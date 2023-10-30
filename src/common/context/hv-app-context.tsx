import { createContext, useEffect } from "react";

import { appMessages } from "~/translations";

import {
  IHvAppContext,
  IHvAppContextProvider,
} from "./models/hv-app-context.model";

const DEFAULT_LANG_BY_ENV = import.meta.env.VITE_DEFAULT_LANGUAGE;

const defaultLang = () => {
  return (
    localStorage?.currentLang ||
    navigator.language ||
    DEFAULT_LANG_BY_ENV ||
    "en"
  );
};

export const HvAppContext = createContext<IHvAppContext>({
  lang: defaultLang(),
  messages:
    appMessages[getAvailableLang(defaultLang()) as keyof typeof appMessages],
  setLocale: (newLang: string) => {
    localStorage.currentLang = getAvailableLang(newLang);
  },
});

function getAvailableLang(lang: string) {
  let newLang = lang;
  // Try country especific messages
  let messages = appMessages[newLang.toLowerCase()];

  if (!messages) {
    // Try standard language
    newLang = newLang.split("-")[0];
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

export const HvAppContextProvider = ({
  children,
  appMessages,
  setLang,
  lang,
}: IHvAppContextProvider) => {
  function onSetLang(nextLang: string) {
    localStorage.currentLang = nextLang;
    setLang({ lang: nextLang, messages: appMessages[nextLang] });
  }

  useEffect(() => {
    if (!lang) {
      const nextLang = defaultLang();

      localStorage.currentLang = nextLang;
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
