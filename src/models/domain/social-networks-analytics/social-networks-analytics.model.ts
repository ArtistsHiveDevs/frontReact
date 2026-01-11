import { Model, ObjectValueTemplate, Template } from '~/models/base';

/**
 * Template para una red social individual
 */
export interface SocialNetworkTemplate extends ObjectValueTemplate {
  id: string; // 'spotify', 'youtube', 'instagram', etc.
  name: string; // Nombre de la red social
  iconName: string; // Nombre del ícono para DynamicIcons (ej: 'BsSpotify')
  mainMetrics: { [key: string]: number }; // Métricas principales para el card
  detailMetrics?: { [key: string]: number }; // Métricas de detalle (opcional)
  hasDetail: boolean; // Si tiene información de detalle
}

/**
 * Template para el widget de analytics de redes sociales
 */
export interface SocialNetworksAnalyticsTemplate extends Template {
  networks: SocialNetworkTemplate[]; // Todas las redes disponibles
  visibleNetworks: string[]; // IDs de redes a mostrar en orden
}

/**
 * Modelo para una red social
 */
export class SocialNetworkModel extends Model<SocialNetworkTemplate> implements SocialNetworkTemplate {
  declare id: string;
  declare name: string;
  declare iconName: string;
  declare mainMetrics: { [key: string]: number };
  declare detailMetrics?: { [key: string]: number };
  declare hasDetail: boolean;

  constructor(template: SocialNetworkTemplate) {
    super(template);
  }

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.name && !!this.iconName;
  }

  /**
   * Obtiene las métricas visibles del card principal
   */
  get mainMetricsEntries(): Array<{ key: string; value: number }> {
    return Object.entries(this.mainMetrics || {}).map(([key, value]) => ({ key, value }));
  }

  /**
   * Obtiene las métricas del detalle
   */
  get detailMetricsEntries(): Array<{ key: string; value: number }> {
    if (!this.detailMetrics) return [];
    return Object.entries(this.detailMetrics).map(([key, value]) => ({ key, value }));
  }
}

/**
 * Modelo para el widget de analytics
 */
export class SocialNetworksAnalyticsModel
  extends Model<SocialNetworksAnalyticsTemplate>
  implements SocialNetworksAnalyticsTemplate
{
  declare networks: SocialNetworkTemplate[];
  declare visibleNetworks: string[];

  constructor(template: SocialNetworksAnalyticsTemplate) {
    super(template);
    // Convertir networks a modelos
    this.networks = (template.networks || []).map((network) => new SocialNetworkModel(network));
  }

  get hasFetchAllData(): boolean {
    return !!this.networks && this.networks.length > 0;
  }

  /**
   * Obtiene las redes que deben ser visibles según visibleNetworks
   */
  get visibleNetworksData(): SocialNetworkModel[] {
    if (!this.visibleNetworks || this.visibleNetworks.length === 0) {
      return this.networks.map((n) => new SocialNetworkModel(n));
    }

    return this.visibleNetworks
      .map((id) => this.networks.find((network) => network.id === id))
      .filter((network): network is SocialNetworkTemplate => network !== undefined)
      .map((network) => new SocialNetworkModel(network));
  }
}
