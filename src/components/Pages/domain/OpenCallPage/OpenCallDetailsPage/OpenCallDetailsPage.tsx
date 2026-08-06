import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Stack } from '@mui/material';
import { useI18n } from '~/common/utils';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useOpenCallsSlice, selectorOpenCalls } from '~/common/slices/domain/open-calls/open-calls.redux';
import {
  useOpenCallApplicationsSlice,
  selectorOpenCallApplications,
} from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { OpenCallApplicationModel } from '~/models/domain/open-call/open-call-application.model';
import { RootState } from '~/common/utils/redux-injectors/types';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import NotFoundPage from '~/components/Pages/NotFoundPage';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import OpenCallSurveyReadOnly from '../OpenCallApplicationPage/OpenCallSurveyReadOnly';
import { TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE } from './config-open-call-details';
import OpenCallPresentation from './OpenCallPresentation';
import '../OpenCallApplicationPage/index.scss';

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
          <OpenCallSurveyReadOnly surveyResponses={application.survey_responses || {}} />
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

  const { actions: applicationActions } = useOpenCallApplicationsSlice();
  const applications: OpenCallApplicationModel[] = useSelector(selectorOpenCallApplications.selectItems);
  const applicationsLoading = useSelector(selectorOpenCallApplications.selectLoading);

  const [updatingApplicationId, setUpdatingApplicationId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (openCallId) {
      dispatch(openCallActions.getItemById({ id: openCallId }));
      // La ruta /open-call-applications no filtra por query params server-side hoy; el filtro real ocurre abajo.
      dispatch(applicationActions.loadItems({ queryParams: { open_call_id: openCallId } }));
    }
  }, [openCallId]);

  const currentOpenCallPlaceId = currentOpenCall?.placeId;
  const isPlaceOwner = !!loggedUser && !!currentOpenCallPlaceId && loggedUser.checkPermissions(currentOpenCallPlaceId).canEdit;
  // `.id` en vez de `.entity`/`.identifier`: este último depende del username cacheado en
  // roles[].entityRoleMap[], que puede quedar desincronizado con la entidad viva.
  const isArtistProfile = !!loggedUser?.isArtistProfile;
  const currentArtistId = isArtistProfile ? loggedUser?.currentProfileInfo?.id : undefined;

  const applicationsForThisOpenCall = applications.filter((app) => app.openCallId === openCallId);
  const myApplication = currentArtistId
    ? applicationsForThisOpenCall.find((app) => app.artistId === currentArtistId)
    : undefined;

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

  if (openCallLoading && !currentOpenCall) {
    return <AppLoader />;
  }

  if (!currentOpenCall) {
    return <NotFoundPage />;
  }

  const canApplyToOpenCall = isArtistProfile && !applicationsLoading && !myApplication && !currentOpenCall.isExpired;

  return (
    <div className="open-call-page">
      <OpenCallPresentation
        openCall={currentOpenCall}
        onApply={
          canApplyToOpenCall
            ? () => navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.APPLY}/${openCallId}`)
            : undefined
        }
      />

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
  );
};

export default OpenCallDetailsPage;
