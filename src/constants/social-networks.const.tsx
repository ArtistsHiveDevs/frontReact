export interface SocialNetworkTemplate {
  url?: string;
  mobile_url?: string;
  icon: string;
  user_prefix?: string;
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
  },
  deezer: {
    url: "https://www.deezer.com/es/artist",
    icon: "FaDeezer",
  },
  email: {
    url: "mailto",
    icon: "MdEmail",
  },
  facebook: {
    url: "https://www.facebook.com",
    mobile_url: "https://m.facebook.com",
    icon: "BsFacebook",
  },
  instagram: {
    url: "https://www.instagram.com",
    icon: "BsInstagram",
    user_prefix: "@",
  },
  linkedin: {
    url: "https://www.linkedin.com",
    icon: "BsLinkedin",
    user_prefix: "",
  },
  mobile_phone: {
    url: "tel",
    icon: "FaMobileAlt",
  },
  phone: {
    url: "tel",
    icon: "BsFillTelephoneFill",
  },
  sound_cloud: {
    url: "https://open.spotify.com/artist",
    icon: "GrSoundcloud",
    user_prefix: "",
  },
  spotify: {
    url: "https://open.spotify.com/artist",
    icon: "BsSpotify",
    user_prefix: "",
  },
  tiktok: {
    url: "https://www.tiktok.com",
    icon: "FaTiktok",
  },
  twitter: {
    url: "https://www.twitter.com",
    mobile_url: "https://mobile.twitter.com",
    icon: "BsTwitter",
    user_prefix: "@",
  },
  website: {
    url: "",
    icon: "TbWorld",
  },
  whatsapp: {
    url: "https://wa.me",
    icon: "BsWhatsapp",
    user_prefix: "+",
  },
  youtube: {
    url: "https://www.youtube.com/@",
    icon: "BsYoutube",
    user_prefix: "",
  },
};

export function buildSocialNetworkLink(
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
