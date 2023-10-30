import { useNavigate } from "react-router";
import { useI18n } from "~/common/utils";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import { EventParams } from "~/components/shared/atoms/calendar/CalendarSimpleEvent/CalendarSimpleEvent";
import MapContainer from "~/components/shared/mapPrinter/mapContainer";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import { CalendarSimpleLayout } from "~/components/shared/molecules/general/calendar/CalendarSimpleLayout/CalendarSimpleLayout";
import { EntityModel, EntityTemplate } from "~/models/base";
import "./ProfileTabsPage.scss";
import {
  ProfileComponentDescriptor,
  ProfileComponentTypes,
  ProfileDetailAttributeConfiguration,
  ProfileDetailsSubpage,
  ProfileDetailsSubpageSection,
} from "./profile-details.def";

import moment from "moment";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";
import SectionsPanel from "~/components/shared/layout/SectionPanel";
import { TabbedPanel } from "~/components/shared/layout/TabbedPanel";
import ProfileHeader from "~/components/shared/molecules/Profile/ProfileHeader";

export interface ProfilePageParams {
  entityName: string;
  translation_base_path: string;
  entityData: EntityModel<EntityTemplate>;
  handlers?: any;
  subpagesConfig?: ProfileDetailsSubpage[];
}

export const ProfileTabsPage = (props: ProfilePageParams) => {
  const { translation_base_path, entityData, handlers, subpagesConfig } = props;

  const { translateText } = useI18n();
  const navigate = useNavigate();

  const getAttributeTitle = (
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
  //#region Helpers
  const getData = (attribute: string) => {
    let response = undefined;
    if (attribute) {
      const data = entityData[attribute as keyof typeof entityData];
      response = data;
      if (Array.isArray(data) && data.length && typeof data[0] === "string") {
        response = data.join(", ");
      }
    }
    return response;
  };

  const transformedConfig = () => {
    return subpagesConfig.map((subpage) => {
      return {
        name: translateSubpage(subpage.name),
        requireSession: subpage.requireSession,
        tabContent: () => {
          return (
            <RequireAuthComponent requiredSession={subpage.requireSession}>
              {subpage.sections.map((section, index) => {
                // Icon Detailed Attributes

                let contentComponents: any = <></>;
                if (section.components) {
                  contentComponents = section.components.map(
                    (
                      componentDescriptor: ProfileComponentDescriptor,
                      componentIndex: number
                    ) =>
                      buildComponent(
                        subpage,
                        section,
                        componentDescriptor,
                        componentIndex
                      )
                  );
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
    });
  };
  //#endregion
  //#region Translation region
  // Translation helpers
  const translateAttribute = (
    subpage: string,
    section: string,
    attribute: string
  ) => {
    return translateText(
      `${translation_base_path}.subpages.${subpage}.sections.${section}.attributes.${attribute}`
    );
  };

  const translateSubpage = (subpage: string) => {
    return translateText(`${translation_base_path}.subpages.${subpage}.name`);
  };

  const translateSection = (subpage: string, section: string) => {
    return translateText(
      `${translation_base_path}.subpages.${subpage}.sections.${section}.name`
    );
  };
  //#endregion

  //#region Build Component

  function buildComponent(
    subpage: ProfileDetailsSubpage,
    section: ProfileDetailsSubpageSection,
    componentDescriptor: ProfileComponentDescriptor,
    componentIndex: number
  ) {
    let renderedComponent = <></>;
    if (componentDescriptor.componentName === ProfileComponentTypes.MAP) {
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

      const googleApiKey = "AIzaSyBzyzf0hnuMJBdOB9sR0kBbBTtqYs-XECs";

      const mapContainerStyles = {
        width: "100%",
        height: "400px",
      };

      renderedComponent = (
        <MapContainer
          //   key={`section-${section.name}-${index}-${componentIndex}`}
          apiKey={googleApiKey}
          stylesc={mapContainerStyles}
          mapData={mapData}
        />
      );
    } else if (
      componentDescriptor.componentName ===
      ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS
    ) {
      const sectionAttributes: IconDetailedAttribute[] =
        componentDescriptor.data?.attributes?.map((attribute: any) => {
          return {
            name: attribute.name,
            title: getAttributeTitle(subpage.name, section.name, attribute),
            icon: attribute?.icon,
            value: getData(attribute.name),
            requireSession: attribute.requireSession,
          };
        }) || [];
      renderedComponent = (
        <AttributesIconFieldReadOnly
          //   key={`section-${section.name}-${index}-${componentIndex}`}
          attributes={sectionAttributes}
        />
      );
    } else if (
      componentDescriptor.componentName === ProfileComponentTypes.IMAGE_GALLERY
    ) {
      let clickHandler: (source: GalleryImageParams, images: any) => void =
        undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler =
          handlers[
            componentDescriptor.clickHandlerName as keyof typeof handlers
          ];
      }
      renderedComponent = (
        <div
        // key={`section-${section.name}-${index}-${componentIndex}`}
        >
          <ImageGallery
            images={getData(componentDescriptor.data?.images)}
            clickHandler={(source: GalleryImageParams) =>
              clickHandler(source, getData(componentDescriptor.data?.images))
            }
          />
        </div>
      );
    } else if (
      componentDescriptor.componentName ===
      ProfileComponentTypes.CALENDAR_SIMPLE_LAYOUT
    ) {
      const eventsInfo: EventParams[] = (
        getData(componentDescriptor.data?.data_source) || []
      ).map((event: any) => {
        return {
          id: event.id,
          name: event[componentDescriptor.data?.fields?.title],
          title: event[componentDescriptor.data?.fields?.title],
          subtitle: event[componentDescriptor.data?.fields?.subtitle],
          picture: event[componentDescriptor.data?.fields?.picture],
          place: event[componentDescriptor.data?.fields?.place],
          datetime: moment(
            `${event[componentDescriptor.data?.fields?.date]} ${
              event[componentDescriptor.data?.fields?.time]
            }`,
            "YYYY-MM-DD hhmm"
          ),
        };
      });

      let clickHandler: (source: any, images: any) => void = undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler =
          handlers[
            componentDescriptor.clickHandlerName as keyof typeof handlers
          ];
      }
      renderedComponent = (
        <CalendarSimpleLayout
          //   key={`section-${section.name}-${index}`}
          events={eventsInfo}
          onClickHandler={clickHandler}
        />
      );
    }
    return renderedComponent;
  }
  //#endregion

  return (
    <>
      {!!entityData && (
        <div className="place-container">
          <ProfileHeader element={entityData} />
          <TabbedPanel tabs={transformedConfig()} />
        </div>
      )}
    </>
  );
};
