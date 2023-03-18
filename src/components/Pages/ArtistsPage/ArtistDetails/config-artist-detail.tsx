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
                  requireSession: true,
                },
                {
                  name: "phone",
                  requireSession: true,
                },
                {
                  name: "mobile_phone",
                  requireSession: true,
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
                {
                  name: "cd_baby",
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
                  components: [
                    {
                      componentName:
                        ProfileComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
                {
                  name: "spotify",
                  components: [
                    {
                      componentName:
                        ProfileComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
                {
                  name: "sound_cloud",
                  components: [
                    {
                      componentName:
                        ProfileComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
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
                place: "place",
              },
            },
            clickHandlerName: "onClickEvent",
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
                place: "place",
              },
            },
            clickHandlerName: "onClickEvent",
          },
        ],
      },
    ],
  },
];
