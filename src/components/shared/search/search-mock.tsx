import { findCustomList, findOnCustomListInput } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";

export interface ISearchMock {
  id: string;
  name: string;
  ratio: number;
  displayField: string;
  data: () => ArtistModel[];
  searchType: string;
}

export interface ISearchList {
  id: string;
  name: string;
  ratio?: number;
  displayField: string;
  data: ArtistModel[] | PlaceModel[] | EventModel[];
  searchType?: string;
}

export const searchMock = () => {
  return (query: string, list?: ArtistModel[] | PlaceModel[]): ISearchMock[] => [
    {
      id: "artists",
      name: "Artists",
      ratio: 8,
      displayField: "name",
      data: () => {
        const { newList: artists } = findOnCustomListInput(query, list);
        return artists;
      },
      searchType: "startswith",
    },
    {
      id: "places",
      name: "Places",
      ratio: 2,
      displayField: "name",
      data: () => {
        const { newList: places } = findOnCustomListInput(query, list);
        return places;
      },
      searchType: "contains",
    },
  ];
};
