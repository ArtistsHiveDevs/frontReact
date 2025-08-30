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
import { GMapsSvgMaker } from '~/common/utils/object-utils/object-utils-index';
import { EVENT_DETAIL_SUB_PAGE_CONFIG } from '~/components/Pages/EventsPage/EventDetailsPage/config-event-detail';
import { Title } from '~/components/shared/atoms/Title/Title';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';

import { isDayjs } from 'dayjs';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProfilesSlice } from '~/common/slices/domain/profile/ProfileSlice';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { CrewListRiderView } from '~/components/shared//molecules/domain/crewListView/CrewListView';
import { GenresListView } from '~/components/shared//molecules/domain/genres/GenresListView';
import { AlbumsShortListView } from '~/components/shared/domain/organisms/AlbumsShortListView/AlbumsShortListView';
import { CountriesCitiesListView } from '~/components/shared/domain/organisms/CountriesCitiesListView/CountriesCitiesListView';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import { TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { EventThumbnailCard } from '~/components/shared/molecules/Profile/EventThumbnailCard/EventThumbnailCard';
import { FollowerListView } from '~/components/shared/molecules/Profile/FollowerListView/FollowerListView';
import { ProfileHeader } from '~/components/shared/molecules/Profile/ProfileHeader';
import { ProfileThumbnailCard } from '~/components/shared/molecules/Profile/ProfileThumbnailCard';
import { SocialNetworks } from '~/constants/social-networks.const';
import { EventModel } from '~/models/domain/event/event.model';
import { HorizontalImageGallery } from '../../atoms/ImageGallery/HorizontalImageGallery';
import { TableView } from '../../atoms/Table/TableView';
import { TracksListView } from '../../domain/organisms/TracksListView/TracksListView';
import SEO from '../app/seo/seo';

export interface ProfilePageParams {
  entityName: string;
  translation_base_path: string;
  entityData: EntityModel<EntityTemplate>;
  handlers?: any;
  subpagesConfig?: ProfileDetailsSubpage[];
  profileHeaderComponent?: any;
  footer?: any;
}

export const ProfileTabsPage = (props: ProfilePageParams) => {
  const { locale } = useI18n();

  const {
    translation_base_path,
    entityData,
    handlers,
    subpagesConfig,
    profileHeaderComponent,
    footer: profileFooter,
  } = props;
  const seoData = entityData
    ? {
        title: `${entityData.name}  ◃⬡▹  Artist Hive`,
        description: `${entityData.description || entityData.name}`,
        url: 'https://www.artist-hive.com/home',
        image: `${entityData.profile_pic || 'https://npcarlos.co/artistsHive_mocks/logo.png'}`,
        type: 'website',
      }
    : undefined;

  const { translateText } = useI18n();
  const { loggedUser } = useAuth();
  const { actions: profileActions } = useProfilesSlice();

  const dispatch = useDispatch();

  const [headerShouldShowFollowerCounter, setHeaderShouldShowFollowerCounter] = useState(true);
  const [showSpecificTab, setShowSpecificTab] = useState(undefined);
  const [showSpecificFollowerType, setShowSpecificFollowerType] = useState(undefined);
  const [lastVisibleTab, setLastVisibleTab] = useState(-1);
  const [currentVisibleTab, setCurrentVisibleTab] = useState(0);
  const [hasSeenFollowers, setHasSeenFollowers] = useState(false);

  useEffect(() => {
    const followersPageIndex = (subpagesConfig || []).findIndex((subpage) => subpage.name === 'followers');
    if (entityData && followersPageIndex === currentVisibleTab) {
      setHasSeenFollowers(true);
      if (loggedUser) {
        dispatch(profileActions.loadProfileEndpoint({ entity: entityData, endpoint: 'follow' }));
      }
    }
  }, [currentVisibleTab]);

  useEffect(() => {
    if (loggedUser) {
      dispatch(profileActions.loadProfileEndpoint({ entity: entityData, endpoint: 'follow' }));
    }
  }, [loggedUser]);

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
      } else if (isDayjs(data)) {
        response = data.format('LL');
      }
    }
    return response;
  };

  const transformedConfig = () => {
    return (subpagesConfig || []).map((subpage, subPageIndex) => {
      return {
        _name: subpage.name,
        name: translateSubpage(subpage.name),
        hideMainMenu: subpage.hideMainMenu,
        allowedRoles: subpage.allowedRoles,
        requireSession: subpage.requireSession,
        tabContent: () => {
          return (
            <RequireAuthComponent
              requiredSession={subpage.requireSession}
              key={`section_${subPageIndex}_${subpage.name}`}
            >
              {(subpage.sections || [])
                .filter(
                  (section) =>
                    section.hidden === undefined ||
                    (typeof section.hidden === 'boolean' && !section.hidden) ||
                    (typeof section.hidden === 'string' && section.hidden !== 'true') ||
                    (section.hidden instanceof Function && !section.hidden(entityData))
                )
                .map((section, sectionIndex) => {
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
        fitBounds: false,
        zoom: 17,
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

      const mapContainerStyles = {
        width: '100%',
        height: '400px',
      };

      renderedComponent = (
        <MapContainer
          //   key={`section-${section.name}-${index}-${componentIndex}`}
          apiKey={import.meta.env.VITE_GMAPS_KEY}
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
          } else if (isDayjs(attribute.value)) {
            value = attribute.value.format('LLLL');
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
              .filter(
                (attribute: any) =>
                  attribute.hidden === undefined ||
                  (typeof attribute.hidden === 'boolean' && !attribute.hidden) ||
                  (typeof attribute.hidden === 'string' && attribute.hidden !== 'true') ||
                  (attribute.hidden instanceof Function && !attribute.hidden(dataSourceElement))
              )
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
              .filter(
                (attribute: any) =>
                  attribute.hidden === undefined ||
                  (typeof attribute.hidden === 'boolean' && !attribute.hidden) ||
                  (typeof attribute.hidden === 'string' && attribute.hidden !== 'true') ||
                  (attribute.hidden instanceof Function && !attribute.hidden(dataSourceElement))
              )
              .map((attribute: any, componentIndex: number) => processAttribute(attribute, componentIndex)),
          },
        ];
      }

      const useColon = componentDescriptor.data?.useColon;
      const useDivInValue = componentDescriptor.data?.useDivInValue;
      const direction = componentDescriptor.data?.iconDirection;

      renderedComponent = (
        <>
          {sectionsAttributes.map((sectionAttributes: any, sectionIndex: number) => (
            <AttributesIconFieldReadOnly
              key={`section-${section.name}-${sectionIndex}-attributes-${componentIndex}`}
              attributes={sectionAttributes.attributes}
              title={sectionAttributes?.title}
              useDivInValue={useDivInValue}
              useColon={useColon}
              direction={direction}
            />
          ))}
        </>
      );
    } else if (componentDescriptor.componentName === ProfileComponentTypes.HTML_CONTENT) {
      const content =
        getData(componentDescriptor.data?.attribute_content) ||
        componentDescriptor.data?.content ||
        (componentDescriptor.data?.render && componentDescriptor.data?.render(parentDataSource || dataSourceElement));
      return <>{content}</>;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.PROFILE_FOLLOWERS_COMPONENT) {
      const content =
        getData(componentDescriptor.data?.attribute_content) ||
        componentDescriptor.data?.content ||
        (componentDescriptor.data?.render && componentDescriptor.data?.render(parentDataSource || dataSourceElement)) ||
        parentDataSource ||
        dataSourceElement;

      const followersListView = {
        ...handlers,
        onClickBackButtonFollowers: () => {
          console.log(lastVisibleTab);
          setShowSpecificTab(lastVisibleTab);
        },
      };
      return (
        <FollowerListView
          element={content}
          handlers={followersListView}
          showSpecificFollowerType={showSpecificFollowerType}
        />
      );
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
      let footer: any = undefined;
      const footerDescriptor = componentDescriptor.data?.footer;
      const source = parentDataSource || entityData;

      const dataSourceElement: EntityModel<EntityTemplate> =
        source[componentDescriptor.data?.data_source as keyof typeof source];
      if (footerDescriptor?.components) {
        footer = (element: any) => {
          return (footerDescriptor.components || []).map(
            (componentDescriptor: ProfileComponentDescriptor, componentIndex: number) => {
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
      } else if (footerDescriptor && typeof footerDescriptor === 'function') {
        footer = (element: any) => footerDescriptor(element);
      }

      // Handlers
      let clickHandler: (source: any) => void = undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler = handlers[componentDescriptor.clickHandlerName as keyof typeof handlers];
      }
      return (elements || []).map((element, index) => (
        <ProfileThumbnailCard
          key={`${section.name}-profile-thumbnail-${index}`}
          elementData={element}
          footer={() => footer?.(element)}
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
        const previous = index > 0 ? new EventModel(eventsArray[index - 1]) : undefined;
        // const previousMoment = previous ? moment(previous?.timetable__initial_date) : undefined;
        // const currentMoment = moment(event.timetable__initial_date);
        console.log(previous, event);
        const sameMonth = previous?.timetable__initial_date.month() === event.timetable__initial_date.month();
        const sameYear = previous?.timetable__initial_date?.year() === event.timetable__initial_date.year();

        return (
          <>
            {!sameMonth && (
              <h3 className="month-title">
                {event.timetable__initial_date.format(`MMMM${!!previous && !sameYear ? ' / YYYY' : ''}`)}
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
    } else if (componentDescriptor.componentName === ProfileComponentTypes.HORIZONTAL_IMAGE_GALLERY) {
      let images: GalleryImageParams[] = [];

      if (componentDescriptor.data?.images) {
        images = getData(componentDescriptor.data?.images);
      }
      if (componentDescriptor.data?.image) {
        images = [{ src: getData(componentDescriptor.data?.image) }];
      }
      renderedComponent = <HorizontalImageGallery imagesInfo={images} />;
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
      const eventsInfo: EventModel[] = getData(componentDescriptor.data?.data_source) || [];

      let clickHandler: (source: any, images: any) => void = undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler = handlers[componentDescriptor.clickHandlerName as keyof typeof handlers];
      }
      renderedComponent = (
        <CalendarSimpleLayout
          //   key={`section-${section.name}-${index}`}
          events={eventsInfo}
          onClickHandler={clickHandler}
          options={componentDescriptor.data?.options}
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
      let clickHandler: (source: GalleryImageParams, images: any) => void = undefined;

      if (!!componentDescriptor.clickHandlerName) {
        clickHandler = handlers[componentDescriptor.clickHandlerName as keyof typeof handlers];
      }

      renderedComponent = (
        <Title
          title={componentDescriptor.data?.title}
          size={componentDescriptor.data?.size || '2'}
          onClickHandler={clickHandler}
        />
      );
    } else if (componentDescriptor.componentName === ProfileComponentTypes.ARTS_GENRES) {
      const content = getData(componentDescriptor.data?.genres) || {};

      return <GenresListView genres={content} />;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.CREW_LIST_RIDER_VIEW) {
      const crewList = getData(componentDescriptor.data?.crewList) || {};
      console.log('ProfileTabs', componentDescriptor.data?.crewList, crewList);
      renderedComponent = <CrewListRiderView crewList={crewList} />;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.TABLE) {
      const tableConfig = componentDescriptor.data?.tableConfig
        ? componentDescriptor.data?.tableConfig(dataSourceElement)
        : undefined;

      console.log('Table', componentDescriptor.data?.crewList, tableConfig);
      renderedComponent = (tableConfig && <TableView config={tableConfig} />) || <></>;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.DISCOGRAPHY_LIST_VIEW) {
      const discography = getData(componentDescriptor.data_source);

      renderedComponent = <AlbumsShortListView discography={discography} />;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.TOP_TRACKS_LIST_VIEW) {
      const tracks = getData(componentDescriptor.data_source);

      renderedComponent = <TracksListView tracks={tracks} />;
    } else if (componentDescriptor.componentName === ProfileComponentTypes.VISITED_COUNTRIES_CITIES_LIST_VIEW) {
      const cities = getData(componentDescriptor.data?.cities) || [];

      renderedComponent = <CountriesCitiesListView cities={cities} />;
    }

    return renderedComponent;
  }

  //#endregion

  const tabPanelHandlers = {
    onSelectedTab: (selectedTabIndex: any) => {
      setLastVisibleTab(currentVisibleTab);
      setCurrentVisibleTab(selectedTabIndex);
      setHeaderShouldShowFollowerCounter(transformedConfigData?.[selectedTabIndex]?._name !== 'followers');
    },
  };

  const transformedConfigData = transformedConfig();

  return (
    <>
      {!!entityData && (
        <div className="place-container">
          {seoData && <SEO {...seoData} />}
          {profileHeaderComponent || (
            <ProfileHeader
              element={entityData}
              handlers={{
                ...handlers,
                onClickSeeFollowers: (value: any) => {
                  const subpageIndex = (subpagesConfig || []).findIndex((subpage) => subpage.name === 'followers');
                  setShowSpecificFollowerType(value);
                  setShowSpecificTab(subpageIndex);
                },
              }}
              showFollowerCounter={headerShouldShowFollowerCounter}
            />
          )}
          <br></br>
          <TabbedPanel
            tabs={transformedConfigData}
            handlers={tabPanelHandlers}
            showSpecificTab={showSpecificTab}
            showSpecificFollowerType={showSpecificFollowerType}
          />
          {profileFooter}
        </div>
      )}
    </>
  );
};
