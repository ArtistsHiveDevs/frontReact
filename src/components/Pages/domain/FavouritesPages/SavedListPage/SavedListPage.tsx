import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSavedSlice } from "~/common/slices/domain/favourites/saved";
import { selectSaved } from "~/common/slices/domain/favourites/saved/selectors";
import { useSearchSlice } from "~/common/slices/search";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import { TabbedPage } from "~/components/shared/layout/TabbedPanel";
import { ProfileDetailsSubpage } from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";
import { ResultElement } from "~/components/shared/search/result-element";
import consts from "~/components/shared/search/search-constants";
import { PATHS, SUB_PATHS } from "~/constants";
import { SavedModel, SavedTemplate } from "~/models/domain/favourites/saved";
import { SAVED_LIST_PAGE_CONFIG } from "./config-saved-list-page";
import "./index.scss";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.domain.AcademiesPages.AcademiesDetailsPage";

const SavedListPage = () => {
  const navigate = useNavigate();

  const [open, setOpen] = useState([]);
  const MAX_RESULTS_PER_PAGE = 40;

  const subPagesInfo = [...SAVED_LIST_PAGE_CONFIG];

  // Slices
  const favouritesList: SavedModel = useSelector(selectSaved);
  const { actions: searchActions } = useSearchSlice();
  const { actions: savedActions } = useSavedSlice();

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    dispatch(savedActions.querySaved("asdasd"));
    console.log("### % % consultando");
    dispatch(searchActions.querySearch("Club"));
    console.log("saved....");
    if (favouritesList) {
      console.log("pidiendo favoritos");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("#### ", favouritesList);
    setOpen(
      favouritesList?.likedEntities?.map((entityName, index) => index === 0) ||
        []
    );
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

  console.log(">>>  ####   ", favouritesList, "DDñ");

  return (
    <>
      <h1>My favourites</h1>
      {favouritesList?.likedEntities.map((entityName, entityIndex) => {
        const entityColorIndex =
          consts.defaultTypes.findIndex(
            (type) => type.toLowerCase() === entityName.toLowerCase()
          ) + 1;

        return (
          favouritesList && (
            <Collapse in={open[entityIndex]}>
              <div id="example-collapse-text-2">
                <article className="day-forecast">
                  {(
                    favouritesList[entityName as keyof typeof favouritesList] ||
                    []
                  )
                    .slice(0, MAX_RESULTS_PER_PAGE)
                    .map((entityObject: SavedTemplate, objectIndex: number) => (
                      <div
                        className="result-element-container"
                        key={`result-${entityName}-${objectIndex}-${entityObject.id}`}
                        // onClick={() => handleResultOnClick(entityObject)}
                      >
                        <ResultElement
                          element={entityObject}
                          elementType={entityName}
                        />
                      </div>
                    ))}
                </article>
              </div>
            </Collapse>
          )
        );
      })}
    </>
  );
};

export default SavedListPage;
