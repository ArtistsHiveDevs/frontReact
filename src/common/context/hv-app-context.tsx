import { createContext, useEffect } from 'react';

import { appMessages } from '~/translations';

import { useDispatch } from 'react-redux';
import { LocalStorageVariables } from '~/constants/localstorage';
import { useUsersSlice } from '../slices/users';
import { IHvAppContext, IHvAppContextProvider } from './models/hv-app-context.model';

const DEFAULT_LANG_BY_ENV = import.meta.env.VITE_DEFAULT_LANGUAGE;

const defaultLang = () => {
  return (
    localStorage?.getItem(LocalStorageVariables.CURRENT_LANGUAGE) || navigator.language || DEFAULT_LANG_BY_ENV || 'en'
  );
};

export const HvAppContext = createContext<IHvAppContext>({
  lang: defaultLang(),
  messages: appMessages[getAvailableLang(defaultLang()) as keyof typeof appMessages],
  setLocale: (newLang: string) => {
    localStorage.setItem(LocalStorageVariables.CURRENT_LANGUAGE, getAvailableLang(newLang));
  },
});

function getAvailableLang(lang: string) {
  let newLang = lang;
  // Try country especific messages
  let messages = appMessages[newLang.toLowerCase()];

  if (!messages) {
    // Try standard language
    newLang = newLang.split('-')[0];
    if (newLang) {
      messages = appMessages[newLang.toLowerCase()];
    }
  }

  if (!messages) {
    // Default messages
    newLang = DEFAULT_LANG_BY_ENV;
  }

  return newLang.toLowerCase();
}

export const HvAppContextProvider = ({ children, appMessages, setLang, lang }: IHvAppContextProvider) => {
  const dispatch = useDispatch();
  const { actions: usersActions } = useUsersSlice();
  function onSetLang(nextLang: string) {
    localStorage.setItem(LocalStorageVariables.CURRENT_LANGUAGE, nextLang);
    dispatch(usersActions.switchLang({ newLang: nextLang }));
    setLang({ lang: nextLang, messages: appMessages[nextLang] });
  }

  useEffect(() => {
    if (!lang) {
      const nextLang = defaultLang();

      localStorage.setItem(LocalStorageVariables.CURRENT_LANGUAGE, nextLang);
      setLang({ lang: nextLang, messages: appMessages[nextLang] });
    }
  }, [lang]);

  return (
    <HvAppContext.Provider
      value={{
        lang: lang.lang,
        messages: appMessages[lang.lang],
        setLocale: onSetLang,
      }}
    >
      {children}
    </HvAppContext.Provider>
  );
};
