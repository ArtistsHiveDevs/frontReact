import { useEffect, useState } from "react";
import { Image } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { usePlacesSlice } from "~/common/slices/places";
import { selectPlaces } from "~/common/slices/places/selectors";
import { useI18n } from "~/common/utils";
import { PLACE_DETAIL_SUB_PAGE_CONFIG } from "~/components/Pages/PlacesPage/PlaceDetailsPage/config-place-detail";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";
import ImageGallery, {
  GalleryImageParams,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import SectionsPanel from "~/components/shared/layout/SectionPanel";
import {
  TabbedPage,
  TabbedPanel,
} from "~/components/shared/layout/TabbedPanel";
import MapContainer from "~/components/shared/mapPrinter/mapContainer";
import ProfileHeader from "~/components/shared/molecules/Profile/ProfileHeader";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import GenericModal from "~/components/shared/molecules/general/Modals/ModalCardInfo/GenericModal";
import { URL_PARAMETER_NAMES } from "~/constants";
import { PlaceModel } from "~/models/domain/place/place.model";
import {
  ProfileComponentDescriptor,
  ProfileComponentTypes,
  ProfileDetailAttributeConfiguration,
} from "~/models/domain/profile/profile-details.def";
import "./index.scss";

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
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

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
      response = data;
      if (Array.isArray(data) && data.length && typeof data[0] === "string") {
        response = data.join(", ");
      }
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

  const handlers = {
    onClickGalleryImage: (source: GalleryImageParams) => {
      const image = (
        <Image
          key={`modal-${source.src}`}
          className="gallery-image-detail"
          src={source.src}
          alt={source.alt || source.src}
        />
      );
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
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
                    (
                      componentDescriptor: ProfileComponentDescriptor,
                      componentIndex: number
                    ) => {
                      let renderedComponent = <></>;
                      if (
                        componentDescriptor.componentName ===
                        ProfileComponentTypes.MAP
                      ) {
                        const mapData = {
                          zoom: 19,
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
                            key={`section-${section.name}-${index}-${componentIndex}`}
                            apiKey={googleApiKey}
                            stylesc={mapContainerStyles}
                            mapData={mapData}
                          />
                        );
                      } else if (
                        componentDescriptor.componentName ===
                        ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS
                      ) {
                        renderedComponent = (
                          <AttributesIconFieldReadOnly
                            key={`section-${section.name}-${index}-${componentIndex}`}
                            attributes={sectionAttributes}
                          />
                        );
                      } else if (
                        componentDescriptor.componentName ===
                        ProfileComponentTypes.IMAGE_GALLERY
                      ) {
                        let clickHandler = undefined;

                        if (!!componentDescriptor.clickHandlerName) {
                          clickHandler =
                            handlers[
                              componentDescriptor.clickHandlerName as keyof typeof handlers
                            ];
                        }
                        renderedComponent = (
                          <>
                            <ImageGallery
                              key={`section-${section.name}-${index}-${componentIndex}`}
                              images={getData(componentDescriptor.data?.images)}
                              clickHandler={clickHandler}
                            />
                            <GenericModal
                              title={currentPlace.name}
                              body={currentGalleryImage}
                              show={!!currentGalleryImage}
                              onHide={(event: any) =>
                                handlers.onCloseGalleryImage(event)
                              }
                            />
                          </>
                        );
                      }
                      return renderedComponent;
                    }
                  );
                } else {
                  contentComponents = [
                    <AttributesIconFieldReadOnly
                      key={`section-${section.name}-${index}`}
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
