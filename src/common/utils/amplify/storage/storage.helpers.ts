import { StorageGetUrlOutput } from '@aws-amplify/storage/dist/esm/types';
import { getUrl, uploadData } from 'aws-amplify/storage';

export const uploadImage = async (params: {
  file: File;
  access_level?: 'public' | 'protected' | 'private';
  path?: string;
  prefferedFilename?: string;
}) => {
  try {
    let { file, access_level, path, prefferedFilename } = params || {};

    const fileName = prefferedFilename || `${Date.now()}-${file.name.replace('-min.', '')}`; // Crea un nombre único para el archivo

    console.log(path, `${path ? path + '/' : 'public'}/${fileName}`);
    const result = await uploadData({
      path: `${path ? path + '/' : 'public'}/${fileName}`,
      data: file,
    });

    return result;
  } catch (error) {
    console.error('Error al subir la imagen:', error);
  }
};

export const uploadImages = async (files: File[], access_level?: 'public' | 'protected' | 'private', path?: string) => {
  try {
    // Usa Promise.all para cargar todos los archivos en paralelo
    const results = await Promise.all(files.map((file) => uploadImage({ file, access_level, path })));

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
  if (urlDB.startsWith('s3://')) {
    urlDB = (await getUrl({ path: urlDB.replace('s3://', '') })).url.href;
  }
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
