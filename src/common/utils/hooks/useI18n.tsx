import { useIntl, FormattedMessage } from "react-intl";

export const useI18n = () => {
  const { locale = "es", formatMessage } = useIntl();

  const getMessage = (messageId: string) => {
    return formatMessage({ id: messageId });
  };

  const getFormattedMessage = (messageId: any, messageValues: any) => {
    return <FormattedMessage id={messageId} values={messageValues} />;
  };

  return { locale, getMessage, getFormattedMessage };
};
