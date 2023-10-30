import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";

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
        name: "contact",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "website",
                  emptyTitle: true,
                },
                {
                  name: "email",
                  emptyTitle: true,
                },
                {
                  name: "phone",
                  emptyTitle: true,
                },
                {
                  name: "mobile_phone",
                  emptyTitle: true,
                },
                {
                  name: "whatsapp",
                  literal: true,
                  emptyTitle: true,
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
                  emptyTitle: true,
                },
                {
                  name: "twitter",
                  emptyTitle: true,
                },
                {
                  name: "instagram",
                  emptyTitle: true,
                },
                {
                  name: "spotify",
                  emptyTitle: true,
                },
                {
                  name: "youtube",
                  emptyTitle: true,
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "social",
    requireSession: true,
    sections: [
      {
        name: "social_network_presence",
        attributes: [
          {
            name: "Facebook",
            emptyTitle: true,
            icon: "BsFacebook",
          },
          {
            name: "Instagram",
            emptyTitle: true,
            icon: "BsInstagram",
          },
          {
            name: "Twitter",
            emptyTitle: true,
            icon: "BsTwitter",
          },
          {
            name: "Spotify",
            emptyTitle: true,
            icon: "BsSpotify",
          },
          {
            name: "Deezer",
            emptyTitle: true,
          },
          {
            name: "Apple Music",
            emptyTitle: true,
            icon: "SiApplemusic",
          },
          {
            name: "Youtube",
            emptyTitle: true,
            icon: "BsYoutube",
          },
        ],
      },
      {
        name: "stats",
        attributes: [
          {
            name: "general_rate",
            icon: "BsStarFill",
          },
          {
            name: "followers",
            icon: "FaUserFriends",
          },
          {
            name: "event_followers",
            icon: "FaUserFriends",
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
