import { RatingStarsView } from "~/components/shared/atoms/gui/rating-stars-view/RatingStarsView";
import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";
import { PlaceRatingTemplate } from "~/models/domain/place/place.model";

export const PLACE_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
  {
    name: "general",
    sections: [
      {
        name: "gallery",
        components: [
          {
            componentName: ProfileComponentTypes.IMAGE_GALLERY,
            data: { images: "image_gallery" },
            clickHandlerName: "onClickGalleryImage",
          },
        ],
      },
      {
        name: "general",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "description",
                  emptyTitle: true,
                },
                {
                  name: "address",
                  emptyTitle: true,
                },
                {
                  name: "cityWithCountry",
                  icon: "AiFillHome",
                  emptyTitle: true,
                },
                {
                  name: "categories",
                  icon: "BsInfoCircleFill",
                },
                {
                  name: "since",
                  icon: "BsCalendar",
                },
                {
                  name: "spoken_languages",
                  icon: "BsTranslate",
                },
              ],
            },
          },
          {
            componentName: ProfileComponentTypes.MAP,
            data: { lat: "latitude", lng: "longitude" },
          },
        ],
      },
      {
        name: "genres",
        components: [
          {
            componentName: ProfileComponentTypes.ARTS_GENRES,
            data: {
              genres: "genres",
            },
          },
        ],
      },
      {
        name: "contact",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "website",
                },
                {
                  name: "email",
                },
                {
                  name: "phone",
                },
                {
                  name: "mobile_phone",
                },
                {
                  name: "whatsapp",
                },
              ],
            },
          },
        ],
      },
      {
        name: "social_networks",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "facebook",
                },
                {
                  name: "twitter",
                },
                {
                  name: "instagram",
                },
                {
                  name: "spotify",
                },
                {
                  name: "youtube",
                },
                {
                  name: "wikipedia",
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "stats",
    // requireSession: true,
    sections: [
      {
        name: "social_network_presence",
        attributes: [
          {
            name: "facebook",
            emptyTitle: true,
          },
          {
            name: "instagram",
            emptyTitle: true,
          },
          {
            name: "twitter",
            emptyTitle: true,
          },
          {
            name: "spotify",
            emptyTitle: true,
          },
          {
            name: "deezer",
            emptyTitle: true,
          },
          {
            name: "appleMusic",
            emptyTitle: true,
          },
          {
            name: "youtube",
            emptyTitle: true,
          },
        ],
      },
      {
        name: "rating",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              data_source: "stats.rating",
              fields: [
                {
                  name: "overall",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.overall} />
                  ),
                },
                {
                  name: "stage",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.stage} />
                  ),
                },
                {
                  name: "sound",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.sound} />
                  ),
                },
                {
                  name: "backline",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.backline} />
                  ),
                },
                {
                  name: "lights",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.lights} />
                  ),
                },
                {
                  name: "dressing_room",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.dressing_room} />
                  ),
                },
                {
                  name: "hospitality_food",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.hospitality_food} />
                  ),
                },
                {
                  name: "hospitality_drinks",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.hospitality_drinks} />
                  ),
                },
                {
                  name: "timeliness",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.timeliness} />
                  ),
                },
                {
                  name: "communication",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.communication} />
                  ),
                },
                {
                  name: "transportation",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.transportation} />
                  ),
                },
                {
                  name: "logistic",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.logistic} />
                  ),
                },
                {
                  name: "location",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.location} />
                  ),
                },
                {
                  name: "seating_capacity",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => (
                    <RatingStarsView rating={rating.seating_capacity} />
                  ),
                },
                {
                  name: "total_rates",
                  translationPath: `app.global_dictionary.stats.rating`,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "shows",
    sections: [
      {
        name: "next_shows",
        components: [
          {
            componentName: ProfileComponentTypes.CALENDAR_SIMPLE_LAYOUT,
            data: {
              data_source: "nextEvents",
              fields: {
                date: "timetable__initial_date",
                time: "timetable__main_artist_time",
                title: "name",
                subtitle: "subtitle",
              },
            },
            clickHandlerName: "onClickNextEvent",
          },
        ],
      },
      {
        name: "past_shows",
        components: [
          {
            componentName: ProfileComponentTypes.CALENDAR_SIMPLE_LAYOUT,
            data: {
              data_source: "pastEvents",
              fields: {
                date: "timetable__initial_date",
                title: "name",
                subtitle: "subtitle",
                picture: "photo",
              },
            },
            clickHandlerName: "onClickPastEvent",
          },
        ],
      },
    ],
  },
  {
    name: "backline",
    requireSession: true,
    sections: [
      {
        name: "sound_backline",
      },
      {
        name: "light_backline",
      },
    ],
  },
  {
    name: "menu",
    sections: [
      {
        name: "main_course",
      },
      {
        name: "second_course",
      },
    ],
  },
];
