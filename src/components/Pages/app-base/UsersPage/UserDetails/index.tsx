import { useState } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { USER_DETAIL_SUB_PAGE_CONFIG } from './config-user-detail';

import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { SUB_PATHS } from '~/constants';
import { EventModel } from '~/models/domain/event/event.model';
import './index.scss';

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE = 'app.pages.app_base.UsersPages.UsersDetailsPage';

const UserDetailPage = () => {
  const { navigateToEntity } = useNavigation();

  const { loggedUser, setLoggedUser } = useAuth();

  const subPagesInfo = [...USER_DETAIL_SUB_PAGE_CONFIG];

  // const [currentUser, setCurrentUser] = useState<AppUserModel>(undefined);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (userList.length === 0) {
  //     dispatch(usersActions.loadUsers());
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // useEffect(() => {
  //   if (!!userList.length) {
  //     setCurrentUser(getUserInfo(userId));
  //   }
  // }, [userList]);

  // useEffect(() => {
  //   setCurrentUser(getUserInfo(userId));
  // }, [userId]);

  // const getUserInfo = (id: string) => {
  //   return userList.find((user) => user.id === id);
  // };

  const handlers = {
    onClickGalleryImage: (source: GalleryImageParams, images: GalleryImageParams[]) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
    onClickEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.identifier });
    },
    onNavigateToEntity: (value: any) => {
      const entityType = value.constructor.name !== 'Object' ? value.constructor.name : value.entity;
      console.log(entityType, value);
      navigateToEntity({ entityType, id: value.username || value.id });
    },
    onEditProfile: (value: any) => {
      const entityType = value.constructor.name !== 'Object' ? value.constructor.name : value.entity;
      navigateToEntity({ entityType, id: value.identifier, action: SUB_PATHS.EDIT });
    },
  };

  return (
    <>
      {!loggedUser && <h1>Iniciar sesión</h1>}
      {!!loggedUser && (
        <ProfileTabsPage
          entityName="User"
          entityData={loggedUser}
          translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
          subpagesConfig={subPagesInfo}
          handlers={handlers}
        />
      )}
    </>
  );
};

export default UserDetailPage;
