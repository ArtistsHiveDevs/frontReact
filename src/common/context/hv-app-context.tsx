import { useState, useEffect, createContext } from "react";
import { setFlagsFromString } from "v8";

import { appMessages } from "../../translations";

import {
  IHvAppContext,
  IHvAppContextProvider,
} from "./models/hv-app-context.model";

const defaultLang: string =
  localStorage?.currentLang || navigator.language || "en";

export const HvAppContext = createContext<IHvAppContext>({
  lang: getAvailableLang(defaultLang),
  messages: appMessages[getAvailableLang(defaultLang)],
  setLang: (newLang: string) => {
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
    newLang = "en";
  }

  return newLang.toLowerCase();
}

export const HvAppContextProvider = ({
  children,
  appMessages,
}: IHvAppContextProvider) => {
  const [lang, setLang] = useState(defaultLang);

  const messages = appMessages[getAvailableLang(lang)] || {};

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
  }, [getAvailableLang(lang)]);

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
