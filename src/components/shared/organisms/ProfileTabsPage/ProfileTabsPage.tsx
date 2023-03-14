import { useNavigate } from "react-router";
import { useI18n } from "~/common/utils";
import { EventParams } from "~/components/shared/atoms/calendar/CalendarSimpleEvent/CalendarSimpleEvent";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import MapContainer from "~/components/shared/mapPrinter/mapContainer";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import { CalendarSimpleLayout } from "~/components/shared/molecules/general/calendar/CalendarSimpleLayout/CalendarSimpleLayout";
import { EntityModel, EntityTemplate } from "~/models/base";
import {
  ProfileComponentDescriptor,
  ProfileComponentTypes,
  ProfileDetailAttributeConfiguration,
  ProfileDetailsSubpage,
  ProfileDetailsSubpageSection,
} from "./profile-details.def";
import "./ProfileTabsPage.scss";

import moment from "moment";
import { EVENT_DETAIL_SUB_PAGE_CONFIG } from "~/components/Pages/EventsPage/EventDetailsPage/config-event-detail";
import { RequireAuthComponent } from "~/components/shared/atoms/app/auth/RequiredAuth";
import { Title } from "~/components/shared/atoms/Title/Title";
import { SectionsPanel } from "~/components/shared/layout/SectionPanel";
import { TabbedPanel } from "~/components/shared/layout/TabbedPanel";
import { ProfileHeader } from "~/components/shared/molecules/Profile/ProfileHeader";
import { ProfileThumbnailCard } from "~/components/shared/molecules/Profile/ProfileThumbnailCard";
import { SocialNetworks } from "~/constants/social-networks.const";
import { GenresListView } from "../../molecules/domain/genres/GenresListView";

export interface ProfilePageParams {
  entityName: string;
  translation_base_path: string;
  entityData: EntityModel<EntityTemplate>;
  handlers?: any;
  subpagesConfig?: ProfileDetailsSubpage[];
  profileHeaderComponent?: any;
}

export const ProfileTabsPage = (props: ProfilePageParams) => {
  const {
    translation_base_path,
    entityData,
    handlers,
    subpagesConfig,
    profileHeaderComponent,
  } = props;

  const { translateText } = useI18n();
  const navigate = useNavigate();

  const getAttributeTitle = (
    subpageName: string,
    sectionName: string,
    attribute: ProfileDetailAttributeConfiguration
  ) => {
    let title: string = "";
    if (attribute.title) {
      title = attribute.title;
    } else if (attribute.useTranslation || attribute.emptyTitle === undefined) {
      title = translateAttribute(subpageName, sectionName, attribute.name);
    }
    return title;
  };

  const subPagesInfo = [...EVENT_DETAIL_SUB_PAGE_CONFIG];

  //#region Helpers
  const getData: any = (
    attribute: string,
    dataSource: EntityModel<EntityTemplate> = undefined
  ) => {
    let response = undefined;
    if (attribute) {
      const element = dataSource || entityData;
      const propertyPath = attribute.split(".") || [];
      const data =
        propertyPath.reduce((previous, current) => {
          return previous ? previous[current as keyof typeof previous] : "";
        }, element) || "";

      response = data;

      if (
        Array.isArray(data) &&
        data.length &&
        (typeof data[0] === "string" || typeof data[0] === "number")
      ) {
        response = data.join(", ");
      }
    }
    return response;
  };

  const transformedConfig = () => {
    return (subpagesConfig || []).map((subpage, subPageIndex) => {
      return {
        name: translateSubpage(subpage.name),
        allowedRoles: subpage.allowedRoles,
        requireSession: subpage.requireSession,
        tabContent: () => {
          return (
            <RequireAuthComponent
              requiredSession={subpage.requireSession}
              key={`section_${subPageIndex}_${subpage.name}`}
            >
              {(subpage.sections || []).map((section, index) => {
                // Icon Detailed Attributes

                let contentComponents: any = <></>;
                if (section.components) {
                  contentComponents = (section.components || []).map(
                    (
                      componentDescriptor: ProfileComponentDescriptor,
                      componentIndex: number
                    ) => (
                      <div key={`content-comp-${index || ""}-section`}>
                        {buildComponent(
                          subpage,
                          section,
                          componentDescriptor,
                          componentIndex
                        )}
                      </div>
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
    return section
      ? translateText(
          `${translation_base_path}.subpages.${subpage}.sections.${section}.name`
        )
      : undefined;
  };
  //#endregion

  //#region Build Component

  function buildComponent(
    subpage: ProfileDetailsSubpage,
    section: ProfileDetailsSubpageSection,
    componentDescriptor: ProfileComponentDescriptor,
    componentIndex: number,
    parentDataSource: EntityModel<EntityTemplate> = undefined
  ) {
    const source = parentDataSource || entityData;

    const dataSourceElement: EntityModel<EntityTemplate> = componentDescriptor
      .data?.data_source
      ? source[componentDescriptor.data?.data_source as keyof typeof source]
      : source;

    let renderedComponent = <></>;
    if (componentDescriptor.componentName === ProfileComponentTypes.MAP) {
      const lat = getData(componentDescriptor.data?.lat, dataSourceElement);
      const lng = getData(componentDescriptor.data?.lng, dataSourceElement);

      const mapData = {
        zoom: 19,
        center: {
          lat,
          lng,
        },
        marksLocation: [
          {
            lat,
            lng,
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
      function processAttribute(
        attribute: any,
        componentIndex: number,
        parentDataSource: EntityModel<EntityTemplate> = undefined
      ) {
        let value = undefined;
        if (attribute.value || attribute.components) {
          if (attribute.value instanceof Function) {
            value = (
              <>{attribute.value(parentDataSource || dataSourceElement)}</>
            );
          } else if (attribute.components && attribute.components.length) {
            value = (
              <>
                {(attribute.components || []).map(
                  (
                    componentDescriptor: ProfileComponentDescriptor,
                    componentIndex: number
                  ) => {
                    const source = parentDataSource || entityData;

                    const dataSourceElement: EntityModel<EntityTemplate> =
                      source[
                        componentDescriptor.data
                          ?.data_source as keyof typeof source
                      ];

                    componentDescriptor.data.socialNetwork = attribute.name;

                    const generated = buildComponent(
                      subpage,
                      section,
                      componentDescriptor,
                      componentIndex,
                      dataSourceElement
                    );
                    return generated;
                  }
                )}
              </>
            );
          } else {
            value = attribute.value;
          }
        } else {
          value = getData(attribute.name, parentDataSource);
        }
        return {
          name: attribute.name,
          title: getAttributeTitle(subpage.name, section.name, attribute),
          customTitle: !!attribute.title || attribute.useTranslation,
          icon: attribute?.icon,
          value,
          requireSession: attribute.requireSession,
        };
      }

      const sectionsAttributes: {
        title: string;
        attributes: IconDetailedAttribute[];
      }[] =
        (componentDescriptor.data?.attributes && [
          {
            title: componentDescriptor.data?.title,
            attributes: componentDescriptor.data?.attributes?.map(
              (attribute: any, componentIndex: number) =>
                processAttribute(attribute, componentIndex)
            ),
          },
        ]) ||
        (componentDescriptor.data?.data_source &&
          source[
            componentDescriptor.data?.data_source as keyof typeof source
          ]?.map((dataSourceElement: any, elementIndex: number) => {
            let title = componentDescriptor.data?.data_element_title?.prefix;
            if (componentDescriptor.data?.data_element_title?.isConsecutive) {
              title += ` ${
                elementIndex +
                componentDescriptor.data?.data_element_title?.consecutiveBase
              }`;
            }
            return {
              title,
              attributes: componentDescriptor.data?.fields.map(
                (attribute: any, componentIndex: number) =>
                  processAttribute(attribute, componentIndex, dataSourceElement)
              ),
            };
          })) ||
        [];

      renderedComponent = (
        <>
          {sectionsAttributes.map(
            (sectionAttributes: any, sectionIndex: number) => (
              <AttributesIconFieldReadOnly
                key={`section-${section.name}-${sectionIndex}-attributes-${componentIndex}`}
                attributes={sectionAttributes.attributes}
                title={sectionAttributes?.title}
              />
            )
          )}
        </>
      );
    } else if (
      componentDescriptor.componentName === ProfileComponentTypes.HTML_CONTENT
    ) {
      const content =
        getData(componentDescriptor.data?.attribute_content) ||
        componentDescriptor.data?.content;
      return <>{content}</>;
    } else if (
      componentDescriptor.componentName ===
      ProfileComponentTypes.PROFILE_THUMBNAIL_CARD
    ) {
      // Data source
      const data: any =
        entityData[
          componentDescriptor.data?.data_source as keyof typeof entityData
        ];

      let elements = [];
      if (Array.isArray(data)) {
        elements = data;
      } else {
        elements.push(data);
      }

      // Footers
      let footer: any = () => <></>;
      const footerDescriptor = componentDescriptor.data?.footer;
      if (footerDescriptor) {
        footer = () => {
          return (footerDescriptor.components || []).map(
            (
              componentDescriptor: ProfileComponentDescriptor,
              componentIndex: number
            ) => {
              const source = parentDataSource || entityData;

              const dataSourceElement: EntityModel<EntityTemplate> =
                source[
                  componentDescriptor.data?.data_source as keyof typeof source
                ];

              const generated = buildComponent(
                subpage,
                section,
                componentDescriptor,
                componentIndex,
                dataSourceElement
              );
              return generated;
            }
          );
        };
      }

      // Handlers
      let clickHandler: (source: any) => void = undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler =
          handlers[
            componentDescriptor.clickHandlerName as keyof typeof handlers
          ];
      }
      return (elements || []).map((element, index) => (
        <ProfileThumbnailCard
          key={`profile-thumbnail-${index}`}
          elementData={element}
          footer={footer}
          callbacks={{
            onClickCard: (elementData: any) => {
              if (componentDescriptor.clickHandlerName) {
                handlers[componentDescriptor.clickHandlerName](elementData);
              }
            },
          }}
        />
      ));
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
    } else if (
      componentDescriptor.componentName ===
      ProfileComponentTypes.SOCIAL_NETWORK_WIDGET
    ) {
      const socialNetworkName = componentDescriptor.data?.socialNetwork;
      renderedComponent = SocialNetworks[socialNetworkName]?.widget({
        user: dataSourceElement[
          socialNetworkName as keyof typeof dataSourceElement
        ],
      });
    } else if (
      componentDescriptor.componentName === ProfileComponentTypes.TITLE
    ) {
      renderedComponent = (
        <Title
          title={componentDescriptor.data?.title}
          size={componentDescriptor.data?.size || "2"}
        />
      );
    } else if (
      componentDescriptor.componentName === ProfileComponentTypes.ARTS_GENRES
    ) {
      const content = getData(componentDescriptor.data?.genres) || {};

      return <GenresListView genres={content} />;
    }

    return renderedComponent;
  }
  //#endregion

  return (
    <>
      {!!entityData && (
        <div className="place-container">
          {profileHeaderComponent || <ProfileHeader element={entityData} />}
          <TabbedPanel tabs={transformedConfig()} />
        </div>
      )}
    </>
  );
};
