import dayjs from 'dayjs';
import { useSelector } from 'react-redux';
import { selectorAllergies } from '~/common/slices/parametrics/demographics/allergies.redux';
import { selectorLanguages } from '~/common/slices/parametrics/geo/language.redux';
import { useI18n } from '~/common/utils';
import { fullyHiddenSectionsByEnvironment } from '~/common/utils/app-utils/app-utils';
import { formatLocationLevels } from '~/common/utils/location-display.utils';
import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { AppUserModel } from '~/models/app/user/user.model';

export const TRANSLATION_BASE_USER_DETAIL_PAGE = 'app.pages.app_base.UsersPages.UsersDetailsPage';

export const USER_DETAIL_SUB_PAGE_CONFIG: PageSection[] = [
  {
    name: 'general',
    sections: [
      {
        name: 'general',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'fullname',
                  formMetaData: {
                    hidden: true,
                  },
                },
                {
                  name: 'given_names',
                  hidden: true,
                  formMetaData: {
                    hidden: false,
                    config: { required: true },
                  },
                },
                {
                  name: 'surnames',
                  hidden: true,
                  formMetaData: {
                    hidden: false,
                    config: { required: true },
                  },
                },
                {
                  name: 'stage_name',
                  hidden: (user: AppUserModel) => {
                    return !user.isIndustryMember;
                  },
                  formMetaData: {
                    hidden: (user: AppUserModel) => {
                      return !user.isIndustryMember;
                    },
                  },
                },
                {
                  name: 'gender',
                  valueFieldName: 'genderEnum.value',
                  icon: 'BsGenderTrans',
                  // emptyTitle: true,
                  value: (user: AppUserModel) => {
                    const { translateGlobalDict } = useI18n();

                    let content = user?.genderEnum?.value
                      ? translateGlobalDict(`entities.users.attributes.gender.values.${user?.genderEnum?.value}`)
                      : undefined;
                    return <>{content}</>;
                  },
                  formMetaData: {
                    inputType: 'select',
                    config: { required: true },
                  },
                },
                {
                  name: 'birthdate',
                  icon: 'FaBirthdayCake',
                  // emptyTitle: true,
                  value: (user: AppUserModel) => {
                    // const { translateText } = useI18n();

                    // let content = user?.genderEnum?.value
                    //   ? translateText(`app.global_dictionary.genders.${user?.genderEnum?.value}`)
                    //   : undefined;
                    return <>{dayjs(user.birthdate).format('DD / MMM / YYYY')}</>;
                  },
                  formMetaData: {
                    inputType: 'date',
                    config: { required: true },
                    componentParams: {
                      disableFuture: true, // No puede ser futuro
                      minAgeInYears: 18, // Debe tener mínimo 18 años
                      maxAgeInYears: 120, // Máximo 120 años
                      defaultToMinAge: false, // Preselecciona "hoy - 18 años"
                    },
                  },
                },
                {
                  name: 'birthplace',
                  icon: 'FaCity',
                  // emptyTitle: true,
                  value: (user: AppUserModel) => formatLocationLevels(user.birthplaceData) || '',
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
                  icon: 'FaMapMarkerAlt',
                  // emptyTitle: true,
                  value: (user: AppUserModel) => formatLocationLevels(user.homeCityData) || '',
                  formMetaData: {
                    inputType: 'citySelector',
                    config: { required: true },
                    defaultValue: { country: '66d61979a546e02c6ce65a39' },
                    componentParams: {
                      maxLevel: 2,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'contact',
        allowedRoles: [{ entityName: 'Artist', requireActiveProfileType: false }],
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'email',
                },
                {
                  name: 'phone_number',
                  formMetaData: {
                    inputType: 'phonePrefix',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'arts',
    allowedRoles: [{ entityName: 'Artist', requireActiveProfileType: false }],
    fullyHidden: fullyHiddenSectionsByEnvironment(['prod']),
    sections: [
      {
        name: 'music',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'played_instruments',
                  data_source: 'arts.music_performance.played_instruments',
                  namePrefix: 'arts.music_performance.',
                  value: (user: AppUserModel) => {
                    return (
                      <>
                        <ul>
                          {(user.arts?.music_performance?.played_instruments || []).map((instrument: string) => (
                            <li>{instrument}</li>
                          ))}
                        </ul>
                      </>
                    );
                  },
                  formMetaData: {
                    inputType: 'instrumentSelector',
                    componentParams: {},
                  },
                },
              ],
            },
          },
        ],
      },
      // {
      //   name: 'dance',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [],
      //       },
      //     },
      //   ],
      // },
      {
        name: 'photography',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [],
            },
          },
        ],
      },
      // {
      //   name: 'video',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [],
      //       },
      //     },
      //   ],
      // },
      // {
      //   name: 'painting',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [],
      //       },
      //     },
      //   ],
      // },
      // {
      //   name: 'poetry',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [],
      //       },
      //     },
      //   ],
      // },
      // {
      //   name: 'standup_comedy',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [],
      //       },
      //     },
      //   ],
      // },
      // {
      //   name: 'awards',
      // },
    ],
  },

  {
    name: 'artist_info',
    allowedRoles: [{ entityName: 'Artist', requireActiveProfileType: false }],
    sections: [
      {
        name: 'artists_info',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'spoken_languages',
                  icon: 'FaGlobeAmericas',
                  value: (user: AppUserModel) => {
                    // El backend guarda spoken_languages del User como códigos (ej. "am"), no como objetos poblados como en Artist.
                    const availableLanguages = useSelector(selectorLanguages.selectItems);
                    const codes = (user?.spoken_languages || []) as unknown as string[];
                    return codes
                      .map((code) => availableLanguages.find((lang) => lang.value === code)?.label || code)
                      .join(', ');
                  },
                  // emptyTitle: true,
                  formMetaData: { inputType: 'autocompletePicker' },
                },
                {
                  name: 'blood_group',
                  icon: 'MdBloodtype',
                  // emptyTitle: true,
                  formMetaData: {
                    inputType: 'select',
                  },
                },
                {
                  name: 'agrees_to_a_blood_transfusion',
                  labelChild: 'label',
                  translationPath: 'app.global_dictionary.entities.users.attributes',
                  icon: 'BiDonateBlood',
                  // emptyTitle: true,
                  value: (user: AppUserModel) => {
                    const { translateGlobalDict } = useI18n();
                    if (user.agrees_to_a_blood_transfusion === undefined) {
                      return 'No disponible';
                    } else {
                      return translateGlobalDict(
                        `entities.users.attributes.agrees_to_a_blood_transfusion.values.${user.agrees_to_a_blood_transfusion}`
                      );
                    }
                  },
                  formMetaData: {
                    inputType: 'switch',
                  },
                },
                {
                  name: 'dietary_restrictions',
                  icon: 'ImSpoonKnife',
                  // emptyTitle: true,
                  value: (user: AppUserModel) => {
                    const { translateGlobalDict } = useI18n();
                    if (user.dietary_restrictions === undefined) {
                      return 'No disponible';
                    } else {
                      return translateGlobalDict(
                        `entities.users.attributes.dietary_restrictions.values.${user.dietary_restrictions}`
                      );
                    }
                  },
                  formMetaData: {
                    inputType: 'select',
                  },
                },
                {
                  name: 'allergies',
                  icon: 'MdOutlineSick',
                  // emptyTitle: true,
                  value: (user: AppUserModel) => {
                    const availableAllergies = useSelector(selectorAllergies.selectItems);
                    const ids = (user?.allergies || []) as unknown as string[];
                    return ids
                      .map((id) => availableAllergies.find((allergy) => allergy.value === id)?.label || id)
                      .join(', ');
                  },
                  formMetaData: {
                    inputType: 'chipPicker',
                    componentParams: {
                      groupby: 'type',
                    },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'emergency_contact',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              data_element_title: {
                prefix: 'contact',
                isConsecutive: true,
                consecutiveBase: 1,
              },
              data_source: 'emergency_contact',
              fields: [
                {
                  name: 'name',
                  value: (emergencyContactData: any) => (
                    <>{`${emergencyContactData?.given_names} ${emergencyContactData?.surnames}`}</>
                  ),
                  // emptyTitle: true,
                },
                { name: 'email' },
                {
                  name: 'phone_number',
                  formMetaData: {
                    inputType: 'phonePrefix',
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    name: 'memberships',
    allowedRoles: [{ entityName: 'Artist', requireActiveProfileType: false }],
    sections: [
      {
        name: 'artists',
        components: [
          {
            componentName: ComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: 'artistMemberships',
              footer: (a: any) => (
                <>
                  <hr></hr>
                  <h3>Roles:</h3>
                  <p>{a.roles.join(', ')}</p>
                </>
              ),
            },
            clickHandlerName: 'onNavigateToEntity',
            formMetaData: { fieldName: 'artistMemberships' },
          },
        ],
      },
      {
        name: 'places',
        components: [
          {
            componentName: ComponentTypes.PROFILE_THUMBNAIL_CARD,
            data: {
              data_source: 'placeMemberships',
              footer: (a: any) => (
                <>
                  <hr></hr>
                  <h3>Roles:</h3>
                  <p>{a.roles.join(', ')}</p>
                </>
              ),
            },
            clickHandlerName: 'onNavigateToEntity',
            formMetaData: { fieldName: 'placeMemberships' },
          },
        ],
      },
    ],
    formMetaData: { hidden: true },
  },
  // {
  //   name: 'my_shows',
  //   allowedRoles: [{ entityName: 'Artist', requireActiveProfileType: false  }],
  //   sections: [
  //     {
  //       name: 'next_shows',
  //       components: [
  //         {
  //           componentName: ComponentTypes.CALENDAR_SIMPLE_LAYOUT,
  //           data: {
  //             data_source: 'events_as_artist.next_events',
  //             fields: {
  //               date: 'timetable__initial_date',
  //               time: 'timetable__main_user_time',
  //               title: 'name',
  //               subtitle: 'subtitle',
  //               place: 'place',
  //             },
  //           },
  //           clickHandlerName: 'onClickEvent',
  //         },
  //       ],
  //     },
  //     {
  //       name: 'past_shows',
  //       components: [
  //         {
  //           componentName: ComponentTypes.CALENDAR_SIMPLE_LAYOUT,
  //           data: {
  //             data_source: 'events_as_artist.past_events',
  //             fields: {
  //               date: 'timetable__initial_date',
  //               time: 'timetable__main_user_time',
  //               title: 'name',
  //               subtitle: 'subtitle',
  //               place: 'place',
  //             },
  //           },
  //           clickHandlerName: 'onClickEvent',
  //         },
  //       ],
  //     },
  //   ],
  //   formMetaData: { hidden: true },
  // },
  // {
  //   name: 'my_liked_shows',
  //   sections: [
  //     {
  //       name: 'next_shows',
  //       components: [
  //         {
  //           componentName: ComponentTypes.CALENDAR_SIMPLE_LAYOUT,
  //           data: {
  //             data_source: 'subscribed_events.next_events',
  //             fields: {
  //               date: 'timetable__initial_date',
  //               time: 'timetable__main_user_time',
  //               title: 'name',
  //               subtitle: 'subtitle',
  //               place: 'place',
  //             },
  //           },
  //           clickHandlerName: 'onClickEvent',
  //         },
  //       ],
  //     },
  //     {
  //       name: 'past_shows',
  //       components: [
  //         {
  //           componentName: ComponentTypes.CALENDAR_SIMPLE_LAYOUT,
  //           data: {
  //             data_source: 'subscribed_events.past_events',
  //             fields: {
  //               date: 'timetable__initial_date',
  //               time: 'timetable__main_user_time',
  //               title: 'name',
  //               subtitle: 'subtitle',
  //               place: 'place',
  //             },
  //           },
  //           clickHandlerName: 'onClickEvent',
  //         },
  //       ],
  //     },
  //   ],
  //   formMetaData: { hidden: true },
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
  },
];
