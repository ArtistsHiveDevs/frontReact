import {
  ProfileComponentTypes,
  ProfileDetailsSubpage,
} from "~/models/domain/profile/profile-details.def";

export const PLACE_DETAIL_SUB_PAGE_CONFIG: ProfileDetailsSubpage[] = [
  {
    name: "general",
    sections: [
      {
        name: "gallery",
        components: [
          {
            componentName: ProfileComponentTypes.IMAGE_GALLERY,
            data: { images: "image_gallery" },
            clickHandlerName: "onClickGalleryImage",
          },
        ],
      },
      {
        name: "general",
        attributes: [
          {
            name: "description",
            emptyTitle: true,
          },
          {
            name: "address",
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
            emptyTitle: true,
          },
          {
            name: "email",
            emptyTitle: true,
          },
          {
            name: "phone",
            emptyTitle: true,
          },
          {
            name: "mobile_phone",
            emptyTitle: true,
          },
          {
            name: "whatsapp",
            literal: true,
            emptyTitle: true,
          },
        ],
      },
      {
        name: "social_networks",
        attributes: [
          {
            name: "facebook",
            emptyTitle: true,
          },
          {
            name: "twitter",
            emptyTitle: true,
          },
          {
            name: "instagram",
            emptyTitle: true,
          },
          {
            name: "spotify",
            emptyTitle: true,
          },
          {
            name: "youtube",
            emptyTitle: true,
          },
        ],
      },
    ],
  },
  {
    name: "social",
    requireSession: true,
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
    requireSession: true,
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
