import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/models/domain/profile/profile-details.def";

export const PLACE_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
  {
    name: "general",
    sections: [
      { name: "gallery" },
      {
        name: "general",
        attributes: [
          {
            name: "description",
            emptyTitle: true,
          },
          {
            name: "address",
            icon: "FaMapMarkerAlt",
            emptyTitle: true,
          },
          {
            name: "cityWithCountry",
            icon: "AiFillHome",
            emptyTitle: true,
          },
          {
            name: "categories",
            icon: "BsInfoCircleFill",
          },
          {
            name: "since",
            icon: "BsCalendar",
          },
          {
            name: "spoken_languages",
            icon: "BsTranslate",
          },
        ],
        components: [
          { componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS },
          {
            componentName: ProfileComponentTypes.MAP,
            data: { lat: "latitude", lng: "longitude" },
          },
        ],
      },
      {
        name: "contact",
        attributes: [
          {
            name: "website",
            icon: "TbWorld",
            emptyTitle: true,
          },
          {
            name: "email",
            icon: "MdEmail",
            emptyTitle: true,
          },
          {
            name: "phone",
            icon: "BsFillTelephoneFill",
            emptyTitle: true,
          },
          {
            name: "mobile_phone",
            icon: "FaMobileAlt",
            emptyTitle: true,
          },
          {
            name: "Whatsapp",
            literal: true,
            icon: "BsWhatsapp",
            emptyTitle: true,
          },
        ],
      },
      {
        name: "social_networks",
        attributes: [
          {
            name: "Facebook",
            icon: "BsFacebook",
            emptyTitle: true,
          },
          {
            name: "Twitter",
            icon: "BsTwitter",
            emptyTitle: true,
          },
          {
            name: "Instagram",
            icon: "BsInstagram",
            emptyTitle: true,
          },
          {
            name: "Spotify",
            icon: "BsSpotify",
            emptyTitle: true,
          },
          {
            name: "Youtube",
            icon: "BsYoutube",
            emptyTitle: true,
          },
        ],
      },
    ],
  },
  {
    name: "social",
    sections: [
      {
        name: "social_network_presence",
        attributes: [
          {
            name: "Facebook",
            emptyTitle: true,
            icon: "BsFacebook",
          },
          {
            name: "Instagram",
            emptyTitle: true,
            icon: "BsInstagram",
          },
          {
            name: "Twitter",
            emptyTitle: true,
            icon: "BsTwitter",
          },
          {
            name: "Spotify",
            emptyTitle: true,
            icon: "BsSpotify",
          },
          {
            name: "Deezer",
            emptyTitle: true,
            icon: "FaDeezer",
          },
          {
            name: "Apple Music",
            emptyTitle: true,
            icon: "SiApplemusic",
          },
          {
            name: "Youtube",
            emptyTitle: true,
            icon: "BsYoutube",
          },
        ],
      },
      {
        name: "stats",
        attributes: [
          {
            name: "general_rate",
            icon: "BsStarFill",
          },
          {
            name: "followers",
            icon: "FaUserFriends",
          },
          {
            name: "event_followers",
            icon: "FaUserFriends",
          },
        ],
      },
    ],
  },
  {
    name: "shows",
    sections: [
      {
        name: "next_shows",
      },
      {
        name: "past_shows",
      },
    ],
  },
  {
    name: "backline",
    sections: [
      {
        name: "sound_backline",
      },
      {
        name: "light_backline",
      },
    ],
  },
  {
    name: "menu",
    sections: [
      {
        name: "main_course",
      },
      {
        name: "second_course",
      },
    ],
  },
];
