import path from "path";
import { Readable as ReadableStream } from "stream";
import mime from "mime-types";
import { ItemBucketMetadata, Client } from "minio";
import { ObjectId } from "mongodb";
import { Dictionary } from "ts-essentials";
import urlJoin from "url-join";
import { Readable, Writable } from "stream";
import { BufferListStream } from "bl";

const config = {
  storage: {
    provider: {
      endPoint: process.env.STORAGE_ENDPOINT || "",
      accessKey: process.env.STORAGE_ACCESS_KEY || "",
      secretKey: process.env.STORAGE_SECRET_KEY || "",
      useSSL: process.env.STORAGE_SSL === "true" ? true : false,
      port:
        process.env.STORAGE_PORT && !isNaN(parseInt(process.env.STORAGE_PORT))
          ? parseInt(process.env.STORAGE_PORT)
          : 9000,
      region: process.env.STORAGE_REGION || "",
    },
    privateBucket: process.env.STORAGE_PRIVATE_BUCKET || "app-private",
    publicBucket: process.env.STORAGE_PUBLIC_BUCKET || "app-public",
    publicEndpoint: process.env.STORAGE_PUBLIC_ENDPOINT || "",
  },
};

enum BucketType {
  Public = "public",
  Private = "private",
}

interface UploadedFile {
  _id: ObjectId;
  filename: string;
  displayName: string;
  objectName: string;
  etag: string;
  size: number;
  uploadedAt: Date;
  bucketType: BucketType;
}

interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination?: string;
  filename: string;
  path?: string;
  buffer: Buffer;
}

type UploadedFileWithPreview = UploadedFile & {
  preview?: UploadedFile;
};

const streamToBuffer = (stream: Readable): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    stream.pipe(
      new BufferListStream((error, buffer) => {
        if (error) {
          reject(error);

          return;
        }

        resolve(buffer);
      }) as unknown as Writable
      // todo forced to cast to unknown and then to Writable because of a type error
    );
  });

if (!config.storage.provider) {
  throw new Error("Missing provider for object storage");
}

export const minioClient = new Client(config.storage.provider);

export const getBucketName = (bucketType: BucketType) => {
  switch (bucketType) {
    case BucketType.Private:
      return config.storage.privateBucket;

    case BucketType.Public:
      return config.storage.publicBucket;

    default:
      throw new Error("Bucket type not supported");
  }
};

export const uploadFile = async (
  bucketType: BucketType,
  dirName: string,
  filename: string,
  stream: ReadableStream | Buffer | string,
  metadata?: ItemBucketMetadata
): Promise<UploadedFile> => {
  const fileId = new ObjectId();
  const ext = path.extname(filename);
  const objectName = path
    .join(dirName, `${fileId}${ext}`)
    .replaceAll("\\", "/");
  const bucket = getBucketName(bucketType);
  const meta: ItemBucketMetadata = {
    ...metadata,
    "Content-Type": mime.lookup(filename),
    ContentType: mime.lookup(filename),
  };

  // upload it at first
  const { etag } = await minioClient.putObject(bucket, objectName, stream, {
    ...meta,
    _id: fileId.toHexString(),
  });

  // get stats from it
  const stats = await minioClient.statObject(bucket, objectName);

  return {
    _id: fileId,
    filename,
    displayName: filename,
    uploadedAt: new Date(),
    etag,
    size: stats.size,
    objectName,
    bucketType,
  };
};

export const getSignedUrlOnUploadedFile = (
  file: UploadedFile,
  expiry = 60
): Promise<string> =>
  minioClient.presignedGetObject(
    getBucketName(file.bucketType),
    file.objectName,
    expiry
  );

export const getFileStream = (file: UploadedFile): Promise<ReadableStream> =>
  minioClient.getObject(getBucketName(file.bucketType), file.objectName);

export const getFileBuffer = async (file: UploadedFile): Promise<Buffer> =>
  streamToBuffer(
    await minioClient.getObject(getBucketName(file.bucketType), file.objectName)
  );

export const deleteUploadedFile = (file: UploadedFile): Promise<void> =>
  minioClient.removeObject(getBucketName(file.bucketType), file.objectName);

export const deleteUploadedFiles = async (
  files: UploadedFile[]
): Promise<void> => {
  const groupedUploads = files.reduce<Dictionary<string[], string>>(
    (acc, upload) => {
      const bucket = getBucketName(upload.bucketType);

      if (acc[bucket]) {
        acc[bucket].push(upload.objectName);
      } else {
        acc[bucket] = [upload.objectName];
      }

      return acc;
    },
    {}
  );

  const promises = Object.entries(groupedUploads).map(([bucket, objects]) =>
    minioClient.removeObjects(bucket, objects)
  );

  await Promise.all(promises);
};

export const handleFileUpload = async (
  bucketType: BucketType,
  dirName: string,
  upload: FileUpload,
  metadata?: ItemBucketMetadata
): Promise<UploadedFile> =>
  uploadFile(bucketType, dirName, upload.filename, upload.buffer, metadata);

export const handleMultipleFileUpload = async (
  bucketType: BucketType,
  dirName: string,
  uploads: FileUpload[],
  metadata?: ItemBucketMetadata
): Promise<UploadedFile[]> =>
  Promise.all(
    uploads.map((upload) =>
      handleFileUpload(bucketType, dirName, upload, metadata)
    )
  );

export const cloneFile = async (
  dirName: string,
  upload: UploadedFile,
  metadata?: ItemBucketMetadata,
  bucketType?: BucketType
): Promise<UploadedFile> => {
  const stream = await getFileStream(upload);

  return uploadFile(
    bucketType || upload.bucketType,
    dirName,
    upload.filename,
    stream,
    metadata
  );
};

export const getUrlForUpload = async (
  uploadFile: UploadedFile,
  expiry?: number
): Promise<string | null> => {
  if (!uploadFile) {
    return null;
  }

  switch (uploadFile.bucketType) {
    case BucketType.Public:
      return urlJoin(config.storage.publicEndpoint, uploadFile.objectName);

    default:
      return getSignedUrlOnUploadedFile(uploadFile, expiry);
  }
};
