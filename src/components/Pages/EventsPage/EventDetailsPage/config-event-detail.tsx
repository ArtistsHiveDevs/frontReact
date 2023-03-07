import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";

export const EVENT_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
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
                  icon: "FaRegCalendarAlt",
                  name: "timetable__initial_date",
                },
                {
                  icon: "TbDoorEnter",
                  name: "timetable__openning_doors",
                },
                {
                  icon: "IoTimeOutline",
                  name: "initial_time",
                },
                {
                  icon: "FaMapMarkerAlt",
                  name: "place.name",
                  emptyTitle: true,
                  value: (event: EventModel) => {
                    return (
                      <>
                        {event.place?.name} <br />
                        {event.place?.address} <br />
                        {event.place?.city} <br />
                        {event.place?.country}
                      </>
                    );
                  },
                },
                {
                  icon: "IoTicketOutline",
                  name: "tickets_website",
                  emptyTitle: true,
                },
                {
                  icon: "IoTimeOutline",
                  name: "minimumAge",
                },
                {
                  icon: "BsInfoCircleFill",
                  name: "promoter",
                },
                {
                  icon: "IoBarcodeOutline",
                  name: "national_code",
                },
              ],
            },
          },
        ],
      },
      {
        name: "description",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: "description",
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
    ],
  },
  {
    name: "artists",
    sections: [
      {
        name: "main_artists",
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: "main_artists",
            },
            clickHandlerName: "onNavigateToEntity",
          },
        ],
      },
    ],
  },
  {
    name: "place",
    sections: [
      {
        id: "place",
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: "place",
              footer: {
                components: [
                  {
                    componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
                    data: {
                      data_source: "place",
                      attributes: [
                        {
                          name: "address",
                        },
                        {
                          icon: "FaCity",
                          name: "city",
                          emptyTitle: true,
                          value: (place: PlaceModel) => {
                            return <>{`${place.city}, ${place.country}`}</>;
                          },
                        },
                        {
                          name: "website",
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
                        {
                          name: "email",
                        },
                        {
                          name: "facebook",
                        },
                        {
                          name: "instagram",
                        },
                      ],
                    },
                  },
                ],
              },
            },
            clickHandlerName: "onNavigateToEntity",
          },
        ],
      },
      {
        name: "location",
        components: [
          {
            componentName: ProfileComponentTypes.MAP,
            data: {
              data_source: "place",
              lat: "latitude",
              lng: "longitude",
            },
          },
        ],
      },
    ],
  },
  {
    name: "contact",
    sections: [
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
                  name: "phone",
                },
                {
                  name: "mobile_phone",
                },
                {
                  name: "email",
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
                  name: "instagram",
                },
                {
                  name: "twitter",
                },
                {
                  name: "youtube",
                },
                {
                  name: "spotify",
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
    name: "extra_info",
    sections: [
      {
        name: "additional_info",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: "additional_info",
            },
          },
        ],
      },
      {
        name: "dress_code",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: "dress_code",
            },
          },
        ],
      },
      {
        name: "discounts",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: "discounts",
            },
          },
        ],
      },
      {
        name: "promoter",
        components: [
          {
            componentName: ProfileComponentTypes.HTML_CONTENT,
            data: {
              attribute_content: "promoter",
            },
          },
        ],
      },
    ],
  },
];
