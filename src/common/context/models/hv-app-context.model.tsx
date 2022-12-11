export interface IHvAppContextProvider {
  children: any;
  appMessages: { [key: string]: { [key: string]: string } };
}

export interface IHvAppContext {
  lang: string;
  messages: { [key: string]: string };
  setLang: ([nextLang]: string) => void;
}
