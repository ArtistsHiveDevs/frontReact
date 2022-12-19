import { useState, useEffect, createContext } from "react";

import {
  IHvAppContext,
  IHvAppContextProvider,
} from "./models/hv-app-context.model";

export const HvAppContext = createContext<IHvAppContext>({
  lang: "",
  messages: {},
  setLang: () => {},
});

export const HvAppContextProvider = ({
  children,
  appMessages,
}: IHvAppContextProvider) => {
  const [lang, setLang] = useState(localStorage?.currentLang || "en");
  const messages = appMessages[lang] || {};

  function onSetLang(nextLang: string) {
    localStorage.currentLang = nextLang;
    setLang(nextLang);
  }

  useEffect(() => {
    if (!lang) {
      const nextLang = localStorage?.currentLang || "en";

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
