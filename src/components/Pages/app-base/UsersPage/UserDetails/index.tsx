import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import { ProfileTabsPage } from "~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage";
import { PATHS, SUB_PATHS } from "~/constants";
import { USER_DETAIL_SUB_PAGE_CONFIG } from "./config-user-detail";

import "./index.scss";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.app_base.UsersPages.UsersDetailsPage";

const UserDetailPage = () => {
  const navigate = useNavigate();

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
    onClickGalleryImage: (
      source: GalleryImageParams,
      images: GalleryImageParams[]
    ) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
    onClickNextEvent: (value: any) => {
      navigateTo(PATHS.EVENTS, value.id);
    },
    onClickPastEvent: (value: any) => {
      navigateTo(PATHS.EVENTS, value.id);
    },
  };

  function navigateTo(newEntity: PATHS, id: string = null) {
    navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  }

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
