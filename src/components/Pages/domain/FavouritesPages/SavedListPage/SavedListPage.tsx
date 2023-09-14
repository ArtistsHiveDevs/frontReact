import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { savedFavouritesActions } from "~/common/slices/domain/favourites/favourites";
import { selectSavedFavourites } from "~/common/slices/domain/favourites/favourites/selectors";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import {
  TabbedPage,
  TabbedPanel,
} from "~/components/shared/layout/TabbedPanel";
import { ProfileDetailsSubpage } from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";
import { PATHS, SUB_PATHS } from "~/constants";
import { SavedFavouritesModel } from "~/models/domain/favourites/favourites";
import { SAVED_LIST_PAGE_CONFIG } from "./config-saved-list-page";
import "./index.scss";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.domain.AcademiesPages.AcademiesDetailsPage";

const SavedListPage = () => {
  const navigate = useNavigate();

  const subPagesInfo = [...SAVED_LIST_PAGE_CONFIG];

  // Slices
  const favouritesList: SavedFavouritesModel[] = useSelector(
    selectSavedFavourites
  );

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    console.log("consultando");
    dispatch(savedFavouritesActions.loadSavedFavourites());
    if (favouritesList.length === 0) {
      console.log("pidiendo favoritos");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("#### ", favouritesList);
  }, [favouritesList]);

  const handlers = {
    onClickGalleryImage: (
      source: GalleryImageParams,
      images: GalleryImageParams[]
    ) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
    },
    onCloseGalleryImage: (value: any) => {},
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

  // Data config
  const tabs: TabbedPage[] = subPagesInfo.map(
    (subpage: ProfileDetailsSubpage) => {
      return {
        name: subpage.name,
        tabContent: () => {
          return <h2>subpage: {subpage.name}</h2>;
        },
      };
    }
  );

  return (
    <>
      <h1>My favourites</h1>
      {<TabbedPanel tabs={tabs} />}
    </>
  );
};

export default SavedListPage;
