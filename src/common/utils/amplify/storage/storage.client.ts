import { StorageGetUrlOutput } from '@aws-amplify/storage/dist/esm/types';
import { getUrl as amplifyGetUrl, uploadData as amplifyUploadData } from 'aws-amplify/storage';

const USE_LOCAL_STORAGE = import.meta.env.VITE_USE_LOCAL_COGNITO === 'true';
const STORAGE_ADMIN_URL = import.meta.env.VITE_STORAGE_ADMIN_URL;

export const getUrl = (input: { path: string }): Promise<StorageGetUrlOutput> => {
  if (USE_LOCAL_STORAGE) {
    return Promise.resolve({
      url: new URL(`${STORAGE_ADMIN_URL}/files/${input.path}`),
      expiresAt: new Date(Date.now() + 50 * 60 * 1000),
    });
  }

  return amplifyGetUrl(input);
};

export const uploadData = (input: { path: string; data: Blob | File }) => {
  if (USE_LOCAL_STORAGE) {
    const formData = new FormData();
    formData.append('path', input.path);
    formData.append('file', input.data);

    const result = fetch(`${STORAGE_ADMIN_URL}/upload`, {
      method: 'POST',
      body: formData,
    }).then(async (response) => {
      if (!response.ok) {
        throw new Error((await response.json()).message || `HTTP ${response.status}`);
      }
      return response.json();
    });

    return { result };
  }

  return amplifyUploadData(input);
};
