export interface ArtistTemplate {
  artistType: string;
  id: string;
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic?: string;
  photo?: string;
  description: string;
  date?: Date;
}

export interface ArtistState extends ArtistTemplate {
  [key: string]: any;
}

export class ArtistModel implements ArtistTemplate {
  artistType: string;
  id: string;
  name: string;
  subtitle: string;
  verified_status: VerificationStatus;
  profile_pic: string | undefined;
  photo: string | undefined;
  description: string;
  date?: Date;

  constructor(private readonly template: ArtistTemplate) {
    this.artistType = template.artistType;
    this.id = template.id;
    this.name = template.name;
    this.subtitle = template.subtitle;
    this.verified_status = template.verified_status;
    this.profile_pic = template.profile_pic;
    this.photo = template.photo;
    this.description = template.description;
    this.date = template.date;
  }
}

export enum VerificationStatus {
  VERIFIED_AND_APPROVED,
  VERIFIED,
  NON_VERIFIED,
}

export enum AligmentVerifiedMark {
  LEFT = "left",
  RIGHT = "right",
  CENTER = "center",
}

export const MUSICIANS = [
  new ArtistModel({
    artistType: "musician",
    id: "1",
    name: "Petrona Martínez",
    subtitle: "Música folclórica del caribe",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic:
      "https://i0.wp.com/www.expresionnaranja.com/wp-content/uploads/2019/01/pertona.png?w=788",
    photo:
      "https://cr00.epimg.net/radio/imagenes/2021/11/19/cartagena/1637324086_096489_1637324189_noticia_normal.jpg",
    description:
      "Petrona Martínez es una cantante afrocolombiana de música tradicional de la Costa Caribe. Su larga y prolífica carrera profesional le han valido el título de “la reina del bullerengue”",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "2",
    name: "Gualajo",
    subtitle: "El piano de la selva",
    verified_status: VerificationStatus.NON_VERIFIED,
    profile_pic:
      "https://radionacional-v3.s3.amazonaws.com/s3fs-public/styles/portadas_relaciona_4_3/public/senalradio/articulo-noticia/galeriaimagen/gualajo.jpg?h=e414c3af&itok=YNZ1VW9-",
    photo:
      "https://www.eltiempo.com/files/image_640_428/files/crop/uploads/2018/05/25/5b08ab38c91eb.r_1527466171569.0-0-3000-1503.jpeg",
    description:
      "Por su destreza y maestría en la interpretación de la Marimba de Chonta, a José Antonio Torres Solís se le conocía como el “Maestro Gualajo” o el “Pianista de la Selva”. La estrecha relación con este instrumento inició desde los 15 años, cuando construyo y diseñó su primera marimba.",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "3",
    name: "Bluefinch & The Wanderlust",
    subtitle: "Just Rockers!",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_bf.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_bf.jpg",
    description:
      "Bluefinch & The Wanderlust es una banda de Rock Alternativo bogotana formada por Osvaldo Oliver (Bajo y Coros), Julian Londoño, (Guitarra Líder), Juan Pinzón (Batería y Coros) y Sergio de Helena (Voz y Guitarra). Aunque el rock alternativo se distingue como la influencia más destacada, no se dejan encasillar en un sólo género, seducidos por el blues, el rock británico, las nuevas propuestas locales y el deseo constante de explorar sus límites la banda se compromete con lo heterogéneo, su sonido siempre contundente más nunca unívoco refleja la riqueza del contexto bogotano en el que viven sus músicos.",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "4",
    name: "Espiral 7",
    subtitle: "Música folclórica del caribe",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_e7.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_e7.jpg",
    description:
      "Espiral7 representa la desembocadura, el lugar donde el afluente se encuentra con el mar, combinando ritmos, sonidos y juegos de palabras.",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "6",
    name: "Monsieur Periné",
    subtitle: "Jazz a la colombiana",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_mp.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_mp.jpg",
    description: "Volverte A Ver: https://SML.lnk.to/VolverteaVerPreSave",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "7",
    name: "La Pacifican Power",
    subtitle: "Música folclórica del caribe",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_pp.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_pp.jpg",
    description:
      "La Pacifican Power es un colectivo multidisciplinario donde la música, la gráfica, la fotografía,",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "8",
    name: "Los Rolling Ruanas",
    subtitle: "El piano de la selva",
    verified_status: VerificationStatus.NON_VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_rr.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_rr.jpg",
    description:
      '"Nueva Tierra" disponible en todas las plataformas. 🎼🎤⚡ https://links.altafonte.com/gwpee2x',
  }),
  new ArtistModel({
    artistType: "musician",
    id: "8",
    name: "Puerto Candelaria",
    subtitle: "Just Rockers!",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_pc.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_pc.jpg",
    description:
      "Atrevida, controversial e innovadora agrupación colombiana. Escucha su más reciente lanzamiento: h",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "9",
    name: "Lunalé",
    subtitle: "Música folclórica del caribe",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_l.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_ll.jpg",
    description:
      "Cantante, compositora y artista audiovisual colombiana 🇨🇴 🔥Hoy nada me daña soy de fuego🔥",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "10",
    name: "Ministerio del beat",
    subtitle: "El piano de la selva",
    verified_status: VerificationStatus.NON_VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_mb.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_mb.jpg",
    description: "Mirá nuestra live session 🤯🤯🤯",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "11",
    name: "La mojarra eléctrica",
    subtitle: "Just Rockers!",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_me.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_me.jpg",
    description:
      "La Mojarra Eléctrica es la banda mas representativa del nuevo sonido moderno Afro- Colombiano, pioneros en este nuevo genero que se empezó a gestar en el año 2002, han liderado la escena de esta música underground.",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "12",
    name: "Pacífico Libre",
    subtitle: "Música del pacífico",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_pl.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_pl.jpg",
    description:
      "La agrupación Pacifico libre tiene un profundo compromiso con la difusión cultural y se ha enfocad",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "13",
    name: "Gregorio Uribe",
    subtitle: "Cantautor y acordenista",
    verified_status: VerificationStatus.NON_VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_gu.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_gu.jpg",
    description:
      "Cantautor y acordeonista que ha llevado sus canciones a Carnegie Hall y a los Montes de María.",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "14",
    name: "Sonoras Mil",
    subtitle: "Just Rockers!",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_sm.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_sm.jpg",
    description:
      "Sonoras mil is the project of Colombian musician Felipe Gómez Ossa. The music is a fresh mix of Dub",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "15",
    name: "La 33",
    subtitle: "Salsa bogotana",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_33.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_33.jpg",
    description:
      "Salsa, boogaloo, Funk, jazz and folk. https://linkr.bio/la-33",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "16",
    name: "Los Cañaverales del Bohío",
    subtitle: "El piano de la selva",
    verified_status: VerificationStatus.NON_VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_cb.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_cb.jpg",
    description:
      "Por su destreza y maestría en la interpretación de la Marimba de Chonta, a José Antonio Torres Solís se le conocía como el “Maestro Gualajo” o el “Pianista de la Selva”. La estrecha relación con este instrumento inició desde los 15 años, cuando construyo y diseñó su primera marimba.",
  }),
  new ArtistModel({
    artistType: "musician",
    id: "17",
    name: "LauraMare",
    subtitle: "Cantautora",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_lm.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_lm.jpg",
    description:
      "Mi falda tiene espinas, es el primer sencillo de LauraMare cantautora, comunicadora y productora cultural de Marediagua Producciones en Medellín, con una trayectoria de más de 20 años como intérprete - Todo es política",
  }),
];

export const ARTISTS = [...MUSICIANS];

export const BARS = [
  new ArtistModel({
    artistType: "place",
    id: "1",
    name: "Matik - Matik",
    subtitle: "Cra 11 # 67 - 20, Bogotá DC",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_mm.png",
    photo:
      "https://scontent.fbog4-2.fna.fbcdn.net/v/t1.6435-9/103692966_10158480139524521_1314928447462667274_n.jpg?_nc_cat=108&ccb=1-5&_nc_sid=e3f864&_nc_ohc=H1BTGqxYLxUAX-qLLTw&_nc_ht=scontent.fbog4-2.fna&oh=00_AT9jEk3fWc8lGE10OBZaP3_UC7YTKYSjJjfRNkn3BM55tw&oe=6284015D",
    description:
      "*matik-matik* es un espacio independiente implantado en Bogota (barrio Quinta Camacho) cuyo proyecto es desarrollar actividades con relación al sonido bajo la plataforma de un café.",
  }),
  new ArtistModel({
    artistType: "place",
    id: "2",
    name: "Casa Kilele",
    subtitle: "Cl. 28a # 16a - 31, Bogotá DC",
    verified_status: VerificationStatus.NON_VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_ck.jpg",
    photo:
      "https://www.eltiempo.com/files/image_640_428/files/crop/uploads/2018/05/25/5b08ab38c91eb.r_1527466171569.0-0-3000-1503.jpeg",
    description:
      "Casa Kilele-Casa Cultural es una fundación sin ánimo de lucro; una plataforma artística y de encuentros creativos que ofrece espacios de creación y colaboración, con el objetivo de activar el ser, fomentar flujo cultural y desarrollar una comunidad.",
  }),
  new ArtistModel({
    artistType: "place",
    id: "3",
    name: "Galería Café Libro 93",
    subtitle: "Cra 11a # 93 - 42",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic:
      "https://pbs.twimg.com/profile_images/943944101820551168/pjNPndM1_400x400.jpg",
    photo:
      "https://scontent.fbog4-1.fna.fbcdn.net/v/t1.6435-9/196750348_335743828122435_8635650371587580230_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-5&_nc_sid=e3f864&_nc_ohc=NdWgL11xdpYAX8yYrtO&_nc_ht=scontent.fbog4-1.fna&oh=00_AT-1XET9IkNFK-__GKmu1sR2X1fryCb1hEOciRe6fk5UCA&oe=627F9283",
    description:
      "LA RUMBA EN BOGOTA!🎶punto de encuentro de la salsa, el son y la música Caribe. Sedes: Parque 93, Palermo & Salón café Bohemia Tels.: 285 1794 - 218 3435",
  }),
  new ArtistModel({
    artistType: "place",
    id: "4",
    name: "Disco Jaguar",
    subtitle: "Ak. 7 # 59-30, Bogotá DC",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_dj.jpg",
    photo:
      "https://scontent.fbog4-1.fna.fbcdn.net/v/t1.6435-9/196750348_335743828122435_8635650371587580230_n.jpg?stp=dst-jpg_s960x960&_nc_cat=105&ccb=1-5&_nc_sid=e3f864&_nc_ohc=NdWgL11xdpYAX8yYrtO&_nc_ht=scontent.fbog4-1.fna&oh=00_AT-1XET9IkNFK-__GKmu1sR2X1fryCb1hEOciRe6fk5UCA&oe=627F9283",
    description:
      "Un 2 x 1 de Sabor, Coctail de colores y ritmos servido en 2 copas!! mas que dos ambientes, dos movimientos!!  El Corazón de Chapinero !!",
  }),
  new ArtistModel({
    artistType: "place",
    id: "5",
    name: "La Pascasia",
    subtitle: "Carrera 42 # 46 - 46, Medellín",
    verified_status: VerificationStatus.VERIFIED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_lp.png",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_lp.jpg",
    description:
      "Céntrico lugar de coincidencia de artistas, concurrentes y paisanos. Garita de Música Corriente y Grupo Hangar.",
  }),
  new ArtistModel({
    artistType: "place",
    id: "6",
    name: "Latino power",
    subtitle: "Calle 58 # 13-88, Bogotá DC",
    verified_status: VerificationStatus.VERIFIED_AND_APPROVED,
    profile_pic: "http://npcarlos.co/artistsHive_mocks/profile_latp.jpg",
    photo: "http://npcarlos.co/artistsHive_mocks/cover_latp.jpg",
    description:
      "Siempre hemos sido un espacio autogestionado, nos hemos consolidado como una de la salas más importantes en Bogotá para los nuevos ritmos colombianos, la promoción de artistas emergentes, la recordación de los clásicos y la influencia internacional.",
  }),
];

export const PLACES = [...BARS];

export function getCustomList(positions: number, list: any) {
  const returnList = [];
  const indexArray: number[] = [];
  const max = list?.length | 0;

  if (max > 0) {
    while (returnList.length < positions) {
      const index = Math.floor(Math.random() * max);

      if (!indexArray.find((idx) => idx === index)) {
        indexArray.push(index);
        returnList.push(list[index]);
      }
    }
  }

  return returnList;
}
enum findByModel {
  name = "name",
  subtitle = "subtitle",
  description = "description",
}

export function findCustomList(words: string) {
  const wordFormatted = words.toLowerCase();

  // ARTISTS
  const newArtistsList: ArtistModel[] = ARTISTS.filter((data: ArtistState) => {
    return Object.keys(findByModel).some((model: string) => {
      if (data[model].toLowerCase().includes(wordFormatted)) {
        return true;
      }
    });
  });

  // PLACES
  const newPlacesList: ArtistModel[] = PLACES.filter((data: ArtistState) => {
    return Object.keys(findByModel).some((model: string) => {
      if (data[model].toLowerCase().includes(wordFormatted)) {
        return true;
      }
    });
  });

  return { newArtistsList, newPlacesList };
}
