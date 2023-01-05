import { PATHS, SUB_PATHS } from "~/constants";
import { SideMenuItem } from ".";

const TRANSLATION_BASE_SIDENAV = "app.sidenav.sections";

const enum SIDENAV_SECTIONS {
  GENERAL = "general",
  MY_INFO = "myInfo",
  SETTINGS = "settings",
}

function generateTranslationPath(
  section: SIDENAV_SECTIONS,
  optionName: string
) {
  return `${TRANSLATION_BASE_SIDENAV}.${section}.options.${optionName}`;
}
const general: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, "home"),
    path: "",
    icon: "FaHome",
    updated: new Date("2/20/16"),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.GENERAL, "cultural_agenda"),
    path: `${PATHS.EVENTS}/${SUB_PATHS.AGENDA}`,
    icon: "FaBullhorn",
    updated: new Date("2/20/16"),
  },
];
const miBanda: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, "inbox"),
    path: "",
    icon: "FaRegEnvelope",
    updated: new Date("2/20/16"),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, "my_profile"),
    path: `${PATHS.PROFILE}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: "FaUser",
    updated: new Date("2/20/16"),
    randomId: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, "my_bands"),
    path: `${PATHS.ARTISTS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: "FaUsers",
    updated: new Date("2/20/16"),
    randomId: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, "my_events"),
    path: `${PATHS.EVENTS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: "FaRegCalendarAlt",
    updated: new Date("1/18/16"),
    randomId: true,
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, "my_riders"),
    path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: "FaFileAlt",
    updated: new Date("2/20/16"),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.MY_INFO, "my_places"),
    path: `${PATHS.RIDERS}/${SUB_PATHS.ELEMENT_DETAILS}`,
    icon: "HiBuildingStorefront",
    updated: new Date("2/20/16"),
  },
];
const config: SideMenuItem[] = [
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, "settings"),
    path: `${PATHS.SETTINGS}`,
    icon: "FaCogs",
    updated: new Date("2/20/16"),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, "help_center"),
    path: "",
    icon: "FaQuestionCircle",
    updated: new Date("2/20/16"),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, "report"),
    path: "",
    icon: "FaRegFlag",
    updated: new Date("2/20/16"),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, "send_comments"),
    path: "",
    icon: "MdFeedback",
    updated: new Date("2/20/16"),
  },
  {
    name: generateTranslationPath(SIDENAV_SECTIONS.SETTINGS, "logout"),
    path: "",
    icon: "HiOutlineLogout",
    updated: new Date("2/20/16"),
  },
];

export const SIDENAV_MENU_CONFIG = [
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.GENERAL}.name`,
    options: general,
  },
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.MY_INFO}.name`,
    options: miBanda,
  },
  {
    name: `${TRANSLATION_BASE_SIDENAV}.${SIDENAV_SECTIONS.SETTINGS}.name`,
    options: config,
  },
];
