export enum Type {
  PLACES = "places",
  ARTISTS = "artists",
}
const defaultSearch = "";
const defaultTypes = [Type.ARTISTS, Type.PLACES];
const maxDefaultArtists = 3;
const maxDefaultPlaces = 2;

export default {
  defaultSearch,
  defaultTypes,
  maxDefaultArtists,
  maxDefaultPlaces,
};
