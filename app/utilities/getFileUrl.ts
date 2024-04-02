import { BucketType, UploadedFile } from "../api/types/uploadedfile";

const getBucketName = (bucketType: BucketType) => {
  switch (bucketType) {
    case BucketType.Private:
      return "app-private";

    case BucketType.Public:
      return "app-public";

    default:
      return "";
  }
};

const getFileUrl = (fileData: UploadedFile | null | undefined) => {
  return fileData
    ? `${process.env.STORAGE_URL}/${getBucketName(fileData.bucketType)}${
        fileData.objectName
      }`
    : "";
};

export default getFileUrl;
