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

function getAvailableLang(lang: string) {
  let newLang = lang;
  // Try country especific messages
  let messages = appMessages[newLang.toLowerCase()];

  if (!messages) {
    // console.log("PIMER IF");
    // Try standard language
    newLang = newLang.split("-")[0];
    if (newLang) {
      messages = appMessages[newLang.toLowerCase()];
    }
    // console.log(newLang, messages);
  }

  if (!messages) {
    // console.log("segundo IF");
    // Default messages
    newLang = "es";
  }
  messages = appMessages[newLang];
  return newLang;
}

export const HvAppContextProvider = ({
  children,
  appMessages,
}: IHvAppContextProvider) => {
  const [lang, setLang] = useState(defaultLang);
  console.log("#####", lang, getAvailableLang(lang));
  const messages = appMessages[getAvailableLang(lang)] || {};

  function onSetLang(nextLang: string) {
    console.log(">>>>>>>>>>>>>>    ", nextLang);
    localStorage.currentLang = nextLang;
    setLang(nextLang);
  }

  useEffect(() => {
    if (!lang) {
      const nextLang = defaultLang;

      localStorage.currentLang = nextLang;
      setLang(nextLang);
    }
    console.log("+++++++++++++++++++++", lang, getAvailableLang(lang));
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
