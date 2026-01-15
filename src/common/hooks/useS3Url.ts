import { getUrl } from 'aws-amplify/storage';
import { useEffect, useState } from 'react';

// Caché global compartido - mismo que en model.ts
const s3UrlCache = new Map<string, { url: string; expiresAt: number }>();
const pendingRequests = new Map<string, Promise<string>>();

/**
 * Hook para convertir rutas S3 a URLs HTTP con caché automático
 * @param s3PathOrUrl - Ruta S3 (con o sin "s3://") o URL HTTP
 * @returns URL HTTP lista para usar en <img> o <Avatar>
 */
export const useS3Url = (s3PathOrUrl: string | undefined): string | undefined => {
  // IMPORTANTE: Si es S3, empezar con undefined para forzar re-render cuando se resuelva
  const [url, setUrl] = useState<string | undefined>(s3PathOrUrl?.startsWith('s3://') ? undefined : s3PathOrUrl);

  useEffect(() => {
    // Si no hay path o no es S3, retornar directamente
    if (!s3PathOrUrl || !s3PathOrUrl.startsWith('s3://')) {
      setUrl(s3PathOrUrl);
      return;
    }

    const fetchUrl = async () => {
      const s3Path = s3PathOrUrl.replace('s3://', '');

      // Verificar caché
      const cached = s3UrlCache.get(s3Path);
      const now = Date.now();

      if (cached && cached.expiresAt > now) {
        setUrl(cached.url);
        return;
      }

      // Si ya hay un request en progreso, esperar
      if (pendingRequests.has(s3Path)) {
        const result = await pendingRequests.get(s3Path)!;
        setUrl(result);
        return;
      }

      // Crear nuevo request
      const urlPromise = getUrl({ path: s3Path }).then((result) => result.url.href);
      pendingRequests.set(s3Path, urlPromise);

      try {
        const httpUrl = await urlPromise;
        const expiresAt = now + 50 * 60 * 1000; // 50 minutos
        s3UrlCache.set(s3Path, { url: httpUrl, expiresAt });
        setUrl(httpUrl);
      } catch (error) {
        console.error('❌ Error resolving S3 URL:', { s3Path, error });
      } finally {
        pendingRequests.delete(s3Path);
      }
    };

    fetchUrl();
  }, [s3PathOrUrl]);

  return url;
};
