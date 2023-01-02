export interface ArtistDetailsSubpage {
  name: string;
  sections?: ArtistDetailsSubpageSection[];
}
export interface ArtistDetailsSubpageSection {
  name: string;
  attributes?: DetailAttribute[];
}
export interface DetailAttribute {
  name: string;
  icon?: string;
  emptyTitle?: boolean;
  literal?: boolean;
}

export const ARTIST_DETAIL_SUB_PAGE_CONFIG: ArtistDetailsSubpage[] = [
  {
    name: "general",
    sections: [
      {
        name: "general",
        attributes: [
          {
            name: "description",
            emptyTitle: true,
          },
          {
            name: "since",
            icon: "BsCalendar",
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
            name: "genres",
            icon: "BsInfoCircleFill",
          },
          {
            name: "spoken_languages",
            icon: "TbWorld",
          },
          {
            name: "stage_languages",
            icon: "BsTranslate",
          },
          {
            name: "arts_languages",
            icon: "BsFillMegaphoneFill",
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
          {
            name: "CD Baby",
            literal: true,
            icon: "BsInfoCircleFill",
          },
        ],
      },
      {
        name: "record_label",
      },
      {
        name: "members",
      },
    ],
  },
  {
    name: "arts",
    sections: [
      {
        name: "discography",
        attributes: [
          {
            name: "albums",
            icon: "BsInfoCircleFill",
          },
          {
            name: "dvd_video",
            icon: "ImVideoCamera",
          },
        ],
      },
      {
        name: "media_channels",
        attributes: [
          {
            name: "Youtube",
            literal: true,
            icon: "BsYoutube",
          },
          {
            name: "Spotify",
            literal: true,
            icon: "BsSpotify",
          },
          {
            name: "Sound cloud",
            literal: true,
            icon: "GrSoundcloud",
          },
        ],
      },
      {
        name: "gallery",
        attributes: [
          {
            name: "photos",
            icon: "MdInsertPhoto",
          },
          {
            name: "video",
            icon: "ImVideoCamera",
          },
        ],
      },
      {
        name: "awards",
      },
    ],
  },
  // {
  //   name: 'requirements',
  //   title: 'Escena',
  //   sections: [
  //     {
  //       title: 'Instrumentación',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Iluminación',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Audiovisual',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //     {
  //       title: 'Escenografía',
  //       attributes: [
  //         {
  //           name: '',
  //           icon: 'info',
  //         },
  //       ],
  //     },
  //   ],
  // },
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
];
