import { findCustomList } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";

export interface ISearchMock {
  id: string;
  name: string;
  ratio: number;
  displayField: string;
  data: () => ArtistModel[];
  searchType: string;
}

export const searchMock = () => {
  return (query: string): ISearchMock[] => [
    {
      id: "artists",
      name: "Artists",
      ratio: 8,
      displayField: "name",
      data: () => {
        const { newArtistsList: artists } = findCustomList(query);

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
        const { newPlacesList: places } = findCustomList(query);

        return places;
      },
      searchType: "contains",
    },
  ];
};
