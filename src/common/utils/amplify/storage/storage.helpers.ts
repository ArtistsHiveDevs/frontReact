import { StorageGetUrlOutput } from '@aws-amplify/storage/dist/esm/types';
import { FileUploadCustomFile } from '~/components/shared/organisms/gui/dynamicForms';
import { getUrl, removeData, uploadData } from './storage.client';
import { UploadFileToServerResponse } from './storage.types';

export const uploadFileToServer = async (params: {
  file: FileUploadCustomFile;
  access_level?: 'public' | 'protected' | 'private';
  path?: string;
  prefferedFilename?: string;
}) => {
  try {
    let { file, access_level, path, prefferedFilename } = params || {};

    const fileName = prefferedFilename || `${Date.now()}-${file.name.replace('-min.', '')}`; // Crea un nombre único para el archivo
    const customPath = `${path ? path + '/' : ''}${fileName}`;
    console.log(path, customPath);
    const result = await uploadData({
      path: `public/${customPath}`,
      data: file,
    });

    const response: UploadFileToServerResponse = { result, fileName, customPath };

    return response;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

export const uploadFilesToServer = async (params: {
  files: FileUploadCustomFile[];
  access_level?: 'public' | 'protected' | 'private';
  path?: string;
}) => {
  const { files, access_level, path } = params;
  console.log({ params });
  try {
    // Usa Promise.all para cargar todos los archivos en paralelo
    const results = await Promise.all(files.map((file) => uploadFileToServer({ file, access_level, path })));

    return results;
  } catch (error) {
    console.error('Error al subir imágenes:', error);
    throw error; // Lanza el error para que pueda ser manejado en la llamada
  }
};

export const getImageURL = async (params: { fileName: string; path?: string }): Promise<StorageGetUrlOutput> => {
  const { fileName, path } = params || {};
  return getUrl({
    path: `${path || 'public'}/${fileName}`,
  });
};

export const getUrlS3 = async (params: { path: string }) => {
  let urlDB = params.path;
  // console.log('ANTES ', urlDB);
  if (urlDB.startsWith('r://')) {
    urlDB = urlDB.replace('r://', import.meta.env.VITE_REPO);
  }

  if (urlDB?.startsWith('s3://')) {
    urlDB = (await getUrl({ path: urlDB.replace('s3://', '') })).url.href;
  }
  // console.log('nueva url.... ', urlDB);
  return urlDB;
};

export const getImagesURL = async (params: { fileNames: string[]; path?: string }): Promise<StorageGetUrlOutput[]> => {
  const { fileNames: fileName, path } = params || {};

  // Usa Promise.all para obtener las URLs de todas las imágenes
  const urls = await Promise.all(
    fileName.map(async (name) => {
      return await getImageURL({ fileName: name, path });
    })
  );

  // Mapea los resultados a un formato adecuado
  return urls;
};

export const removeFileFromServer = async (params: { path?: string }) => {
  try {
    let { path } = params || {};
    const result = await removeData({
      path: `public/${path}`,
    });

    return { result, path };
  } catch (error) {
    console.error('Error al remover la imagen:', error);
  }
};

export const removeFilesFromServer = async (params: { paths: string[] }) => {
  const { paths } = params;
  console.log(paths);
  try {
    // Usa Promise.all para cargar todos los archivos en paralelo
    const results = await Promise.all(paths.map((path) => removeFileFromServer({ path })));

    return results;
  } catch (error) {
    console.error('Error al remover imágenes:', error);
    throw error; // Lanza el error para que pueda ser manejado en la llamada
  }
};

export const getFilesUrls = async (referenceData: any) => {
  let formattedUrls = undefined;
  if (referenceData && Array.isArray(referenceData)) {
    const urlsObject: { [identifier: string]: string } = {};

    // Mapeamos las URLs a promesas y usamos Promise.all para esperar a que todas se resuelvan
    const urlPromises = referenceData.map(async (imageParams: any) => {
      const url = await getUrlS3({ path: imageParams.src });
      urlsObject[imageParams.src] = url;
    });

    // Esperamos a que todas las promesas terminen
    await Promise.all(urlPromises);
    formattedUrls = urlsObject;
  }
  return formattedUrls;
};
