export interface IHvAppContextProvider {
  children: any;
  appMessages: { [key: string]: { [key: string]: string } };
  setLang?: Function;
  lang?: { lang: string; messages: any };
}

export interface IHvAppContext {
  lang: string;
  messages: { [key: string]: string };
  setLocale: ([nextLang]: string) => void;
}
