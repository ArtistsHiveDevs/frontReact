import { useState, useEffect, createContext } from "react";

import { appMessages } from "../../translations";

import {
  IHvAppContext,
  IHvAppContextProvider,
} from "./models/hv-app-context.model";

const defaultLang: string =
  localStorage?.currentLang || navigator.language || "en";

export const HvAppContext = createContext<IHvAppContext>({
  lang: defaultLang,
  messages: appMessages[defaultLang],
  setLang: () => {},
});

export const HvAppContextProvider = ({
  children,
  appMessages,
}: IHvAppContextProvider) => {
  const [lang, setLang] = useState(defaultLang);
  const messages = appMessages[lang] || {};

  function onSetLang(nextLang: string) {
    localStorage.currentLang = nextLang;
    setLang(nextLang);
  }

  useEffect(() => {
    if (!lang) {
      const nextLang = defaultLang;

      localStorage.currentLang = nextLang;
      setLang(nextLang);
    }
  }, [lang]);

  return (
    <HvAppContext.Provider
      value={{
        lang,
        messages,
        setLang: onSetLang,
      }}
    >
      {children}
    </HvAppContext.Provider>
  );
};
