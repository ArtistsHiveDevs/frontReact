import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useAllergiesSlice } from '~/common/slices/parametrics/demographics/allergies.redux';
import { useLanguagesSlice } from '~/common/slices/parametrics/geo/language.redux';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import { ProfileTabsPage } from '~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage';
import { USER_DETAIL_SUB_PAGE_CONFIG } from './config-user-detail';

import { useSelector } from 'react-redux';
import { usersActions } from '~/common/slices/users';
import { selectLoading } from '~/common/slices/users/selectors';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { IndustrySignUpBanner } from '~/components/shared/atoms/IndustrySignUpBanner/IndustrySignUpBanner';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PATHS, SUB_PATHS } from '~/constants';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { getClassFromModelName } from '~/models/base/modelHelpers';
import { EventModel } from '~/models/domain/event/event.model';
import './index.scss';

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE = 'app.pages.app_base.UsersPages.UsersDetailsPage';

const UserDetailPage = () => {
  const { navigateToEntity, navigateToInnerPath } = useNavigation();

  const { loggedUser, setLoggedUser, currentUserProfile } = useAuth();

  const isLoading = useSelector(selectLoading);

  const subPagesInfo = [...USER_DETAIL_SUB_PAGE_CONFIG];

  // const [currentUser, setCurrentUser] = useState<AppUserModel>(undefined);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

  const dispatch = useDispatch();
  const { actions: languageActions } = useLanguagesSlice();
  const { actions: allergyActions } = useAllergiesSlice();

  useEffect(() => {
    dispatch(languageActions.loadItems({}));
    dispatch(allergyActions.loadItems({}));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
      let entityType = ['Object', CurrentProfileInfoModel.name].includes(value.constructor.name)
        ? value.entity
        : value.constructor.name;
      navigateToEntity({ entityType, id: value.username || value.identifier });
    },
    onEditProfile: (value: any) => {
      const entityType = value.constructor.name !== 'Object' ? value.constructor.name : value.entity;
      navigateToEntity({ entityType, id: value.identifier, action: SUB_PATHS.EDIT });
    },
    onClickOnFollower: (value: any) => {
      const entityType = getClassFromModelName(value?.entityType)?.name;
      if (entityType) {
        navigateToEntity({ entityType, id: value.username || value.id });
      }
    },

    onClickFollowSucription: (value: any) => {
      if (loggedUser) {
        let followAction: 'follow' | 'unfollow';
        let id;
        if (value) {
          followAction = 'follow';
          id = 'XX Seguir a:  ' + loggedUser.identifier;
        } else {
          {
            followAction = 'unfollow';
            id = 'XX dejar de Seguir a:  ' + loggedUser.identifier;
          }
        }
        dispatch(usersActions.followProfileUser({ action: followAction, profile: loggedUser }));
      } else {
        navigateToInnerPath({ path: PATHS.LOGIN });
      }
    },
  };

  return (
    <>
      {!loggedUser &&
        ((!isLoading && <h1>Iniciar sesión</h1>) ||
          (isLoading && (
            <div>
              <AppLoader />
            </div>
          )))}
      {!!loggedUser && (
        <ProfileTabsPage
          entityName="User"
          entityData={loggedUser}
          translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
          subpagesConfig={subPagesInfo}
          handlers={handlers}
        />
      )}
      <IndustrySignUpBanner />
    </>
  );
};

export default UserDetailPage;
