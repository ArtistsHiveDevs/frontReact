import { FormattedMessage, useIntl } from "react-intl";
import { SocialNetworks } from "~/constants/social-networks.const";

export const useI18n = () => {
  const { locale = "es", formatMessage } = useIntl();

  const translateText = (messageId: string) => {
    const subpaths = messageId?.split(".") || [];
    let response = "";
    if (subpaths.length) {
      const socialNetworkName = SocialNetworks[subpaths[subpaths.length - 1]];
      if (!socialNetworkName) {
        response = formatMessage({ id: messageId });
      } else {
        response = socialNetworkName.title;
      }
    }
    return response;
  };

  const getFormattedMessage = (messageId: any, messageValues: any) => {
    return <FormattedMessage id={messageId} values={messageValues} />;
  };

  return { locale, translateText, getFormattedMessage };
};
