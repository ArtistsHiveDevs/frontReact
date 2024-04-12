import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { buildSocialNetworkLinkData, SocialNetworks } from '~/constants/social-networks.const';
import './index.scss';

const IconFieldReadOnly = (props: any) => {
  let { fieldName, fieldTitle, icon, fieldValue, customTitle, emptyTitle, useDivInValue, useColon, direction } = props;

  useColon = useColon === undefined || useColon;

  let renderFieldValue = fieldValue;
  const socialNetwork = SocialNetworks[fieldName];

  if (!!socialNetwork) {
    if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || typeof fieldValue === undefined) {
      if (fieldValue && socialNetwork.url !== undefined) {
        const urlSocialNetwork = buildSocialNetworkLinkData(fieldName, fieldValue);
        renderFieldValue = (
          <a href={urlSocialNetwork.url} target={urlSocialNetwork.target}>
            {`${socialNetwork.user_prefix || ''}${fieldValue}`}
          </a>
        );
      }
    }
    if (!icon) {
      icon = socialNetwork.icon;
    }

    if (!customTitle) {
      if (socialNetwork.emptyTitle) {
        fieldTitle = '';
      } else {
        fieldTitle = socialNetwork.title;
      }
    }
  }

  if (direction !== 'vertical') {
    direction = '';
  }

  const generateTitle = () =>
    fieldTitle && (
      <strong>
        {fieldTitle}
        {useColon ? ':' : ''}{' '}
      </strong>
    );
  return (
    <div className={`icon-field-container ${direction}`}>
      {icon && (
        <span>
          <DynamicIcons iconName={icon} size={20} />
          {direction === 'vertical' && generateTitle()}
        </span>
      )}
      {useDivInValue && (
        <div className="field-content">
          {direction !== 'vertical' && generateTitle()}
          {renderFieldValue}
        </div>
      )}
      {!useDivInValue && (
        <span className="field-content">
          {direction !== 'vertical' && generateTitle()}
          {renderFieldValue}
        </span>
      )}
    </div>
  );
};

export default IconFieldReadOnly;
