import { ProfileDetailsSubpage } from "~/models/domain/profile/profile-details.def";

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
          },
          {
            name: "home_city",
            icon: "AiFillHome",
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
      },
      {
        name: "contact",
        attributes: [
          {
            name: "website",
            icon: "TbWorld",
          },
          {
            name: "email",
            icon: "MdEmail",
          },
          {
            name: "phone",
            icon: "BsFillTelephoneFill",
          },
          {
            name: "mobile_phone",
            icon: "FaMobileAlt",
          },
          {
            name: "Whatsapp",
            literal: true,
            icon: "BsWhatsapp",
          },
        ],
      },
      {
        name: "social_networks",
        attributes: [
          {
            name: "Facebook",
            literal: true,
            icon: "BsFacebook",
          },
          {
            name: "Twitter",
            literal: true,
            icon: "BsTwitter",
          },
          {
            name: "Instagram",
            literal: true,
            icon: "BsInstagram",
          },
          {
            name: "Spotify",
            literal: true,
            icon: "BsSpotify",
          },
          {
            name: "Youtube",
            literal: true,
            icon: "BsYoutube",
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
            literal: true,
            icon: "BsFacebook",
          },
          {
            name: "Instagram",
            literal: true,
            icon: "BsInstagram",
          },
          {
            name: "Twitter",
            literal: true,
            icon: "BsTwitter",
          },
          {
            name: "Spotify",
            literal: true,
            icon: "BsSpotify",
          },
          {
            name: "Deezer",
            literal: true,
            icon: "FaDeezer",
          },
          {
            name: "Apple Music",
            literal: true,
            icon: "SiApplemusic",
          },
          {
            name: "Youtube",
            literal: true,
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
