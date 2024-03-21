import { AllowedEntityRole } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { PATHS, SUB_PATHS } from '~/constants';

const TRANSLATION_BASE_SIDENAV = 'app.appbase.sidenav.sections';

const enum SIDENAV_SECTIONS {
  GENERAL = 'general',
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
}

export interface SideMenuItem {
  name: string;
  updated: Date;
  path?: string;
  icon?: string;
  randomId?: boolean;
  allowedRoles?: AllowedEntityRole[];
  requireSession?: boolean;
  nestedMenuOptions?: SideMenuItem[];
}

const general: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'home'),
    path: '',
    icon: 'FaHome',
    updated: new Date('2/20/16'),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'cultural_agenda'),
    path: `${PATHS.CULTURAL_AGENDA}`,
    icon: 'FaBullhorn',
    updated: new Date('2/20/16'),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, 'search'),
    path: `${PATHS.SEARCH}`,
    icon: 'ImSearch',
    updated: new Date('2/20/16'),
  },
];
const miInfo: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'inbox'),
    path: '',
    icon: 'FaRegEnvelope',
    updated: new Date('2/20/16'),
    requireSession: true,
    nestedMenuOptions: [
      {
        name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'inbox.nested.incoming'),
        path: '',
        icon: 'HiInboxIn',
        updated: new Date('2/20/16'),
        requireSession: true,
      },
      {
        name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'inbox.nested.sent'),
        path: '',
        icon: 'RiMailSendLine',
        updated: new Date('2/20/16'),
        requireSession: true,
      },
    ],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_profile'),
    path: `${PATHS.PROFILE}`,
    icon: 'FaUser',
    updated: new Date('2/20/16'),
    requireSession: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_bands'),
    path: `${PATHS.ARTISTS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: 'FaUsers',
    updated: new Date('2/20/16'),
    randomId: true,
    allowedRoles: [{ entityName: 'Artist' }],
    requireSession: false,
    nestedMenuOptions: [
      {
        name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_bands.nested.create'),
        path: `${PATHS.ARTISTS}/${SUB_PATHS.CREATE}`,
        icon: 'MdGroupAdd',
        updated: new Date('2/20/16'),
        requireSession: true,
      },
    ],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_events'),
    path: `${PATHS.EVENTS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: 'FaRegCalendarAlt',
    updated: new Date('1/18/16'),
    randomId: true,
    allowedRoles: [{ entityName: 'Artist' }],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_riders'),
    path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}/2`,
    icon: 'FaFileAlt',
    updated: new Date('2/20/16'),
    allowedRoles: [{ entityName: 'Artist' }],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_places'),
    path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: 'hi2 HiBuildingStorefront',
    updated: new Date('2/20/16'),
    allowedRoles: [{ entityName: 'Place' }],
    nestedMenuOptions: [
      {
        name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_places.nested.create'),
        path: `${PATHS.PLACES}/${SUB_PATHS.CREATE}`,
        icon: 'MdGroupAdd',
        updated: new Date('2/20/16'),
        requireSession: true,
      },
    ],
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'favourites'),
    path: '',
    icon: 'BsFillBookmarksFill',
    updated: new Date('2/20/16'),
    requireSession: true,
    nestedMenuOptions: [
      {
        name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'favourites.nested.saved'),
        path: `${PATHS.MY_FAVOURITES}`,
        icon: 'AiFillHeart',
        updated: new Date('2/20/16'),
        requireSession: true,
      },
      {
        name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'favourites.nested.tour_planning'),
        path: `${PATHS.TOURS_OUTLINE}`,
        icon: 'BsFillJournalBookmarkFill',
        updated: new Date('2/20/16'),
        requireSession: true,
      },
    ],
  },
];
const config: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'settings'),
    path: `${PATHS.SETTINGS}`,
    icon: 'FaCogs',
    updated: new Date('2/20/16'),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'help_center'),
    path: '',
    icon: 'FaQuestionCircle',
    updated: new Date('2/20/16'),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'report'),
    path: '',
    icon: 'FaRegFlag',
    updated: new Date('2/20/16'),
    requireSession: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'send_comments'),
    path: '',
    icon: 'MdFeedback',
    updated: new Date('2/20/16'),
    requireSession: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, 'logout'),
    path: '',
    icon: 'HiOutlineLogout',
    updated: new Date('2/20/16'),
    requireSession: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, 'my_riders'),
    path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}/2`,
    icon: 'FaFileAlt',
    updated: new Date('2/20/16'),
  },
];

export const SIDENAV_MENU_CONFIG: SideMenuSection[] = [
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.GENERAL}.name`,
    options: general,
  },
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.MY_INFO}.name`,
    options: miInfo,
    requireSession: true,
  },
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.SETTINGS}.name`,
    options: config,
  },
];
