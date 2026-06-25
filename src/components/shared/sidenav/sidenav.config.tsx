import { EnvironmentType } from '~/common/utils/app-utils/app-utils';
import { AllowedEntityRole } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { PATHS, SUB_PATHS } from '~/constants';
import { AppUserModel } from '~/models/app/user/user.model';

const TRANSLATION_BASE_SIDENAV = 'app.appbase.sidenav.sections';

const enum SIDENAV_SECTIONS {
  GENERAL = 'general',
  INDUSTRY = 'industry',
  MY_INFO = 'myInfo',
  SETTINGS = 'settings',
}

function generateTranslationPath(section: SIDENAV_SECTIONS, optionName: string) {
  return `${TRANSLATION_BASE_SIDENAV}.${section}.options.${optionName}`;
}

export interface SideMenuSection {
  name: string;
  options: SideMenuItem[];
  allowedRoles?: AllowedEntityRole[];
  requireSession?: boolean;
  hidden?: boolean | Function;
  allowedEnvironments?: EnvironmentType[];
  forbiddenEnvironments?: EnvironmentType[];
}

export interface SideMenuItem {
  name: string;
  updated: Date;
  path?: string;
  icon?: string;
  color?: string;
  handler?: string;
  randomId?: boolean;
  allowedRoles?: AllowedEntityRole[];
  requireSession?: boolean;
  nestedMenuOptions?: SideMenuItem[];
  hidden?: boolean | Function;
  allowedEnvironments?: EnvironmentType[];
  forbiddenEnvironments?: EnvironmentType[];
  rightIcon?: string;
  rightPath?: string;
  rightHandler?: string;
  rightAllowedRoles?: AllowedEntityRole[];
  rightHidden?: boolean | Function;
  rightAllowedEnvironments?: EnvironmentType[];
  rightForbiddenEnvironments?: EnvironmentType[];
  badge?: Function;
}

const general: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'home'),
    path: `${PATHS.HOME}`,
    icon: 'FaHome',
    updated: new Date('2/20/16'),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'cultural_agenda'),
    path: `${PATHS.CULTURAL_AGENDA}`,
    icon: 'FaBullhorn',
    updated: new Date('2/20/16'),
    forbiddenEnvironments: ['prod'],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'search'),
    path: `${PATHS.SEARCH}`,
    icon: 'ImSearch',
    updated: new Date('2/20/16'),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'opportunities'),
    path: `${PATHS.OPPORTUNITIES}`,
    icon: 'md MdRocketLaunch',
    updated: new Date('2/20/16'),
  },
  // {
  //   name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'artists'),
  //   path: `${PATHS.SEARCH}`,
  //   icon: 'ImSearch',
  //   updated: new Date('2/20/16'),
  // },
  // {
  //   name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'places'),
  //   path: `${PATHS.SEARCH}`,
  //   icon: 'ImSearch',
  //   updated: new Date('2/20/16'),
  // },
];
const miInfo: SideMenuItem[] = [
  // {
  //   name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_profile'),
  //   path: `${PATHS.PROFILE}`,
  //   icon: 'FaUser',
  //   updated: new Date('2/20/16'),
  //   requireSession: true,
  // },
  // {
  //   name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_bands'),
  //   path: `${PATHS.ARTISTS}/${SUB_PATHS.ELEMENT_DETAILS}`,
  //   icon: 'FaUsers',
  //   updated: new Date('2/20/16'),
  //   randomId: true,
  //   allowedRoles: [{ entityName: 'Artist' }],
  //   requireSession: false,
  //   nestedMenuOptions: [
  //     {
  //       name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_bands.nested.create'),
  //       path: `${PATHS.ARTISTS}/${SUB_PATHS.CREATE}`,
  //       icon: 'MdGroupAdd',
  //       updated: new Date('2/20/16'),
  //       requireSession: true,
  //     },
  //   ],
  // },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'inbox'),
    path: '',
    icon: 'FaRegEnvelope',
    updated: new Date('2/20/16'),
    requireSession: true,
    forbiddenEnvironments: ['prod'],
    allowedRoles: [{ entityName: 'Artist' }, { entityName: 'Place' }],
    // nestedMenuOptions: [
    //   {
    //     name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'inbox.nested.incoming'),
    //     path: '',
    //     icon: 'HiInboxIn',
    //     updated: new Date('2/20/16'),
    //     requireSession: true,
    //   },
    //   {
    //     name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'inbox.nested.sent'),
    //     path: '',
    //     icon: 'RiMailSendLine',
    //     updated: new Date('2/20/16'),
    //     requireSession: true,
    //   },
    // ],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_calendar'),
    path: `${PATHS.CALENDAR}`,
    icon: 'io5 IoCalendarNumberOutline',
    updated: new Date('1/18/16'),
    randomId: false,
    requireSession: true,
    forbiddenEnvironments: ['prod'],
    hidden: (params: { user: AppUserModel; section: SideMenuSection }) => {
      return !params?.user?.hasIndustryProfiles;
    },
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_prebooking_requests'),
    path: `${PATHS.PREBOOKING_REQUESTS_LIST}`,
    icon: 'LuCalendarClock',
    updated: new Date('1/18/16'),
    randomId: false,
    allowedRoles: [{ entityName: 'Artist' }, { entityName: 'Place' }],
    rightIcon: 'FaPlus',
    rightPath: `${PATHS.EVENTS}/${SUB_PATHS.CREATE}`,
    forbiddenEnvironments: ['prod'],
    hidden: (params: { user: AppUserModel; section: SideMenuSection }) => {
      return params?.user?.hasIndustryProfiles && params?.user?.isInPersonalProfile;
    },
    badge: () => Math.round(Math.random() * 100),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_events'),
    path: `${PATHS.EVENTS}`,
    icon: 'FaRegCalendarAlt',
    updated: new Date('1/18/16'),
    randomId: false,
    allowedRoles: [{ entityName: 'Artist' }, { entityName: 'Place' }],
    rightIcon: 'FaPlus',
    rightPath: `${PATHS.EVENTS}/${SUB_PATHS.CREATE}`,
    forbiddenEnvironments: ['prod'],
    hidden: (params: { user: AppUserModel; section: SideMenuSection }) => {
      return params?.user?.hasIndustryProfiles && params?.user?.isInPersonalProfile;
    },
    // nestedMenuOptions: [
    //   {
    //     name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_events.nested.create'),
    //     path: `${PATHS.EVENTS}/${SUB_PATHS.CREATE}`,
    //     icon: 'FaRegCalendarPlus',
    //     updated: new Date('2/20/16'),
    //     requireSession: true,
    //     allowedRoles: [{ entityName: 'Artist' }],
    //   },
    // ],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_open_calls'),
    path: `${PATHS.OPEN_CALLS}`,
    icon: 'LuMegaphone',
    updated: new Date('1/18/16'),
    randomId: false,
    allowedRoles: [{ entityName: 'Artist' }, { entityName: 'Place' }],
    rightIcon: 'FaPlus',
    rightPath: `${PATHS.OPEN_CALLS}/${SUB_PATHS.CREATE}`,
    rightAllowedRoles: [{ entityName: 'Place' }],
    forbiddenEnvironments: ['prod'],
    hidden: (params: { user: AppUserModel; section: SideMenuSection }) => {
      return params?.user?.hasIndustryProfiles && params?.user?.isInPersonalProfile;
    },
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_riders'),
    path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}/rid_2`,
    icon: 'FaFileAlt',
    updated: new Date('2/20/16'),
    allowedRoles: [{ entityName: 'Artist' }],
    forbiddenEnvironments: ['prod'],
  },
  // {
  //   name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_places'),
  //   path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}`,
  //   icon: 'hi2 HiBuildingStorefront',
  //   updated: new Date('2/20/16'),
  //   allowedRoles: [{ entityName: 'Place' }],
  //   nestedMenuOptions: [
  //     {
  //       name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_places.nested.create'),
  //       path: `${PATHS.PLACES}/${SUB_PATHS.CREATE}`,
  //       icon: 'MdGroupAdd',
  //       updated: new Date('2/20/16'),
  //       requireSession: true,
  //     },
  //   ],
  // },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'favourites'),
    path: `${PATHS.MY_FAVOURITES}`,
    icon: 'AiFillHeart',
    updated: new Date('2/20/16'),
    requireSession: true,
    // nestedMenuOptions: [
    // {
    //   name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'favourites.nested.saved'),
    //   path: `${PATHS.MY_FAVOURITES}`,
    //   icon: 'BsFillBookmarksFill',
    //   updated: new Date('2/20/16'),
    //   requireSession: true,
    // },
    // {
    //   name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'favourites.nested.tour_planning'),
    //   path: `${PATHS.TOURS_OUTLINE}`,
    //   icon: 'BsFillJournalBookmarkFill',
    //   updated: new Date('2/20/16'),
    //   allowedRoles: [{ entityName: 'Artist' }],
    //   requireSession: true,
    // },
    // ],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'logout'),
    handler: 'logout',
    icon: 'HiOutlineLogout',
    updated: new Date('2/20/16'),
    requireSession: true,
  },
];
const config: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'settings'),
    path: `${PATHS.SETTINGS}`,
    icon: 'FaCogs',
    updated: new Date('2/20/16'),
    requireSession: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'help_center'),
    path: `${PATHS.FAQ}`,
    icon: 'FaQuestionCircle',
    updated: new Date('2/20/16'),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'report'),
    path: '',
    color: '#eb0000',
    icon: 'TbAlertHexagonFilled',
    updated: new Date('2/20/16'),
    requireSession: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'send_comments'),
    path: '',
    icon: 'MdFeedback',
    updated: new Date('2/20/16'),
    requireSession: true,
    forbiddenEnvironments: ['prod'],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'send_comments'),
    path: `${PATHS.STAGE_PLOT}/editor/ahgd`,
    icon: 'BsPinMapFill',
    updated: new Date('2/20/16'),
    forbiddenEnvironments: ['prod'],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'send_comments'),
    path: `${PATHS.PLANS}`,
    icon: 'MdAttachMoney',
    updated: new Date('2/20/16'),
    forbiddenEnvironments: ['prod'],
  },
  {
    name: 'PAGOS = = =',
    path: `${PATHS.PAYMENTS}`,
    icon: 'MdAttachMoney',
    updated: new Date('2/20/16'),
    forbiddenEnvironments: ['prod'],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'send_comments'),
    path: `${PATHS.PREBOOKING_REQUESTS_LIST}/end/details/lasucursalvenue`,
    icon: 'tb TbContract',
    updated: new Date('2/20/16'),
    forbiddenEnvironments: ['prod'],
  },

  // {
  //   name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_riders'),
  //   path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}/rid_2`,
  //   icon: 'FaFileAlt',
  //   updated: new Date('2/20/16'),
  // },
];

export const LEFT_SIDENAV_MENU_CONFIG: SideMenuSection[] = [
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.GENERAL}.name`,
    options: general,
  },

  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.SETTINGS}.name`,
    options: config,
  },
];

export const RIGHT_SIDENAV_MENU_CONFIG: SideMenuSection[] = [
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.INDUSTRY}.name`,
    requireSession: true,
    options: [
      {
        name: generateTranslationPath(SIDENAV_SECTIONS.INDUSTRY, 'industry_member'),
        path: `${PATHS.INDUSTRY}`,
        icon: 'hi2 HiMusicalNote',
        updated: new Date('2/20/16'),
        requireSession: true,
      },
    ],
    hidden: (params: { user: AppUserModel; section: SideMenuSection }) => {
      return params?.user?.hasIndustryProfiles;
    },
  },
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.MY_INFO}.name`,
    options: miInfo,
    requireSession: true,
  },
];
