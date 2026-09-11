import { EntityModel, EntityTemplate } from '~/models/base';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { PlaceModel } from '~/models/domain/place/place.model';

export type ProfileClaimEntityType = 'Artist' | 'Place';

export interface ProfileClaimUserInfo {
  id?: string;
  identifier?: string;
  name?: string;
  given_names?: string;
  surnames?: string;
  stage_name?: string;
  username?: string;
  email?: string;
  profile_pic?: string;
}

export interface ProfileClaimEntityProfile {
  id?: string;
  identifier?: string;
  name?: string;
  username?: string;
  run?: string;
  profile_pic?: string;
  instagram?: string;
  spotify?: string;
}

export interface ProfileClaimTemplate extends EntityTemplate {
  identifier: any;
  user?: ProfileClaimUserInfo;
  entityType: ProfileClaimEntityType;
  entityId: string;
  entityProfile?: ProfileClaimEntityProfile;
  issuedDate?: string | Date;
  createdAt?: string | Date;
}

export class ProfileClaimModel extends EntityModel<ProfileClaimTemplate> implements ProfileClaimTemplate {
  declare user?: ProfileClaimUserInfo;
  declare entityType: ProfileClaimEntityType;
  declare entityId: string;
  declare entityProfile?: ProfileClaimEntityProfile;
  declare issuedDate?: string | Date;
  declare createdAt?: string | Date;

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.entityType && !!this.entityId;
  }

  get requestingUserName(): string {
    const user = this.user;
    return (
      user?.stage_name ||
      [user?.given_names, user?.surnames].filter(Boolean).join(' ') ||
      user?.username ||
      'Usuario'
    );
  }

  get claimedProfileName(): string {
    return this.entityProfile?.name || this.identifier || this.entityId;
  }

  /**
   * Instancia real de ArtistModel/PlaceModel a partir de `entityProfile`, necesaria para que
   * `avatarURL()` resuelva el `profile_pic` (puede venir como ruta s3:// / r://, no una URL directa).
   */
  get claimedProfileModel(): ArtistModel | PlaceModel | undefined {
    if (!this.entityProfile) {
      return undefined;
    }

    const template = { ...this.entityProfile, id: this.entityProfile.id || this.entityId };
    return this.entityType === 'Place' ? new PlaceModel(template as any) : new ArtistModel(template as any);
  }

  get isResolved(): boolean {
    return !!this.issuedDate;
  }
}
