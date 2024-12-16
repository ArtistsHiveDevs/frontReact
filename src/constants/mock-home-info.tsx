import dayjs from 'dayjs';
import moment from 'moment-with-locales-es6';
import { useI18n } from '~/common/utils';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { EventModel } from '~/models/domain/event/event.model';

export enum VerificationStatus {
  NON_VERIFIED,
  VERIFIED,
  VERIFIED_AND_APPROVED,
}
export enum UserGender {
  MALE,
  FEMALE,
  NON_BINARY,
  NON_SPECIFIED,
}

export enum AligmentVerifiedMark {
  LEFT = 'left',
  RIGHT = 'right',
  CENTER = 'center',
}

export enum FormatDateTime {
  NARROW = 'narrow',
  SHORT = 'short',
  LONG = 'long',
}

export function getCustomList(positions: number, list: any) {
  const returnList = [];
  const indexArray: number[] = [];
  const max = list?.length | 0;

  if (positions > max) {
    positions = max;
  }

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

export function sortEventsPerMonth(list: EventModel[], lang: string) {
  const today = dayjs();

  dayjs.locale(lang);

  // Filtrar solo los eventos futuros
  const futureEvents = list.filter(
    (event) => event?.timetable__initial_date && event.timetable__initial_date.isAfter(today)
  );

  // Agrupar eventos por mes y año
  const groupedEvents = futureEvents.reduce((acc, event) => {
    const eventDate = event.timetable__initial_date;
    const monthKey = eventDate.format('YYYY-MM'); // Clave que incluye año y mes

    if (!acc[monthKey]) {
      acc[monthKey] = {
        id: monthKey,
        monthName: eventDate.format(today.month() === 11 && eventDate.month() === 0 ? 'MMMM YYYY' : 'MMMM'), // Nombre legible con mes y año
        data: [],
      };
    }
    acc[monthKey].data.push(event);
    return acc;
  }, {} as Record<string, { id: string; monthName: string; data: EventModel[] }>);

  // Convertir el objeto agrupado en un array y ordenar por mes y año
  const sortedArray = Object.values(groupedEvents).sort((a, b) => {
    return dayjs(a.id, 'YYYY-MM').diff(dayjs(b.id, 'YYYY-MM'));
  });

  return sortedArray;
}

// export function getEventsPerMonth(month: number, list: EventModel[]) {
//   let returnList: EventModel[] = [];
//   const max = list?.length | 0;

//   if (max > 0) {
//     returnList = list.filter((event) => {
//       const listMonth = moment(event?.timetable__initial_date, 'YYYY-MM-DD').toDate()?.getMonth();
//       return month === listMonth;
//     });
//   }

//   return returnList;
// }

export function formatDateInMomentType(dateInText: string, momentFormat: string, customLocale?: string) {
  const { locale } = useI18n();
  return moment(dateInText)
    .locale(customLocale || locale)
    .format(momentFormat);
}

export function getMonthName(dateInText: string, monthFormat?: FormatDateTime) {
  let monthName;
  const monthFormatProperty = !!monthFormat ? monthFormat : FormatDateTime.LONG;
  const inputDate = moment(dateInText).toDate();
  const validateDate = !isNaN(inputDate?.getTime());
  if (validateDate)
    monthName = inputDate?.toLocaleString('default', {
      month: monthFormatProperty,
    });
  return monthName;
}

enum findByModel {
  name = 'name',
  subtitle = 'subtitle',
  description = 'description',
}

export function findCustomList(words: string) {
  const wordFormatted = words.toLowerCase();

  // ARTISTS
  const newArtistsList: ArtistModel[] = [].filter((data: { [key: string]: any }) => {
    return Object.keys(findByModel).some((model: string) => {
      if (data[model].toLowerCase().includes(wordFormatted)) {
        return true;
      }
    });
  });

  // PLACES
  const newPlacesList: ArtistModel[] = [].filter((data: { [key: string]: any }) => {
    return Object.keys(findByModel).some((model: string) => {
      if (data[model].toLowerCase().includes(wordFormatted)) {
        return true;
      }
    });
  });

  return { newArtistsList, newPlacesList };
}

export function findOnCustomListInput(query: string, list: any) {
  const querYFormatted = query?.toLowerCase();
  const newList = list?.filter((data: { [key: string]: any }) => {
    return Object.keys(findByModel).some((model: string) => {
      if (data[model]?.toLowerCase()?.includes(querYFormatted) && querYFormatted?.length > 0) {
        return true;
      }
    });
  });
  return { newList };
}
