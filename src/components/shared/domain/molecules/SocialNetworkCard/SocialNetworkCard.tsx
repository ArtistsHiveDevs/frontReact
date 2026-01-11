import { IconButton } from '@mui/material';
import { numberFormatterThousands } from '~/common/utils/string-utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { SocialNetworkTemplate } from '~/models/domain/social-networks-analytics';
import './SocialNetworkCard.scss';

interface SocialNetworkCardProps {
  network: SocialNetworkTemplate;
  onClick?: () => void;
}

export const SocialNetworkCard = (props: SocialNetworkCardProps) => {
  const { network, onClick } = props;

  const handleClick = () => {
    if (network.hasDetail && onClick) {
      onClick();
    }
  };

  // Obtener la primera métrica como principal
  const metricsEntries = Object.entries(network.mainMetrics || {});
  const primaryMetric = metricsEntries[0];
  const secondaryMetrics = metricsEntries.slice(1);

  return (
    <div className={`social-network-card ${network.hasDetail ? 'clickable' : ''}`} onClick={handleClick}>
      <div className="card-header">
        <span className="metric-label">{primaryMetric?.[0] || ''}</span>
        {network.hasDetail && (
          <IconButton className="search-icon" size="small">
            <DynamicIcons iconName="fa6 FaMagnifyingGlassChart" size={20} />
          </IconButton>
        )}
      </div>

      <div className="card-body">
        <div className="primary-metric">
          <div className={`network-icon sn-icon-${network.id}`}>
            <DynamicIcons iconName={network.iconName} size={35} />
          </div>
          <span className="metric-value">{primaryMetric ? numberFormatterThousands(primaryMetric[1], 1) : ''}</span>
        </div>

        {secondaryMetrics.length > 0 && (
          <div className="secondary-metrics">
            {secondaryMetrics.map(([key, value]) => (
              <div key={key} className="metric-item">
                <span className="metric-label">{key}</span>
                <span className="metric-value-small">{numberFormatterThousands(value, 1)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
