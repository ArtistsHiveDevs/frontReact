import { useI18n } from '~/common/utils';
import { fullyHiddenSectionsByEnvironment } from '~/common/utils/app-utils/app-utils';
import { formatLegacyLocation, formatLocationLevels } from '~/common/utils/location-display.utils';
import { RatingStarsView } from '~/components/shared/atoms/gui/rating-stars-view/RatingStarsView';
import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { ArtistModel, ArtistRatingTemplate } from '~/models/domain/artist/artist.model';
import { LanguageModel } from '~/models/parametrics/geo/language.model';

export const TRANSLATION_BASE_ARTIST_DETAIL_PAGE = 'app.pages.ArtistsPages.ArtistsDetailsPage';
const TRANSLATION_BASE_TECHNICAL_DOCS = 'subpages.documents.sections.technical_docs.docs';

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
            data: { images: 'epkGallery', placeholder: 'Foto de los integrantes', size: 150 },
            clickHandlerName: 'onClickGalleryImage',
            formMetaData: {
              hidden: true,
              inputType: 'file',
              fieldName: 'image_gallery',
            },
          },
          {
            componentName: ComponentTypes.HORIZONTAL_IMAGE_GALLERY,
            data: { images: 'image_gallery', placeholder: 'Foto de los integrantes' },
            clickHandlerName: 'onClickGalleryMemberImage',
            hidden: true,
            formMetaData: {
              inputType: 'file',
              fieldName: 'image_members',
              componentParams: {
                multipleFiles: false,
                accept: 'image/*',
                destinationPath: 'images',
                filesDataType: 'members',
                translationPath:
                  'app.pages.ArtistsPages.ArtistsDetailsPage.subpages.general.sections.artist_gallery.attributes',
                fieldTranslationName: 'members',
              },
            },
          },
          {
            componentName: ComponentTypes.HORIZONTAL_IMAGE_GALLERY,
            data: { images: 'image_gallery', placeholder: 'Foto de eventos en vivo' },
            clickHandlerName: 'onClickGalleryLiveImage',
            hidden: true,
            formMetaData: {
              inputType: 'file',
              fieldName: 'image_live_gallery',
              componentParams: {
                multipleFiles: false,
                accept: 'image/*',
                destinationPath: 'images',
                filesDataType: 'live',
                translationPath:
                  'app.pages.ArtistsPages.ArtistsDetailsPage.subpages.general.sections.artist_gallery.attributes',
                fieldTranslationName: 'live',
              },
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
                {
                  name: 'origin_city',
                  icon: 'BsGeoAltFill',
                  value: (artist: ArtistModel) => formatLocationLevels(artist.originCityData) || '',
                  formMetaData: {
                    inputType: 'citySelector',
                    config: { required: true },
                    defaultValue: { country: '66d61979a546e02c6ce65a39' },
                    componentParams: {
                      maxLevel: 2,
                    },
                  },
                },
                {
                  name: 'home_city',
                  icon: 'AiFillHome',
                  // Fallback legacy mientras existan artistas sin los niveles de ubicación persistidos.
                  value: (artist: ArtistModel) =>
                    formatLocationLevels(artist.homeCityData) ||
                    formatLegacyLocation(artist.city, artist.country) ||
                    '',
                  formMetaData: {
                    inputType: 'citySelector',
                    config: { required: true },
                    defaultValue: { country: '66d61979a546e02c6ce65a39' },
                    componentParams: {
                      maxLevel: 2,
                    },
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
                  formMetaData: { inputType: 'autocompletePicker' },
                },
                {
                  name: 'stage_languages',
                  icon: 'BsTranslate',
                  requireSession: true,
                  value: (artist: ArtistModel) => {
                    return artist?.stage_languages.map((l: LanguageModel) => l.name).join(', ');
                  },
                  formMetaData: { inputType: 'autocompletePicker' },
                },
                {
                  name: 'arts_languages',
                  icon: 'BsFillMegaphoneFill',
                  requireSession: true,
                  value: (artist: ArtistModel) => {
                    return artist?.arts_languages.map((l: LanguageModel) => l.name).join(', ');
                  },
                  formMetaData: {
                    inputType: 'autocompletePicker',
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
                  formMetaData: {
                    inputType: 'tel',
                    componentParams: {
                      numericOnly: true,
                    },
                  },
                },
                {
                  name: 'mobile_phone',
                  requireSession: true,
                  formMetaData: {
                    inputType: 'phonePrefix',
                    config: {
                      required: false,
                    },
                  },
                },
                {
                  name: 'whatsapp',
                  formMetaData: {
                    inputType: 'phonePrefix',
                  },
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
    allowedRoles: [{ entityName: 'Artist', checkCurrentProfileInfo: true }],
    fullyHidden: fullyHiddenSectionsByEnvironment(['prod']),
    sections: [
      {
        name: 'music_performance',
        components: [
          {
            componentName: ComponentTypes.CUSTOM_OBJECT_LIST,
            data: { externalData: 'music_performance', placeholder: 'En construcción' },
            formMetaData: {
              inputType: 'customObjectList',
              fieldName: 'music_performance',
              componentParams: {
                dialogTitle: 'Agregar miembro',
                translationPath:
                  'app.pages.ArtistsPages.ArtistsDetailsPage.subpages.members.sections.music_performance.attributes',
                dialogLabelAddCustomObjectElement: 'add',
                enableVerticalView: true,
                fields: [
                  { inputType: 'text', fieldName: 'names', label: 'member_names', config: { required: true } },
                  {
                    inputType: 'text',
                    fieldName: 'surnames',
                    label: 'member_surenames',
                    config: { required: true },
                  },
                  {
                    inputType: 'text',
                    fieldName: 'stage_name',
                    label: 'stage_name',
                  },
                  {
                    inputType: 'email',
                    fieldName: 'email',
                    label: 'email',
                    config: { required: true },
                  },
                  {
                    inputType: 'select',
                    fieldName: 'gender',
                    label: 'gender',
                    config: { required: true },
                    value: (user: any) => {
                      const { translateText } = useI18n();

                      let content = user?.genderEnum?.value
                        ? translateText(`app.global_dictionary.genders.${user?.genderEnum?.value}`)
                        : undefined;
                      return <>{content}</>;
                    },
                  },
                  { inputType: 'text', fieldName: 'member_role', label: 'member_role', config: { required: true } },
                  {
                    inputType: '',
                    fieldName: 'member_instrument',
                    label: 'member_instrument',
                    config: { required: true },
                  },
                ],
              },
            },
          },
        ],
      },
      // {
      //   name: 'audio_engineering',
      //   components: [
      //   ],
      // },
      // {
      //   name: 'visual_arts',
      //   components: [],
      // },
      // {
      //   name: 'management',
      //   components: [],
      // },
      // {
      //   name: 'production',
      //   components: [],
      // },
      // {
      //   name: 'support',
      //   components: [],
      // },
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
                  // Ya se edita en social_networks: acá sólo se muestra el widget.
                  formMetaData: { hidden: true },
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
                  // Ya se edita en social_networks: acá sólo se muestra el widget.
                  formMetaData: { hidden: true },
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
        hidden: fullyHiddenSectionsByEnvironment(['prod']),
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
                  // Ya se edita en social_networks: acá sólo se muestra el widget.
                  formMetaData: { hidden: true },
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
        hidden: fullyHiddenSectionsByEnvironment(['prod']),
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
    fullyHidden: fullyHiddenSectionsByEnvironment(['prod']),
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
    name: 'documents',
    allowedRoles: [{ entityName: 'Artist', checkCurrentProfileInfo: true }],
    sections: [
      {
        name: 'technical_docs',
        components: [
          {
            componentName: ComponentTypes.DOCUMENT_FILE_VIEWER,
            data: {
              fileSource: 'technical_epk',
              translationPath: `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.${TRANSLATION_BASE_TECHNICAL_DOCS}`,
            },
            formMetaData: {
              inputType: 'file',
              fieldName: 'technical_epk',
              componentParams: {
                multipleFiles: false,
                accept: '.pdf, application/pdf',
                useIcons: true,
                iconName: 'FaFilePdf',
                destinationPath: 'documents',
                translationPath: `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.${TRANSLATION_BASE_TECHNICAL_DOCS}`,
              },
            },
          },
          {
            componentName: ComponentTypes.DOCUMENT_FILE_VIEWER,
            data: {
              fileSource: 'technical_rider',
              translationPath: `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.${TRANSLATION_BASE_TECHNICAL_DOCS}`,
            },
            formMetaData: {
              inputType: 'file',
              fieldName: 'technical_rider',
              componentParams: {
                multipleFiles: false,
                accept: '.pdf, application/pdf',
                useIcons: true,
                iconName: 'FaFilePdf',
                destinationPath: 'documents',
                translationPath: `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.${TRANSLATION_BASE_TECHNICAL_DOCS}`,
              },
            },
          },
          {
            componentName: ComponentTypes.DOCUMENT_FILE_VIEWER,
            data: {
              fileSource: 'stage_plot',
              translationPath: `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.${TRANSLATION_BASE_TECHNICAL_DOCS}`,
            },
            formMetaData: {
              inputType: 'file',
              fieldName: 'stage_plot',
              componentParams: {
                multipleFiles: false,
                accept: '.pdf, application/pdf',
                useIcons: true,
                iconName: 'FaFilePdf',
                destinationPath: 'documents',
                translationPath: `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.${TRANSLATION_BASE_TECHNICAL_DOCS}`,
              },
            },
          },
        ],
      },
    ],
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
];
