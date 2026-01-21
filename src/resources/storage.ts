import { HTTPClient } from '../utils/http';
import type {
  StorageType,
  UploadFileParams,
  UploadFileResponse,
} from '../types/storage';

export function createStorageResource(client: HTTPClient) {
  return {
    async uploadFile(
      storageType: StorageType,
      params: UploadFileParams
    ): Promise<UploadFileResponse> {
      const formData = new FormData();
      
      // Convert Buffer to Blob if needed
      let fileBlob: Blob | File;
      if (Buffer.isBuffer(params.file)) {
        fileBlob = new Blob([params.file]);
      } else {
        fileBlob = params.file;
      }
      
      formData.append('file', fileBlob);
      if (params.filename) {
        formData.append('filename', params.filename);
      }

      return client.post<UploadFileResponse>(
        `/api/v1/storage/files/${storageType}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    },
  };
}

