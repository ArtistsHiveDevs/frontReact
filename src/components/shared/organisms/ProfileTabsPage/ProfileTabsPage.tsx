import { useI18n } from '~/common/utils';
import { PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { EntityModel, EntityTemplate } from '~/models/base';
import './ProfileTabsPage.scss';

import { Fab } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProfilesSlice } from '~/common/slices/domain/profile/ProfileSlice';
import useAuth from '~/common/utils/hooks/auth/useAuth';
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
  }, [tabbedPanelRef.current, footerRef.current]);

  const tabPanelHandlers = {
    onSelectedTab: (selectedTabIndex: any) => {
      setLastVisibleTab(currentVisibleTab);
      setCurrentVisibleTab(selectedTabIndex);
      // Necesitamos acceder al nombre del tab de otra forma ya que no tenemos transformedConfigData
      const selectedTabName = subpagesConfig?.[selectedTabIndex]?.name;
      setHeaderShouldShowFollowerCounter(selectedTabName !== 'followers');
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
          {fab && !currentUserIsInProfile && (
            <Fab
              color="primary"
              aria-label="add"
              size="large"
              className={!isFabVisible ? 'fab-hidden' : ''}
              onClick={() => fab.handler()}
            >
              <DynamicIcons iconName={fab.icon || 'lu LuCalendarPlus'} size={35} color="#034d5b" />
            </Fab>
          )}
        </div>
      )}
    </>
  );
};
