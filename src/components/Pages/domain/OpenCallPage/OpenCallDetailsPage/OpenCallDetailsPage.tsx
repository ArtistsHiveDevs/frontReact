import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import {
  selectorOpenCallApplications,
  useOpenCallApplicationsSlice,
} from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { selectorOpenCalls, useOpenCallsSlice } from '~/common/slices/domain/open-calls/open-calls.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { RootState } from '~/common/utils/redux-injectors/types';
import ApplicationSurveyView from '~/components/Pages/domain/OpenCallPage/OpenCallApplicationPage/ApplicationSurveyView';
import '~/components/Pages/domain/OpenCallPage/OpenCallApplicationPage/index.scss';
import { TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE } from '~/components/Pages/domain/OpenCallPage/OpenCallDetailsPage/config-open-call-details';
import OpenCallPresentation from '~/components/Pages/domain/OpenCallPage/OpenCallDetailsPage/OpenCallPresentation';
import NotFoundPage from '~/components/Pages/NotFoundPage';
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { OpenCallApplicationModel } from '~/models/domain/open-call/open-call-application.model';

const STATUS_COLORS: Record<string, string> = {
  pending: '#FFA726',
  accepted: '#66BB6A',
  rejected: '#EF5350',
};

interface ApplicationCardProps {
  application: OpenCallApplicationModel;
  canModerate: boolean;
  isUpdating: boolean;
  onAccept: () => void;
  onReject: () => void;
}

const ApplicationCard = ({ application, canModerate, isUpdating, onAccept, onReject }: ApplicationCardProps) => {
  const { translateText } = useI18n();
  const [expanded, setExpanded] = useState(false);
  const statusColor = STATUS_COLORS[application.status] || STATUS_COLORS.pending;

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
          <p style={{ margin: '4px 0', opacity: 0.7, fontSize: '0.9em' }}>{application.artist_city}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span
            style={{
              padding: '4px 12px',
              borderRadius: '12px',
              backgroundColor: statusColor,
              color: '#000',
              fontSize: '0.8em',
              fontWeight: 'bold',
            }}
          >
            {translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.status.${application.status}`)}
          </span>
          {canModerate && (
            <Stack direction="row" spacing={1} onClick={(event: any) => event.stopPropagation()}>
              <Button
                size="small"
                variant="outlined"
                color="success"
                disabled={isUpdating || application.status === 'accepted'}
                onClick={onAccept}
              >
                {translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.actions.accept`)}
              </Button>
              <Button
                size="small"
                variant="outlined"
                color="error"
                disabled={isUpdating || application.status === 'rejected'}
                onClick={onReject}
              >
                {translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.actions.reject`)}
              </Button>
            </Stack>
          )}
          <span style={{ fontSize: '1.2em', transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>&#9660;</span>
        </div>
      </div>

      {expanded && (
        <div style={{ padding: '0 20px 20px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <ApplicationSurveyView surveyResponses={application.survey_responses || {}} />
        </div>
      )}
    </div>
  );
};

const OpenCallDetailsPage = () => {
  const { translateText } = useI18n();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const urlParameters = useParams();
  const openCallId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const loggedUser = useSelector(selectCurrentUser);

  const { actions: openCallActions } = useOpenCallsSlice();
  const selectOpenCallById = selectorOpenCalls.makeSelectItemById();
  const currentOpenCall = useSelector((state: RootState) =>
    openCallId ? selectOpenCallById(state, openCallId) : undefined
  );
  const openCallLoading = useSelector(selectorOpenCalls.selectLoading);

  const { actions: artistActions } = useArtistsSlice();
  const selectArtistById = selectorArtists.makeSelectItemById();
  const currentArtist: ArtistModel | undefined = useSelector((state: RootState) => {
    if (loggedUser?.currentProfileInfo?.identifier) {
      return selectArtistById(state, loggedUser?.currentProfileInfo?.identifier);
    }
    return undefined;
  });

  const { actions: applicationActions } = useOpenCallApplicationsSlice();
  const applications: OpenCallApplicationModel[] = useSelector(selectorOpenCallApplications.selectItems);
  const applicationsLoading = useSelector(selectorOpenCallApplications.selectLoading);

  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | undefined>(undefined);
  const [isArtistProfile, setIsArtistProfile] = useState(false);
  const [currentArtistId, setCurrentArtistId] = useState<string>(undefined);
  const [isMissingDocsDialogOpen, setIsMissingDocsDialogOpen] = useState(false);

  // Estados derivados que dependen de datos asíncronos
  const [isPlaceOwner, setIsPlaceOwner] = useState(false);
  const [applicationsForThisOpenCall, setApplicationsForThisOpenCall] = useState<OpenCallApplicationModel[]>([]);
  const [myApplication, setMyApplication] = useState<OpenCallApplicationModel | undefined>(undefined);
  const [canApplyToOpenCall, setCanApplyToOpenCall] = useState(false);

  useEffect(() => {
    if (openCallId) {
      dispatch(openCallActions.getItemById({ id: openCallId }));
      // La ruta /open-call-applications no filtra por query params server-side hoy; el filtro real ocurre abajo.
      dispatch(applicationActions.loadItems({ queryParams: { open_call_id: openCallId } }));
    }
  }, [openCallId]);

  useEffect(() => {
    if (!!loggedUser) {
      // Determinar el tipo de perfil actual
      const currentProfileEntity = loggedUser?.currentProfileInfo?.entity;
      const isArtist = currentProfileEntity === ArtistModel.name;

      if (isArtist) {
        dispatch(artistActions.getItemById({ id: loggedUser?.currentProfileInfo?.identifier }));
      }

      setIsArtistProfile(isArtist);
      setCurrentArtistId(isArtist ? loggedUser?.currentProfileInfo?.id : undefined);

      // Actualizar isPlaceOwner cuando cambian loggedUser o currentOpenCall
      const currentOpenCallPlaceId = currentOpenCall?.placeId;
      const placeOwner =
        !!loggedUser && !!currentOpenCallPlaceId && loggedUser.checkPermissions(currentOpenCallPlaceId).canEdit;
      setIsPlaceOwner(placeOwner);
    }
  }, [loggedUser, currentOpenCall]);

  // Actualizar aplicaciones filtradas cuando cambian applications u openCallId
  useEffect(() => {
    if (!applicationsLoading) {
      const filteredApplications = applications.filter((app) => app.openCallId === openCallId);
      setApplicationsForThisOpenCall(filteredApplications);
    }
  }, [applications, applicationsLoading, openCallId]);

  // Actualizar myApplication cuando cambian applicationsForThisOpenCall o currentArtistId
  useEffect(() => {
    if (currentArtistId && applicationsForThisOpenCall.length > 0) {
      const foundApplication = applicationsForThisOpenCall.find((app) => app.artistId === currentArtistId);
      setMyApplication(foundApplication);
    } else {
      setMyApplication(undefined);
    }
  }, [applicationsForThisOpenCall, currentArtistId]);

  // Actualizar canApplyToOpenCall cuando cambian las condiciones necesarias
  useEffect(() => {
    if (currentOpenCall && isArtistProfile && !applicationsLoading) {
      const canApply = !myApplication && !currentOpenCall.isExpired;
      setCanApplyToOpenCall(canApply);
    } else {
      setCanApplyToOpenCall(false);
    }
  }, [isArtistProfile, applicationsLoading, myApplication, currentOpenCall]);

  const handleApplyClick = () => {
    // Validar si el artista tiene documentos faltantes
    if (isArtistProfile && currentArtist && currentArtist.openCallDocumentCheckList.length > 0) {
      // Abrir el diálogo de documentos faltantes
      setIsMissingDocsDialogOpen(true);
    } else {
      // Si no hay documentos faltantes, navegar a la página de aplicación
      navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.APPLY}/${openCallId}`);
    }
  };

  const handleSetStatus = (application: OpenCallApplicationModel, status: 'accepted' | 'rejected') => {
    setUpdatingApplicationId(application.id);
    dispatch(
      applicationActions.postActionItem({
        id: application.id,
        action: 'setStatus',
        newItem: {},
        params: { status },
      })
    );
  };

  return (
    <>
      {openCallLoading && !currentOpenCall && <AppLoader />}
      {!openCallLoading && !currentOpenCall && <NotFoundPage />}
      <BackButton />
      <div className="open-call-page">
        {currentOpenCall && (
          <OpenCallPresentation
            openCall={currentOpenCall}
            onApply={canApplyToOpenCall ? handleApplyClick : undefined}
          />
        )}

        <div className="step-content">
          {isPlaceOwner && (
            <>
              <h3 className="step-title">
                {translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.applications_received_title`)} (
                {applicationsForThisOpenCall.length})
              </h3>
              {applicationsLoading && (
                <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.loading_applications`)}</p>
              )}
              {!applicationsLoading && applicationsForThisOpenCall.length === 0 && (
                <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.no_applications_yet`)}</p>
              )}
              {applicationsForThisOpenCall.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  canModerate
                  isUpdating={applicationsLoading && updatingApplicationId === application.id}
                  onAccept={() => handleSetStatus(application, 'accepted')}
                  onReject={() => handleSetStatus(application, 'rejected')}
                />
              ))}
            </>
          )}

          {isArtistProfile && (
            <>
              <h3 className="step-title">
                {translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.your_application_title`)}
              </h3>
              {applicationsLoading && (
                <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.loading_your_application`)}</p>
              )}
              {!applicationsLoading && !myApplication && (
                <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.not_applied_yet`)}</p>
              )}
              {myApplication && (
                <ApplicationCard
                  application={myApplication}
                  canModerate={false}
                  isUpdating={false}
                  onAccept={() => undefined}
                  onReject={() => undefined}
                />
              )}
            </>
          )}

          {!isPlaceOwner && !isArtistProfile && (
            <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.unauthorized_message`)}</p>
          )}
        </div>

        <div className="step-navigation">
          <button type="button" className="nav-btn btn-prev" onClick={() => navigate(`/${PATHS.OPEN_CALLS}`)}>
            {translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.back_button`)}
          </button>
        </div>
      </div>
      {isArtistProfile && currentArtist && currentArtist.openCallDocumentCheckList.length > 0 && (
        <AppDialog
          isOpenDialog={isMissingDocsDialogOpen}
          onClose={() => setIsMissingDocsDialogOpen(false)}
          title={translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.missing_documents_title`)}
          content={
            <div className="missing-documents-section">
              <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.missing_documents_message`)}</p>
              <ol>
                {currentArtist.openCallDocumentCheckList.map((doc, index) => (
                  <li key={index}>
                    {doc.field}
                    {doc.translationPath && ` - ${translateText(doc.translationPath)}`}
                  </li>
                ))}
              </ol>
            </div>
          }
        />
      )}
    </>
  );
};

export default OpenCallDetailsPage;
