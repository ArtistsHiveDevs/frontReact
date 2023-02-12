export enum EntityType {
  PLACES = "Places",
  ARTISTS = "Artists",
  EVENTS = "Events",
}
const defaultSearch = "";
const defaultTypes = [EntityType.ARTISTS, EntityType.PLACES, EntityType.EVENTS];
const totalDefaultSearchElements = 6;
const maxDefaultSearchElements =
  totalDefaultSearchElements / defaultTypes.length;

export default {
  defaultSearch,
  defaultTypes,
  maxDefaultSearchElements,
  totalDefaultSearchElements,
};
