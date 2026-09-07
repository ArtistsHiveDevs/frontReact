import { useEffect, useState } from 'react';

import { getUrlS3 } from '~/common/utils/amplify/storage/storage.helpers';

interface CalendarEventImageProps {
  alt: string;
  className: string;
  source?: string | null;
}

export const CalendarEventImage = ({ alt, className, source }: CalendarEventImageProps) => {
  const [resolvedSource, setResolvedSource] = useState<string>();

  useEffect(() => {
    let active = true;

    if (!source) {
      setResolvedSource(undefined);
      return () => {
        active = false;
      };
    }

    getUrlS3({ path: source })
      .then((url) => {
        if (active) setResolvedSource(url);
      })
      .catch(() => {
        if (active) setResolvedSource(undefined);
      });

    return () => {
      active = false;
    };
  }, [source]);

  return resolvedSource ? <img alt={alt} className={className} src={resolvedSource} /> : null;
};
