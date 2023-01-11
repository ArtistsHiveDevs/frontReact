import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";

export const ARTIST_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
  {
    name: "general",
    sections: [
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
                  name: "since",
                  icon: "BsCalendar",
                },
                {
                  name: "home_city",
                  icon: "AiFillHome",
                },
                {
                  name: "categories",
                  icon: "BsInfoCircleFill",
                },
                {
                  name: "genres",
                  icon: "BsInfoCircleFill",
                },
                {
                  name: "spoken_languages",
                  icon: "TbWorld",
                  requireSession: true,
                },
                {
                  name: "stage_languages",
                  icon: "BsTranslate",
                  requireSession: true,
                },
                {
                  name: "arts_languages",
                  icon: "BsFillMegaphoneFill",
                  requireSession: true,
                },
              ],
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
                  icon: "TbWorld",
                  emptyTitle: true,
                },
                {
                  name: "email",
                  icon: "MdEmail",
                  requireSession: true,
                  emptyTitle: true,
                },
                {
                  name: "phone",
                  icon: "BsFillTelephoneFill",
                  requireSession: true,
                  emptyTitle: true,
                },
                {
                  name: "mobile_phone",
                  requireSession: true,
                  emptyTitle: true,
                },
                {
                  name: "whatsapp",
                  emptyTitle: true,
                  requireSession: true,
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
                  icon: "BsFacebook",
                },
                {
                  name: "twitter",
                  emptyTitle: true,
                  icon: "BsTwitter",
                },
                {
                  name: "instagram",
                  emptyTitle: true,
                  icon: "BsInstagram",
                },
                {
                  name: "spotify",
                  emptyTitle: true,
                  icon: "BsSpotify",
                },
                {
                  name: "youtube",
                  emptyTitle: true,
                  icon: "BsYoutube",
                },
                {
                  name: "cd_baby",
                  emptyTitle: true,
                  title: "CD Baby",
                  icon: "BsInfoCircleFill",
                },
              ],
            },
          },
        ],
      },
      {
        name: "record_label",
      },
      {
        name: "members",
        requireSession: true,
      },
    ],
  },
  {
    name: "arts",
    sections: [
      {
        name: "discography",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "albums",
                  icon: "BsInfoCircleFill",
                },
                {
                  name: "dvd_video",
                  icon: "ImVideoCamera",
                },
              ],
            },
          },
        ],
      },
      {
        name: "media_channels",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "youtube",
                  emptyTitle: true,
                },
                {
                  name: "spotify",
                  emptyTitle: true,
                  icon: "BsSpotify",
                },
                {
                  name: "Sound cloud",
                  emptyTitle: true,
                  icon: "GrSoundcloud",
                },
              ],
            },
          },
        ],
      },
      {
        name: "gallery",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "photos",
                  icon: "MdInsertPhoto",
                },
                {
                  name: "video",
                  icon: "ImVideoCamera",
                },
              ],
            },
          },
        ],
      },
      {
        name: "awards",
      },
    ],
  },
  // {
  //   name: 'requirements',
  //   title: 'Escena',
  //   sections: [
  //     {
  //       title: 'Instrumentación',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Iluminación',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Audiovisual',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Escenografía',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //   ],
  // },
  {
    name: "social",
    requireSession: true,
    sections: [
      {
        name: "social_network_presence",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
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
                  icon: "FaDeezer",
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
          },
        ],
      },
      {
        name: "stats",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
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
                time: "timetable__main_artist_time",
                title: "name",
                subtitle: "subtitle",
              },
            },
            clickHandlerName: "onClickNextEvent",
          },
        ],
      },
    ],
  },
];
