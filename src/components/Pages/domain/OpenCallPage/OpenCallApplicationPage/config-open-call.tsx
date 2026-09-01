import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';

export const TRANSLATION_BASE_OPEN_CALL_PAGE = 'app.pages.OpenCallPage';

// ─── Option lists ───

export const MUSIC_GENRE_OPTIONS = [
  { label: 'Rock', value: 'rock' },
  { label: 'Pop', value: 'pop' },
  { label: 'Jazz', value: 'jazz' },
  { label: 'Blues', value: 'blues' },
  { label: 'Hip Hop', value: 'hip_hop' },
  { label: 'R&B', value: 'rnb' },
  { label: 'Reggae', value: 'reggae' },
  { label: 'Reggaetón', value: 'reggaeton' },
  { label: 'Cumbia', value: 'cumbia' },
  { label: 'Salsa', value: 'salsa' },
  { label: 'Electrónica', value: 'electronica' },
  { label: 'Folk', value: 'folk' },
  { label: 'Metal', value: 'metal' },
  { label: 'Punk', value: 'punk' },
  { label: 'Indie', value: 'indie' },
  { label: 'Clásica', value: 'clasica' },
  { label: 'Latina', value: 'latina' },
  { label: 'World Music', value: 'world_music' },
  { label: 'Otro', value: 'otro' },
];

export const PROJECT_TYPE_OPTIONS = [
  { label: 'Solista', value: 'soloist' },
  { label: 'Dúo', value: 'duo' },
  { label: 'Trío', value: 'trio' },
  { label: 'Banda (4-6)', value: 'band_small' },
  { label: 'Banda (7+)', value: 'band_large' },
  { label: 'Orquesta', value: 'orchestra' },
  { label: 'DJ / Productor', value: 'dj' },
  { label: 'Colectivo artístico', value: 'collective' },
];

export const CURRENCY_OPTIONS = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'COP', value: 'COP' },
  { label: 'MXN', value: 'MXN' },
  { label: 'ARS', value: 'ARS' },
  { label: 'BRL', value: 'BRL' },
  { label: 'CLP', value: 'CLP' },
  { label: 'PEN', value: 'PEN' },
  { label: 'GBP', value: 'GBP' },
];

export const AVAILABILITY_OPTIONS = [
  { label: 'Cualquier fecha', value: 'any' },
  { label: 'Solo fines de semana', value: 'weekends' },
  { label: 'Solo entre semana', value: 'weekdays' },
  { label: 'Fechas específicas (indicar en observaciones)', value: 'specific' },
];

export const FEE_INCLUDES_OPTIONS = [
  { label: 'Solo show', value: 'show_only' },
  { label: 'Show + transporte', value: 'show_transport' },
  { label: 'Show + transporte + hospedaje', value: 'show_transport_hotel' },
  { label: 'Todo incluido', value: 'all_inclusive' },
];

export const TRAVEL_OPTIONS = [
  { label: 'No, somos locales', value: 'no' },
  { label: 'Sí, transporte terrestre', value: 'ground' },
  { label: 'Sí, vuelos nacionales', value: 'domestic_flight' },
  { label: 'Sí, vuelos internacionales', value: 'international_flight' },
];

export const ACCOMMODATION_OPTIONS = [
  { label: 'No', value: 'no' },
  { label: 'Sí, 1 noche', value: '1_night' },
  { label: 'Sí, 2 noches', value: '2_nights' },
  { label: 'Sí, 3+ noches', value: '3_plus_nights' },
];

// ─── Step metadata ───

export interface OpenCallStepMeta {
  title: string;
  description: string;
}

export const OPEN_CALL_STEP_META: Record<string, OpenCallStepMeta> = {
  general: {
    title: 'General',
    description: 'Cuéntanos sobre tu proyecto artístico y cómo contactarte.',
  },
  multimedia: {
    title: 'Multimedia',
    description: 'Comparte enlaces a tu música, videos y redes sociales.',
  },
  show: {
    title: 'Show',
    description: 'Describe tu propuesta de show en vivo.',
  },
  technical: {
    title: 'Técnico',
    description: 'Detalla tus necesidades técnicas para la presentación.',
  },
  logistics: {
    title: 'Logística',
    description: 'Información sobre costos, transporte y hospedaje.',
  },
};

// ─── Page config ───

export const OPEN_CALL_PAGE_CONFIG: PageSection[] = [
  // ─── Step 1: General ───
  {
    name: 'general',
    title: OPEN_CALL_STEP_META.general.title,
    sections: [
      // {
      //   name: 'artist_info',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [
      //           // {
      //           //   name: 'artist_name',
      //           //   title: 'Nombre del proyecto / Artista',
      //           //   formMetaData: {
      //           //     inputType: 'text',
      //           //     config: {
      //           //       required: true,
      //           //       minLength: { value: 2, message: 'Mínimo 2 caracteres' },
      //           //     },
      //           //     componentParams: { placeholder: 'Ej: Los Amplificadores' },
      //           //   },
      //           // },
      //           // {
      //           //   name: 'manager_name',
      //           //   title: 'Nombre del representante / Manager',
      //           //   formMetaData: {
      //           //     inputType: 'text',
      //           //     componentParams: { placeholder: 'Nombre completo del contacto' },
      //           //   },
      //           // },
      //           // {
      //           //   name: 'country',
      //           //   title: 'País de origen',
      //           //   formMetaData: {
      //           //     inputType: 'text',
      //           //     config: { required: 'Este campo es obligatorio' },
      //           //     componentParams: { placeholder: 'Ej: Colombia' },
      //           //   },
      //           // },
      //           // {
      //           //   name: 'city',
      //           //   title: 'Ciudad de origen',
      //           //   formMetaData: {
      //           //     inputType: 'text',
      //           //     config: { required: 'Este campo es obligatorio' },
      //           //     componentParams: { placeholder: 'Ej: Bogotá' },
      //           //   },
      //           // },
      //         ],
      //       },
      //     },
      //   ],
      // },
      {
        name: 'contact',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'email',
                  title: 'Correo electrónico',
                  formMetaData: {
                    inputType: 'text',
                    config: {
                      required: 'Este campo es obligatorio',
                      pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
                    },
                    componentParams: { placeholder: 'correo@ejemplo.com' },
                  },
                },
                {
                  name: 'phone',
                  title: 'Teléfono / WhatsApp',
                  formMetaData: {
                    inputType: 'tel',
                    config: { required: 'Este campo es obligatorio' },
                    componentParams: { placeholder: '+57 300 123 4567' },
                  },
                },
              ],
            },
          },
        ],
      },
      // {
      //   name: 'project',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [
      //           {
      //             name: 'genre',
      //             title: 'Género musical principal',
      //             formMetaData: {
      //               inputType: 'select',
      //               config: { required: 'Este campo es obligatorio' },
      //               componentParams: { placeholder: 'Selecciona un género', options: MUSIC_GENRE_OPTIONS },
      //             },
      //           },
      //           {
      //             name: 'project_type',
      //             title: 'Tipo de proyecto',
      //             formMetaData: {
      //               inputType: 'select',
      //               config: { required: 'Este campo es obligatorio' },
      //               componentParams: { placeholder: 'Selecciona el tipo', options: PROJECT_TYPE_OPTIONS },
      //             },
      //           },
      //           {
      //             name: 'synopsis',
      //             title: 'Sinopsis del espectáculo',
      //             formMetaData: {
      //               inputType: 'textarea',
      //               componentParams: {
      //                 placeholder: 'Describe brevemente tu propuesta artística...',
      //                 maxLength: 150,
      //                 rows: 3,
      //               },
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
    ],
  },

  // ─── Step 2: Multimedia ───
  // {
  //   name: 'multimedia',
  //   title: OPEN_CALL_STEP_META.multimedia.title,
  //   sections: [
  //     // {
  //     //   name: 'links',
  //     //   components: [
  //     //     {
  //     //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
  //     //       // data: {
  //     //       //   attributes: [
  //     //       //     {
  //     //       //       name: 'music_link',
  //     //       //       title: 'Enlace a tu música',
  //     //       //       formMetaData: {
  //     //       //         inputType: 'url',
  //     //       //         config: { required: 'Incluye al menos un enlace a tu música' },
  //     //       //         componentParams: { placeholder: 'https://open.spotify.com/artist/...' },
  //     //       //       },
  //     //       //     },
  //     //       //     {
  //     //       //       name: 'video_link',
  //     //       //       title: 'Video en vivo',
  //     //       //       formMetaData: {
  //     //       //         inputType: 'url',
  //     //       //         config: { required: 'Incluye un video de tu presentación en vivo' },
  //     //       //         componentParams: { placeholder: 'https://youtube.com/watch?v=...' },
  //     //       //       },
  //     //       //     },
  //     //       //     {
  //     //       //       name: 'social_instagram',
  //     //       //       title: 'Instagram',
  //     //       //       formMetaData: {
  //     //       //         inputType: 'url',
  //     //       //         componentParams: { placeholder: 'https://instagram.com/tuartista' },
  //     //       //       },
  //     //       //     },
  //     //       //     {
  //     //       //       name: 'social_facebook',
  //     //       //       title: 'Facebook',
  //     //       //       formMetaData: {
  //     //       //         inputType: 'url',
  //     //       //         componentParams: { placeholder: 'https://facebook.com/tuartista' },
  //     //       //       },
  //     //       //     },
  //     //       //     {
  //     //       //       name: 'social_tiktok',
  //     //       //       title: 'TikTok',
  //     //       //       formMetaData: {
  //     //       //         inputType: 'url',
  //     //       //         componentParams: { placeholder: 'https://tiktok.com/@tuartista' },
  //     //       //       },
  //     //       //     },
  //     //       //     {
  //     //       //       name: 'website',
  //     //       //       title: 'Sitio web',
  //     //       //       formMetaData: {
  //     //       //         inputType: 'url',
  //     //       //         componentParams: { placeholder: 'https://www.tuartista.com' },
  //     //       //       },
  //     //       //     },
  //     //       //   ],
  //     //       // },
  //     //     },
  //     //   ],
  //     // },
  //     {
  //       name: 'files',
  //       components: [
  //         {
  //           componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
  //           data: {
  //             attributes: [
  //               // {
  //               //   name: 'press_kit',
  //               //   title: 'Press kit / EPK',
  //               //   formMetaData: {
  //               //     inputType: 'file',
  //               //     componentParams: { accept: '.pdf,image/*', multipleFiles: false },
  //               //   },
  //               // },
  //               // {
  //               //   name: 'photos',
  //               //   title: 'Fotos promocionales',
  //               //   formMetaData: {
  //               //     inputType: 'file',
  //               //     componentParams: { accept: 'image/*', multipleFiles: true },
  //               //   },
  //               // },
  //             ],
  //           },
  //         },
  //       ],
  //     },
  //   ],
  // },

  // ─── Step 3: Show ───
  {
    name: 'show',
    title: OPEN_CALL_STEP_META.show.title,
    sections: [
      {
        name: 'performance',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'show_duration',
                  title: 'Duración del show (minutos)',
                  formMetaData: {
                    inputType: 'number',
                    config: { required: 'Este campo es obligatorio', min: { value: 15, message: 'Mínimo 15 minutos' } },
                    componentParams: { placeholder: 'Ej: 60' },
                  },
                },
                // {
                //   name: 'members_on_stage',
                //   title: 'Miembros en escenario',
                //   formMetaData: {
                //     inputType: 'number',
                //     config: { required: 'Este campo es obligatorio', min: { value: 1, message: 'Mínimo 1' } },
                //     componentParams: { placeholder: 'Ej: 4' },
                //   },
                // },
                {
                  name: 'show_description',
                  title: 'Descripción del show',
                  formMetaData: {
                    inputType: 'textarea',
                    config: { required: 'Describe brevemente tu show' },
                    componentParams: {
                      placeholder: 'Describe qué puede esperar el público de tu presentación en vivo...',
                      rows: 4,
                    },
                  },
                },
                {
                  name: 'setlist_sample',
                  title: 'Setlist de ejemplo',
                  formMetaData: {
                    inputType: 'textarea',
                    componentParams: { placeholder: '1. Canción de apertura\n2. ...\n3. ...', rows: 4 },
                  },
                },
                // {
                //   name: 'past_events',
                //   title: 'Eventos anteriores',
                //   formMetaData: {
                //     inputType: 'textarea',
                //     componentParams: { placeholder: 'Ej: Rock al Parque 2024, Festival Estéreo Picnic...', rows: 3 },
                //   },
                // },
                // {
                //   name: 'availability',
                //   title: 'Disponibilidad',
                //   formMetaData: {
                //     inputType: 'select',
                //     config: { required: 'Este campo es obligatorio' },
                //     componentParams: { placeholder: 'Selecciona tu disponibilidad', options: AVAILABILITY_OPTIONS },
                //   },
                // },
              ],
            },
          },
        ],
      },
    ],
  },

  // ─── Step 4: Técnico ───
  {
    name: 'technical',
    title: OPEN_CALL_STEP_META.technical.title,
    sections: [
      // {
      //   name: 'requirements',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [
      //           {
      //             name: 'sound_requirements',
      //             title: 'Requerimientos de sonido',
      //             formMetaData: {
      //               inputType: 'textarea',
      //               config: { required: 'Indica tus requerimientos de sonido' },
      //               componentParams: {
      //                 placeholder: 'Ej: 4 monitores de piso, 2 DI box, mesa de mezclas de 16 canales...',
      //                 rows: 4,
      //               },
      //             },
      //           },
      //           {
      //             name: 'backline_requirements',
      //             title: 'Requerimientos de backline',
      //             formMetaData: {
      //               inputType: 'textarea',
      //               componentParams: {
      //                 placeholder: 'Ej: Batería completa, amplificador de bajo, 2 amplificadores de guitarra...',
      //                 rows: 4,
      //               },
      //             },
      //           },
      //           {
      //             name: 'lighting_requirements',
      //             title: 'Requerimientos de iluminación',
      //             formMetaData: {
      //               inputType: 'textarea',
      //               componentParams: { placeholder: 'Ej: Luces de colores, máquina de humo, seguidor...', rows: 3 },
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
      {
        name: 'timing',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'setup_time',
                  title: 'Tiempo de montaje (minutos)',
                  formMetaData: {
                    inputType: 'number',
                    componentParams: { placeholder: 'Ej: 30' },
                  },
                },
                {
                  name: 'soundcheck_time',
                  title: 'Tiempo de soundcheck (minutos)',
                  formMetaData: {
                    inputType: 'number',
                    componentParams: { placeholder: 'Ej: 20' },
                  },
                },
              ],
            },
          },
        ],
      },
      // {
      //   name: 'rider_files',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [
      //           // {
      //           //   name: 'technical_rider',
      //           //   title: 'Rider técnico (PDF)',
      //           //   formMetaData: {
      //           //     inputType: 'file',
      //           //     componentParams: { accept: '.pdf', multipleFiles: false },
      //           //   },
      //           // },
      //           // {
      //           //   name: 'stage_plot_file',
      //           //   title: 'Stage plot',
      //           //   formMetaData: {
      //           //     inputType: 'file',
      //           //     componentParams: { accept: '.pdf,image/*', multipleFiles: false },
      //           //   },
      //           // },
      //         ],
      //       },
      //     },
      //   ],
      // },
    ],
  },

  // ─── Step 5: Logística ───
  {
    name: 'logistics',
    title: OPEN_CALL_STEP_META.logistics.title,
    sections: [
      // {
      //   name: 'fees',
      //   components: [
      //     {
      //       componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
      //       data: {
      //         attributes: [
      //           {
      //             name: 'fee_currency',
      //             title: 'Moneda',
      //             formMetaData: {
      //               inputType: 'select',
      //               config: { required: 'Selecciona una moneda' },
      //               componentParams: { placeholder: 'Selecciona la moneda', options: CURRENCY_OPTIONS },
      //             },
      //           },
      //           {
      //             name: 'fee_amount',
      //             title: 'Tarifa',
      //             formMetaData: {
      //               inputType: 'number',
      //               config: { required: 'Indica tu tarifa' },
      //               componentParams: { placeholder: 'Ej: 2500' },
      //             },
      //           },
      //           {
      //             name: 'fee_includes',
      //             title: 'La tarifa incluye',
      //             formMetaData: {
      //               inputType: 'select',
      //               config: { required: 'Este campo es obligatorio' },
      //               componentParams: { placeholder: 'Selecciona una opción', options: FEE_INCLUDES_OPTIONS },
      //             },
      //           },
      //         ],
      //       },
      //     },
      //   ],
      // },
      {
        name: 'travel',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'needs_travel',
                  title: 'Necesita transporte',
                  formMetaData: {
                    inputType: 'select',
                    config: { required: 'Este campo es obligatorio' },
                    componentParams: { placeholder: 'Selecciona una opción', options: TRAVEL_OPTIONS },
                  },
                },
                // {
                //   name: 'needs_accommodation',
                //   title: 'Necesita hospedaje',
                //   formMetaData: {
                //     inputType: 'select',
                //     config: { required: 'Este campo es obligatorio' },
                //     componentParams: { placeholder: 'Selecciona una opción', options: ACCOMMODATION_OPTIONS },
                //   },
                // },
                {
                  name: 'crew_count',
                  title: 'Personas en el crew',
                  formMetaData: {
                    inputType: 'number',
                    componentParams: { placeholder: 'Ej: 2' },
                  },
                },
              ],
            },
          },
        ],
      },
      {
        name: 'additional',
        components: [
          {
            componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'hospitality_requirements',
                  title: 'Requerimientos de hospitalidad',
                  formMetaData: {
                    inputType: 'textarea',
                    componentParams: {
                      placeholder: 'Ej: Agua, comida para 6 personas, restricciones alimentarias...',
                      rows: 3,
                    },
                  },
                },
                {
                  name: 'additional_notes',
                  title: 'Notas adicionales',
                  formMetaData: {
                    inputType: 'textarea',
                    componentParams: {
                      placeholder: 'Cualquier información adicional relevante para tu aplicación...',
                      rows: 4,
                    },
                  },
                },
              ],
            },
          },
        ],
      },
    ],
  },
];
