import { useEffect, useState } from 'react';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { AppUserModel } from '~/models/app/user/user.model';
import { SearchableTemplate } from '~/models/base';
import {
  EVENT_DETAIL_SUB_PAGE_CONFIG,
  TRANSLATION_BASE_EVENT_DETAILS_PAGE,
} from '../EventDetailsPage/config-event-detail';

const availableArtistsComplete: SearchableTemplate[] = [
  {
    id: '1',
    name: 'Petrona Martínez',
    subtitle: 'Música folclórica del caribe',
    verified_status: 1,
    profile_pic: 'https://i0.wp.com/www.expresionnaranja.com/wp-content/uploads/2019/01/pertona.png?w=788',
    description:
      'Petrona Martínez es una cantante afrocolombiana de música tradicional de la Costa Caribe. Su larga y prolífica carrera profesional le han valido el título de “la reina del bullerengue”',
  },
  {
    id: '2',
    name: 'Gualajo',
    subtitle: 'El piano de la selva',
    verified_status: 2,
    profile_pic:
      'https://radionacional-v3.s3.amazonaws.com/s3fs-public/styles/portadas_relaciona_4_3/public/senalradio/articulo-noticia/galeriaimagen/gualajo.jpg?h=e414c3af&itok=YNZ1VW9-',
    description:
      'Por su destreza y maestría en la interpretación de la Marimba de Chonta, a José Antonio Torres Solís se le conocía como el “Maestro Gualajo” o el “Pianista de la Selva”. La estrecha relación con este instrumento inició desde los 15 años, cuando construyo y diseñó su primera marimba.',
  },
  {
    id: '3',
    name: 'Bluefinch & The Wanderlust',
    subtitle: 'Just Rockers!',
    verified_status: 0,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bf.jpg',
    description:
      'Bluefinch & The Wanderlust es una banda de Rock Alternativo bogotana formada por Osvaldo Oliver (Bajo y Coros), Julian Londoño, (Guitarra Líder), Juan Pinzón (Batería y Coros) y Sergio de Helena (Voz y Guitarra). Aunque el rock alternativo se distingue como la influencia más destacada, no se dejan encasillar en un sólo género, seducidos por el blues, el rock británico, las nuevas propuestas locales y el deseo constante de explorar sus límites la banda se compromete con lo heterogéneo, su sonido siempre contundente más nunca unívoco refleja la riqueza del contexto bogotano en el que viven sus músicos.',
  },
  {
    id: '4',
    name: 'Espiral 7',
    subtitle: 'Música folclórica del caribe',
    verified_status: 1,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_e7.jpg',
    description:
      'Espiral7 representa la desembocadura, el lugar donde el afluente se encuentra con el mar, combinando ritmos, sonidos y juegos de palabras.',
  },
  {
    id: '5',
    name: 'Juan Pablo Vega',
    subtitle: 'Música folclórica del caribe',
    verified_status: 1,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_jpv.jpg',
    description:
      'Artista, cantautor y productor, Vega es uno de los nombres más importantes de América Latina y parte de una nueva generación de artistas que están cambiando el paradigma del pop latino.',
  },
  {
    id: '6',
    name: 'Monsieur Periné',
    subtitle: 'Jazz a la colombiana',
    verified_status: 0,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_mp.jpg',
    description: 'Volverte A Ver: https://SML.lnk.to/VolverteaVerPreSave',
  },
  {
    id: '7',
    name: 'La Pacifican Power',
    subtitle: 'Música folclórica del caribe',
    verified_status: 1,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_pp.jpg',
    description: 'La Pacifican Power es un colectivo multidisciplinario donde la música, la gráfica, la fotografía,',
  },
  {
    id: '8',
    name: 'Los Rolling Ruanas',
    subtitle: 'El piano de la selva',
    verified_status: 2,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_rr.jpg',
    description: '"Nueva Tierra" disponible en todas las plataformas. 🎼🎤⚡ https://links.altafonte.com/gwpee2x',
  },
  {
    id: '18',
    name: 'Puerto Candelaria',
    subtitle: 'Just Rockers!',
    verified_status: 0,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_pc.jpg',
    description: 'Atrevida, controversial e innovadora agrupación colombiana. Escucha su más reciente lanzamiento: h',
  },
  {
    id: '9',
    name: 'Lunalé',
    subtitle: 'Música folclórica del caribe',
    verified_status: 1,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_l.jpg',
    description: 'Cantante, compositora y artista audiovisual colombiana 🇨🇴 🔥Hoy nada me daña soy de fuego🔥',
  },
  {
    id: '10',
    name: 'Ministerio del beat',
    subtitle: 'El piano de la selva',
    verified_status: 2,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_mb.jpg',
    description: 'Mirá nuestra live session 🤯🤯🤯',
  },
  {
    id: '11',
    name: 'La mojarra eléctrica',
    subtitle: 'Just Rockers!',
    verified_status: 0,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_me.jpg',
    description:
      'La Mojarra Eléctrica es la banda mas representativa del nuevo sonido moderno Afro- Colombiano, pioneros en este nuevo genero que se empezó a gestar en el año 2002, han liderado la escena de esta música underground.',
  },
  {
    id: '12',
    name: 'Pacífico Libre',
    subtitle: 'Música del pacífico',
    verified_status: 1,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_pl.jpg',
    description: 'La agrupación Pacifico libre tiene un profundo compromiso con la difusión cultural y se ha enfocado',
  },
  {
    id: '13',
    name: 'Gregorio Uribe',
    subtitle: 'Cantautor y acordenista',
    verified_status: 2,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_gu.jpg',
    description: 'Cantautor y acordeonista que ha llevado sus canciones a Carnegie Hall y a los Montes de María.',
  },
  {
    id: '14',
    name: 'Sonoras Mil',
    subtitle: 'Just Rockers!',
    verified_status: 0,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_sm.jpg',
    description: 'Sonoras mil is the project of Colombian musician Felipe Gómez Ossa. The music is a fresh mix of Dub',
  },
  {
    id: '15',
    name: 'La 33',
    subtitle: 'Salsa bogotana',
    verified_status: 1,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_33.jpg',
    description: 'Salsa, boogaloo, Funk, jazz and folk. https://linkr.bio/la-33',
  },
  {
    id: '16',
    name: 'Los Cañaverales del Bohío',
    subtitle: 'El piano de la selva',
    verified_status: 2,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_cb.jpg',
    description:
      'Por su destreza y maestría en la interpretación de la Marimba de Chonta, a José Antonio Torres Solís se le conocía como el “Maestro Gualajo” o el “Pianista de la Selva”. La estrecha relación con este instrumento inició desde los 15 años, cuando construyo y diseñó su primera marimba.',
  },
  {
    id: '17',
    name: 'LauraMare',
    subtitle: 'Cantautora',
    verified_status: 0,
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_lm.jpg',
    description:
      'Mi falda tiene espinas, es el primer sencillo de LauraMare cantautora, comunicadora y productora cultural de Marediagua Producciones en Medellín, con una trayectoria de más de 20 años como intérprete - Todo es política',
  },
];

const availablePlacesComplete = [
  {
    id: '1',
    name: 'Matik Matik',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_mm.png',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '2',
    name: 'Teatro Jorge Eliécer Gaitán',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_tjeg.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '3',
    name: 'Galería Café Libro 93',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_gcl.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '4',
    name: 'Galería Café Libro Palermo',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_gcl.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '5',
    name: 'La Pascasia',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_lp.png',
    city: 'Medellín',
    country: 'Colombia',
  },
  {
    id: '6',
    name: 'Sonora Casa Cultural',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_sccc.jpg',
    city: 'Cali',
    country: 'Colombia',
  },
  {
    id: '7',
    name: 'Casa Kilele',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_ck.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '8',
    name: 'Disco Jaguar',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_dj.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '9',
    name: 'Cuban Jazz',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_cj.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '10',
    name: 'PuraPizza',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_ppjazz.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '11',
    name: 'Latino Power',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_latp.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '12',
    name: 'Boogaloop CLUB',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_b.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '13',
    name: 'Café cinema La resistencia',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_cc.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '14',
    name: 'El Goce Pagano',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_egp.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '15',
    name: 'Salsa Camará',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_sc.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '16',
    name: "Longo's",
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_sl.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '17',
    name: 'Café Vallejo',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_cv.png',
    city: 'Medellín',
    country: 'Colombia',
  },
  {
    id: '18',
    name: 'Revellion Bar',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_r.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '19',
    name: 'Jackass Rock Bar',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_j.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '20',
    name: 'El anónimo',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_ea.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '21',
    name: 'Son Havana',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_sh.jpg',
    city: 'Medellín',
    country: 'Colombia',
  },
  {
    id: '22',
    name: 'Teatro Charlot',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_tc.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '23',
    name: 'A seis manos',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_a6m.jpg',
    city: 'Bogotá DC',
    country: 'Colombia',
  },
  {
    id: '60',
    name: 'Casa Astor',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_astor.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '69',
    name: 'Café Berlín',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Madrid',
    country: 'España',
  },
  {
    id: '89',
    name: 'Marula Café Barcelona',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '90',
    name: 'Big bang bar',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_bbb.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '91',
    name: 'Paral·lel 62',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_parallel.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '118',
    name: 'La Mole',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_lamole.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '205',
    name: "Ciro's Pizza Pomodoro",
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_londres_ciros.jpg',
    city: 'Londres',
    country: 'Inglaterra',
  },
  {
    id: '206',
    name: 'TAm Temple Of Art & Music',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_londres_tam.jpg',
    city: 'Londres',
    country: 'Inglaterra',
  },
  {
    id: '207',
    name: 'The Blues Kitchen Camden',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_londres_bluesk.jpg',
    city: 'Londres',
    country: 'Inglaterra',
  },
  {
    id: '218',
    name: 'La Gaia',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_lagaia.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '234',
    name: 'Sidecar Barcelona',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_sidecar.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '247',
    name: 'Soda Acústica',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_soda.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '257',
    name: 'Jamboree Jazz',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_jamboree.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '266',
    name: 'Bar La Raíz',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_laraiz.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '291',
    name: 'espai ku',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '314',
    name: 'Milano Jazz Club',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '321',
    name: 'CCDEA La Parcería',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Madrid',
    country: 'España',
  },
  {
    id: '336',
    name: 'Susurro',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '342',
    name: 'Razzmatazz Club',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_bcn_razzmatazz.jpg',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '343',
    name: 'Matisse Club',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Valencia',
    country: 'España',
  },
  {
    id: '345',
    name: 'Sala Stereo Alicante',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Alicante',
    country: 'España',
  },
  {
    id: '346',
    name: 'Taberna J&J Granada',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Granada',
    country: 'España',
  },
  {
    id: '347',
    name: 'Sala Funclub',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Sevilla',
    country: 'España',
  },
  {
    id: '348',
    name: 'Nazca Music Live',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Madrid',
    country: 'España',
  },
  {
    id: '349',
    name: 'Sala Mon Live',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Madrid',
    country: 'España',
  },
  {
    id: '350',
    name: 'Copernico',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_madrid_copernico.jpg',
    city: 'Madrid',
    country: 'España',
  },
  {
    id: '394',
    name: 'Notting Hill Arts Club',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_londres_nhac.jpg',
    city: 'Londres',
    country: 'Inglaterra',
  },
  {
    id: '396',
    name: 'Sinestesia',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '403',
    name: '16 Toneladas Rock Club',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Valencia',
    country: 'España',
  },
  {
    id: '404',
    name: 'La Nau',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '405',
    name: 'Cooperativa Ítaca',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Murcia',
    country: 'España',
  },
  {
    id: '406',
    name: 'Sala Creedence',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Zaragoza',
    country: 'España',
  },
  {
    id: '414',
    name: 'Calvario Bar',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Madrid',
    country: 'España',
  },
  {
    id: '415',
    name: 'Rosazul',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '426',
    name: 'Ronda Barcelona',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
  {
    id: '427',
    name: 'The Post Bar',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_londres_postbar.jpg',
    city: 'Londres',
    country: 'Inglaterra',
  },
  {
    id: '442',
    name: 'The Cavern Club',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Liverpool',
    country: 'Inglaterra',
  },
  {
    id: '464',
    name: 'Sala El Sol',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Madrid',
    country: 'España',
  },
  {
    id: '466',
    name: 'The Jacaranda',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Liverpool',
    country: 'Inglaterra',
  },
  {
    id: '480',
    name: 'Espacio Mumuki',
    profile_pic: 'https://npcarlos.co/artistsHive_mocks/profile_default_place.png',
    city: 'Barcelona',
    country: 'España',
  },
];

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const EventCreatePage = () => {
  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [availableGenders, updateAvailableGenders] = useState([]);
  const [availableAllergies, updateAvailableAllergies] = useState([]);
  const [availableBloodGroups, updateAvailableBloodGroups] = useState([]);
  const [availableDietaryRestritions, updateAvailableDietaryRestrictions] = useState([]);
  const [availableArtists, updateAvailableArtists] = useState([]);
  const [availablePlaces, updateAvailablePlaces] = useState([]);

  const [selectedArtists, updateSelectedArtists] = useState([]);
  const [selectedPlaces, updateSelectedPlaces] = useState([]);

  useEffect(() => {
    const langsOR = [
      { label: 'ES', value: 'es', selected: false },
      { label: 'DE', value: 'de' },
      { label: 'FR', value: 'fr' },
      { label: 'PT', value: 'pt' },
    ];
    let langs = [...langsOR];

    Array(20)
      .fill('x')
      .forEach((valu, number) =>
        langsOR.forEach((lng) =>
          langs.push({
            label: `${lng.label}${number}`,
            value: `${lng.value}${number}`,
            selected: Math.random() > 1 - 10 / 100,
          })
        )
      );

    updateAvailableLanguages(langs);
    updateAvailableGenres([
      { label: 'Cumbia', value: 'genre1' },
      { label: 'Reggaetón', value: 'genre2' },
      { label: 'Rock', value: 'genre3', selected: true },
      { label: 'Jazz', value: 'genr4' },
    ]);

    //
    const groupList = ['A', 'B', 'AB', 'O'];
    const fullGroup = groupList.map((group) => {
      return [`${group}+`, `${group}-`];
    });
    const defaultBloodGroup = 'O+';
    updateAvailableBloodGroups(
      fullGroup.flat().map((group) => {
        let bloodGroup: SelectOption = { label: group, value: group };
        if (group === defaultBloodGroup) {
          bloodGroup = { ...bloodGroup, selected: true };
        }
        return bloodGroup;
      })
    );

    updateAvailableAllergies([
      { label: 'Polen', value: 'Polen' },
      { label: 'Polvo', value: 'Polvo' },
      { label: 'Leche', value: 'Leche' },
      { label: 'Maní', value: 'Maní' },
      { label: 'Gluten', value: 'Gluten' },
      { label: 'Ibuprofeno', value: 'Ibuprofeno' },
      { label: 'Perros', value: 'Perros' },
      { label: 'Gatos', value: 'Gatos' },
    ]);

    updateAvailableGenders([
      { label: 'Man', value: 'male' },
      { label: 'Woman', value: 'female' },
      { label: 'Non binary', value: 'non_binary' },
      { label: 'Non specified', value: 'non_specified' },
    ]);

    updateAvailableDietaryRestrictions([
      { label: 'None', value: 'none' },
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Celiac', value: 'celiac' },
    ]);

    updateAvailableArtists(availableArtistsComplete);
    updateAvailablePlaces(availablePlacesComplete);
  }, []);

  const handlers = {
    onSubmit: (data: any, error?: any) => {
      console.log('#####----------->>>>  !!! ', data);
    },
    onChangecountry: (data: any) => {
      console.log('#####----------->>>>  !!! ', data);
      // const ciudades =
      //   !!data &&
      //   !!data.value &&
      //   Object.keys(provincias).indexOf(data?.value) >= 0
      //     ? provincias[data.value as keyof typeof provincias]
      //     : [];
      // const provinceField = fields.find(
      //   (fieldData) => fieldData.fieldName === "province"
      // );
      // provinceField.options = ciudades;
      // // provinceField.defaultValue =
      // //   (ciudades && ciudades.length && ciudades[1].value) || "";

      // updateFields(fields);
      // updateCiudades(ciudades);
    },
    place_onChange: async (data: any) => {
      // console.log('antes de sleep');

      const searchedText = data?.target?.value?.trim().toLowerCase() || '';
      // await sleep(2e3);
      const filteredPlaces = availablePlacesComplete.filter((place) => place.name.toLowerCase().includes(searchedText));

      console.log(searchedText, searchedText.length, filteredPlaces);
      updateAvailablePlaces(filteredPlaces);
      // console.log('FILTER PLACE', data);
    },
    main_artists_onChange: async (data: any) => {
      const searchedText = data?.target?.value?.trim().toLowerCase() || '';

      const filteredArtists = availableArtistsComplete.filter((artist) =>
        artist.name.toLowerCase().includes(searchedText)
      );

      updateAvailableArtists(filteredArtists);
    },
  };

  return (
    <>
      <DynamicTabbedForm
        tabsInfo={EVENT_DETAIL_SUB_PAGE_CONFIG}
        handlers={handlers}
        translationBasePath={TRANSLATION_BASE_EVENT_DETAILS_PAGE}
        entityType={AppUserModel.name}
        fieldOptions={{
          allergies: availableAllergies,
          blood_group: availableBloodGroups,
          dietary_restrictions: availableDietaryRestritions,
          gender: availableGenders,
          genres: availableGenres,
          user_language: availableLanguages,
          spoken_languages: availableLanguages,
          stage_languages: availableLanguages,
        }}
        externalData={{
          main_artists: { options: availableArtists },
          place: { options: availablePlaces },
        }}
      />
    </>
  );
};

export default EventCreatePage;
