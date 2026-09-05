import { useRef } from 'react';
import { useI18n } from '~/common/utils';
import { FixedHeader } from '~/components/shared/molecules/FixedHeader/FixedHeader';
import { OpenCallModel, OpenCallStatus } from '~/models/domain/open-call/open-call.model';
import { TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE } from './config-open-call-details';
import './OpenCallPresentation.scss';

const DATE_FORMAT = 'DD/MM/YYYY';

interface PresentationField {
  name: string;
  value: string;
  longText?: boolean;
}

interface PresentationSection {
  name: string;
  fields: PresentationField[];
}

interface OpenCallPresentationProps {
  openCall: OpenCallModel;
  onApply?: () => void;
}

const joinDefinedValues = (values: (string | undefined)[], separator = ' · ') =>
  values.filter((value) => !!value && value.trim().length > 0).join(separator);

const formatList = (values?: string[]) => (values?.length ? values.join(', ') : '');

const formatNumber = (value?: number) => (typeof value === 'number' ? String(value) : '');

const OpenCallPresentation = ({ openCall, onApply }: OpenCallPresentationProps) => {
  const { translateText } = useI18n();
  const translate = (key: string) => translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.${key}`);

  const mainHeaderRef = useRef<HTMLDivElement>(null);

  const minutesSuffix = translate('presentation.minutes_suffix');
  const formatSetDuration = () => {
    const { set_duration_min: min, set_duration_max: max } = openCall;
    if (typeof min === 'number' && typeof max === 'number') {
      return `${min} - ${max} ${minutesSuffix}`;
    }
    if (typeof min === 'number') {
      return `${min} ${minutesSuffix}`;
    }
    return typeof max === 'number' ? `${max} ${minutesSuffix}` : '';
  };

  const formatFee = () => {
    if (typeof openCall.fee_amount !== 'number') {
      return '';
    }
    return joinDefinedValues([String(openCall.fee_amount), openCall.fee_currency], ' ');
  };

  const sections: PresentationSection[] = [
    {
      name: 'about',
      fields: [
        { name: 'description', value: openCall.description || '', longText: true },
        { name: 'genres', value: formatList(openCall.genres) },
        { name: 'accepted_project_types', value: formatList(openCall.accepted_project_types) },
      ],
    },
    {
      name: 'conditions',
      fields: [
        { name: 'requirements_description', value: openCall.requirements_description || '', longText: true },
        { name: 'set_duration', value: formatSetDuration() },
        { name: 'max_applications', value: formatNumber(openCall.max_applications) },
        { name: 'available_slots', value: formatNumber(openCall.available_slots) },
        { name: 'expected_audience', value: formatNumber(openCall.expected_audience) },
      ],
    },
    {
      name: 'technical',
      fields: [
        { name: 'stage_type', value: openCall.stage_type || '' },
        { name: 'stage_dimensions', value: openCall.stage_dimensions || '' },
        { name: 'provided_sound', value: openCall.provided_sound || '' },
        { name: 'provided_backline', value: openCall.provided_backline || '' },
        { name: 'provided_lighting', value: openCall.provided_lighting || '' },
        { name: 'technical_notes', value: openCall.technical_notes || '', longText: true },
      ],
    },
    {
      name: 'compensation',
      fields: [
        { name: 'fee', value: formatFee() },
        { name: 'travel_support', value: openCall.travel_support || '' },
        { name: 'accommodation_provided', value: openCall.accommodation_provided || '' },
        { name: 'meals_provided', value: openCall.meals_provided || '' },
        { name: 'additional_notes', value: openCall.additional_notes || '', longText: true },
      ],
    },
  ];

  // Un único badge: con status OPEN el estado no dice nada que no diga ya el plazo, así que
  // manda si acepta o no aplicaciones; con cualquier otro estado (borrador, cerrada, cancelada)
  // el estado ES la información relevante y el plazo pasa a ser secundario.
  const resolveBadge = () => {
    if (openCall.status !== OpenCallStatus.OPEN) {
      return {
        label: translate(`open_call_status.${openCall.status}`),
        modifier: openCall.status === OpenCallStatus.DRAFT ? 'status' : 'expired',
      };
    }

    return openCall.isExpired
      ? { label: translate('presentation.expired_badge'), modifier: 'expired' }
      : { label: translate('presentation.open_badge'), modifier: 'open' };
  };

  const badge = resolveBadge();

  const filledSections = sections
    .map((section) => ({ ...section, fields: section.fields.filter((field) => !!field.value) }))
    .filter((section) => section.fields.length > 0);

  const location = joinDefinedValues([openCall.city, openCall.event_location, openCall.country]);

  return (
    <section className="open-call-presentation">
      {/* Fixed Header */}
      <FixedHeader mainHeaderRef={mainHeaderRef}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{openCall.event_name}</h2>
            {location && <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>{location}</p>}
          </div>
          <span className={`presentation-badge presentation-badge--${badge.modifier}`}>{badge.label}</span>
        </div>
      </FixedHeader>

      <header ref={mainHeaderRef} className="presentation-header">
        <h1 className="presentation-title">{openCall.event_name}</h1>
        {location && <p className="presentation-location">{location}</p>}
        <div className="presentation-badges">
          <span className={`presentation-badge presentation-badge--${badge.modifier}`}>{badge.label}</span>
        </div>
      </header>

      <div className="presentation-deadline">
        <h2 className="presentation-deadline-title">{translate('presentation.apply_deadline_title')}</h2>
        <p className="presentation-deadline-range">
          {openCall.start_date.format(DATE_FORMAT)} &ndash; {openCall.end_date.format(DATE_FORMAT)}
        </p>
        <p className="presentation-deadline-event">
          {translate('presentation.event_date_label')}: {openCall.event_date.format(DATE_FORMAT)}
        </p>
      </div>

      {filledSections.map((section) => (
        <div key={section.name} className="presentation-section">
          <h2 className="presentation-section-title">{translate(`presentation.sections.${section.name}`)}</h2>
          <dl className="presentation-fields">
            {section.fields.map((field) => (
              <div
                key={field.name}
                className={`presentation-field ${field.longText ? 'presentation-field--long' : ''}`}
              >
                <dt className="presentation-field-label">{translate(`presentation.fields.${field.name}`)}</dt>
                <dd className="presentation-field-value">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}

      {onApply && (
        <div className="presentation-actions">
          <button type="button" className="presentation-apply-btn" onClick={onApply}>
            {translate('apply_button')}
          </button>
        </div>
      )}
    </section>
  );
};

export default OpenCallPresentation;
