import { RatingStarsView } from "~/components/shared/atoms/gui/rating-stars-view/RatingStarsView";
import { SocialNetworkStats } from "~/components/shared/domain/atoms/gui/social-network-stats/SocialNetworkStats";
import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";
import {
  ArtistModel,
  ArtistRatingTemplate,
} from "~/models/domain/artist/artist.model";

export const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.ArtistsPages.ArtistsDetailsPage";
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
                  formMetaData: {
                    inputType: "textarea",
                    config: {
                      required: false,
                    },
                  },
                },

                {
                  name: "since",
                  icon: "BsCalendar",
                  formMetaData: {
                    inputType: "date",
                    componentParams: {
                      disableFuture: true,
                    },
                    config: {
                      required: false,
                    },
                  },
                },
                {
                  name: "home_city",
                  icon: "AiFillHome",
                  formMetaData: {
                    inputType: "citySelector",
                  },
                },
                {
                  name: "categories",
                  icon: "BsInfoCircleFill",
                },
                {
                  name: "spoken_languages",
                  icon: "TbWorld",
                  requireSession: true,
                  formMetaData: { inputType: "chipPicker" },
                },
                {
                  name: "stage_languages",
                  icon: "BsTranslate",
                  requireSession: true,
                  formMetaData: { inputType: "chipPicker" },
                },
                {
                  name: "arts_languages",
                  icon: "BsFillMegaphoneFill",
                  requireSession: true,
                  formMetaData: {
                    inputType: "chipPicker",
                    config: { required: true },
                  },
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
            formMetaData: { inputType: "chipPicker", fieldName: "genres" },
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
                  formMetaData: {
                    config: {
                      required: false,
                    },
                  },
                },
                {
                  name: "phone",
                  requireSession: true,
                },
                {
                  name: "mobile_phone",
                  requireSession: true,
                  formMetaData: {
                    config: {
                      required: false,
                    },
                  },
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
                  icon: "SlDisc",
                  components: [
                    {
                      componentName:
                        ProfileComponentTypes.DISCOGRAPHY_LIST_VIEW,
                      data_source: "arts.music.albums",
                      data: {},
                    },
                  ],
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
                      data: {
                        params: {
                          videoURL: "youtube_widget_id",
                        },
                      },
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
                {
                  name: "instagram",
                  components: [
                    {
                      componentName:
                        ProfileComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
                {
                  name: "tiktok",
                  components: [
                    {
                      componentName:
                        ProfileComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
                {
                  name: "vimeo",
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
    requireSession: false,
    sections: [
      {
        name: "social_network_presence",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: "facebook",
                  hidden: (artist: ArtistModel) => {
                    return !artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "facebook"
                    );
                  },
                  value: (artist: ArtistModel) => {
                    const socialNetworkData = artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "facebook"
                    );
                    return (
                      <SocialNetworkStats
                        followers={socialNetworkData?.followers}
                        extraData={socialNetworkData}
                      />
                    );
                  },
                },
                {
                  name: "instagram",
                  hidden: (artist: ArtistModel) => {
                    return !artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "instagram"
                    );
                  },
                  value: (artist: ArtistModel) => {
                    const socialNetworkData = artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "instagram"
                    );
                    return (
                      <SocialNetworkStats
                        followers={socialNetworkData?.followers}
                        extraData={socialNetworkData}
                      />
                    );
                  },
                },
                {
                  name: "twitter",
                  hidden: (artist: ArtistModel) => {
                    return !artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "twitter"
                    );
                  },
                  value: (artist: ArtistModel) => {
                    const socialNetworkData = artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "twitter"
                    );
                    return (
                      <SocialNetworkStats
                        followers={socialNetworkData?.followers}
                        extraData={socialNetworkData}
                      />
                    );
                  },
                },
                {
                  name: "spotify",
                  hidden: (artist: ArtistModel) => {
                    return !artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "spotify"
                    );
                  },
                  value: (artist: ArtistModel) => {
                    const socialNetworkData = artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "spotify"
                    );
                    return (
                      <SocialNetworkStats
                        followers={socialNetworkData?.followers}
                        extraData={socialNetworkData}
                      />
                    );
                  },
                },
                {
                  name: "deezer",
                  hidden: (artist: ArtistModel) => {
                    return !artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "deezer"
                    );
                  },
                  value: (artist: ArtistModel) => {
                    const socialNetworkData = artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "deezer"
                    );
                    return (
                      <SocialNetworkStats
                        followers={socialNetworkData?.followers}
                        extraData={socialNetworkData}
                      />
                    );
                  },
                },
                {
                  name: "appleMusic",
                  hidden: (artist: ArtistModel) => {
                    return !artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "appleMusic"
                    );
                  },
                  value: (artist: ArtistModel) => {
                    const socialNetworkData = artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "appleMusic"
                    );
                    return (
                      <SocialNetworkStats
                        followers={socialNetworkData?.followers}
                        extraData={socialNetworkData}
                      />
                    );
                  },
                },
                {
                  name: "youtube",
                  hidden: (artist: ArtistModel) => {
                    return !artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "youtube"
                    );
                  },
                  value: (artist: ArtistModel) => {
                    const socialNetworkData = artist.stats.socialNetworks.find(
                      (socialNetworkStats) =>
                        socialNetworkStats.name === "youtube"
                    );
                    return (
                      <SocialNetworkStats
                        followers={socialNetworkData?.followers}
                        extraData={socialNetworkData}
                      />
                    );
                  },
                },
              ],
            },
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
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.overall} />
                  ),
                },
                {
                  name: "talent",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.talent} />
                  ),
                },
                {
                  name: "performance",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.performance} />
                  ),
                },
                {
                  name: "proffesionalism",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.proffesionalism} />
                  ),
                },
                {
                  name: "stage_presence",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.stage_presence} />
                  ),
                },
                {
                  name: "charisma",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.charisma} />
                  ),
                },
                {
                  name: "timeliness",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.timeliness} />
                  ),
                },
                {
                  name: "communication",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.communication} />
                  ),
                },
                {
                  name: "respectfulness",
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => (
                    <RatingStarsView rating={rating.respectfulness} />
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
        name: "summary",
        components: [
          {
            componentName:
              ProfileComponentTypes.VISITED_COUNTRIES_CITIES_LIST_VIEW,
            data: {
              cities: "cities",
            },
          },
        ],
      },
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
