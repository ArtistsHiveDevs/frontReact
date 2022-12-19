export interface IHvAppContextProvider {
  children: any;
  appMessages: any;
}

export interface IHvAppContext {
  lang: string;
  messages: any;
  setLang: ([nextLang]: string) => void;
}
