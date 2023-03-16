import { ParametrizedIFrame } from "~/components/shared/molecules/general/parametrizedIFrame/parametrizedIFrame";

export interface SocialNetworkTemplate {
  url?: string;
  mobile_url?: string;
  icon: string;
  user_prefix?: string;
  emptyTitle?: boolean;
  title?: string;
  useSimpleWidget?: boolean;
  widget?: any;
}

export const SocialNetworks: {
  [socialNetworkName: string]: SocialNetworkTemplate;
} = {
  address: {
    icon: "FaMapMarkerAlt",
  },
  appleMusic: {
    url: "https://music.apple.com",
    icon: "SiApplemusic",
    emptyTitle: true,
    title: "Apple Music",
  },
  cd_baby: {
    url: "https://CdBaby.com",
    icon: "BsInfoCircleFill",
    emptyTitle: true,
    title: "CD Baby",
  },
  deezer: {
    url: "https://www.deezer.com/es/artist",
    icon: "FaDeezer",
    emptyTitle: true,
    title: "Deezer",
  },
  email: {
    url: "mailto",
    icon: "MdEmail",
    title: "e-mail",
    emptyTitle: true,
  },
  facebook: {
    url: "https://www.facebook.com",
    mobile_url: "https://m.facebook.com",
    icon: "BsFacebook",
    emptyTitle: true,
    title: "Facebook",
  },
  instagram: {
    url: "https://www.instagram.com",
    icon: "BsInstagram",
    user_prefix: "@",
    emptyTitle: true,
    title: "Instagram",
  },
  linkedin: {
    url: "https://www.linkedin.com",
    icon: "BsLinkedin",
    user_prefix: "",
    emptyTitle: true,
    title: "LinkedIn",
  },
  mobile_phone: {
    url: "tel",
    icon: "FaMobileAlt",
  },
  phone: {
    url: "tel",
    icon: "BsFillTelephoneFill",
  },
  phone_number: {
    url: "tel",
    icon: "BsFillTelephoneFill",
  },
  sound_cloud: {
    url: "https://w.soundcloud.com/player/",
    icon: "GrSoundcloud",
    user_prefix: "",
    emptyTitle: true,
    title: "Sound Cloud",
    widget: (params: any) => {
      let { user, entity, width, height } = params;
      if (!entity) {
        entity = "playlists";
      }
      return (
        user && (
          <ParametrizedIFrame
            key={`scloud-frame-${user}-${entity || ""}`}
            srcUrl={`https://w.soundcloud.com/player/?url=https://api.soundcloud.com/${entity}/${user}&`}
            customWidth={width}
            customHeight={height}
            customStyles={{ borderRadius: "10px" }}
          />
        )
      );
    },
  },
  spotify: {
    url: "https://open.spotify.com/artist",
    icon: "BsSpotify",
    user_prefix: "",
    emptyTitle: true,
    title: "Spotify",
    widget: (params: any) => {
      let { user, entity, width, height } = params;
      if (!entity) {
        entity = "artist";
      }
      return (
        user && (
          <ParametrizedIFrame
            key={`scloud-frame-${user}-${entity || ""}`}
            srcUrl={`https://open.spotify.com/embed/${entity}/${user}?utm_source=generator&theme=0`}
            customWidth={width}
            customHeight={height}
          />
        )
      );
    },
  },
  tiktok: {
    url: "https://www.tiktok.com",
    icon: "FaTiktok",
    emptyTitle: true,
    title: "Tik Tok",
  },
  twitter: {
    url: "https://www.twitter.com",
    mobile_url: "https://mobile.twitter.com",
    icon: "BsTwitter",
    user_prefix: "@",
    emptyTitle: true,
    title: "Twitter",
  },
  website: {
    url: "",
    icon: "TbWorld",
    emptyTitle: true,
    title: "Web",
  },
  whatsapp: {
    url: "https://wa.me",
    icon: "BsWhatsapp",
    user_prefix: "+",
    emptyTitle: true,
    title: "WhatsApp",
  },
  wikipedia: {
    icon: "FaWikipediaW",
    url: "https://en.wikipedia.org/wiki",
    emptyTitle: true,
    title: "Wikipedia",
  },
  youtube: {
    url: "https://www.youtube.com/@",
    icon: "BsYoutube",
    user_prefix: "",
    emptyTitle: true,
    title: "Youtube",
    widget: (params: any) => {
      let { user, entity, width, height } = params;
      return (
        user && (
          <ParametrizedIFrame
            key={`scloud-frame-${user}-${entity || ""}`}
            srcUrl={`https://www.youtube.com/embed/${user}`}
            customWidth={width}
            customHeight={height}
            customStyles={{ borderRadius: "10px" }}
          />
        )
      );
    },
  },
};

export function buildSocialNetworkLinkData(
  socialNetworkName: string,
  mainValue: string,
  extraParams: any = {}
) {
  const socialNetwork = SocialNetworks[socialNetworkName];
  let url = undefined;
  let target = "_blank";

  if (socialNetwork) {
    url = `${socialNetwork.url}/${mainValue}`;

    if (
      socialNetworkName === "email" ||
      socialNetworkName === "phone" ||
      socialNetworkName === "mobile_phone"
    ) {
      url = `${socialNetwork.url}:${mainValue}`;
      target = "_self";
    } else if (socialNetworkName === "tiktok") {
      url = `${socialNetwork.url}/@${mainValue}`;
    } else if (socialNetworkName === "website") {
      url = `${mainValue}`;
    }
  }
  return { url, target };
}
