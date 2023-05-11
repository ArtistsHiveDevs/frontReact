import moment from "moment";
import { SearchableTemplate } from "~/models/base";
import { EventModel } from "~/models/domain/event/event.model";

export function GMapsSvgMaker(icon: any, data?: any) {
  const path = icon[4] as string;
  const iconAnchor = [icon[0] / 2 || 0, icon[1] || 20];
  const customColor = data?.color || "#8a5433";
  const customOpacity = data?.opacity || 1;
  const customRotation = data?.rotation || 0;
  const customScale = data?.scale || 0.06;

  return {
    path,
    fillColor: customColor,
    fillOpacity: customOpacity,
    strokeWeight: 1,
    rotation: customRotation,
    scale: customScale,
    iconAnchor,
  };
}

export function findEventsPerGenre(
  eventList: EventModel[],
  parentGenre: string
) {
  return eventList.filter((singleEvent) => {
    const genreMainArtistMatch = !!Object.values(
      singleEvent.main_artist?.genres || {}
    )
      ?.reduce((result, current) => result?.concat(current), [])
      ?.find((genre) => genre?.toUpperCase() === parentGenre?.toUpperCase());

    const genreGuestArtistMatch = !!Object.values(
      singleEvent.guest_artist?.genres || {}
    )
      ?.reduce((result, current) => result?.concat(current), [])
      ?.find((genre) => genre?.toUpperCase() === parentGenre?.toUpperCase());

    return genreMainArtistMatch || genreGuestArtistMatch;
  });
}

export function findEventsPerDate(
  eventList: EventModel[],
  endDate: string,
  startDate?: string
) {
  const formatStartDate = startDate
    ? moment(startDate).toDate()
    : moment(endDate).toDate();

  const formatEndDate = moment(endDate).toDate();

  return eventList.filter((singleEvent) => {
    const formatDate = moment(
      singleEvent?.timetable__initial_date || 0
    ).toDate();
    return formatDate >= formatStartDate && formatDate <= formatEndDate;
  });
}

export function findEventsPerArtist(
  eventList: EventModel[],
  search: SearchableTemplate
) {
  return eventList.filter((singleEvent) => {
    const matchMainArtist =
      singleEvent?.main_artist_id?.toString() === search?.id?.toString();
    const matchGuestArtist =
      singleEvent?.guest_artist_id?.toString() === search?.id?.toString();

    return matchGuestArtist || matchMainArtist;
  });
}

export function searchGenresFromEvents(eventList: EventModel[]) {
  const all_genres: string[] = [];
  eventList.forEach((evento) => {
    const main_artist_genres = Object.values(
      evento.main_artist?.genres || {}
    )?.reduce((result, current) => result?.concat(current), []);

    const guest_artist_genres = Object.values(
      evento.guest_artist?.genres || {}
    )?.reduce((result, current) => result?.concat(current), []);

    const artistGenres = main_artist_genres
      ?.concat(guest_artist_genres)
      ?.map((genre) => genre.toUpperCase());
    all_genres.push(...artistGenres);
  });

  return [...new Set(all_genres)].sort();
}

export function mapStringArrayForListType(list: string[]) {
  return list?.map((element) => {
    return {
      label: element,
      value: element,
    };
  });
}
