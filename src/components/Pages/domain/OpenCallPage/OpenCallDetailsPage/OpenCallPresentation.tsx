import { Avatar } from '@mui/material';
import { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useOpenCallsSlice } from '~/common/slices/domain/open-calls/open-calls.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import {
  getMusicArtistProjectFormatTypeOptions,
  getMusicGenreTypeOptions,
  getStageTypeOptions,
} from '~/common/utils/form-options';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { ProfileSummaryDialog } from '~/components/Pages/domain/ProfilePreview/ProfileSummaryDialog';
import { CustomPDFViewer } from '~/components/shared/atoms/CustomPDFViewer/CustomPDFViewer';
import ExpandableText from '~/components/shared/atoms/gui/ExpandableText/ExpandableText';
import {
  ProfilePictureWithName,
  ProfilePictureWithNameConstants,
} from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureWithName';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import { FixedHeader } from '~/components/shared/molecules/FixedHeader/FixedHeader';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { ResourceMoreMenu } from '~/components/shared/molecules/general/ResourceMoreMenu/ResourceMoreMenu';
import { SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import MDReader from '~/components/shared/organisms/gui/MDReader/mdreader';
import { SUB_PATHS } from '~/constants';
import { MDDocumentModel } from '~/models/app/md-model/md-model';
import { OpenCallModelV1, OpenCallStatus } from '~/models/domain/open-call/v1';
import { PlaceModel } from '~/models/domain/place/place.model';
import { TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE } from './config-open-call-details';
import './OpenCallPresentation.scss';

type OpenCallDocument = NonNullable<OpenCallModelV1['documents']>[number];

const DATE_FORMAT = 'ddd DD/MM/YYYY';

interface PresentationField {
  name: string;
  value: string;
  translations?: SelectOption[];
  longText?: boolean;
}

interface PresentationSection {
  name: string;
  fields: PresentationField[];
}

interface OpenCallPresentationProps {
  openCall: OpenCallModelV1;
  onApply?: () => void;
  /** El artista logueado ya tiene una aplicación para este open call: muestra el botón deshabilitado con el mensaje de duplicado en vez de ocultarlo. */
  alreadyApplied?: boolean;
  /** El usuario actual es dueño (Place) de este open call: habilita Editar en el menú de acciones. */
  isOwner?: boolean;
}

const joinDefinedValues = (values: (string | undefined)[], separator = ' · ') =>
  values.filter((value) => !!value && value.trim().length > 0).join(separator);

const formatList = (params: { values?: string[]; translations?: SelectOption[] }) => {
  const { values, translations } = params;
  return values?.length
    ? values
        .map((value) => (translations || []).find((translation) => value === translation.value)?.label || value)
        .sort((a, b) => {
          const labelA = a.toLowerCase();
          const labelB = b.toLowerCase();

          return labelA.localeCompare(labelB);
        })
        .join(', ')
    : '';
};

const formatNumber = (value?: number) => (typeof value === 'number' ? String(value) : '');

const OpenCallPresentation = ({
  openCall,
  onApply,
  alreadyApplied = false,
  isOwner = false,
}: OpenCallPresentationProps) => {
  const { translateText, translateGlobalDict } = useI18n();
  const translate = (key: string) => translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.${key}`);

  const showApplyButton = !!onApply || alreadyApplied;
  const applyButtonLabel = onApply
    ? translate('apply_button')
    : translateText('app.pages.OpenCallPage.submit_errors.duplicate');

  const loggedUser = useSelector(selectCurrentUser);

  const { navigateToEntity } = useNavigation();
  const goToEditOpenCall = () => {
    const entityType = openCall.constructor.name !== 'Object' ? openCall.constructor.name : (openCall as any).entity;
    navigateToEntity({ entityType, id: openCall.identifier, action: SUB_PATHS.EDIT });
  };

  const dispatch = useDispatch();
  const { actions: openCallActions } = useOpenCallsSlice();

  // Solo alterna OPEN<->DRAFT: CLOSED/CANCELLED no se tocan desde acá (no hay
  // un tercer estado al que "volver"). Solo el dueño puede cambiarlo.
  const changeOpenCallStatus = () => {
    if (!isOwner) {
      return;
    }
    if (openCall.status !== OpenCallStatus.OPEN && openCall.status !== OpenCallStatus.DRAFT) {
      return;
    }

    const newStatus = openCall.status === OpenCallStatus.OPEN ? OpenCallStatus.DRAFT : OpenCallStatus.OPEN;
    dispatch(openCallActions.updateItem({ id: openCall.id, newItem: { status: newStatus } }));
  };

  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const [isPosterZoomOpen, setIsPosterZoomOpen] = useState(false);
  const [isVenuePreviewOpen, setIsVenuePreviewOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<OpenCallDocument | null>(null);

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
        {
          name: 'genres',
          value: formatList({
            values: openCall.genres,
            translations: getMusicGenreTypeOptions({ translateFn: translateGlobalDict }),
          }),
        },
        {
          name: 'accepted_project_types',
          value: formatList({
            values: openCall.accepted_project_types,
            translations: getMusicArtistProjectFormatTypeOptions({ translateFn: translateGlobalDict }),
          }),
        },
      ],
    },
    {
      name: 'conditions',
      fields: [
        { name: 'requirements_description', value: openCall.requirements_description || '', longText: true },
        { name: 'selection_criteria', value: openCall.selection_criteria || '', longText: true },
        { name: 'set_duration', value: formatSetDuration() },
        { name: 'max_applications', value: formatNumber(openCall.max_applications) },
        { name: 'available_slots', value: formatNumber(openCall.available_slots) },
        { name: 'expected_audience', value: formatNumber(openCall.expected_audience) },
      ],
    },
    {
      name: 'technical',
      fields: [
        {
          name: 'stage_type',
          value:
            formatList({
              values: [openCall.stage_type],
              translations: getStageTypeOptions({ translateFn: translateGlobalDict }),
            }) || '',
        },
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

  const filledSections = sections.map((section) => ({
    ...section,
    fields: section.fields.filter((field) => !!field.value),
  }));
  // .filter((section) => section.fields.length > 0);

  const location = joinDefinedValues([openCall.city, openCall.event_location, openCall.country]);

  return (
    <>
      <section className="open-call-presentation">
        {/* Fixed Header */}
        <FixedHeader
          mainHeaderRef={mainHeaderRef}
          avatar={
            <>
              <Avatar
                src={openCall.poster}
                alt={openCall.event_name}
                variant="rounded"
                onClick={() => openCall.poster && setIsPosterZoomOpen(true)}
                style={{ cursor: openCall.poster ? 'zoom-in' : 'default' }}
              >
                {!openCall.poster && <DynamicIcons iconName="bs BsFillMegaphoneFill" color="white" size={30} />}
              </Avatar>
            </>
          }
          isOwner={isOwner}
          shareUrl={openCall.sharedUrlSocialNetworks}
        >
          <div className="presentation-fixed-header">
            <div className="presentation-fixed-header-info">
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{openCall.event_name}</h2>
              {location && <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.7 }}>{location}</p>}
              <span
                className={`presentation-badge presentation-badge--${badge.modifier}`}
                onClick={changeOpenCallStatus}
              >
                {badge.label}
              </span>
            </div>
            {!!onApply && openCall.status === 'OPEN' && (
              <div className="presentation-actions">
                <button type="button" className="presentation-apply-btn" onClick={onApply}>
                  {translate('apply_button')}
                </button>
              </div>
            )}
          </div>
        </FixedHeader>

        <header ref={mainHeaderRef} className="presentation-header">
          <div className="presentation-header-avatar">
            <Avatar
              src={openCall.poster}
              alt={openCall.event_name}
              variant="rounded"
              onClick={() => openCall.poster && setIsPosterZoomOpen(true)}
              style={{ cursor: openCall.poster ? 'zoom-in' : 'default' }}
            >
              {!openCall.poster && <DynamicIcons iconName="bs BsFillMegaphoneFill" color="white" size={30} />}
            </Avatar>
          </div>
          <div className="presentation-header-info">
            <h1 className="presentation-title">{openCall.event_name}</h1>
            {location && <p className="presentation-location">{location}</p>}
            <div className="presentation-badges" onClick={changeOpenCallStatus}>
              <span className={`presentation-badge presentation-badge--${badge.modifier}`}>
                {badge.label}
                {isOwner ? ' - SI' : ''}
              </span>
            </div>
          </div>
          <div className="presentation-header-menu">
            {openCall.sharedUrlSocialNetworks && (
              <ResourceMoreMenu
                loggedUser={loggedUser}
                isOwner={isOwner}
                shareUrl={openCall.sharedUrlSocialNetworks}
                onEdit={goToEditOpenCall}
              />
            )}
          </div>
        </header>

        <div className="mobile-key">
          <div className="presentation-deadline">
            <div className="presentation-deadline-header">
              <DynamicIcons iconName="bs BsFillAlarmFill" color={'white'} size={18} />
              <div className="presentation-deadline-header-text">
                <h2 className="presentation-deadline-title">{translate('presentation.apply_deadline_title')}</h2>
                <p className="presentation-deadline-range">
                  {openCall.start_date.format(DATE_FORMAT)} &ndash; {openCall.end_date.format(DATE_FORMAT)}
                </p>
              </div>
            </div>
            <div className="presentation-deadline-header presentation-deadline-event">
              <DynamicIcons iconName="io IoMdCalendar" color={'white'} size={20} />{' '}
              <div className="presentation-deadline-header-text">
                <h2 className="presentation-deadline-title">{translate('presentation.event_date_label')}</h2>
                <p className="presentation-deadline-range">{openCall.event_date.format(DATE_FORMAT)}</p>
              </div>
            </div>
          </div>

          <div key={'section_venue'} className="presentation-section">
            <h2 className="presentation-section-title">{translate(`presentation.sections.venue`)}</h2>
            <div>
              {openCall.placeProfileInfo && (
                <ProfilePictureWithName
                  element={openCall.placeProfileInfo}
                  direction={ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL}
                  styles={{ avatarSize: 3 }}
                  showSubtitle
                  onProfileClick={() => setIsVenuePreviewOpen(true)}
                  actionable
                />
              )}
            </div>
          </div>
        </div>
        {filledSections.map((section) => (
          <SectionsPanel
            key={section.name}
            id={`section_${section.name}`}
            sectionName={translate(`presentation.sections.${section.name}`)}
            sectionContent={() => (
              <dl className="presentation-fields">
                {section.fields.map((field) => (
                  <div
                    key={field.name}
                    className={`presentation-field ${field.longText ? 'presentation-field--long' : ''}`}
                  >
                    <dt className="presentation-field-label">{translate(`presentation.fields.${field.name}`)}</dt>
                    {field.longText && <ExpandableText text={field.value} />}
                    {!field.longText && <dd className="presentation-field-value">{field.value}</dd>}
                  </div>
                ))}
              </dl>
            )}
          />
        ))}

        <SectionsPanel
          id="section_documents"
          sectionName={translate('presentation.sections.documents')}
          sectionContent={() =>
            openCall.documents && openCall.documents.length > 0 ? (
              <ul className="presentation-documents-list">
                {openCall.documents.map((document, index) => (
                  <li key={`${document.title}-${index}`}>
                    <button
                      type="button"
                      className="presentation-documents-item"
                      onClick={() => setSelectedDocument(document)}
                    >
                      <DynamicIcons iconName="fa FaFileAlt" color={'white'} size={20} />
                      {document.title}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="presentation-documents-empty">{translate('presentation.no_documents')}</p>
            )
          }
        />

        {showApplyButton && openCall.status === 'OPEN' && (
          <div className="presentation-actions">
            <button type="button" className="presentation-apply-btn" onClick={onApply} disabled={!onApply}>
              {applyButtonLabel}
            </button>
          </div>
        )}
      </section>
      {!!openCall.placeProfileInfo && (
        <ProfileSummaryDialog
          isOpen={isVenuePreviewOpen}
          onClose={() => setIsVenuePreviewOpen(false)}
          entityType={PlaceModel.name}
          entityId={openCall.placeProfileInfo.identifier}
        />
      )}
      {!!openCall.poster && (
        <AppDialog
          title={openCall.event_name}
          isOpenDialog={isPosterZoomOpen}
          onClose={() => setIsPosterZoomOpen(false)}
          content={<img src={openCall.poster} alt={openCall.event_name} style={{ maxWidth: '100%' }} />}
        />
      )}
      {!!selectedDocument && (
        <AppDialog
          title={selectedDocument.title}
          fullScreen
          isOpenDialog={!!selectedDocument}
          onClose={() => setSelectedDocument(null)}
          content={
            selectedDocument.docType === 'pdf' ? (
              <CustomPDFViewer
                fileSources={[
                  { fileName: selectedDocument.title, path: selectedDocument.content, src: selectedDocument.content },
                ]}
              />
            ) : (
              <div className="presentation-document-markdown">
                <MDReader
                  mdDocument={
                    new MDDocumentModel({
                      id: selectedDocument.title,
                      content: selectedDocument.content,
                      lang: 'es',
                    })
                  }
                />
              </div>
            )
          }
        />
      )}
    </>
  );
};

export default OpenCallPresentation;
