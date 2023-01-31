export enum Type {
  PLACES = "places",
  ARTISTS = "artists",
  EVENTS = "events",
}
const defaultSearch = "";
const defaultTypes = [Type.ARTISTS, Type.PLACES, Type.EVENTS];
const maxDefaultSearchElements = 2;

export default {
  defaultSearch,
  defaultTypes,
  maxDefaultSearchElements
};
