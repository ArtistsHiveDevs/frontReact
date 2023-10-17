import { NavigateOptions, useNavigate } from "react-router-dom";
import { PATHS, SUB_PATHS } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";
import { TourOutlineModel } from "~/models/domain/favourites/tourOutline";
import { PlaceModel } from "~/models/domain/place/place.model";

export const useNavigation = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  const navigateToInnerPath = (params: {
    path: string;
    options?: NavigateOptions;
  }) => {
    window.scrollTo(0, 0);
    navigate(params.path, params.options);
  };

  const navigateToEntity = (params: {
    entityType: string;
    id?: string;
    options?: NavigateOptions;
  }) => {
    let entity = undefined;

    switch (params.entityType) {
      case ArtistModel.name:
        entity = PATHS.ARTISTS;
        break;
      case EventModel.name:
        entity = PATHS.EVENTS;
        break;
      case PlaceModel.name:
        entity = PATHS.PLACES;
        break;
      case TourOutlineModel.name:
        entity = PATHS.TOURS_OUTLINE;
        break;

      default:
        break;
    }

    if (entity) {
      let path = `${entity}`;
      if (params.id) {
        path += `/${SUB_PATHS.ELEMENT_DETAILS}/${params.id}`;
      }
      window.scrollTo(0, 0);
      navigate(path, params.options);
    }
  };

  return { goBack, navigateToEntity, navigateToInnerPath };
};
