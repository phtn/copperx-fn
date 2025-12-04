export type StorageType = string;

export interface UploadFileParams {
  file: File | Blob | Buffer;
  filename?: string;
}

export interface UploadFileResponse {
  url: string;
  key: string;
}

