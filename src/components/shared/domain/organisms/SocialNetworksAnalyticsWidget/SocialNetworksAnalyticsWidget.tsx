import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import {
  SocialNetworkModel,
  SocialNetworksAnalyticsModel,
  SocialNetworksAnalyticsTemplate,
} from '~/models/domain/social-networks-analytics';
import { SocialNetworkCard } from '../../molecules/SocialNetworkCard/SocialNetworkCard';
import { SocialNetworkDetail } from '../../molecules/SocialNetworkDetail/SocialNetworkDetail';
import './SocialNetworksAnalyticsWidget.scss';

interface SocialNetworksAnalyticsWidgetProps {
  data?: SocialNetworksAnalyticsTemplate;
  columns?: 1 | 2 | 4 | 6;
}

// Datos de ejemplo para testing
const MOCK_DATA: SocialNetworksAnalyticsTemplate = {
  networks: [
    {
      id: 'spotify',
      name: 'Spotify',
      iconName: 'BsSpotify',
      hasDetail: true,
      mainMetrics: {
        Seguidores: 6900000,
        // Métricas adicionales que se mostrarán en el footer del card (comentadas por ahora)
        // 'Oyentes mensuales': 16100000,
        // 'Reproducciones totales': 361700000,
      },
      detailMetrics: {
        'Alcance de la lista de reproducción': 145100000,
        Seguidores: 6900000,
        'Oyentes mensuales': 16100000,
        'Reproducciones totales': 361700000,
        'Tasa de guardado': 8500000,
        'Streams de radio': 12300000,
      },
    },
    {
      id: 'instagram',
      name: 'Instagram',
      iconName: 'BsInstagram',
      hasDetail: true,
      mainMetrics: {
        'Seguidores IG': 8400000,
      },
      detailMetrics: {
        Seguidores: 8400000,
        Publicaciones: 1245,
        'Promedio de likes': 245000,
        'Engagement rate': 3.2,
        'Alcance promedio': 2100000,
      },
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      iconName: 'BsTiktok',
      hasDetail: true,
      mainMetrics: {
        Seguidores: 2900000,
        // Métricas adicionales que se mostrarán en el footer del card (comentadas por ahora)
        // 'Me gusta': 16400000,
        // 'Contenido publicaciones': 3800000,
      },
      detailMetrics: {
        Seguidores: 2900000,
        'Total Me gusta': 16400000,
        'Videos publicados': 587,
        'Vistas de video': 6587300000,
        'Contenido publicaciones': 3800000,
        Compartidos: 890000,
      },
    },
    {
      id: 'youtube',
      name: 'YouTube',
      iconName: 'BsYoutube',
      hasDetail: true,
      mainMetrics: {
        Suscriptores: 6300000,
        // Métricas adicionales que se mostrarán en el footer del card (comentadas por ahora)
        // 'Vistas totales': 6880100000,
        // 'Videos vistos mensuales': 55700000,
      },
      detailMetrics: {
        Suscriptores: 6300000,
        'Vistas totales': 6880100000,
        'Videos publicados': 432,
        'Videos vistos mensuales': 55700000,
        'Tiempo de visualización': 1700000,
        'Nuevos suscriptores': 2069900000,
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      iconName: 'BsFacebook',
      hasDetail: true,
      mainMetrics: {
        'Seguidores Facebook': 6200000,
      },
      detailMetrics: {
        Seguidores: 6200000,
        'Me gusta de página': 5900000,
        'Alcance semanal': 1200000,
        Engagement: 245000,
        Publicaciones: 892,
      },
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      iconName: 'BsTwitterX',
      hasDetail: true,
      mainMetrics: {
        Seguidores: 4400000,
        // Métricas adicionales que se mostrarán en el footer del card (comentadas por ahora)
      },
      detailMetrics: {
        Seguidores: 4400000,
        Tweets: 12400,
        'Impresiones mensuales': 8900000,
        'Engagement rate': 2.8,
        Menciones: 125000,
      },
    },
    {
      id: 'pandora',
      name: 'Pandora',
      iconName: 'SiPandora',
      hasDetail: true,
      mainMetrics: {
        'Oyentes mensuales': 413800,
        // Métricas adicionales que se mostrarán en el footer del card (comentadas por ahora)
        // 'Reproducciones': 766700000,
      },
      detailMetrics: {
        'Oyentes mensuales': 413800,
        'Reproducciones totales': 766700000,
        'Estaciones que incluyen artista': 15600,
        'Thumbs up': 89000,
      },
    },
    {
      id: 'shazam',
      name: 'Shazam',
      iconName: 'SiShazam',
      hasDetail: false,
      mainMetrics: {
        Shazams: 29100000,
      },
    },
  ],
  visibleNetworks: ['spotify', 'instagram', 'tiktok', 'youtube', 'facebook', 'twitter', 'pandora', 'shazam'],
};

export const SocialNetworksAnalyticsWidget = (props: SocialNetworksAnalyticsWidgetProps) => {
  const { data = MOCK_DATA, columns = 4 } = props;

  const analyticsModel = new SocialNetworksAnalyticsModel(data);
  const visibleNetworks = analyticsModel.visibleNetworksData;

  const [selectedNetwork, setSelectedNetwork] = useState<SocialNetworkModel | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');

  const handleCardClick = (network: SocialNetworkModel) => {
    if (network.hasDetail) {
      setSelectedNetwork(network);
      setViewMode('detail');
    }
  };

  const handleBack = () => {
    setViewMode('list');
    setTimeout(() => setSelectedNetwork(null), 300); // Espera a que termine la animación
  };

  const swipeHandlers = useSwipeable({
    onSwipedRight: () => {
      if (viewMode === 'detail') {
        handleBack();
      }
    },
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <>
      <div className="social-networks-analytics-widget" {...swipeHandlers}>
        <div className={`widget-content ${viewMode === 'detail' ? 'detail-view' : 'list-view'}`}>
          {viewMode === 'list' && (
            <div className={`networks-grid columns-${columns}`}>
              {visibleNetworks.map((network) => (
                <SocialNetworkCard key={network.id} network={network} onClick={() => handleCardClick(network)} />
              ))}
            </div>
          )}

          {viewMode === 'detail' && selectedNetwork && (
            <SocialNetworkDetail network={selectedNetwork} onBack={handleBack} />
          )}
        </div>
      </div>
      <div className="trademark_cm">
        Powered by{'\n'}
        <img src="/cm_logo.png" />
      </div>
    </>
  );
};
