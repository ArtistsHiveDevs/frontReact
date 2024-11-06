import Flag from 'react-world-flags';
import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from '~/components/shared/organisms/ProfileTabsPage/profile-details.def';
import { EventModel } from '~/models/domain/event/event.model';
import { PlaceModel } from '~/models/domain/place/place.model';

export const TRANSLATION_BASE_EVENT_DETAILS_PAGE: string = 'app.pages.EventsPages.EventDetailsPage';

export const EVENT_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
  {
    name: 'general',
    sections: [
      {
        name: 'description',
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: 'description',
            },
          },
        ],
      },
      {
        name: 'general',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  icon: 'FaRegCalendarAlt',
                  name: 'timetable__initial_date',
                  formMetaData: { inputType: 'date' },
                },
                {
                  icon: 'TbDoorEnter',
                  name: 'timetable__openning_doors',
                  formMetaData: { inputType: 'time' },
                },
                {
                  icon: 'io5 IoTimeOutline',
                  name: 'initial_time',
                  formMetaData: { inputType: 'time' },
                },
                {
                  icon: 'FaMapMarkerAlt',
                  name: 'place.name',
                  emptyTitle: true,
                  value: (event: EventModel) => {
                    return (
                      <>
                        {event.place?.name} <br />
                        {event.place?.address} <br />
                        {event.place?.city} <br />
                        {event.place?.country && event.place?.country?.name && (
                          <>
                            {event.place?.country?.name}
                            {'   '}
                            <Flag
                              code={event.place?.country?.alpha2}
                              height="15"
                              style={{ border: '1px solid #999' }}
                            />
                          </>
                        )}
                      </>
                    );
                  },
                  formMetaData: { hidden: true },
                },
                {
                  icon: 'io5 IoTicketOutline',
                  name: 'tickets_website',
                  emptyTitle: true,
                },
                {
                  icon: 'io5 IoTimeOutline',
                  name: 'minimumAge',
                  formMetaData: { inputType: 'number', config: { min: 0 } },
                },
                {
                  icon: 'BsInfoCircleFill',
                  name: 'promoter',
                },
                {
                  icon: 'io5 IoBarcodeOutline',
                  name: 'national_code',
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
            componentName: ProfileComponentTypes.ARTS_GENRES,
            data: {
              genres: 'genres',
            },
          },
        ],
        formMetaData: { hidden: true },
      },
    ],
  },
  {
    name: 'artists',
    sections: [
      {
        name: 'main_artists',
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: 'main_artists',
            },
            clickHandlerName: 'onNavigateToEntity',
            formMetaData: { fieldName: 'main_artists' },
          },
        ],
      },
      {
        name: 'other_artists',
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: 'other_artists',
            },
            clickHandlerName: 'onNavigateToEntity',
            formMetaData: { fieldName: 'other_artists' },
          },
        ],
        hidden: (event: EventModel) => {
          console.log(event, event?.other_artists.length === 0);
          return event?.other_artists.length === 0;
        },
      },
    ],
  },
  {
    name: 'place',
    sections: [
      {
        id: 'place',
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: 'place',
              footer: {
                components: [
                  {
                    componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
                    data: {
                      data_source: 'place',
                      attributes: [
                        {
                          name: 'address',
                        },
                        {
                          icon: 'FaCity',
                          name: 'city',
                          emptyTitle: true,
                          value: (place: PlaceModel) => {
                            return (
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
                            );
                          },
                        },
                        {
                          name: 'website',
                        },
                        {
                          name: 'phone',
                        },
                        {
                          name: 'mobile_phone',
                        },
                        {
                          name: 'whatsapp',
                        },
                        {
                          name: 'email',
                        },
                        {
                          name: 'facebook',
                        },
                        {
                          name: 'instagram',
                        },
                      ],
                    },
                  },
                ],
              },
            },
            clickHandlerName: 'onNavigateToEntity',
            formMetaData: { fieldName: 'place', componentParams: { maximumRelations: 1 } },
          },
        ],
      },
      {
        name: 'location',
        components: [
          {
            componentName: ProfileComponentTypes.MAP,
            data: {
              data_source: 'place',
              lat: 'latitude',
              lng: 'longitude',
            },
          },
        ],
        formMetaData: { hidden: true },
      },
    ],
  },
  {
    name: 'contact',
    sections: [
      {
        name: 'contact',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'website',
                },
                {
                  name: 'phone',
                },
                {
                  name: 'mobile_phone',
                },
                {
                  name: 'email',
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
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'facebook',
                },
                {
                  name: 'instagram',
                },
                {
                  name: 'twitter',
                },
                {
                  name: 'youtube',
                },
                {
                  name: 'spotify',
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
    name: 'extra_info',
    sections: [
      {
        name: 'additional_info',
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: 'additional_info',
            },
          },
        ],
      },
      {
        name: 'dress_code',
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: 'dress_code',
            },
          },
        ],
      },
      {
        name: 'discounts',
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: 'discounts',
            },
          },
        ],
      },
      {
        name: 'promoter',
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: 'promoter',
            },
          },
        ],
        formMetaData: { hidden: true },
      },
    ],
  },
];
