import dayjs from 'dayjs';
import Flag from 'react-world-flags';
import { useI18n } from '~/common/utils';
import { fullyHiddenSectionsByEnvironment } from '~/common/utils/app-utils/app-utils';
import { formatLocationLevels } from '~/common/utils/location-display.utils';
import { RatingStarsView } from '~/components/shared/atoms/gui/rating-stars-view/RatingStarsView';
import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
// import { CitySelectionLevel } from '~/components/shared/organisms/gui/dynamicForms/components/CitySelector';
import { PlaceModel, PlaceRatingTemplate } from '~/models/domain/place/place.model';

export const TRANSLATION_BASE_PLACE_DETAIL_PAGE = 'app.pages.PlacesPages.PlacesDetailsPage';

export const PLACE_DETAIL_SUB_PAGE_CONFIG: PageSection[] = [
  {
    name: 'general',
    sections: [
      {
        name: 'gallery',
        components: [
          {
            componentName: ComponentTypes.HORIZONTAL_IMAGE_GALLERY,
            data: { images: 'image_gallery' },
            clickHandlerName: 'onClickGalleryImage',
            formMetaData: {
              inputType: 'file',
              fieldName: 'image_gallery',
              componentParams: { multipleFiles: true, accept: 'image/*' },
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
                  },
                },
                {
                  name: 'place_type',
                  icon: 'BsInfoCircleFill',
                  value: (place: PlaceModel) => {
                    const { translateGlobalDict } = useI18n();

                    const content = place?.place_type
                      ? translateGlobalDict(`entities.places.attributes.place_types.values.${place.place_type}`)
                      : undefined;
                    return <>{content}</>;
                  },
                  formMetaData: {
                    inputType: 'select',
                    config: { required: true },
                  },
                },
                {
                  name: 'home_city',
                  icon: 'AiFillHome',
                  value: (place: PlaceModel) => {
                    return (
                      formatLocationLevels(place?.homeCityData) || (
                        <>
                          <span>{place?.cityWithCountry}</span>
                          {place?.country && (
                            <Flag
                              code={place?.country.alpha2}
                              height="15"
                              style={{ border: '1px solid #999', marginLeft: '0.6rem' }}
                            />
                          )}
                        </>
                      )
                    );
                  },
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
                  name: 'address',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'address',
                  },
                },
                // {
                //   name: 'categories',
                //   icon: 'BsInfoCircleFill',
                // },
                {
                  name: 'since',
                  icon: 'BsCalendar',
                  value: (place: PlaceModel) => (place?.since ? dayjs(place.since).format('DD / MMM / YYYY') : ''),
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
                  name: 'activity',
                  icon: 'bs BsActivity',
                  formMetaData: {
                    inputType: 'switch',
                    componentParams: {},
                    config: {
                      required: false,
                    },
                  },
                },
                {
                  name: 'spoken_languages',
                  icon: 'BsTranslate',
                  formMetaData: { inputType: 'chipPicker', hidden: true },
                },
                {
                  name: 'total_audience_capacity',
                  icon: 'md MdGroups',
                },
                {
                  name: 'has_open_mic',
                  icon: 'lu LuMicVocal',
                  value: (place: PlaceModel) => {
                    return place.has_open_mic ? 'Sí' : 'No';
                  },
                  formMetaData: {
                    inputType: 'switch',
                    componentParams: {},
                    config: {
                      required: false,
                    },
                  },
                  // formMetaData: { inputType: 'chipPicker' },
                },
                {
                  name: 'bookingRatesPolicy',
                  icon: 'tb TbContract',
                  value: (place: PlaceModel) => {
                    return (
                      <ul>
                        {place.bookingRatesPolicy.map((policy: any, index: number) => (
                          <li key={`policy_${index}`}>{policy}</li>
                        ))}
                      </ul>
                    );
                  },
                  // formMetaData: { inputType: 'chipPicker' },
                },
                {
                  name: 'regulatory_closing_time',
                  icon: 'tb TbContract',
                  value: (place: PlaceModel) =>
                    place?.regulatory_closing_time ? dayjs(place.regulatory_closing_time).format('hh:mm A') : '',
                  formMetaData: { inputType: 'time', componentParams: { ampm: true } },
                },
              ],
            },
          },
          {
            componentName: ComponentTypes.MAP,
            data: { lat: 'latitude', lng: 'longitude' },
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
                },
                {
                  name: 'phone',
                  formMetaData: {
                    inputType: 'tel',
                    componentParams: {
                      numericOnly: true,
                    },
                  },
                },
                {
                  name: 'mobile_phone',
                  formMetaData: {
                    inputType: 'phonePrefix',
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
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'stats',
    requireSession: true,
    sections: [
      // {
      //   name: 'social_network_presence',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [
      //           {
      //             name: 'facebook',
      //             hidden: (place: PlaceModel) => {
      //               return !place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'facebook'
      //               );
      //             },
      //             value: (place: PlaceModel) => {
      //               const socialNetworkData = place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'facebook'
      //               );
      //               return (
      //                 <SocialNetworkStats followers={socialNetworkData?.followers} extraData={socialNetworkData} />
      //               );
      //             },
      //           },
      //           {
      //             name: 'instagram',
      //             hidden: (place: PlaceModel) => {
      //               return !place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'instagram'
      //               );
      //             },
      //             value: (place: PlaceModel) => {
      //               const socialNetworkData = place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'instagram'
      //               );
      //               return (
      //                 <SocialNetworkStats followers={socialNetworkData?.followers} extraData={socialNetworkData} />
      //               );
      //             },
      //           },
      //           {
      //             name: 'twitter',
      //             hidden: (place: PlaceModel) => {
      //               return !place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'twitter'
      //               );
      //             },
      //             value: (place: PlaceModel) => {
      //               const socialNetworkData = place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'twitter'
      //               );
      //               return (
      //                 <SocialNetworkStats followers={socialNetworkData?.followers} extraData={socialNetworkData} />
      //               );
      //             },
      //           },
      //           {
      //             name: 'spotify',
      //             hidden: (place: PlaceModel) => {
      //               return !place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'spotify'
      //               );
      //             },
      //             value: (place: PlaceModel) => {
      //               const socialNetworkData = place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'spotify'
      //               );
      //               return (
      //                 <SocialNetworkStats followers={socialNetworkData?.followers} extraData={socialNetworkData} />
      //               );
      //             },
      //           },
      //           {
      //             name: 'deezer',
      //             hidden: (place: PlaceModel) => {
      //               return !place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'deezer'
      //               );
      //             },
      //             value: (place: PlaceModel) => {
      //               const socialNetworkData = place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'deezer'
      //               );
      //               return (
      //                 <SocialNetworkStats followers={socialNetworkData?.followers} extraData={socialNetworkData} />
      //               );
      //             },
      //           },
      //           {
      //             name: 'appleMusic',
      //             hidden: (place: PlaceModel) => {
      //               return !place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'appleMusic'
      //               );
      //             },
      //             value: (place: PlaceModel) => {
      //               const socialNetworkData = place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'appleMusic'
      //               );
      //               return (
      //                 <SocialNetworkStats followers={socialNetworkData?.followers} extraData={socialNetworkData} />
      //               );
      //             },
      //           },
      //           {
      //             name: 'youtube',
      //             hidden: (place: PlaceModel) => {
      //               return !place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'youtube'
      //               );
      //             },
      //             value: (place: PlaceModel) => {
      //               const socialNetworkData = place.stats?.socialNetworks?.find(
      //                 (socialNetworkStats) => socialNetworkStats.name === 'youtube'
      //               );
      //               return (
      //                 <SocialNetworkStats followers={socialNetworkData?.followers} extraData={socialNetworkData} />
      //               );
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
      {
        name: 'rating',
        components: [
          {
            componentName: ComponentTypes.HTML_CONTENT,
            data: {
              content: '* * Las siguientes calificaciones son ficticias y sirven para efectos de pruebas.',
            },
          },
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              data_source: 'stats.rating',
              fields: [
                {
                  name: 'overall',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.overall} />,
                },
                {
                  name: 'stage',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.stage} />,
                },
                {
                  name: 'sound',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.sound} />,
                },
                {
                  name: 'backline',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.backline} />,
                },
                {
                  name: 'lights',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.lights} />,
                },
                {
                  name: 'dressing_room',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.dressing_room} />,
                },
                {
                  name: 'hospitality_food',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.hospitality_food} />,
                },
                {
                  name: 'hospitality_drinks',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.hospitality_drinks} />,
                },
                {
                  name: 'timeliness',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.timeliness} />,
                },
                {
                  name: 'communication',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.communication} />,
                },
                {
                  name: 'transportation',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.transportation} />,
                },
                {
                  name: 'logistic',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.logistic} />,
                },
                {
                  name: 'location',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.location} />,
                },
                {
                  name: 'seating_capacity',
                  translationPath: `app.global_dictionary.stats.rating`,
                  value: (rating: PlaceRatingTemplate) => <RatingStarsView rating={rating.seating_capacity} />,
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
    formMetaData: {
      hidden: true,
    },
  },
  {
    name: 'shows',
    fullyHidden: fullyHiddenSectionsByEnvironment(['prod']),
    sections: [
      {
        name: 'next_shows',
        components: [
          {
            componentName: ComponentTypes.CALENDAR_SIMPLE_LAYOUT,
            data: {
              data_source: 'nextEvents',
              options: { hidePlace: true },
            },
            clickHandlerName: 'onClickNextEvent',
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
              options: { hidePlace: true },
            },
            clickHandlerName: 'onClickPastEvent',
          },
        ],
      },
    ],
    formMetaData: { hidden: true },
  },
  {
    name: 'backline',
    requireSession: true,
    sections: [
      {
        name: 'backline_instruments',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'venue_backline_instruments',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'textarea',
                    placeholder: 'Ej: Batería completa, amplificadores de guitarra y bajo...',
                    componentParams: {
                      rows: 4,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'backline_sound',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'venue_backline_sound',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'textarea',
                    placeholder: 'Ej: PA system, monitores de piso, mesa de mezcla de 32 canales...',
                    componentParams: {
                      rows: 4,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'backline_lights',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'venue_backline_lights',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'textarea',
                    placeholder: 'Ej: Luces LED, seguidor, máquina de humo...',
                    componentParams: {
                      rows: 3,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'backline_video',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'venue_backline_video',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'textarea',
                    placeholder: 'Ej: Reproducción de video 4K, formato MP4, VID, etc',
                    componentParams: {
                      rows: 4,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'backline_additional_info',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'venue_backline_additional_info',
                  emptyTitle: true,
                  formMetaData: {
                    inputType: 'textarea',
                    placeholder: 'Notas adicionales sobre el equipo técnico...',
                    componentParams: {
                      rows: 3,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
    formMetaData: {
      // hidden: true,
    },
  },
  // {
  //   name: 'menu',
  //   sections: [
  //     {
  //       name: 'main_course',
  //     },
  //     {
  //       name: 'second_course',
  //     },
  //   ],
  // },
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

    formMetaData: {
      hidden: true,
    },
  },
];
