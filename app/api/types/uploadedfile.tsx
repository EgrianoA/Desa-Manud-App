export enum BucketType {
  Public = "public",
  Private = "private",
}

export interface UploadedFile {
  _id: string;
  filename: string;
  displayName: string;
  objectName: string;
  etag: string;
  size: number;
  uploadedAt: Date;
  bucketType: BucketType;
}
