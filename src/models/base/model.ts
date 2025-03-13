import { StorageGetUrlOutput } from '@aws-amplify/storage/dist/esm/types';
import { getUrl } from 'aws-amplify/storage';
import { toCamelCase } from '~/common/utils/string-utils';
import { EntityTemplate, ObjectValueTemplate, ProfileTemplate, SearchableProfileTemplate } from './template';

const DEFAULT_MAX_CACHE_TIME_TO_LIVE = 3 * 60 * 1000;

/**
 *
 */
abstract class Model<T extends EntityTemplate | ObjectValueTemplate> {
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

  declare followed_profiles: string[];
  declare followed_by: string[];

  constructor(template: T | any = {}) {
    super(template);
    this.id = template.id || template._id;
    // this.setAWSURL();
    this.followed_profiles = template.followed_profiles || [];
    this.followed_by = template.followed_by || [];
  }

  get identifier(): string {
    return this.username || this.id;
  }

  get fullUserName() {
    return !!this.username ? `@${this.username}` : undefined;
  }

  async avatarURL(): Promise<string> {
    let urlDB = this.profile_pic;
    if (urlDB?.startsWith('s3://')) {
      await this.setAWSURL();
      urlDB = this._profile_pic_aws?.url.href;
    }
    return urlDB;
  }

  private async setAWSURL() {
    let urlDB = this.profile_pic;
    if (urlDB?.startsWith('s3://')) {
      if (!this._profile_pic_aws || this._profile_pic_aws.expiresAt.getTime() < Date.now()) {
        this._profile_pic_aws = await getUrl({ path: urlDB.replace('s3://', '') });
      }
    } else {
      this._profile_pic_aws = undefined;
    }
  }

  isFollowedBy(identifier: string) {
    return true; //this.followed_by.includes(identifier);
  }
}
