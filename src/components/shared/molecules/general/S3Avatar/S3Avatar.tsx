import { Avatar, AvatarProps } from '@mui/material';
import { useS3Url } from '~/common/hooks/useS3Url';

interface S3AvatarProps extends Omit<AvatarProps, 'src'> {
  /**
   * Ruta S3 (s3://...) o URL HTTP directa
   */
  src?: string;
}

/**
 * Avatar component que automáticamente resuelve URLs S3 a URLs HTTP
 * Usa caché compartido para evitar múltiples llamadas a AWS
 */
export const S3Avatar: React.FC<S3AvatarProps> = ({ src, ...rest }) => {
  const resolvedUrl = useS3Url(src);

  return <Avatar src={resolvedUrl} {...rest} />;
};
