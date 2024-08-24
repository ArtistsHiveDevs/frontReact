import { toCamelCase } from '~/common/utils/string-utils';
import { EntityTemplate, ObjectValueTemplate } from './template';

const DEFAULT_MAX_CACHE_TIME_TO_LIVE = 3 * 60 * 1000;

/**
 *
 */
abstract class Model<T extends EntityTemplate | ObjectValueTemplate> {
  protected _data: any = {};
  private _template: any;
  public fetchTimestamp: number;
  protected maxCacheTimeToLive: number;

  /**
   *
   * @param template
   */
  constructor(template: T | any = {}) {
    this._template = template;
    this.fetchTimestamp = Date.now();
    this._template.fetchTimestamp = this.fetchTimestamp;
    this.maxCacheTimeToLive = DEFAULT_MAX_CACHE_TIME_TO_LIVE;

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
  declare id: string;
  declare username?: string;

  constructor(template: T | any = {}) {
    super(template);
    this.id = template.id || template._id;
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
