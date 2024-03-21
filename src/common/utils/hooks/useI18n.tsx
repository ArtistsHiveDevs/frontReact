import { FormattedMessage, useIntl } from 'react-intl';
import { SocialNetworks } from '~/constants/social-networks.const';

export const useI18n = () => {
  let { locale, formatMessage } = useIntl();
  locale = !!locale ? locale : 'es';

  const translateText = (messageId: string) => {
    const subpaths = messageId?.split('.') || [];
    let response = '';
    if (subpaths.length) {
      const socialNetworkName = SocialNetworks[subpaths[subpaths.length - 1]];
      if (!socialNetworkName) {
        response = formatMessage({ id: messageId });
      } else {
        response = socialNetworkName.title || (!socialNetworkName.emptyTitle && formatMessage({ id: messageId }));
      }
    }
    return response;
  };

  const getFormattedMessage = (messageId: any, messageValues: any) => {
    return <FormattedMessage id={messageId} values={messageValues} />;
  };

  return { locale, translateText, getFormattedMessage };
};
