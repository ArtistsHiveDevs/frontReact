import { DeMessages } from "./de";
import EnMessages from "./en.json";
import EsMessages from "./es.json";
import FrMessages from "./fr.json";
import ItMessages from "./it.json";

export const appMessages: { [key: string]: { [key: string]: string } } = {
  de: DeMessages,
  en: EnMessages,
  es: EsMessages,
  fr: FrMessages,
  it: ItMessages,
};
