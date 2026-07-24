import { StorageGetUrlOutput } from '@aws-amplify/storage/dist/esm/types';
import { toCamelCase } from '~/common/utils/string-utils';
import { getUrl } from '~/common/utils/amplify/storage/storage.client';
import { VerificationStatus } from '~/constants';
import { ProfileActiveStatus, ProfileApprovalStatus, ProfileNature } from '~/constants/domain/profile.constants';
import { CurrentProfileInfoModel } from '../app/user/user.model';
import {
  EntityTemplate,
  FollowerProfileTemplate,
  ObjectValueTemplate,
  ProfileTemplate,
  SearchableProfileTemplate,
} from './template';

const DEFAULT_MAX_CACHE_TIME_TO_LIVE = 3 * 60 * 1000;

// Caché global compartido para URLs de S3 - evita llamar getUrl múltiples veces para la misma imagen
const s3UrlCache = new Map<string, { url: StorageGetUrlOutput; expiresAt: number }>();
// Map para trackear requests en progreso y evitar llamadas duplicadas simultáneas
const pendingRequests = new Map<string, Promise<StorageGetUrlOutput>>();

/**
 *
 */
export abstract class Model<T extends EntityTemplate | ObjectValueTemplate> {
  protected _data: any = {};
  private _template: any;
  public fetchTimestamp: number;
  protected maxCacheTimeToLive: number;
  public rawTemplate: T | any;

  /**
   *
   * @param template
   */
  constructor(template: T | any = {}) {
    this.rawTemplate = template;
    this.fetchTimestamp = Date.now();
    this.maxCacheTimeToLive = DEFAULT_MAX_CACHE_TIME_TO_LIVE;

    if (typeof template === 'object' && template !== null) {
      this._template = { ...template, fetchTimestamp: this.fetchTimestamp };
    } else {
      this._template = { value: template, fetchTimestamp: this.fetchTimestamp };
    }

    Object.keys(template)
      .filter((templateKey) => templateKey !== '_data')
      .forEach((templateKey: string): void => {
        const builderName = `onBuildTemplateField${toCamelCase(templateKey, false)}`;
        //@ts-expect-error
        const builder = this[builderName];
        const functionBuildTemplateValue: (key: string, template: T) => void = (builder || this.buildAttribute).bind(
          this
        );
        functionBuildTemplateValue(templateKey, template);
      });
  }

  /**
   *
   */
  get template() {
    return this._template;
  }

  /**
   *
   * @param attributeName
   * @param template
   * @param attributeTemplateName
   * @param getter
   * @param setter
   * @param defaultValue
   * @param enumerable
   * @param configurable
   * @param writable
   */
  protected buildAttribute(
    attributeName: string,
    template: T,
    attributeTemplateName: string,
    getter: () => any = undefined,
    setter: (newValue: any) => any = undefined,
    defaultValue: () => any = undefined,
    enumerable: boolean = true,
    configurable: boolean = true,
    writable: boolean = true
  ) {
    if (attributeTemplateName === undefined) {
      attributeTemplateName = attributeName;
    }

    //@ts-expect-error
    const attributeValueInTemplate = template[attributeTemplateName];

    const defaultValueFunction = defaultValue ? defaultValue : () => attributeValueInTemplate;

    const descriptor: PropertyDescriptor = {
      get:
        getter ||
        function () {
          //@ts-expect-error
          return this._data[attributeName];
        },
      set:
        setter ||
        function (newValue) {
          //@ts-expect-error
          this._data[attributeName] = newValue;
        },
      enumerable: enumerable,
      configurable: configurable,
    };

    if (!descriptor.set) {
      descriptor.writable = writable;
    }
    Object.defineProperty(this, attributeName, descriptor);
    //@ts-ignore
    this[attributeName] = defaultValueFunction();
  }

  /**
   *
   */
  public clone() {
    return Object.create(this);
  }

  /**
   *
   */
  public toJSON(): any {
    return this;
  }

  public expireCache(): void {
    this.fetchTimestamp = 0;
  }

  abstract get hasFetchAllData(): boolean;

  public isExpiredCache(): boolean {
    return Date.now() - this.fetchTimestamp >= this.maxCacheTimeToLive;
  }

  /**
   * Método protegido para obtener URLs de S3 con caché global compartido.
   * Evita múltiples llamadas a getUrl() para la misma imagen.
   * Puede ser usado por cualquier clase que herede de Model.
   *
   * @param s3PathOrUrl - Ruta S3 (con o sin prefijo "s3://") o URL HTTP directa
   * @returns URL HTTP de la imagen o la misma URL si ya es HTTP
   */
  protected async getS3UrlWithCache(s3PathOrUrl: string | undefined): Promise<string> {
    if (!s3PathOrUrl) return undefined;

    // Si no es una ruta S3, retornar directamente
    if (!s3PathOrUrl.startsWith('s3://')) {
      return s3PathOrUrl;
    }

    const s3Path = s3PathOrUrl.replace('s3://', '');

    // Verificar si existe en caché y no ha expirado
    const cached = s3UrlCache.get(s3Path);
    const now = Date.now();

    if (cached && cached.expiresAt > now) {
      // Usar URL cacheada
      return cached.url.url.href;
    }

    // Si ya hay un request en progreso para esta misma URL, esperar a que termine
    if (pendingRequests.has(s3Path)) {
      const result = await pendingRequests.get(s3Path)!;
      return result.url.href;
    }

    // Crear nuevo request y guardarlo en pendingRequests
    const urlPromise = getUrl({ path: s3Path });
    pendingRequests.set(s3Path, urlPromise);

    try {
      const result = await urlPromise;

      // Guardar en caché con tiempo de expiración (50 minutos antes de que expire la URL)
      const expiresAt = now + (50 * 60 * 1000); // 50 minutos (URLs de S3 expiran en ~1 hora)
      s3UrlCache.set(s3Path, { url: result, expiresAt });

      return result.url.href;
    } finally {
      // Limpiar el pending request
      pendingRequests.delete(s3Path);
    }
  }
}

/**
 *
 */
export abstract class EntityModel<T extends EntityTemplate> extends Model<T> {
  [x: string]: any;
  declare id: string;
  declare shortId?: string;

  constructor(template: T | any = {}) {
    super(template);
    this.id = template.id || template._id;
  }

  get identifier(): string {
    return this.shortId || this.id;
  }
}

/**
 *
 */
export abstract class ObjectValueModel<T extends ObjectValueTemplate> extends Model<T> {
  public toJSON(): T {
    throw new Error('Method not implemented.');
  }
}

/**
 *
 */
export abstract class ProfileModel<T extends ProfileTemplate>
  extends EntityModel<T>
  implements SearchableProfileTemplate
{
  declare id: string;
  declare name: string;
  declare username?: string;
  declare profile_pic?: string;
  declare shortId?: string;
  protected _profile_pic_aws?: StorageGetUrlOutput;

  declare isClaimedProfile?: boolean;

  declare is_active: ProfileActiveStatus;

  declare approval_status?: ProfileApprovalStatus;

  declare followed_profiles: FollowerProfileTemplate[];
  declare followed_by: FollowerProfileTemplate[];

  declare isFollowedByCurrentProfile: boolean;

  declare nature?: ProfileNature;

  declare entity: string;
  declare verified_status: VerificationStatus;
  // declare roles: string[];

  constructor(template: T | any = {}) {
    super(template);
    this.id = template.id || template._id;
    // this.setAWSURL();
    this.followed_profiles =
      template.followed_profiles ||
      [
        // {
        //   id: 'bbb',
        //   identifier: 'bbb',
        //   name: 'PEPITO PÉREZ',
        //   profile_pic: 's3://public/24e884f8-2061-70d1-9dcc-c33cf99891e9.jpg',
        // },
      ];
    this.followed_by =
      template.followed_by ||
      [
        // {
        //   id: 'bbb',
        //   identifier: 'bbb',
        //   name: 'PEPITO PÉREZ',
        //   profile_pic: 's3://public/24e884f8-2061-70d1-9dcc-c33cf99891e9.jpg',
        // },
      ];
  }

  get identifier(): string {
    return this.username || this.id;
  }

  get fullUserName() {
    return !!this.username ? `@${this.username}` : undefined;
  }

  async avatarURL(): Promise<string> {
    return await this.getS3UrlWithCache(this.profile_pic);
  }

  private async setAWSURL() {
    const url = await this.getS3UrlWithCache(this.profile_pic);
    if (url && url !== this.profile_pic) {
      // Mantener compatibilidad con código existente que usa _profile_pic_aws
      this._profile_pic_aws = { url: new URL(url) } as StorageGetUrlOutput;
    } else {
      this._profile_pic_aws = undefined;
    }
  }

  get profileInfo(): CurrentProfileInfoModel {
    return new CurrentProfileInfoModel({ ...this });
  }

  isFollowedBy(identifier: string) {
    return true; //this.followed_by.includes(identifier);
  }
}
