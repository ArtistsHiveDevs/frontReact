import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
} from '~/components/Pages/ArtistsPage/ArtistDetails/config-artist-detail';
import {
  PLACE_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_PLACE_DETAIL_PAGE,
} from '~/components/Pages/PlacesPage/PlaceDetailsPage/config-place-detail';
import { PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { ProfilePreviewConfig } from '~/components/shared/organisms/ProfileTabsPage/profile-preview.utils';
import { getModelInfoFromClassName } from '~/models/base/modelHelpers';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { PlaceModel } from '~/models/domain/place/place.model';

export const ARTIST_ENTITY_NAME = getModelInfoFromClassName(ArtistModel.name).entityName;
export const PLACE_ENTITY_NAME = getModelInfoFromClassName(PlaceModel.name).entityName;

export const ARTIST_PROFILE_PREVIEW_CONFIG: ProfilePreviewConfig = {
  general: {
    general: ['description', 'origin_city', 'home_city'],
    contact: true,
    social_networks: true,
  },
  arts: {
    media_channels: true,
  },
};

export const PLACE_PROFILE_PREVIEW_CONFIG: ProfilePreviewConfig = {
  general: {
    general: ['description', 'place_type', 'home_city', 'address'],
    contact: true,
    social_networks: true,
  },
};

export interface ProfilePreviewEntityConfig {
  entityName: string;
  translationBasePath: string;
  subpagesConfig: PageSection[];
  previewConfig: ProfilePreviewConfig;
}

const PROFILE_PREVIEW_REGISTRY: { [entityName: string]: ProfilePreviewEntityConfig } = {
  [ARTIST_ENTITY_NAME]: {
    entityName: ARTIST_ENTITY_NAME,
    translationBasePath: TRANSLATION_BASE_ARTIST_DETAIL_PAGE,
    subpagesConfig: ARTIST_DETAIL_SUB_PAGE_CONFIG,
    previewConfig: ARTIST_PROFILE_PREVIEW_CONFIG,
  },
  [PLACE_ENTITY_NAME]: {
    entityName: PLACE_ENTITY_NAME,
    translationBasePath: TRANSLATION_BASE_PLACE_DETAIL_PAGE,
    subpagesConfig: PLACE_DETAIL_SUB_PAGE_CONFIG,
    previewConfig: PLACE_PROFILE_PREVIEW_CONFIG,
  },
};

export const getProfilePreviewEntityConfig = (entityType: string): ProfilePreviewEntityConfig | undefined =>
  PROFILE_PREVIEW_REGISTRY[getModelInfoFromClassName(entityType)?.entityName || entityType];
