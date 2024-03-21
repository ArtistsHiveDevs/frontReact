import { useI18n } from '~/common/utils';
import { GalleryImageParams, ImageGallery } from '~/components/shared/atoms/ImageGallery/ImageGallery';
import MapContainer from '~/components/shared/mapPrinter/mapContainer';
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from '~/components/shared/molecules/general/AttributesIconField';
import { CalendarSimpleLayout } from '~/components/shared/molecules/general/calendar/CalendarSimpleLayout/CalendarSimpleLayout';
import { EntityModel, EntityTemplate } from '~/models/base';
import './ProfileTabsPage.scss';
import {
  ProfileComponentDescriptor,
  ProfileComponentTypes,
  ProfileDetailAttributeConfiguration,
  ProfileDetailsSubpage,
  ProfileDetailsSubpageSection,
} from './profile-details.def';

import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { Table } from 'react-bootstrap';
import { GMapsSvgMaker } from '~/common/utils/object-utils/object-utils-index';
import { EVENT_DETAIL_SUB_PAGE_CONFIG } from '~/components/Pages/EventsPage/EventDetailsPage/config-event-detail';
import { Title } from '~/components/shared/atoms/Title/Title';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';

import moment from 'moment';
import { CrewListView } from '~/components/shared//molecules/domain/crewListView/CrewListView';
import { GenresListView } from '~/components/shared//molecules/domain/genres/GenresListView';
import { AlbumsShortListView } from '~/components/shared/domain/organisms/AlbumsShortListView/AlbumsShortListView';
import { CountriesCitiesListView } from '~/components/shared/domain/organisms/CountriesCitiesListView/CountriesCitiesListView';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import { TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { ProfileHeader } from '~/components/shared/molecules/Profile/ProfileHeader';
import { ProfileThumbnailCard } from '~/components/shared/molecules/Profile/ProfileThumbnailCard';
import { formatDateInMomentType } from '~/constants';
import { SocialNetworks } from '~/constants/social-networks.const';
import { EventModel } from '~/models/domain/event/event.model';
import { EventParams } from '../../atoms/calendar/CalendarSimpleEvent/CalendarSimpleEvent';
import { EventThumbnailCard } from '../../molecules/Profile/EventThumbnailCard/EventThumbnailCard';

export interface ProfilePageParams {
  entityName: string;
  translation_base_path: string;
  entityData: EntityModel<EntityTemplate>;
  handlers?: any;
  subpagesConfig?: ProfileDetailsSubpage[];
  profileHeaderComponent?: any;
}

export const ProfileTabsPage = (props: ProfilePageParams) => {
  const { translation_base_path, entityData, handlers, subpagesConfig, profileHeaderComponent } = props;

  const { translateText } = useI18n();

  const getAttributeTitle = (
    subpageName: string,
    sectionName: string,
    attribute: ProfileDetailAttributeConfiguration
  ) => {
    let title: string = '';
    if (attribute.translationPath) {
      title = translateText(`${attribute.translationPath}.${attribute.name}`);
    } else if (attribute.title) {
      title = attribute.title;
    } else if (attribute.useTranslation || attribute.emptyTitle === undefined) {
      title = translateAttribute(subpageName, sectionName, attribute.name);
    }
    return title;
  };

  const subPagesInfo = [...EVENT_DETAIL_SUB_PAGE_CONFIG];

  //#region Helpers
  const getData: any = (attribute: string, dataSource: EntityModel<EntityTemplate> = undefined) => {
    let response = undefined;
    if (attribute) {
      const element = dataSource || entityData;
      const propertyPath = attribute.split('.') || [];
      const data =
        propertyPath.reduce((previous, current) => {
          return previous ? previous[current as keyof typeof previous] : '';
        }, element) || '';

      response = data;

      if (Array.isArray(data) && data.length && (typeof data[0] === 'string' || typeof data[0] === 'number')) {
        response = data.join(', ');
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
              {(subpage.sections || []).map((section, sectionIndex) => {
                // Icon Detailed Attributes

                let contentComponents: any = <></>;
                if (section.components) {
                  contentComponents = (section.components || []).map(
                    (componentDescriptor: ProfileComponentDescriptor, componentIndex: number) => (
                      <div key={`content-comp-${subPageIndex}-${sectionIndex || ''}-${componentIndex}`}>
                        {buildComponent(subpage, section, componentDescriptor, componentIndex)}
                      </div>
                    )
                  );
                }

                const sectionContent = () => contentComponents;

                return (
                  <RequireAuthComponent
                    key={`section-${section.name}-${sectionIndex}`}
                    requiredSession={section.requireSession}
                  >
                    <SectionsPanel
                      sectionName={translateSection(subpage.name, section?.name)}
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
  const translateAttribute = (subpage: string, section: string, attribute: string) => {
    return translateText(`${translation_base_path}.subpages.${subpage}.sections.${section}.attributes.${attribute}`);
  };

  const translateSubpage = (subpage: string) => {
    return translateText(`${translation_base_path}.subpages.${subpage}.name`);
  };

  const translateSection = (subpage: string, section: string) => {
    return section ? translateText(`${translation_base_path}.subpages.${subpage}.sections.${section}.name`) : undefined;
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

    let dataSourceElement: EntityModel<EntityTemplate> = source;

    if (componentDescriptor.data?.data_source) {
      const dsPath = componentDescriptor.data?.data_source.split('.') || [];
      const element = source;
      dataSourceElement =
        dsPath.reduce((previous: any, current: any) => {
          return previous ? previous[current as keyof typeof previous] : {};
        }, element) || {};
    }

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
            position: { lat, lng },
            iconData: GMapsSvgMaker(faMicrophoneLines.icon, {
              color: 'rgb(94, 90, 90)',
              scale: 0.07,
            }),
          },
        ],
        anotherOpts: {},
      };

      const googleApiKey = 'AIzaSyBzyzf0hnuMJBdOB9sR0kBbBTtqYs-XECs';

      const mapContainerStyles = {
        width: '100%',
        height: '400px',
      };

      renderedComponent = (
        <MapContainer
          //   key={`section-${section.name}-${index}-${componentIndex}`}
          apiKey={googleApiKey}
          stylesc={mapContainerStyles}
          mapData={mapData}
        />
      );
    } else if (componentDescriptor.componentName === ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS) {
      function processAttribute(
        attribute: any,
        componentIndex: number,
        parentDataSource: EntityModel<EntityTemplate> = undefined
      ) {
        let value = undefined;
        if (attribute.value || attribute.components) {
          if (attribute.value instanceof Function) {
            value = <>{attribute.value(parentDataSource || dataSourceElement)}</>;
          } else if (attribute.components && attribute.components.length) {
            value = (
              <>
                {(attribute.components || []).map(
                  (componentDescriptor: ProfileComponentDescriptor, componentIndexAtt: number) => {
                    const source = parentDataSource || entityData;

                    const dataSourceElement: EntityModel<EntityTemplate> =
                      source[componentDescriptor.data?.data_source as keyof typeof source];

                    componentDescriptor.data.socialNetwork = attribute.name;

                    const generated = buildComponent(
                      subpage,
                      section,
                      componentDescriptor,
                      componentIndexAtt,
                      dataSourceElement
                    );
                    return <div key={`build-comp-${componentIndex}-${componentIndexAtt}`}>{generated}</div>;
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

      let sectionsAttributes: {
        title: string;
        attributes: IconDetailedAttribute[];
      }[] = [];

      if (componentDescriptor.data?.data_source) {
        const dsPath = componentDescriptor.data?.data_source.split('.') || [];
        const element = source;
        const dsElement =
          dsPath.reduce((previous: any, current: any) => {
            return previous ? previous[current as keyof typeof previous] : {};
          }, element) || {};

        const isDSArray = Array.isArray(dsElement);
        let dsAsArray = dsElement;
        if (!isDSArray) {
          dsAsArray = [dsElement];
        }

        sectionsAttributes = dsAsArray.map((dataSourceElement: any, elementIndex: number) => {
          let title = componentDescriptor.data?.data_element_title?.prefix;
          if (componentDescriptor.data?.data_element_title?.isConsecutive) {
            title += ` ${elementIndex + componentDescriptor.data?.data_element_title?.consecutiveBase}`;
          }
          return {
            title,
            attributes: (componentDescriptor.data?.attributes || componentDescriptor.data?.fields)
              .filter((attribute: any) => !attribute.hidden || !attribute.hidden(dataSourceElement))
              .map((attribute: any, componentIndex: number) =>
                processAttribute(attribute, componentIndex, dataSourceElement)
              ),
          };
        });
      } else if (componentDescriptor.data?.attributes) {
        sectionsAttributes = [
          {
            title: componentDescriptor.data?.title,
            attributes: componentDescriptor.data?.attributes
              .filter((attribute: any) => !attribute.hidden || !attribute.hidden(dataSourceElement))
              .map((attribute: any, componentIndex: number) => processAttribute(attribute, componentIndex)),
          },
        ];
      }

      const useColon = componentDescriptor.data?.useColon;
      const useDivInValue = componentDescriptor.data?.useDivInValue;

      renderedComponent = (
        <>
          {sectionsAttributes.map((sectionAttributes: any, sectionIndex: number) => (
            <AttributesIconFieldReadOnly
              key={`section-${section.name}-${sectionIndex}-attributes-${componentIndex}`}
              attributes={sectionAttributes.attributes}
              title={sectionAttributes?.title}
              useDivInValue={useDivInValue}
              useColon={useColon}
            />
          ))}
        </>
      );
    } else if (componentDescriptor.componentName === ProfileComponentTypes.HTML_CONTENT) {
      const content =
        getData(componentDescriptor.data?.attribute_content) ||
        componentDescriptor.data?.content ||
        componentDescriptor.data?.render(parentDataSource || dataSourceElement);
      return <>{content}</>;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.PROFILE_THUMBNAIL_CARD) {
      // Data source
      const data: any = entityData[componentDescriptor.data?.data_source as keyof typeof entityData];

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
            (componentDescriptor: ProfileComponentDescriptor, componentIndex: number) => {
              const source = parentDataSource || entityData;

              const dataSourceElement: EntityModel<EntityTemplate> =
                source[componentDescriptor.data?.data_source as keyof typeof source];

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
        clickHandler = handlers[componentDescriptor.clickHandlerName as keyof typeof handlers];
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
    } else if (componentDescriptor.componentName === ProfileComponentTypes.EVENT_THUMBNAIL_CARD) {
      // Data source
      const data: any = entityData[componentDescriptor.data?.data_source as keyof typeof entityData];

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
            (componentDescriptor: ProfileComponentDescriptor, componentIndex: number) => {
              const source = parentDataSource || entityData;

              const dataSourceElement: EntityModel<EntityTemplate> =
                source[componentDescriptor.data?.data_source as keyof typeof source];

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
        clickHandler = handlers[componentDescriptor.clickHandlerName as keyof typeof handlers];
      }
      return (elements || []).map((element, index, eventsArray) => {
        const event = new EventModel(element);
        const previous = index > 0 ? eventsArray[index - 1] : undefined;
        const previousMoment = previous ? moment(previous?.timetable__initial_date) : undefined;
        const currentMoment = moment(event.timetable__initial_date);
        const sameMonth = previousMoment?.month() === currentMoment.month();
        const sameYear = previousMoment?.year() === currentMoment.year();

        return (
          <>
            {!sameMonth && (
              <h3 className="month-title">
                {formatDateInMomentType(
                  event.timetable__initial_date,
                  `MMMM${!!previous && !sameYear ? ' / YYYY' : ''}`
                )}
              </h3>
            )}
            <EventThumbnailCard
              key={`profile-thumbnail-${index}`}
              elementData={event}
              footer={footer}
              callbacks={{
                onClickCard: (elementData: any) => {
                  if (componentDescriptor.clickHandlerName) {
                    handlers[componentDescriptor.clickHandlerName](elementData);
                  }
                },
              }}
            />
          </>
        );
      });
    } else if (componentDescriptor.componentName === ProfileComponentTypes.IMAGE_GALLERY) {
      let clickHandler: (source: GalleryImageParams, images: any) => void = undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler = handlers[componentDescriptor.clickHandlerName as keyof typeof handlers];
      }
      let images: GalleryImageParams[] = [];

      if (componentDescriptor.data?.images) {
        images = getData(componentDescriptor.data?.images);
      }
      if (componentDescriptor.data?.image) {
        images = [{ src: getData(componentDescriptor.data?.image) }];
      }
      renderedComponent = (
        <div
        // key={`section-${section.name}-${index}-${componentIndex}`}
        >
          <ImageGallery
            images={images}
            imageSize="fs"
            clickHandler={(source: GalleryImageParams) => {
              if (clickHandler) {
                clickHandler(source, getData(componentDescriptor.data?.images));
              }
            }}
          />
        </div>
      );
    } else if (componentDescriptor.componentName === ProfileComponentTypes.CALENDAR_SIMPLE_LAYOUT) {
      const eventsInfo: EventParams[] = (getData(componentDescriptor.data?.data_source) || []).map((event: any) => {
        return {
          id: event.id,
          name: event[componentDescriptor.data?.fields?.title],
          title: event[componentDescriptor.data?.fields?.title],
          subtitle: event[componentDescriptor.data?.fields?.subtitle],
          picture: event[componentDescriptor.data?.fields?.picture],
          place: event[componentDescriptor.data?.fields?.place],
          datetime: moment(
            `${event[componentDescriptor.data?.fields?.date]} ${event[componentDescriptor.data?.fields?.time]}`,
            'YYYY-MM-DD hhmm'
          ),
        };
      });

      let clickHandler: (source: any, images: any) => void = undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler = handlers[componentDescriptor.clickHandlerName as keyof typeof handlers];
      }
      renderedComponent = (
        <CalendarSimpleLayout
          //   key={`section-${section.name}-${index}`}
          events={eventsInfo}
          onClickHandler={clickHandler}
        />
      );
    } else if (componentDescriptor.componentName === ProfileComponentTypes.SOCIAL_NETWORK_WIDGET) {
      const socialNetworkName = componentDescriptor.data?.socialNetwork;
      const selectedSocialNetwork = SocialNetworks[socialNetworkName];
      const user = dataSourceElement[socialNetworkName as keyof typeof dataSourceElement];

      const params = componentDescriptor.data?.params || {};
      const paramsValues: any = {};
      Object.keys(params).forEach((param) => (paramsValues[param] = getData(params[param], dataSourceElement)));

      renderedComponent =
        selectedSocialNetwork?.widget &&
        selectedSocialNetwork?.widget({
          user,
          ...paramsValues,
        });
    } else if (componentDescriptor.componentName === ProfileComponentTypes.TITLE) {
      renderedComponent = (
        <Title title={componentDescriptor.data?.title} size={componentDescriptor.data?.size || '2'} />
      );
    } else if (componentDescriptor.componentName === ProfileComponentTypes.ARTS_GENRES) {
      const content = getData(componentDescriptor.data?.genres) || {};

      return <GenresListView genres={content} />;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.CREW_LIST_VIEW) {
      const crewList = getData(componentDescriptor.data?.crewList) || {};
      console.log('ProfileTabs', componentDescriptor.data?.crewList, crewList);
      renderedComponent = <CrewListView crewList={crewList} />;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.TABLE) {
      const tableConfig = componentDescriptor.data?.tableConfig
        ? componentDescriptor.data?.tableConfig(dataSourceElement)
        : undefined;

      console.log('Table', componentDescriptor.data?.crewList, tableConfig);
      renderedComponent = (tableConfig && (
        <Table responsive>
          <thead>
            <tr>
              {tableConfig.columns.map((column: any) => (
                <th>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableConfig.rows.map((row: any) => (
              <tr>
                {tableConfig.columns.map((column: any) => (
                  <td>{row[column]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      )) || <></>;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.DISCOGRAPHY_LIST_VIEW) {
      const discography = getData(componentDescriptor.data_source);

      renderedComponent = <AlbumsShortListView discography={discography} />;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.VISITED_COUNTRIES_CITIES_LIST_VIEW) {
      const cities = getData(componentDescriptor.data?.cities) || [];

      renderedComponent = <CountriesCitiesListView cities={cities} />;
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
