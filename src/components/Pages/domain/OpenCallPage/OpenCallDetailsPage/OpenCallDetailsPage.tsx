import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';
import OpenCallSurveyReadOnly from '../OpenCallApplicationPage/OpenCallSurveyReadOnly';
import { OpenCallApplicationEntry, OpenCallDetailsDataTemplate } from './config-open-call-details';
import '../OpenCallApplicationPage/index.scss';

// Mock: datos de la convocatoria con las aplicaciones de artistas
const MOCK_OPEN_CALL_DETAILS: OpenCallDetailsDataTemplate = {
  open_call: {
    id: 'oc_1',
    event_name: 'Festival Rock Independiente 2026',
    event_date: '2026-09-15',
    start_date: '2026-06-01',
    end_date: '2026-07-31',
    status: 'OPEN',
    description: 'Festival de rock independiente en La Sucursal Venue.',
    city: 'Bogotá',
    genres: ['rock', 'indie'],
  },
  applications: [
    {
      id: 'app_1',
      artist_name: 'Los Amplificadores',
      artist_profile_pic: '',
      artist_city: 'Bogotá',
      applied_at: '2026-06-15',
      status: 'pending',
      survey_responses: {
        artist_name: 'Los Amplificadores',
        manager_name: 'Carlos Rodríguez',
        country: 'Colombia',
        city: 'Bogotá',
        email: 'amplificadores@email.com',
        phone: '+57 300 111 2222',
        genre: 'rock',
        project_type: 'band_small',
        synopsis: 'Rock alternativo con influencias de grunge y post-punk.',
        music_link: 'https://open.spotify.com/artist/example1',
        video_link: 'https://youtube.com/watch?v=example1',
        social_instagram: 'https://instagram.com/losamplificadores',
        show_duration: 60,
        members_on_stage: 5,
        show_description: 'Show energético de rock alternativo con visuales en vivo.',
        past_events: 'Rock al Parque 2025, Festival Estéreo Picnic 2024',
        availability: 'any',
        sound_requirements: '4 monitores de piso, 2 DI box, mesa de mezclas de 16 canales',
        backline_requirements: 'Batería completa, 2 amplificadores de guitarra',
        setup_time: 30,
        soundcheck_time: 20,
        fee_currency: 'USD',
        fee_amount: 2500,
        fee_includes: 'show_only',
        needs_travel: 'no',
        needs_accommodation: 'no',
        crew_count: 2,
      },
    },
    {
      id: 'app_2',
      artist_name: 'Meridiano Cero',
      artist_profile_pic: '',
      artist_city: 'Bogotá',
      applied_at: '2026-06-18',
      status: 'pending',
      survey_responses: {
        artist_name: 'Meridiano Cero',
        manager_name: 'Ana López',
        country: 'Colombia',
        city: 'Bogotá',
        email: 'meridiano@email.com',
        phone: '+57 310 333 4444',
        genre: 'indie',
        project_type: 'trio',
        synopsis: 'Indie rock melódico con letras en español.',
        music_link: 'https://open.spotify.com/artist/example2',
        video_link: 'https://youtube.com/watch?v=example2',
        show_duration: 45,
        members_on_stage: 3,
        show_description: 'Set acústico e íntimo con transiciones a eléctrico.',
        availability: 'weekends',
        sound_requirements: '3 monitores, 1 DI box',
        fee_currency: 'USD',
        fee_amount: 1800,
        fee_includes: 'show_transport',
        needs_travel: 'no',
        needs_accommodation: 'no',
        crew_count: 1,
      },
    },
    {
      id: 'app_3',
      artist_name: 'Estática',
      artist_profile_pic: '',
      artist_city: 'Medellín',
      applied_at: '2026-06-20',
      status: 'pending',
      survey_responses: {
        artist_name: 'Estática',
        country: 'Colombia',
        city: 'Medellín',
        email: 'estatica@email.com',
        phone: '+57 320 555 6666',
        genre: 'rock',
        project_type: 'band_small',
        synopsis: 'Rock progresivo instrumental con elementos electrónicos.',
        music_link: 'https://open.spotify.com/artist/example3',
        video_link: 'https://youtube.com/watch?v=example3',
        show_duration: 50,
        members_on_stage: 4,
        show_description: 'Show instrumental con loops en vivo y proyecciones.',
        availability: 'any',
        sound_requirements: '4 monitores, 3 DI box, mesa de 24 canales',
        lighting_requirements: 'Luces de colores, máquina de humo',
        setup_time: 40,
        soundcheck_time: 25,
        fee_currency: 'USD',
        fee_amount: 3000,
        fee_includes: 'show_only',
        needs_travel: 'domestic_flight',
        needs_accommodation: '2_nights',
        crew_count: 3,
        hospitality_requirements: 'Comida para 7 personas, sin gluten para 2',
      },
    },
  ],
};

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: 'Pendiente', color: '#FFA726' },
  accepted: { label: 'Aceptado', color: '#66BB6A' },
  rejected: { label: 'Rechazado', color: '#EF5350' },
};

const ApplicationCard = ({ application }: { application: OpenCallApplicationEntry }) => {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = STATUS_LABELS[application.status] || STATUS_LABELS.pending;

  return (
    <div
      style={{
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '8px',
        marginBottom: '16px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        overflow: 'hidden',
      }}
    >
      {/* Header — always visible, toggles expanded */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 20px',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div>
          <h4 style={{ margin: 0 }}>{application.artist_name}</h4>
          <p style={{ margin: '4px 0', opacity: 0.7, fontSize: '0.9em' }}>
            {application.artist_city} &middot; Aplicó el {application.applied_at}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: statusInfo.color,
              color: '#000',
              fontSize: '0.8em',
              fontWeight: 'bold',
            }}
          >
            {statusInfo.label}
          </span>
          <span style={{ fontSize: '1.2em', transition: 'transform 0.2s', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
            &#9660;
          </span>
        </div>
      </div>

      {/* Survey responses — collapsible */}
      {expanded && (
        <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <OpenCallSurveyReadOnly surveyResponses={application.survey_responses} />
        </div>
      )}
    </div>
  );
};

const OpenCallDetailsPage = () => {
  const navigate = useNavigate();
  const urlParameters = useParams();
  const openCallId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const [entityData] = useState<OpenCallDetailsDataTemplate>(MOCK_OPEN_CALL_DETAILS);
  const openCall = entityData.open_call;

  return (
    <div className="open-call-page">
      <div className="open-call-header">
        <h1 className="open-call-title">{openCall.event_name}</h1>
        <p className="open-call-subtitle">
          Evento: {openCall.event_date} &middot; Convocatoria abierta hasta: {openCall.end_date} &middot;{' '}
          {entityData.applications.length} aplicaciones recibidas
        </p>
      </div>

      <div className="step-content">
        <h3 className="step-title">Aplicaciones Recibidas ({entityData.applications.length})</h3>

        {entityData.applications.map((app) => (
          <ApplicationCard key={app.id} application={app} />
        ))}
      </div>

      <div className="step-navigation">
        <button type="button" className="nav-btn btn-prev" onClick={() => navigate(`/${PATHS.OPEN_CALLS}`)}>
          Volver a Mis Convocatorias
        </button>
      </div>
    </div>
  );
};

export default OpenCallDetailsPage;
