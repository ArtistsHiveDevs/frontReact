import Flag from 'react-world-flags';
import { isProdEnvironment, fullyHiddenSectionsByEnvironment } from '~/common/utils/app-utils/app-utils';
import { RatingStarsView } from '~/components/shared/atoms/gui/rating-stars-view/RatingStarsView';
import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { ArtistModel, ArtistRatingTemplate } from '~/models/domain/artist/artist.model';
import { LanguageModel } from '~/models/parametrics/geo/language.model';

export const TRANSLATION_BASE_ARTIST_DETAIL_PAGE = 'app.pages.ArtistsPages.ArtistsDetailsPage';
export const ARTIST_DETAIL_SUB_PAGE_CONFIG: PageSection[] = [
  {
    name: 'general',
    sections: [
      {
        name: 'artist_gallery',
        emptyTitle: true,
        components: [
          {
            componentName: ComponentTypes.HORIZONTAL_IMAGE_GALLERY,
            data: { images: 'image_gallery', placeholder: 'Foto de los integrantes' },
            clickHandlerName: 'onClickGalleryImage',
            formMetaData: {
              inputType: 'file',
              fieldName: 'image_gallery',
              componentParams: { multipleFiles: true, accept: 'image/*', destinationPath: '/img' },
            },
          },
        ],
      },
      {
        name: 'general',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'description',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'textarea',
                    config: {
                      required: false,
                    },
                  },
                },

                {
                  name: 'since',
                  icon: 'BsCalendar',
                  formMetaData: {
                    inputType: 'date',
                    componentParams: {
                      disableFuture: true,
                    },
                    config: {
                      required: false,
                    },
                  },
                },
                // {
                //   name: 'origin_city',
                //   icon: 'AiFillHome',
                //   value: (artist: ArtistModel) => {
                //     let text = 'No disponible';
                //     let flag = undefined;
                //     if (artist.country) {
                //       text = '';

                //       if (artist.city) {
                //         text = `${artist.city}, `;
                //       }
                //       text += `${artist.country.name}`;
                //       flag = <Flag code={artist.country.alpha2} height="20" style={{ border: '1px solid #999' }} />;
                //     }
                //     return (
                //       <>
                //         <span>{text}</span> {flag}
                //       </>
                //     );
                //   },
                //   formMetaData: {
                //     inputType: 'citySelector',
                //   },
                // },
                {
                  name: 'home_city',
                  icon: 'AiFillHome',
                  value: (artist: ArtistModel) => {
                    let text = 'No disponible';
                    let flag = undefined;
                    if (artist.country) {
                      text = '';

                      if (artist.city) {
                        text = `${artist.city}, `;
                      }
                      text += `${artist.country.name}`;
                      flag = <Flag code={artist.country.alpha2} height="20" style={{ border: '1px solid #999' }} />;
                    }
                    return (
                      <>
                        <span>{text}</span> {flag}
                      </>
                    );
                  },
                  formMetaData: {
                    inputType: 'citySelector',
                  },
                },
                {
                  name: 'categories',
                  icon: 'BsInfoCircleFill',
                },
                {
                  name: 'spoken_languages',
                  icon: 'TbWorld',
                  requireSession: true,
                  value: (artist: ArtistModel) => {
                    return artist?.spoken_languages.map((l: LanguageModel) => l.name).join(', ');
                  },
                  formMetaData: { inputType: 'chipPicker', hidden: true },
                },
                {
                  name: 'stage_languages',
                  icon: 'BsTranslate',
                  requireSession: true,
                  value: (artist: ArtistModel) => {
                    return artist?.stage_languages.map((l: LanguageModel) => l.name).join(', ');
                  },
                  formMetaData: { inputType: 'chipPicker', hidden: true },
                },
                {
                  name: 'arts_languages',
                  icon: 'BsFillMegaphoneFill',
                  requireSession: true,
                  value: (artist: ArtistModel) => {
                    return artist?.arts_languages.map((l: LanguageModel) => l.name).join(', ');
                  },
                  formMetaData: {
                    inputType: 'chipPicker',
                    config: { required: true },
                    hidden: true,
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'genres',
        components: [
          {
            componentName: ComponentTypes.ARTS_GENRES,
            data: {
              genres: 'genres',
            },
            formMetaData: { inputType: 'chipPicker', fieldName: 'genres' },
          },
        ],
      },
      {
        name: 'contact',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'website',
                },
                {
                  name: 'email',
                  requireSession: true,
                  formMetaData: {
                    config: {
                      required: false,
                    },
                  },
                },
                {
                  name: 'phone',
                  requireSession: true,
                },
                {
                  name: 'mobile_phone',
                  requireSession: true,
                  formMetaData: {
                    config: {
                      required: false,
                    },
                  },
                },
                {
                  name: 'whatsapp',
                },
              ],
            },
          },
        ],
      },
      {
        name: 'social_networks',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'facebook',
                },
                {
                  name: 'twitter',
                },
                {
                  name: 'instagram',
                },
                {
                  name: 'spotify',
                },
                {
                  name: 'youtube',
                },
                {
                  name: 'wikipedia',
                },
                {
                  name: 'cd_baby',
                },
              ],
            },
          },
        ],
      },
      // {
      //   name: 'record_label',
      // },
      // {
      //   name: 'members',
      //   requireSession: true,
      // },
    ],
  },
  {
    name: 'members',
    requireSession: true,
    fullyHidden: fullyHiddenSectionsByEnvironment(['prod', 'dev']),
    sections: [
      {
        name: 'music_performance',
        components: [],
      },
      {
        name: 'audio_engineering',
        components: [],
      },
      {
        name: 'visual_arts',
        components: [],
      },
      {
        name: 'management',
        components: [],
      },
      {
        name: 'production',
        components: [],
      },
      {
        name: 'support',
        components: [],
      },
    ],
  },
  {
    name: 'arts',
    sections: [
      {
        name: 'discography',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'albums',
                  icon: 'SlDisc',
                  components: [
                    {
                      componentName: ComponentTypes.DISCOGRAPHY_LIST_VIEW,
                      data_source: 'arts.music.albums',
                      data: {},
                    },
                  ],
                },
                {
                  name: 'top_tracks',
                  icon: 'FaHeadphones',
                  components: [
                    {
                      componentName: ComponentTypes.TOP_TRACKS_LIST_VIEW,
                      data_source: 'arts.music.top_tracks',
                      data: {},
                    },
                  ],
                },
                {
                  name: 'dvd_video',
                  icon: 'ImVideoCamera',
                },
              ],
              iconDirection: 'vertical',
            },
          },
        ],
      },

      {
        name: 'media_channels',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'youtube',
                  // emptyTitle: true,
                  components: [
                    {
                      componentName: ComponentTypes.SOCIAL_NETWORK_WIDGET,

                      // emptyTitle: true,
                      data: {
                        params: {
                          videoURL: 'youtube_widget_id',
                        },
                      },
                    },
                  ],
                },
                {
                  name: 'spotify',
                  components: [
                    {
                      componentName: ComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
                {
                  name: 'sound_cloud',
                  components: [
                    {
                      componentName: ComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
              ],
              iconDirection: 'vertical',
            },
          },
        ],
      },
      {
        name: 'gallery',
        hidden: fullyHiddenSectionsByEnvironment(['prod', 'dev']),
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'photos',
                  icon: 'MdInsertPhoto',
                },
                {
                  name: 'video',
                  icon: 'ImVideoCamera',
                },
                {
                  name: 'instagram',
                  components: [
                    {
                      componentName: ComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
                {
                  name: 'tiktok',
                  components: [
                    {
                      componentName: ComponentTypes.SOCIAL_NETWORK_WIDGET,
                      data: {},
                    },
                  ],
                },
                {
                  name: 'vimeo',
                  components: [
                    {
                      componentName: ComponentTypes.SOCIAL_NETWORK_WIDGET,
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
        name: 'awards',
        hidden: fullyHiddenSectionsByEnvironment(['prod', 'dev']),
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
    name: 'social',
    requireSession: false,
    formMetaData: { hidden: true },
    sections: [
      {
        name: 'social_network_presence',
        components: [
          {
            componentName: ComponentTypes.SOCIAL_NETWORK_CHARTMETRIC_ANALYTICS_WIDGET,
            data: {},
          },
        ],
      },
      {
        name: 'rating',
        components: [
          {
            componentName: ComponentTypes.HTML_CONTENT,
            data: { content: '* * Las siguientes calificaciones son ficticias y sirven para efectos de pruebas.' },
          },
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              data_source: 'stats.rating',
              fields: [
                {
                  name: 'overall',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.overall} />,
                },
                {
                  name: 'talent',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.talent} />,
                },
                {
                  name: 'performance',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.performance} />,
                },
                {
                  name: 'proffesionalism',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.proffesionalism} />,
                },
                {
                  name: 'stage_presence',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.stage_presence} />,
                },
                {
                  name: 'charisma',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.charisma} />,
                },
                {
                  name: 'timeliness',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.timeliness} />,
                },
                {
                  name: 'communication',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.communication} />,
                },
                {
                  name: 'respectfulness',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: ArtistRatingTemplate) => <RatingStarsView rating={rating.respectfulness} />,
                },
                {
                  name: 'total_rates',
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
    name: 'shows',
    fullyHidden: fullyHiddenSectionsByEnvironment(['prod', 'dev']),
    sections: [
      {
        name: 'summary',
        components: [
          {
            componentName: ComponentTypes.VISITED_COUNTRIES_CITIES_LIST_VIEW,
            data: {
              cities: 'cities',
            },
          },
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'priceRange',
                  icon: 'BsFillMegaphoneFill',
                  requireSession: false,
                  value: (artist: ArtistModel) => {
                    return artist?.priceRange.join(' - ');
                  },
                  // formMetaData: {
                  //   inputType: 'chipPicker',
                  //   config: { required: true },
                  // },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'next_shows',
        components: [
          {
            componentName: ComponentTypes.CALENDAR_SIMPLE_LAYOUT,
            data: {
              data_source: 'nextEvents',
            },
            clickHandlerName: 'onClickEvent',
          },
        ],
      },
      {
        name: 'past_shows',
        components: [
          {
            componentName: ComponentTypes.CALENDAR_SIMPLE_LAYOUT,
            data: {
              data_source: 'pastEvents',
            },
            clickHandlerName: 'onClickEvent',
          },
        ],
      },
    ],
    formMetaData: { hidden: true },
  },
  {
    name: 'followers',
    hideMainMenu: true,
    sections: [
      {
        components: [
          {
            componentName: ComponentTypes.PROFILE_FOLLOWERS_COMPONENT,
            // data: {
            //   data_source: 'nextEvents',
            // },
            clickHandlerName: 'onClickBackButtonFollowers',
          },
        ],
      },
    ],
  },
  {
    name: 'riders',
    sections: [
      {
        name: 'riders_data',
        emptyTitle: true,
        components: [
          {
            componentName: ComponentTypes.DOCUMENT_FILE_VIEWER,
            data: { images: 'image_gallery', placeholder: 'Foto de los integrantes' },
            clickHandlerName: 'onClickGalleryImage',
            formMetaData: {
              inputType: 'file',
              fieldName: 'rider_data',
              componentParams: { multipleFiles: true, accept: '.pdf, application/pdf', useIcons: true, iconName: 'FaFilePdf', destinationPath: '/documents' },
            },
          },
        ],
      },]
  }
];
