import { useI18n } from '~/common/utils';
import { PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { EntityModel, EntityTemplate } from '~/models/base';
import './ProfileTabsPage.scss';

import { Fab } from '@mui/material';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProfilesSlice } from '~/common/slices/domain/profile/ProfileSlice';
import { isProdEnvironment } from '~/common/utils/app-utils/app-utils';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { RouteTracker, EntityType } from '~/common/utils/analytics';
import { TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { ProfileHeader } from '~/components/shared/molecules/Profile/ProfileHeader';
import { DynamicIcons } from '../../DynamicIcons';
import SEO from '../app/seo/seo';

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
        image: `${entityData.profile_pic || 'https://artist-hive.com/img/logo.png'}`,
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
  const [currentTabName, setCurrentTabName] = useState<string>('info'); // For analytics
  const [hasSeenFollowers, setHasSeenFollowers] = useState(false);
  const [isFabVisible, setIsFabVisible] = useState(true);
  const [currentUserCanEdit, setCurrentUserCanEdit] = useState(false);

  const tabbedPanelRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

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
      let permissions = { canEdit: false, isInProfile: true };
      if (loggedUser && entityData) {
        const userPermissions = loggedUser.checkPermissions(entityData.identifier);
        permissions = userPermissions;
      }
      setCurrentUserCanEdit(permissions.canEdit);
    }
  }, [loggedUser]);

  const handleScroll = useCallback(() => {
    const tabbedPanelElement = tabbedPanelRef.current;
    const footerElement = footerRef.current;

    if (!tabbedPanelElement) return;

    const tabbedPanelRect = tabbedPanelElement.getBoundingClientRect();
    const tabbedPanelBottom = tabbedPanelRect.bottom;

    // Si hay footer, usar su posición, si no, usar el final del TabbedPanel
    let limitPosition = tabbedPanelBottom;

    if (footerElement) {
      const footerRect = footerElement.getBoundingClientRect();
      limitPosition = footerRect.bottom;
    }

    const absoluteContentBottom = limitPosition + window.scrollY;
    if (absoluteContentBottom <= window.innerHeight) {
      setIsFabVisible(true);
      return;
    }

    // El FAB está fijo, consideramos su altura (3rem) y posición desde el bottom
    const fabHeightPx = parseFloat(getComputedStyle(document.documentElement).fontSize) * 3;
    const fabBottomPosition = window.innerHeight - fabHeightPx;

    // Ocultar el FAB si alcanzó el límite
    setIsFabVisible(fabBottomPosition < limitPosition);
  }, [tabbedPanelRef.current, footerRef.current]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Map entityName to EntityType for analytics
  const getEntityType = (entityName: string): EntityType | undefined => {
    const entityMap: Record<string, EntityType> = {
      Artist: EntityType.ARTIST,
      Place: EntityType.PLACE,
      Event: EntityType.EVENT,
      Academy: EntityType.ACADEMY,
    };
    return entityMap[entityName];
  };

  const tabPanelHandlers = {
    onSelectedTab: (selectedTabIndex: any) => {
      setLastVisibleTab(currentVisibleTab);
      setCurrentVisibleTab(selectedTabIndex);
      setTimeout(handleScroll, 0);

      // Necesitamos acceder al nombre del tab de otra forma ya que no tenemos transformedConfigData
      const selectedTabName = subpagesConfig?.[selectedTabIndex]?.name;
      setHeaderShouldShowFollowerCounter(selectedTabName !== 'followers');

      // Update current tab name for analytics
      setCurrentTabName(selectedTabName || 'info');
    },
  };

  // Crear el contexto del transformer por defecto
  const defaultTransformerContext = {
    entityData,
    handlers: {
      ...handlers,
      lastVisibleTab,
      setShowSpecificTab,
      showSpecificFollowerType,
    },
    translationBasePath: translation_base_path,
    translateText,
    // buildComponent, // Comentado para usar el buildComponent por defecto de TabbedPanel
  };

  return (
    <>
      {/* Analytics Tracker - tracks profile views and tab changes */}
      {entityData && (
        <RouteTracker
          entity={entityData}
          entityType={getEntityType(props.entityName)}
          tab={currentTabName}
          section={props.entityName.toLowerCase() + 's'} // e.g., 'artists', 'places'
        />
      )}

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
              rawConfig={subpagesConfig}
              defaultTransformerContext={defaultTransformerContext}
              handlers={tabPanelHandlers}
              showSpecificTab={showSpecificTab}
            />
          </div>
          {profileFooter && <div ref={footerRef}>{profileFooter}</div>}
          {!profileFooter && profileFooter}
          {!isProdEnvironment() && fab && !loggedUser?.isInPersonalProfile && (
            <Fab
              color="white"
              aria-label="add"
              size="large"
              className={!isFabVisible ? 'fab-hidden' : ''}
              onClick={() => fab.handler()}
            >
              <DynamicIcons iconName={fab.icon || 'fa FaPlus'} size={35} color="#000" />
            </Fab>
          )}
        </div>
      )}
    </>
  );
};
