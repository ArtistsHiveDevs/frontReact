import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';

export interface OpenCallStep {
  name: string;
  translationKey: string;
  fields: DynamicFieldData[];
}

export const TRANSLATION_BASE_OPEN_CALL_PAGE = 'app.pages.OpenCallPage';

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

export const OPEN_CALL_STEPS: OpenCallStep[] = [
  // ─── Step 1: General ───
  {
    name: 'general',
    translationKey: 'general',
    fields: [
      {
        inputType: 'text',
        fieldName: 'artist_name',
        label: 'Nombre del proyecto / Artista',
        placeholder: 'Ej: Los Amplificadores',
        config: { required: 'Este campo es obligatorio', minLength: { value: 2, message: 'Mínimo 2 caracteres' } },
      },
      {
        inputType: 'text',
        fieldName: 'manager_name',
        label: 'Nombre del representante / Manager',
        placeholder: 'Nombre completo del contacto',
      },
      {
        inputType: 'text',
        fieldName: 'country',
        label: 'País de origen',
        placeholder: 'Ej: Colombia',
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'text',
        fieldName: 'city',
        label: 'Ciudad de origen',
        placeholder: 'Ej: Bogotá',
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'text',
        fieldName: 'email',
        label: 'Correo electrónico',
        placeholder: 'correo@ejemplo.com',
        config: {
          required: 'Este campo es obligatorio',
          pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
        },
      },
      {
        inputType: 'tel',
        fieldName: 'phone',
        label: 'Teléfono / WhatsApp',
        placeholder: '+57 300 123 4567',
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'select',
        fieldName: 'genre',
        label: 'Género musical principal',
        placeholder: 'Selecciona un género',
        options: MUSIC_GENRE_OPTIONS,
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'select',
        fieldName: 'project_type',
        label: 'Tipo de proyecto',
        placeholder: 'Selecciona el tipo',
        options: PROJECT_TYPE_OPTIONS,
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'textarea',
        fieldName: 'synopsis',
        label: 'Sinopsis del espectáculo',
        placeholder: 'Describe brevemente tu propuesta artística...',
        componentParams: { maxLength: 150, rows: 3 },
      },
    ],
  },

  // ─── Step 2: Multimedia ───
  {
    name: 'multimedia',
    translationKey: 'multimedia',
    fields: [
      {
        inputType: 'url',
        fieldName: 'music_link',
        label: 'Enlace a música (Spotify, SoundCloud, Bandcamp, etc.)',
        placeholder: 'https://open.spotify.com/artist/...',
        config: { required: 'Incluye al menos un enlace a tu música' },
      },
      {
        inputType: 'url',
        fieldName: 'video_link',
        label: 'Enlace a video en vivo (YouTube, Vimeo)',
        placeholder: 'https://youtube.com/watch?v=...',
        config: { required: 'Incluye un video de tu presentación en vivo' },
      },
      {
        inputType: 'url',
        fieldName: 'social_instagram',
        label: 'Instagram',
        placeholder: 'https://instagram.com/tuartista',
      },
      {
        inputType: 'url',
        fieldName: 'social_facebook',
        label: 'Facebook',
        placeholder: 'https://facebook.com/tuartista',
      },
      {
        inputType: 'url',
        fieldName: 'social_tiktok',
        label: 'TikTok',
        placeholder: 'https://tiktok.com/@tuartista',
      },
      {
        inputType: 'url',
        fieldName: 'website',
        label: 'Sitio web',
        placeholder: 'https://www.tuartista.com',
      },
      {
        inputType: 'file',
        fieldName: 'press_kit',
        label: 'Press Kit / EPK (PDF o imágenes)',
        componentParams: { accept: '.pdf,image/*', multipleFiles: false },
      },
      {
        inputType: 'file',
        fieldName: 'photos',
        label: 'Fotos promocionales',
        componentParams: { accept: 'image/*', multipleFiles: true },
      },
    ],
  },

  // ─── Step 3: Show ───
  {
    name: 'show',
    translationKey: 'show',
    fields: [
      {
        inputType: 'number',
        fieldName: 'show_duration',
        label: 'Duración del show (minutos)',
        placeholder: 'Ej: 60',
        config: { required: 'Este campo es obligatorio', min: { value: 15, message: 'Mínimo 15 minutos' } },
      },
      {
        inputType: 'number',
        fieldName: 'members_on_stage',
        label: 'Número de músicos en escenario',
        placeholder: 'Ej: 4',
        config: { required: 'Este campo es obligatorio', min: { value: 1, message: 'Mínimo 1' } },
      },
      {
        inputType: 'textarea',
        fieldName: 'show_description',
        label: 'Descripción del show',
        placeholder: 'Describe qué puede esperar el público de tu presentación en vivo...',
        componentParams: { rows: 4 },
        config: { required: 'Describe brevemente tu show' },
      },
      {
        inputType: 'textarea',
        fieldName: 'setlist_sample',
        label: 'Setlist de ejemplo (opcional)',
        placeholder: '1. Canción de apertura\n2. ...\n3. ...',
        componentParams: { rows: 4 },
      },
      {
        inputType: 'textarea',
        fieldName: 'past_events',
        label: 'Eventos / festivales donde has participado',
        placeholder: 'Ej: Rock al Parque 2024, Festival Estéreo Picnic...',
        componentParams: { rows: 3 },
      },
      {
        inputType: 'select',
        fieldName: 'availability',
        label: 'Disponibilidad para fechas',
        placeholder: 'Selecciona tu disponibilidad',
        options: [
          { label: 'Cualquier fecha', value: 'any' },
          { label: 'Solo fines de semana', value: 'weekends' },
          { label: 'Solo entre semana', value: 'weekdays' },
          { label: 'Fechas específicas (indicar en observaciones)', value: 'specific' },
        ],
        config: { required: 'Este campo es obligatorio' },
      },
    ],
  },

  // ─── Step 4: Técnico ───
  {
    name: 'technical',
    translationKey: 'technical',
    fields: [
      {
        inputType: 'textarea',
        fieldName: 'sound_requirements',
        label: 'Requerimientos de sonido',
        placeholder: 'Ej: 4 monitores de piso, 2 DI box, mesa de mezclas de 16 canales...',
        componentParams: { rows: 4 },
        config: { required: 'Indica tus requerimientos de sonido' },
      },
      {
        inputType: 'textarea',
        fieldName: 'backline_requirements',
        label: 'Backline necesario',
        placeholder: 'Ej: Batería completa, amplificador de bajo, 2 amplificadores de guitarra...',
        componentParams: { rows: 4 },
      },
      {
        inputType: 'textarea',
        fieldName: 'lighting_requirements',
        label: 'Requerimientos de iluminación',
        placeholder: 'Ej: Luces de colores, máquina de humo, seguidor...',
        componentParams: { rows: 3 },
      },
      {
        inputType: 'number',
        fieldName: 'setup_time',
        label: 'Tiempo de montaje (minutos)',
        placeholder: 'Ej: 30',
      },
      {
        inputType: 'number',
        fieldName: 'soundcheck_time',
        label: 'Tiempo de prueba de sonido (minutos)',
        placeholder: 'Ej: 20',
      },
      {
        inputType: 'file',
        fieldName: 'technical_rider',
        label: 'Rider técnico (PDF)',
        componentParams: { accept: '.pdf', multipleFiles: false },
      },
      {
        inputType: 'file',
        fieldName: 'stage_plot_file',
        label: 'Stage plot (PDF o imagen)',
        componentParams: { accept: '.pdf,image/*', multipleFiles: false },
      },
    ],
  },

  // ─── Step 5: Logística ───
  {
    name: 'logistics',
    translationKey: 'logistics',
    fields: [
      {
        inputType: 'select',
        fieldName: 'fee_currency',
        label: 'Moneda',
        placeholder: 'Selecciona la moneda',
        options: CURRENCY_OPTIONS,
        config: { required: 'Selecciona una moneda' },
      },
      {
        inputType: 'number',
        fieldName: 'fee_amount',
        label: 'Caché / Tarifa del artista',
        placeholder: 'Ej: 2500',
        config: { required: 'Indica tu tarifa' },
      },
      {
        inputType: 'select',
        fieldName: 'fee_includes',
        label: 'La tarifa incluye',
        placeholder: 'Selecciona una opción',
        options: [
          { label: 'Solo show', value: 'show_only' },
          { label: 'Show + transporte', value: 'show_transport' },
          { label: 'Show + transporte + hospedaje', value: 'show_transport_hotel' },
          { label: 'Todo incluido', value: 'all_inclusive' },
        ],
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'select',
        fieldName: 'needs_travel',
        label: '¿Requiere transporte?',
        placeholder: 'Selecciona una opción',
        options: [
          { label: 'No, somos locales', value: 'no' },
          { label: 'Sí, transporte terrestre', value: 'ground' },
          { label: 'Sí, vuelos nacionales', value: 'domestic_flight' },
          { label: 'Sí, vuelos internacionales', value: 'international_flight' },
        ],
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'select',
        fieldName: 'needs_accommodation',
        label: '¿Requiere hospedaje?',
        placeholder: 'Selecciona una opción',
        options: [
          { label: 'No', value: 'no' },
          { label: 'Sí, 1 noche', value: '1_night' },
          { label: 'Sí, 2 noches', value: '2_nights' },
          { label: 'Sí, 3+ noches', value: '3_plus_nights' },
        ],
        config: { required: 'Este campo es obligatorio' },
      },
      {
        inputType: 'number',
        fieldName: 'crew_count',
        label: 'Personas en el crew (técnicos, road managers, etc.)',
        placeholder: 'Ej: 2',
      },
      {
        inputType: 'textarea',
        fieldName: 'hospitality_requirements',
        label: 'Requerimientos de hospitalidad / catering',
        placeholder: 'Ej: Agua, comida para 6 personas, restricciones alimentarias...',
        componentParams: { rows: 3 },
      },
      {
        inputType: 'textarea',
        fieldName: 'additional_notes',
        label: 'Observaciones adicionales',
        placeholder: 'Cualquier información adicional relevante para tu aplicación...',
        componentParams: { rows: 4 },
      },
    ],
  },
];
