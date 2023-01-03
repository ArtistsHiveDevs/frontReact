import "./index.scss";
import { useParams } from "react-router-dom";
import { URL_PARAMETER_NAMES } from "~/constants";
import { PLACE_DETAIL_SUB_PAGE_CONFIG } from "~/components/Pages/PlacesPage/PlaceDetailsPage/config-place-detail";
import { useEffect, useState } from "react";
import { PlaceModel } from "~/models/domain/place/place.model";
import { useSelector, useDispatch } from "react-redux";
import { selectPlaces } from "~/common/slices/places/selectors";
import { usePlacesSlice } from "~/common/slices/places";
import { useI18n } from "~/common/utils";
import ProfileHeader from "~/components/shared/molecules/Profile/ProfileHeader";
import {
  TabbedPanel,
  TabbedPage,
} from "~/components/shared/layout/TabbedPanel";
import SectionsPanel from "~/components/shared/layout/SectionPanel";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import { ProfileDetailAttributeConfiguration } from "~/models/domain/profile/profile-details.def";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.PlacesPages.PlacesDetailsPage";

const PlaceDetailPage = () => {
  const { translateText } = useI18n();

  const urlParameters = useParams();

  const [placeId, setCurrentPlaceId] = useState(
    urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]
  );

  const placesList: PlaceModel[] = useSelector(selectPlaces);
  const { actions: placesActions } = usePlacesSlice();

  const subPagesInfo = [...PLACE_DETAIL_SUB_PAGE_CONFIG];

  const [currentPlace, setCurrentPlace] = useState<PlaceModel>(undefined);

  const dispatch = useDispatch();
  useEffect(() => {
    if (placesList.length === 0) {
      dispatch(placesActions.loadPlaces());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log(placesList);

    if (!!placesList.length) {
      console.log(getPlaceInfo(placeId));
      setCurrentPlace(getPlaceInfo(placeId));
    }
  }, [placesList]);

  useEffect(() => {
    getPlaceInfo(placeId);
    setCurrentPlace(getPlaceInfo(placeId));
  }, [placeId]);

  const getData = (attribute: string) => {
    const data = currentPlace[attribute as keyof PlaceModel];
    const response = Array.isArray(data) ? data.join(", ") : data;
    return response;
  };

  const getPlaceInfo = (id: string) => {
    return placesList.find((place) => place.id === id);
  };

  const getAttributeName = (
    subpageName: string,
    sectionName: string,
    attribute: ProfileDetailAttributeConfiguration
  ) => {
    return attribute.emptyTitle
      ? ""
      : attribute.literal
      ? attribute.name
      : translateAttribute(subpageName, sectionName, attribute.name);
  };

  // Translation helpers
  const translateAttribute = (
    subpage: string,
    section: string,
    attribute: string
  ) => {
    return translateText(
      `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.subpages.${subpage}.sections.${section}.attributes.${attribute}`
    );
  };

  const translateSubpage = (subpage: string) => {
    return translateText(
      `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.subpages.${subpage}.name`
    );
  };

  const translateSection = (subpage: string, section: string) => {
    return translateText(
      `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.subpages.${subpage}.sections.${section}.name`
    );
  };

  // Data config
  const ARTIST_DETAILS_TABBED_PAGES: TabbedPage[] = subPagesInfo.map(
    (subpage) => {
      return {
        name: translateSubpage(subpage.name),
        tabContent: () => {
          return subpage.sections.map((section, index) => {
            // Icon Detailed Attributes
            const sectionAttributes: IconDetailedAttribute[] =
              section.attributes?.map((attribute) => {
                return {
                  name: attribute.name,
                  title: getAttributeName(
                    subpage.name,
                    section.name,
                    attribute
                  ),
                  icon: attribute?.icon,
                  value: getData(attribute.name),
                };
              });

            const sectionContent = () => (
              <AttributesIconFieldReadOnly attributes={sectionAttributes} />
            );
            return (
              <SectionsPanel
                key={`section-${section.name}-${index}`}
                sectionName={translateSection(subpage.name, section?.name)}
                sectionContent={sectionContent}
              />
            );
          });
        },
      };
    }
  );

  return (
    <>
      {!!currentPlace && (
        <div className="place-container">
          <ProfileHeader element={currentPlace} />
          <TabbedPanel tabs={ARTIST_DETAILS_TABBED_PAGES} />
        </div>
      )}
    </>
  );
};

export default PlaceDetailPage;
