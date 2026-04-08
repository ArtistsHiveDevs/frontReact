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
        followers: 6900000,
        // monthly_listeners: 16100000,
        // total_streams: 361700000,
      },
      detailMetrics: {
        playlist_reach: 145100000,
        followers: 6900000,
        monthly_listeners: 16100000,
        total_streams: 361700000,
        save_rate: 8500000,
        radio_streams: 12300000,
      },
    },
    {
      id: 'instagram',
      name: 'Instagram',
      iconName: 'BsInstagram',
      hasDetail: true,
      mainMetrics: {
        followers: 8400000,
      },
      detailMetrics: {
        followers: 8400000,
        posts: 1245,
        avg_likes: 245000,
        engagement_rate: 3.2,
        avg_reach: 2100000,
      },
    },
    {
      id: 'tiktok',
      name: 'TikTok',
      iconName: 'BsTiktok',
      hasDetail: true,
      mainMetrics: {
        followers: 2900000,
        // total_likes: 16400000,
        // posts_content: 3800000,
      },
      detailMetrics: {
        followers: 2900000,
        total_likes: 16400000,
        videos_published: 587,
        video_views: 6587300000,
        posts_content: 3800000,
        shares: 890000,
      },
    },
    {
      id: 'youtube',
      name: 'YouTube',
      iconName: 'BsYoutube',
      hasDetail: true,
      mainMetrics: {
        subscribers: 6300000,
        // total_views: 6880100000,
        // monthly_video_views: 55700000,
      },
      detailMetrics: {
        subscribers: 6300000,
        total_views: 6880100000,
        videos_published: 432,
        monthly_video_views: 55700000,
        watch_time: 1700000,
        new_subscribers: 2069900000,
      },
    },
    {
      id: 'facebook',
      name: 'Facebook',
      iconName: 'BsFacebook',
      hasDetail: true,
      mainMetrics: {
        followers: 6200000,
      },
      detailMetrics: {
        followers: 6200000,
        page_likes: 5900000,
        weekly_reach: 1200000,
        engagement: 245000,
        posts: 892,
      },
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      iconName: 'BsTwitterX',
      hasDetail: true,
      mainMetrics: {
        followers: 4400000,
      },
      detailMetrics: {
        followers: 4400000,
        tweets: 12400,
        monthly_impressions: 8900000,
        engagement_rate: 2.8,
        mentions: 125000,
      },
    },
    {
      id: 'pandora',
      name: 'Pandora',
      iconName: 'SiPandora',
      hasDetail: true,
      mainMetrics: {
        monthly_listeners: 413800,
        // total_plays: 766700000,
      },
      detailMetrics: {
        monthly_listeners: 413800,
        total_plays: 766700000,
        stations_featuring_artist: 15600,
        thumbs_up: 89000,
      },
    },
    {
      id: 'shazam',
      name: 'Shazam',
      iconName: 'SiShazam',
      hasDetail: false,
      mainMetrics: {
        shazams: 29100000,
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
        <div className="trademark-content">
          <span>Powered by</span>
          <img src="/cm_logo.png" alt="Chartmetric" />
        </div>
        <span className="test-data-label">* Datos de prueba</span>
      </div>
    </>
  );
};
