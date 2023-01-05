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
import {
  ProfileComponentDescriptor,
  ProfileComponentTypes,
  ProfileDetailAttributeConfiguration,
} from "~/models/domain/profile/profile-details.def";
import MapContainer from "~/components/shared/mapPrinter/mapContainer";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";

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
    let response = undefined;
    if (attribute) {
      const data = currentPlace[attribute as keyof PlaceModel];
      response = Array.isArray(data) ? data.join(", ") : data;
    }
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
  const PLACES_DETAILS_TABBED_PAGES: TabbedPage[] = subPagesInfo.map(
    (subpage) => {
      return {
        name: translateSubpage(subpage.name),
        requireSession: subpage.requireSession,
        tabContent: () => {
          return (
            <RequireAuthComponent requiredSession={subpage.requireSession}>
              {subpage.sections.map((section, index) => {
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
                  }) || [];

                let contentComponents: any;
                if (section.components) {
                  contentComponents = section.components.map(
                    (componentDescriptor: ProfileComponentDescriptor) => {
                      let renderedComponent = <></>;
                      if (
                        componentDescriptor.componentName ===
                        ProfileComponentTypes.MAP
                      ) {
                        const mapData = {
                          zoom: 18,
                          center: {
                            lat: getData(componentDescriptor.data?.lat),
                            lng: getData(componentDescriptor.data?.lng),
                          },
                          marksLocation: [
                            {
                              lat: getData(componentDescriptor.data?.lat),
                              lng: getData(componentDescriptor.data?.lng),
                            },
                          ],
                          anotherOpts: {},
                        };

                        const googleApiKey =
                          "AIzaSyBzyzf0hnuMJBdOB9sR0kBbBTtqYs-XECs";

                        const mapContainerStyles = {
                          width: "100%",
                          height: "400px",
                        };

                        renderedComponent = (
                          <MapContainer
                            apiKey={googleApiKey}
                            stylesc={mapContainerStyles}
                            mapData={mapData}
                          />
                        );
                      } else {
                        renderedComponent = (
                          <AttributesIconFieldReadOnly
                            attributes={sectionAttributes}
                          />
                        );
                      }
                      return renderedComponent;
                    }
                  );
                } else {
                  contentComponents = [
                    <AttributesIconFieldReadOnly
                      attributes={sectionAttributes}
                    />,
                  ];
                }

                const sectionContent = () => contentComponents;

                return (
                  <RequireAuthComponent
                    key={`section-${section.name}-${index}`}
                    requiredSession={section.requireSession}
                  >
                    <SectionsPanel
                      sectionName={translateSection(
                        subpage.name,
                        section?.name
                      )}
                      sectionContent={sectionContent}
                    />
                  </RequireAuthComponent>
                );
              })}
            </RequireAuthComponent>
          );
        },
      };
    }
  );

  return (
    <>
      {!!currentPlace && (
        <div className="place-container">
          <ProfileHeader element={currentPlace} />
          <TabbedPanel tabs={PLACES_DETAILS_TABBED_PAGES} />
        </div>
      )}
    </>
  );
};

export default PlaceDetailPage;
