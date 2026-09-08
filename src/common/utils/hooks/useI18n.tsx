import { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { SocialNetworks } from '~/constants/social-networks.const';
import { EnMessages } from '~/translations/en';
export enum I18nPaths {
  TRANSLATION_GLOBAL_DICTIONARY = 'app.global_dictionary',
  TRANSLATION_GLOBAL_DICTIONARY_ACTIONS = 'app.global_dictionary.actions',
  TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES = 'app.global_dictionary.errors',
  TRANSLATION_DOMAIN_GLOBAL_DICTIONARY_ERROR_CODES = 'app.domain_global_dictionary.errors',
}

export const useI18n = () => {
  let { locale, formatMessage } = useIntl();
  locale = !!locale ? locale : 'es';

  // Memoizadas para que consumidores puedan usarlas como dependencia de useEffect/useMemo sin
  // que cambien de referencia en cada render (sólo cambian cuando realmente cambia el idioma).
  const translateText = useCallback(
    (messageId: string, suffix?: string) => {
      const fullMessageId = suffix ? `${messageId}.${suffix}` : messageId;
      const subpaths = fullMessageId?.split('.') || [];
      let response = '';
      if (subpaths.length) {
        const socialNetworkName = SocialNetworks[subpaths[subpaths.length - 1]];
        if (!socialNetworkName) {
          response = formatMessage({ id: fullMessageId });
        } else {
          response =
            socialNetworkName.title || (!socialNetworkName.emptyTitle && formatMessage({ id: fullMessageId }));
        }
      }
      return response;
    },
    [formatMessage]
  );

  const getFormattedMessage = useCallback((messageId: any, messageValues: any) => {
    return <FormattedMessage id={messageId} values={messageValues} />;
  }, []);

  const translateGlobalDict = useCallback(
    (messageId: string) => {
      return translateText(`app.global_dictionary.${messageId}`);
    },
    [translateText]
  );

  const translateError = useCallback(
    (messageId: string) => {
      const inGlobalDictionary = Object.keys(EnMessages.app.global_dictionary.errors).includes(messageId);
      const inDomainGlobalDictionary = Object.keys(EnMessages.app.domain_global_dictionary.errors).includes(
        messageId
      );

      const path = inGlobalDictionary
        ? `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.`
        : inDomainGlobalDictionary
        ? `${I18nPaths.TRANSLATION_DOMAIN_GLOBAL_DICTIONARY_ERROR_CODES}.`
        : '';

      return translateText(`${path}${messageId}`);
    },
    [translateText]
  );

  return { locale, translateText, getFormattedMessage, translateGlobalDict, translateError };
};
