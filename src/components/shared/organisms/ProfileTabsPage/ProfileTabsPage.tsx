import { useI18n } from '~/common/utils';
import { EntityModel, EntityTemplate } from '~/models/base';
import './ProfileTabsPage.scss';
import { ComponentDescriptor, PageSection, ContentSection } from '~/components/shared/organisms/gui/builders/component-types.def';

import { EVENT_DETAIL_SUB_PAGE_CONFIG } from '~/components/Pages/EventsPage/EventDetailsPage/config-event-detail';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';

import { Fab } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProfilesSlice } from '~/common/slices/domain/profile/ProfileSlice';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import { TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { ProfileHeader } from '~/components/shared/molecules/Profile/ProfileHeader';
import { DynamicIcons } from '../../DynamicIcons';
import SEO from '../app/seo/seo';
import { buildComponent as buildComponentFromRegistry, registerAllBuilders } from '~/components/shared/organisms/gui/builders/componentBuilders';

interface FabParams {
  icon?: string;
  text?: string;
  handler: Function;
}
export interface ProfilePageParams {
  entityName: string;
  translation_base_path: string;
  entityData: EntityModel<EntityTemplate>;
  handlers?: any;
  subpagesConfig?: PageSection[];
  profileHeaderComponent?: any;
  footer?: any;
  fab?: FabParams;
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
    fab,
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
  const [isFabVisible, setIsFabVisible] = useState(true);
  const [currentUserCanEdit, setCurrentUserCanEdit] = useState(false);
  const [currentUserIsInProfile, setCurrentUserIsInProfile] = useState(false);

  const tabbedPanelRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Registrar builders al montar el componente
  useEffect(() => {
    registerAllBuilders();
  }, []);

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
      let permissions = { canEdit: false, isInProfile: false };
      if (loggedUser && entityData) {
        const userPermissions = loggedUser.checkPermissions(entityData.identifier);
        permissions = userPermissions;
      }
      setCurrentUserCanEdit(permissions.canEdit);
      setCurrentUserIsInProfile(permissions.isInProfile);
    }
  }, [loggedUser]);

  useEffect(() => {
    const handleScroll = () => {
      const tabbedPanelElement = tabbedPanelRef.current;
      const footerElement = footerRef.current;

      if (!tabbedPanelElement) return;

      const tabbedPanelRect = tabbedPanelElement.getBoundingClientRect();
      const tabbedPanelBottom = tabbedPanelRect.bottom;

      // Si hay footer, usar su posición, si no, usar el final del TabbedPanel
      let limitPosition = tabbedPanelBottom;

      if (footerElement) {
        const footerRect = footerElement.getBoundingClientRect();
        limitPosition = Math.min(tabbedPanelBottom, footerRect.top);
      }

      // El FAB está fijo en bottom: 24px, así que consideramos esa altura
      const fabBottomPosition = window.innerHeight - 24;

      // Ocultar el FAB si alcanzó el límite
      setIsFabVisible(fabBottomPosition < limitPosition);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Ejecutar al montar

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const subPagesInfo = [...EVENT_DETAIL_SUB_PAGE_CONFIG];

  //#region Helpers
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
                      (componentDescriptor: ComponentDescriptor, componentIndex: number) => (
                        <div key={`content-comp-${subPageIndex}-${sectionIndex || ''}-${componentIndex}`}>
                          {buildComponent(subpage, section, componentDescriptor, componentIndex)}
                        </div>
                      )
                    );
                  }

                  const sectionContent = () => contentComponents;

                  const filteredSections = (subpage.sections || []).filter((section) => {
                    // Check hidden property first
                    const isHidden =
                      section.hidden !== undefined &&
                      ((typeof section.hidden === 'boolean' && section.hidden) ||
                        (typeof section.hidden === 'string' && section.hidden === 'true') ||
                        (section.hidden instanceof Function && section.hidden(entityData)));

                    if (isHidden) return false;

                    // Check requireSession property
                    if (section.requireSession && !loggedUser) {
                      return false;
                    }

                    return true;
                  });

                  return (
                    <RequireAuthComponent
                      key={`section-${section.name}-${sectionIndex}`}
                      requiredSession={section.requireSession}
                    >
                      <SectionsPanel
                        sectionName={section?.emptyTitle ? '' : translateSection(subpage.name, section?.name)}
                        sectionContent={sectionContent}
                        isCollapsible={filteredSections.length > 1}
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
    subpage: PageSection,
    section: ContentSection,
    componentDescriptor: ComponentDescriptor,
    componentIndex: number,
    parentDataSource: EntityModel<EntityTemplate> = undefined
  ) {
    // Extender handlers con funciones especiales del estado de ProfileTabsPage
    const extendedHandlers = {
      ...handlers,
      lastVisibleTab,
      setShowSpecificTab,
      showSpecificFollowerType,
    };

    // Llamar al nuevo sistema de builders
    return buildComponentFromRegistry({
      componentDescriptor,
      subpage,
      section,
      componentIndex,
      entityData,
      parentDataSource,
      handlers: extendedHandlers,
      translationBasePath: translation_base_path,
    });
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

          <div ref={tabbedPanelRef}>
            <TabbedPanel
              tabs={transformedConfigData}
              handlers={tabPanelHandlers}
              showSpecificTab={showSpecificTab}
              showSpecificFollowerType={showSpecificFollowerType}
            />
          </div>
          {profileFooter && <div ref={footerRef}>{profileFooter}</div>}
          {!profileFooter && profileFooter}
          {fab && !currentUserIsInProfile && (
            <Fab
              color="primary"
              aria-label="add"
              size="medium"
              className={!isFabVisible ? 'fab-hidden' : ''}
              onClick={() => fab.handler()}
            >
              <DynamicIcons iconName={fab.icon || 'lu LuCalendarPlus'} size={30} color="#034d5b" />
            </Fab>
          )}
        </div>
      )}
    </>
  );
};
