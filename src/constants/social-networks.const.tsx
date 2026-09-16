import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ParametrizedIFrame } from '~/components/shared/molecules/general/parametrizedIFrame/parametrizedIFrame';

export interface SocialNetworkTemplate {
  url?: string;
  mobile_url?: string;
  icon: string;
  user_prefix?: string;
  emptyTitle?: boolean;
  title?: string;
  useSimpleWidget?: boolean;
  widget?: any;
  usernamePattern?: RegExp;
  loginWidget?: any;
  // Recibe el valor pegado por el usuario (puede ser un link completo con tracking, ej. ?si=...)
  // y devuelve sólo el username/handle que se debe almacenar. Si no se define, se usa defaultCleanLink.
  clean_link?: (rawValue: string) => string;
}

/**
 * Extractor genérico de username a partir de un link tipo `plataforma.com/username`.
 * - Si el valor no parece una URL (el usuario ya escribió sólo el username), lo deja igual.
 * - Descarta protocolo, dominio, query string (?si=...) y hash.
 * - Devuelve el último segmento del path, sin '@' inicial (ej. tiktok.com/@user -> user).
 */
export function defaultCleanLink(rawValue: string): string {
  if (!rawValue) {
    return rawValue;
  }
  const value = rawValue.trim();
  const looksLikeUrl = /^https?:\/\//i.test(value) || /^[\w-]+(\.[\w-]+)+\//i.test(value);
  if (!looksLikeUrl) {
    return value;
  }
  try {
    const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
    const url = new URL(withProtocol);
    const segments = url.pathname.split('/').filter(Boolean);
    if (segments.length === 0) {
      return value;
    }
    const username = segments[segments.length - 1];
    return decodeURIComponent(username).replace(/^@/, '');
  } catch {
    return value;
  }
}

/**
 * Extrae el id de video de un link de YouTube pegado por el usuario (watch, youtu.be, embed, shorts).
 * Si no matchea ninguno de esos formatos, se asume que ya es sólo el id y se deja igual.
 */
export function extractYoutubeVideoId(rawValue: string): string {
  if (!rawValue) {
    return rawValue;
  }
  const value = rawValue.trim();
  const match = value.match(/(?:youtube\.com\/watch\?v=|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtu\.be\/)([\w-]{11})/i);
  return match ? match[1] : value;
}

export const SocialNetworks: {
  [socialNetworkName: string]: SocialNetworkTemplate;
} = {
  address: {
    icon: 'FaMapMarkerAlt',
  },

  apple: {
    icon: 'BsApple',
    title: 'Apple',
    loginWidget: true,
  },
  appleMusic: {
    url: 'https://music.apple.com',
    icon: 'SiApplemusic',
    emptyTitle: true,
    title: 'Apple Music',
  },
  cd_baby: {
    url: 'https://CdBaby.com',
    icon: 'BsInfoCircleFill',
    emptyTitle: true,
    title: 'CD Baby',
  },
  deezer: {
    url: 'https://www.deezer.com/es/artist',
    icon: 'FaDeezer',
    emptyTitle: true,
    title: 'Deezer',
  },
  email: {
    url: 'mailto',
    icon: 'MdEmail',
    title: 'e-mail',
    emptyTitle: true,
    usernamePattern: /^[\w.+-]+@([\w-]+\.)+[\w-]{2,4}$/,
  },
  facebook: {
    url: 'https://www.facebook.com',
    mobile_url: 'https://m.facebook.com',
    icon: 'BsFacebook',
    emptyTitle: true,
    title: 'Facebook',
    usernamePattern: /^(?<=^|[^\/])([A-Za-z0-9_.]{2,24})$/,
    loginWidget: true,
    // Los perfiles sin username personalizado usan facebook.com/profile.php?id=<id>, donde el
    // patrón genérico plataforma.com/username no aplica (el "username" real va en el query string).
    clean_link: (rawValue: string) => {
      if (!rawValue) {
        return rawValue;
      }
      const value = rawValue.trim();
      if (/^https?:\/\//i.test(value) || /^[\w-]+(\.[\w-]+)+\//i.test(value)) {
        try {
          const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
          const url = new URL(withProtocol);
          const idParam = url.searchParams.get('id');
          if (idParam) {
            return idParam;
          }
        } catch {
          // sigue con la extracción genérica
        }
      }
      return defaultCleanLink(value);
    },
  },
  google: {
    icon: 'BsGoogle',
    title: 'Google',
    loginWidget: true,
  },
  instagram: {
    url: 'https://www.instagram.com',
    icon: 'BsInstagram',
    user_prefix: '@',
    emptyTitle: true,
    title: 'Instagram',
    loginWidget: true,
  },
  linkedin: {
    url: 'https://www.linkedin.com',
    icon: 'BsLinkedin',
    user_prefix: '',
    emptyTitle: true,
    title: 'LinkedIn',
    loginWidget: true,
  },
  mobile_phone: {
    url: 'tel',
    icon: 'FaMobileAlt',
    title: 'Mobile',
  },
  phone: {
    url: 'tel',
    icon: 'BsFillTelephoneFill',
    title: 'Phone',
  },
  phone_number: {
    url: 'tel',
    icon: 'BsFillTelephoneFill',
    title: 'Phone',
  },
  sound_cloud: {
    url: 'https://soundcloud.com/',
    icon: 'fa FaSoundcloud',
    user_prefix: '',
    emptyTitle: true,
    title: 'Sound Cloud',
    // widget: (params: any) => {
    //   let { user, entity, width, height } = params;
    //   if (!entity) {
    //     entity = 'playlists';
    //   }
    //   return (
    //     user && (
    //       <ParametrizedIFrame
    //         key={`scloud-frame-${user}-${entity || ''}`}
    //         srcUrl={`https://w.soundcloud.com/player/?url=https://api.soundcloud.com/${entity}/${user}&`}
    //         customWidth={width}
    //         customHeight={height}
    //         customStyles={{ borderRadius: '10px' }}
    //       />
    //     )
    //   );
    // },
  },
  spotify: {
    url: 'https://open.spotify.com/artist',
    icon: 'BsSpotify',
    user_prefix: '',
    emptyTitle: true,
    title: 'Spotify',
    widget: (params: any) => {
      let { user, entity, width, height } = params;
      if (!entity) {
        entity = 'artist';
      }
      return (
        (user && (
          <ParametrizedIFrame
            key={`scloud-frame-${user}-${entity || ''}`}
            srcUrl={`https://open.spotify.com/embed/${entity}/${user}?utm_source=generator&theme=0`}
            customWidth={width}
            customHeight={height}
          />
        )) ||
        (!user && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <DynamicIcons iconName="BsSpotify" size={35} />
            <span>No disponible</span>
          </div>
        ))
      );
    },
    loginWidget: true,
  },
  threads: {
    url: 'https://www.threads.net',
    icon: 'TbSocial',
    emptyTitle: false,
    title: 'Threads',
  },
  tidal: {
    url: 'https://www.tidal.com',
    icon: 'si SiTidal',
    emptyTitle: true,
    title: 'Tidal',
  },
  tiktok: {
    url: 'https://www.tiktok.com',
    icon: 'FaTiktok',
    emptyTitle: true,
    title: 'Tik Tok',
  },
  twitch: {
    url: 'https://www.twitch.tv',
    icon: 'FaTwitch',
    emptyTitle: true,
    title: 'Twitch',
  },
  twitter: {
    url: 'https://www.twitter.com',
    mobile_url: 'https://mobile.twitter.com',
    icon: 'BsTwitterX',
    user_prefix: '@',
    emptyTitle: true,
    title: 'X (Twitter)',
  },
  vimeo: {
    url: '',
    icon: 'BsVimeo',
    emptyTitle: true,
    title: 'Vimeo',
  },
  website: {
    url: '',
    icon: 'TbWorld',
    emptyTitle: true,
    title: 'Web',
    // usernamePattern: /^((https?:\/\/)?(www\.)?|[a-zA-Z0-9\-\.]+)\.[a-zA-Z]{2,}(:[0-9]{1,5})?(\/\S*)?$/,
  },
  whatsapp: {
    url: 'https://wa.me',
    icon: 'BsWhatsapp',
    emptyTitle: true,
    title: 'WhatsApp',
  },
  wikipedia: {
    icon: 'FaWikipediaW',
    url: 'https://en.wikipedia.org/wiki',
    emptyTitle: true,
    title: 'Wikipedia',
  },
  youtube: {
    url: 'https://www.youtube.com',
    icon: 'BsYoutube',
    user_prefix: '',
    emptyTitle: true,
    title: 'Youtube',
    widget: (params: any) => {
      let { entity, width, height, videoURL } = params;
      return (
        (videoURL && (
          <ParametrizedIFrame
            key={`scloud-frame-${videoURL}-${entity || ''}`}
            srcUrl={`https://www.youtube.com/embed/${videoURL}`}
            customWidth={width}
            customHeight={height}
            customStyles={{ borderRadius: '10px' }}
          />
        )) ||
        (!videoURL && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <DynamicIcons iconName="BsYoutube" size={35} />
            <span>No disponible</span>
          </div>
        ))
      );
    },
  },
};

export function buildSocialNetworkLinkData(socialNetworkName: string, mainValue: string, _extraParams: any = {}) {
  const socialNetwork = SocialNetworks[socialNetworkName];
  let url = undefined;
  let target = '_blank';
  if (socialNetwork) {
    url = `${socialNetwork.url}/${mainValue}`;
    if (socialNetworkName === 'email' || socialNetworkName === 'phone' || socialNetworkName === 'mobile_phone') {
      url = `${socialNetwork.url}:${mainValue}`;
      target = '_self';
    } else if (socialNetworkName === 'tiktok') {
      url = `${socialNetwork.url}/@${mainValue}`;
    } else if (socialNetworkName === 'youtube') {
      url = `${socialNetwork.url}/@${mainValue}`;
    } else if (socialNetworkName === 'website') {
      url = `${mainValue}`;
    }
  }
  return { url, target };
}

export const ARTISTS_HIVE_SOCIAL_NETWORKS = {
  facebook: 'artistshive',
  instagram: 'artist_hive_',
  tiktok: 'artist.hive',
  twitch: 'artistshive',
  twitter: 'artistshivecom',
  youtube: 'ArtistsHive',
};

export interface SocialNetworkStatsTemplate {
  name: string;
  followers?: number;
  variation?: number;
  timelapse?: string;
  [extraData: string]: any;
}
