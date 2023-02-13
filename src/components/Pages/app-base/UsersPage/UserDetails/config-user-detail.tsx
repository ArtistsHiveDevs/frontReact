import { useI18n } from "~/common/utils";
import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/components/shared/organisms/ProfileTabsPage/profile-details.def";
import { AppUserModel } from "~/models/app/user/user.model";

export const USER_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
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
                  name: "fullname",
                },
                {
                  name: "gender",
                  icon: "BsGenderTrans",
                  emptyTitle: true,
                  value: (user: AppUserModel) => {
                    const { translateText } = useI18n();
                    return (
                      <>
                        {translateText(
                          `app.global_dictionary.genders.${user.genderEnum.value}`
                        )}
                      </>
                    );
                  },
                },
                {
                  name: "birthdate",
                  icon: "FaBirthdayCake",
                  emptyTitle: true,
                },
                {
                  name: "birthplace",
                  icon: "FaCity",
                  emptyTitle: true,
                },
                {
                  name: "home_city",
                  icon: "FaMapMarkerAlt",
                  emptyTitle: true,
                },
                {
                  name: "user_language",
                  icon: "FaGlobeAmericas",
                  emptyTitle: true,
                },
                {
                  name: "blood_group",
                  icon: "MdBloodtype",
                  emptyTitle: true,
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
                  name: "email",
                },
                {
                  name: "phone_number",
                },
              ],
            },
          },
        ],
      },
      {
        name: "emergency_contact",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              data_element_title: {
                prefix: "contact",
                isConsecutive: true,
                consecutiveBase: 1,
              },
              data_source: "emergency_contact",
              fields: [
                {
                  name: "name",
                  value: (emergencyContactData: any) => (
                    <>{`${emergencyContactData.given_names} ${emergencyContactData.surnames}`}</>
                  ),
                  emptyTitle: true,
                },
                { name: "email" },
                { name: "phone_number" },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: "arts",
    sections: [
      {
        name: "music",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      {
        name: "dance",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      {
        name: "photography",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      {
        name: "video",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      {
        name: "painting",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      {
        name: "poetry",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      {
        name: "standup_comedy",
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      {
        name: "awards",
      },
    ],
  },
  {
    name: "memberships",
    sections: [
      {
        name: "artists",
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: "artistMemberships",
            },
            clickHandlerName: "onNavigateToEntity",
          },
        ],
      },
      {
        name: "places",
        components: [
          {
            componentName: ProfileComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: "placeMemberships",
            },
            clickHandlerName: "onNavigateToEntity",
          },
        ],
      },
    ],
  },
  {
    name: "shows",
    sections: [
      {
        name: "my_liked_shows",
        components: [
          {
            componentName: ProfileComponentTypes.CALENDAR_SIMPLE_LAYOUT,
            data: {
              data_source: "nextEvents",
              fields: {
                date: "timetable__initial_date",
                time: "timetable__main_user_time",
                title: "name",
                subtitle: "subtitle",
                place: "place",
              },
            },
            clickHandlerName: "onClickNextEvent",
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
                time: "timetable__main_user_time",
                title: "name",
                subtitle: "subtitle",
                place: "place",
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
                time: "timetable__main_user_time",
                title: "name",
                subtitle: "subtitle",
                place: "place",
              },
            },
            clickHandlerName: "onClickNextEvent",
          },
        ],
      },
    ],
  },
];
