import { useIntl, FormattedMessage } from "react-intl";

export const useI18n = () => {
  const { locale = "en", messages } = useIntl();

  const getMessage = (messageId: string) => {
    return messages[messageId];
  };

  const getFormattedMessage = (messageId: string, messageValues: any) => {
    return <FormattedMessage id={messageId} values={messageValues} />;
  };

  return { locale, getMessage, getFormattedMessage };
};
