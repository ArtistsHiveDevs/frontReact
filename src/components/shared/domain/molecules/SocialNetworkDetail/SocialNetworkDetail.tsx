import { IconButton } from '@mui/material';
import { numberFormatterThousands } from '~/common/utils/string-utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { SocialNetworkTemplate } from '~/models/domain/social-networks-analytics';
import './SocialNetworkDetail.scss';

interface SocialNetworkDetailProps {
  network: SocialNetworkTemplate;
  onBack: () => void;
}

export const SocialNetworkDetail = (props: SocialNetworkDetailProps) => {
  const { network, onBack } = props;

  const detailMetrics = network.detailMetrics || {};
  const metricsEntries = Object.entries(detailMetrics);

  return (
    <div className="social-network-detail">
      <div className="detail-header">
        <IconButton className="back-button" onClick={onBack}>
          <DynamicIcons iconName="MdArrowBack" size={24} />
        </IconButton>
        <div className="header-info">
          <div className={`network-icon sn-icon-${network.id}`}>
            <DynamicIcons iconName={network.iconName} size={40} />
          </div>
          <h2 className="network-name">{network.name}</h2>
        </div>
      </div>

      <div className="detail-body">
        {metricsEntries.length > 0 ? (
          <div className="metrics-grid">
            {metricsEntries.map(([key, value]) => (
              <div key={key} className="metric-card">
                <span className="metric-label">{key}</span>
                <span className="metric-value">
                  {numberFormatterThousands(value, 1)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-details">
            <p>No hay información detallada disponible para esta red social.</p>
          </div>
        )}
      </div>
    </div>
  );
};
