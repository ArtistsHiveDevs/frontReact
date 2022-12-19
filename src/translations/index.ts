import { DeMessages } from "./de";
import { EnMessages } from "./en";
import { EsMessages } from "./es";
import { EsCOMessages } from "./es-co";
import { FrMessages } from "./fr";
import { ItMessages } from "./it";

function flat(res: any, key: string, val: any, pre = ""): any {
  const prefix = [pre, key].filter((v) => v).join(".");
  return typeof val === "object"
    ? Object.keys(val).reduce(
        (prev, curr) => flat(prev, curr, val[curr], prefix),
        res
      )
    : Object.assign(res, { [prefix]: val });
}

function flatObject(input: any) {
  return Object.keys(input).reduce(
    (prev, curr) => flat(prev, curr, input[curr]),
    {}
  );
}

export const appMessages: { [key: string]: { [key: string]: string } } = {
  de: flatObject(DeMessages),
  en: flatObject(EnMessages),
  es: flatObject(EsMessages),
  "es-co": flatObject(EsCOMessages),
  fr: flatObject(FrMessages),
  it: flatObject(ItMessages),
};
