import { ArtistModel } from "~/models/domain/artist/artist.model";

export enum VerificationStatus {
  NON_VERIFIED,
  VERIFIED,
  VERIFIED_AND_APPROVED,
}

export enum AligmentVerifiedMark {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export function getCustomList(positions: number, list: any) {
  const returnList = [];
  const indexArray: number[] = [];
  const max = list?.length | 0;

  if (max > 0) {
    while (returnList.length < positions) {
      const index = Math.floor(Math.random() * max);

      if (!indexArray.find((idx) => idx === index)) {
        indexArray.push(index);
        returnList.push(list[index]);
      }
    }
  }

  return returnList;
}
enum findByModel {
  name = "name",
  subtitle = "subtitle",
  description = "description",
}

export function findCustomList(words: string) {
  const wordFormatted = words.toLowerCase();

  // ARTISTS
  const newArtistsList: ArtistModel[] = [].filter(
    (data: { [key: string]: any }) => {
      return Object.keys(findByModel).some((model: string) => {
        if (data[model].toLowerCase().includes(wordFormatted)) {
          return true;
        }
      });
    }
  );

  // PLACES
  const newPlacesList: ArtistModel[] = [].filter(
    (data: { [key: string]: any }) => {
      return Object.keys(findByModel).some((model: string) => {
        if (data[model].toLowerCase().includes(wordFormatted)) {
          return true;
        }
      });
    }
  );

  return { newArtistsList, newPlacesList };
}

export function findOnCustomListInput(query: string, list: any) {
  const querYFormatted = query?.toLowerCase();
  const newList = list?.filter(
    (data: { [key: string]: any }) => {
      return Object.keys(findByModel).some((model: string) => {
        if (data[model]?.toLowerCase()?.includes(querYFormatted) && querYFormatted?.length>0) {
          return true;
        }
      });
    }
  );
  return {newList}
}
