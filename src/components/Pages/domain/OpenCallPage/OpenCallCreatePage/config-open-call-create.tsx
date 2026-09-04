import { ComponentTypes, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import {
  ACCOMMODATION_OPTIONS,
  CURRENCY_OPTIONS,
  MUSIC_GENRE_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  TRAVEL_OPTIONS,
} from '../OpenCallApplicationPage/config-open-call';

export const TRANSLATION_BASE_OPEN_CALL_CREATE_PAGE = 'app.pages.OpenCallCreatePage';

// ─── Option lists (create-specific) ───

export const MEALS_OPTIONS = [
  { label: 'No', value: 'no' },
  { label: 'Solo artistas', value: 'artists_only' },
  { label: 'Artistas + crew', value: 'artists_crew' },
  { label: 'Todos los participantes', value: 'all' },
];

// ─── Step metadata ───

export interface CreateOpenCallStepMeta {
  title: string;
  description: string;
}

export const CREATE_OPEN_CALL_STEP_META: Record<string, CreateOpenCallStepMeta> = {
  event_info: {
    title: 'Información del Evento',
    description: 'Datos básicos sobre el evento y la convocatoria.',
  },
  open_call_details: {
    title: 'Convocatoria',
    description: 'Define los géneros, tipos de proyecto y fechas de la convocatoria.',
  },
  stage: {
    title: 'Escenario',
    description: 'Describe el escenario y las características del show.',
  },
  technical: {
    title: 'Técnico',
    description: 'Indica el equipo técnico disponible para los artistas.',
  },
  logistics: {
    title: 'Logística',
    description: 'Información sobre compensación, transporte y hospedaje.',
  },
};

// ─── Page config ───

export interface OpenCallCreateConfigParams {
  eventTypeOptions: SelectOption[];
  stageTypeOptions: SelectOption[];
}

export const getOpenCallCreateConfig = (params: OpenCallCreateConfigParams): PageSection[] => {
  const { eventTypeOptions, stageTypeOptions } = params;

  return [
    // ─── Step 1: Información del Evento ───
    {
      name: 'event_info',
      title: CREATE_OPEN_CALL_STEP_META.event_info.title,
      sections: [
        {
          name: 'basic_info',
          components: [
            {
              componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
              data: {
                attributes: [
                  {
                    name: 'event_name',
                    title: 'Nombre del evento',
                    formMetaData: {
                      inputType: 'text',
                      config: {
                        required: 'Este campo es obligatorio',
                        minLength: { value: 3, message: 'Mínimo 3 caracteres' },
                      },
                      componentParams: { placeholder: 'Ej: Festival Rock en el Parque 2026' },
                    },
                  },
                  {
                    name: 'event_type',
                    title: 'Tipo de evento',
                    formMetaData: {
                      inputType: 'select',
                      componentParams: { placeholder: 'Selecciona el tipo de evento', options: eventTypeOptions },
                    },
                  },
                  {
                    name: 'event_date',
                    title: 'Fecha del evento',
                    formMetaData: {
                      inputType: 'date',
                      config: { required: 'Este campo es obligatorio' },
                      componentParams: { placeholder: 'Fecha del evento' },
                    },
                  },
                  // {
                  //   name: 'event_location',
                  //   title: 'Lugar / Venue',
                  //   formMetaData: {
                  //     inputType: 'text',
                  //     config: { required: 'Este campo es obligatorio' },
                  //     componentParams: { placeholder: 'Ej: Parque Simón Bolívar' },
                  //   },
                  // },
                  // {
                  //   name: 'city',
                  //   title: 'Ciudad',
                  //   formMetaData: {
                  //     inputType: 'text',
                  //     config: { required: 'Este campo es obligatorio' },
                  //     componentParams: { placeholder: 'Ej: Bogotá' },
                  //   },
                  // },
                  // {
                  //   name: 'country',
                  //   title: 'País',
                  //   formMetaData: {
                  //     inputType: 'text',
                  //     config: { required: 'Este campo es obligatorio' },
                  //     componentParams: { placeholder: 'Ej: Colombia' },
                  //   },
                  // },
                  {
                    name: 'description',
                    title: 'Descripción del evento',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: {
                        placeholder: 'Describe brevemente el evento y lo que buscas en los artistas...',
                        rows: 4,
                      },
                    },
                  },
                  {
                    name: 'event_image',
                    title: 'Imagen del evento',
                    formMetaData: {
                      inputType: 'file',
                      componentParams: {
                        multipleFiles: false,
                        accept: 'image/*',
                        destinationPath: 'images/open-calls',
                        filesDataType: 'event_image',
                        fieldTranslationName: 'event_image',
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

    // ─── Step 2: Convocatoria ───
    {
      name: 'open_call_details',
      title: CREATE_OPEN_CALL_STEP_META.open_call_details.title,
      sections: [
        {
          name: 'call_config',
          components: [
            {
              componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
              data: {
                attributes: [
                  {
                    name: 'genres',
                    title: 'Géneros musicales aceptados',
                    formMetaData: {
                      inputType: 'autocompletePicker',
                      componentParams: {
                        placeholder: 'Selecciona los géneros musicales',
                        options: MUSIC_GENRE_OPTIONS,
                      },
                    },
                  },
                  {
                    name: 'accepted_project_types',
                    title: 'Tipos de proyecto aceptados',
                    formMetaData: {
                      inputType: 'autocompletePicker',
                      componentParams: {
                        placeholder: 'Selecciona los tipos de proyecto',
                        options: PROJECT_TYPE_OPTIONS,
                      },
                    },
                  },
                  {
                    name: 'start_date',
                    title: 'Fecha de apertura',
                    formMetaData: {
                      inputType: 'date',
                      config: { required: 'Este campo es obligatorio' },
                      componentParams: { placeholder: 'Fecha de apertura de la convocatoria' },
                    },
                  },
                  {
                    name: 'end_date',
                    title: 'Fecha de cierre',
                    formMetaData: {
                      inputType: 'date',
                      config: { required: 'Este campo es obligatorio' },
                      componentParams: { placeholder: 'Fecha de cierre de la convocatoria' },
                    },
                  },
                  {
                    name: 'available_slots',
                    title: 'Cupos disponibles',
                    formMetaData: {
                      inputType: 'number',
                      componentParams: { placeholder: 'Ej: 10 (dejar vacío si no hay límite)' },
                    },
                  },
                  {
                    name: 'requirements_description',
                    title: 'Requisitos especiales',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: {
                        placeholder: 'Requisitos o condiciones especiales para los artistas...',
                        maxLength: 500,
                        rows: 3,
                      },
                    },
                  },
                  {
                    name: 'selection_criteria',
                    title: 'Criterios de selección',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: {
                        placeholder: 'Describe cómo se seleccionarán los artistas...',
                        maxLength: 500,
                        rows: 3,
                      },
                    },
                  },
                  {
                    name: 'set_duration_min',
                    title: 'Duración mínima del set (min)',
                    formMetaData: {
                      inputType: 'number',
                      config: { min: { value: 10, message: 'Mínimo 10 minutos' } },
                      componentParams: { placeholder: 'Ej: 30' },
                    },
                  },
                  {
                    name: 'set_duration_max',
                    title: 'Duración máxima del set (min)',
                    formMetaData: {
                      inputType: 'number',
                      componentParams: { placeholder: 'Ej: 60' },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },

    // ─── Step 3: Escenario ───
    {
      name: 'stage',
      title: CREATE_OPEN_CALL_STEP_META.stage.title,
      sections: [
        {
          name: 'stage_info',
          components: [
            {
              componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
              data: {
                attributes: [
                  {
                    name: 'stage_type',
                    title: 'Tipo de escenario',
                    formMetaData: {
                      inputType: 'select',
                      componentParams: { placeholder: 'Selecciona el tipo de escenario', options: stageTypeOptions },
                    },
                  },
                  {
                    name: 'stage_dimensions',
                    title: 'Dimensiones del escenario',
                    formMetaData: {
                      inputType: 'text',
                      componentParams: { placeholder: 'Ej: 8m x 6m' },
                    },
                  },
                  {
                    name: 'expected_audience',
                    title: 'Audiencia esperada',
                    formMetaData: {
                      inputType: 'number',
                      componentParams: { placeholder: 'Ej: 500' },
                    },
                  },
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
      title: CREATE_OPEN_CALL_STEP_META.technical.title,
      sections: [
        {
          name: 'provided_equipment',
          components: [
            {
              componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
              data: {
                attributes: [
                  {
                    name: 'provided_sound',
                    title: 'Equipo de sonido disponible',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: {
                        placeholder: 'Ej: PA system, monitores de piso, mesa de mezcla de 32 canales...',
                        rows: 4,
                      },
                    },
                  },
                  {
                    name: 'provided_backline',
                    title: 'Backline disponible',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: {
                        placeholder: 'Ej: Batería completa, amplificadores de guitarra y bajo...',
                        rows: 4,
                      },
                    },
                  },
                  {
                    name: 'provided_lighting',
                    title: 'Iluminación disponible',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: { placeholder: 'Ej: Luces LED, seguidor, máquina de humo...', rows: 3 },
                    },
                  },
                  {
                    name: 'technical_notes',
                    title: 'Notas técnicas adicionales',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: { placeholder: 'Notas adicionales sobre el equipo técnico...', rows: 3 },
                    },
                  },
                ],
              },
            },
          ],
        },
      ],
    },

    // ─── Step 5: Logística ───
    {
      name: 'logistics',
      title: CREATE_OPEN_CALL_STEP_META.logistics.title,
      sections: [
        {
          name: 'compensation',
          components: [
            {
              componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
              data: {
                attributes: [
                  {
                    name: 'fee_currency',
                    title: 'Moneda',
                    formMetaData: {
                      inputType: 'select',
                      componentParams: { placeholder: 'Selecciona la moneda', options: CURRENCY_OPTIONS },
                    },
                  },
                  {
                    name: 'fee_amount',
                    title: 'Tarifa ofrecida por artista',
                    formMetaData: {
                      inputType: 'number',
                      componentParams: { placeholder: 'Ej: 2500' },
                    },
                  },
                  {
                    name: 'fee_negotiable',
                    title: 'Tarifa negociable',
                    formMetaData: {
                      inputType: 'switch',
                      componentParams: { label: 'La tarifa es negociable' },
                    },
                  },
                ],
              },
            },
          ],
        },
        {
          name: 'travel_accommodation',
          components: [
            {
              componentName: ComponentTypes.ATTRIBUTES_ICON_FIELDS,
              data: {
                attributes: [
                  {
                    name: 'travel_support',
                    title: 'Apoyo de transporte',
                    formMetaData: {
                      inputType: 'select',
                      componentParams: { placeholder: 'Selecciona una opción', options: TRAVEL_OPTIONS },
                    },
                  },
                  {
                    name: 'accommodation_provided',
                    title: 'Hospedaje',
                    formMetaData: {
                      inputType: 'select',
                      componentParams: { placeholder: 'Selecciona una opción', options: ACCOMMODATION_OPTIONS },
                    },
                  },
                  {
                    name: 'meals_provided',
                    title: 'Alimentación',
                    formMetaData: {
                      inputType: 'select',
                      componentParams: { placeholder: 'Selecciona una opción', options: MEALS_OPTIONS },
                    },
                  },
                  {
                    name: 'additional_notes',
                    title: 'Notas adicionales',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: {
                        placeholder: 'Cualquier información adicional para los artistas que apliquen...',
                        rows: 4,
                      },
                    },
                  },
                  {
                    name: 'terms_and_conditions',
                    title: 'Términos y condiciones',
                    formMetaData: {
                      inputType: 'textarea',
                      componentParams: {
                        placeholder: 'Términos y condiciones de la convocatoria (puedes usar Markdown)...',
                        rows: 6,
                      },
                    },
                  },
                  {
                    name: 'external_link',
                    title: 'Enlace externo',
                    formMetaData: {
                      inputType: 'url',
                      componentParams: {
                        placeholder: 'https://ejemplo.com/mas-informacion',
                      },
                    },
                  },
                  {
                    name: 'is_recurring',
                    title: 'Convocatoria recurrente',
                    formMetaData: {
                      inputType: 'switch',
                      componentParams: { label: 'Esta convocatoria se repite periódicamente' },
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
};

// Export a default config for backwards compatibility (will be empty until options are provided)
export const OPEN_CALL_CREATE_CONFIG: PageSection[] = [];
