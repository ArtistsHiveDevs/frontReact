import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';

/**
 * Hook para obtener información del perfil actual del usuario
 * Detecta automáticamente si es Artista o Place
 */
export const useProfileInfo = () => {
  const loggedUser = useSelector(selectCurrentUser);

  const [isArtistProfile, setIsArtistProfile] = useState(false);
  const [isPlaceProfile, setIsPlaceProfile] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string | undefined>(undefined);
  const [currentProfilePic, setCurrentProfilePic] = useState<string | undefined>(undefined);
  const [currentProfileEntity, setCurrentProfileEntity] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (loggedUser) {
      const entity = loggedUser?.currentProfileInfo?.entity;
      const isArtist = entity === 'Artist';
      const isPlace = entity === 'Place';

      setCurrentProfileEntity(entity);
      setIsArtistProfile(isArtist);
      setIsPlaceProfile(isPlace);
      setCurrentProfileId(loggedUser?.currentProfileInfo?.id);
      setCurrentProfilePic(loggedUser?.currentProfileInfo?.profile_pic);
    }
  }, [loggedUser]);

  return {
    loggedUser,
    isArtistProfile,
    isPlaceProfile,
    currentProfileId,
    currentProfilePic,
    currentProfileEntity,
  };
};
