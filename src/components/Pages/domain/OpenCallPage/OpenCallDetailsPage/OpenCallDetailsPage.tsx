import { Button, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectApiKey } from '~/common/slices/app-base/APIKey/selectors';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import {
  selectorOpenCallApplications,
  useOpenCallApplicationsSlice,
} from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { selectorOpenCalls, useOpenCallsSlice } from '~/common/slices/domain/open-calls/open-calls.redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { buildQueryString, request } from '~/common/utils/request';
import { RootState } from '~/common/utils/redux-injectors/types';
import ApplicationSurveyView from '~/components/Pages/domain/OpenCallPage/OpenCallApplicationPage/ApplicationSurveyView';
import '~/components/Pages/domain/OpenCallPage/OpenCallApplicationPage/index.scss';
import { TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE } from '~/components/Pages/domain/OpenCallPage/OpenCallDetailsPage/config-open-call-details';
import OpenCallPresentation from '~/components/Pages/domain/OpenCallPage/OpenCallDetailsPage/OpenCallPresentation';
import NotFoundPage from '~/components/Pages/NotFoundPage';
import { BackButton } from '~/components/shared/app/atoms/navigation-buttons/back-buttons';
import {
  ProfilePictureWithName,
  ProfilePictureWithNameConstants,
} from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureWithName';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { OpenCallApplicationModel, OpenCallModelV1 } from '~/models/domain/open-call/v1';

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

  const applicationArtist = application?.artist
    ? new ArtistModel({
        ...application.artist,
        id: application.artist.id || application.artist._id || application?.artistId,
      } as any)
    : undefined;

  return (
    <div
      className="application-card"
      style={{
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: '8px',
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
          flexDirection: 'column',
        }}
        onClick={() => setExpanded((prev) => !prev)}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '1rem',
            cursor: 'pointer',
            flexDirection: 'row',
            gap: '0.7rem',
          }}
        >
          <div onClick={(event: any) => event.stopPropagation()}>
            <ProfilePictureWithName
              element={{
                ...application?.artist,
                entity: ArtistModel.name,
                identifier: applicationArtist?.identifier,
              }}
              zoomable
              showProfileSummary
              profileSummaryData={applicationArtist}
            />
          </div>
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {canModerate && false && (
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
          <ApplicationSurveyView
            surveyResponses={{
              ...(application.survey_responses || {}),
              ...{
                total: applicationArtist.music_performance.length,
                gender: applicationArtist.getMembersPercentagePerAttribute('gender'),
                gender_identity: applicationArtist.getMembersPercentagePerAttribute('gender_identity'),
                member_instrument: applicationArtist.getMembersPercentagePerAttribute('member_instrument'),
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

const OpenCallDetailsPage = () => {
  const { translateText, translateGlobalDict, getFormattedMessage } = useI18n();
  const { navigateToEntity, navigateToInnerPath } = useNavigation();
  const dispatch = useDispatch();
  const urlParameters = useParams();
  const openCallId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const loggedUser = useSelector(selectCurrentUser);
  const { actions: usersActions } = useUsersSlice();

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
  const [isActingAsOwningPlace, setIsActingAsOwningPlace] = useState(false);
  const [applicationsForThisOpenCall, setApplicationsForThisOpenCall] = useState<OpenCallApplicationModel[]>([]);
  const [myApplication, setMyApplication] = useState<OpenCallApplicationModel | undefined>(undefined);
  const [canApplyToOpenCall, setCanApplyToOpenCall] = useState(false);
  const [hasAppliedByStatus, setHasAppliedByStatus] = useState(false);
  const apiKey = useSelector(selectApiKey)?.apiKey;
  const currentArtistIdentifier = loggedUser?.currentProfileInfo?.identifier;

  // Estado directo (open call + artista), independiente de la lista filtrada por ownership.
  useEffect(() => {
    setHasAppliedByStatus(false);
    if (!openCallId || !currentArtistIdentifier || !isArtistProfile || !apiKey) {
      return;
    }

    let cancelled = false;
    const query = buildQueryString({ open_call_id: openCallId, artist_id: currentArtistIdentifier });
    request(`${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/open-call-applications/status${query}`, {
      headers: { 'x-api-key': apiKey },
    })
      .then((response) => {
        if (!cancelled) {
          setHasAppliedByStatus(!!(response as { applied?: boolean })?.applied);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [openCallId, currentArtistIdentifier, isArtistProfile, apiKey]);

  useEffect(() => {
    if (openCallId) {
      window.scrollTo(0, 0);
      dispatch(openCallActions.getItemById({ id: openCallId }));
      dispatch(applicationActions.loadItems({ queryParams: { open_call_id: openCallId } }));
    }
  }, [openCallId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!!loggedUser) {
      // Determinar el tipo de perfil actual
      const currentProfileEntity = loggedUser?.currentProfileInfo?.entity;
      const isArtist = currentProfileEntity === ArtistModel.name;

      if (isArtist) {
        dispatch(artistActions.getItemById({ id: loggedUser?.currentProfileInfo?.identifier }));
      }

      setIsArtistProfile(isArtist);
      setCurrentArtistId(isArtist ? loggedUser?.currentProfileInfo?.id : undefined);

      const currentOpenCallPlaceId = currentOpenCall?.place?.identifier;
      const permissions = currentOpenCallPlaceId ? loggedUser.checkPermissions(currentOpenCallPlaceId) : undefined;
      setIsPlaceOwner(!!currentOpenCallPlaceId && !!permissions?.canEdit);
      setIsActingAsOwningPlace(!!currentOpenCallPlaceId && !!permissions?.isInProfile);
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
      const foundApplication = applicationsForThisOpenCall.find((app) => app.artist?.id === currentArtistId);

      setMyApplication(foundApplication);
    } else {
      setMyApplication(undefined);
    }
  }, [applicationsForThisOpenCall, currentArtistId]);

  // Actualizar canApplyToOpenCall cuando cambian las condiciones necesarias
  useEffect(() => {
    if (currentOpenCall && isArtistProfile && !applicationsLoading) {
      const canApply = !myApplication && !hasAppliedByStatus && !currentOpenCall.isExpired;
      setCanApplyToOpenCall(canApply);
    } else {
      setCanApplyToOpenCall(false);
    }
  }, [isArtistProfile, applicationsLoading, myApplication, hasAppliedByStatus, currentOpenCall]);

  const currentOpenCallPlaceId = currentOpenCall?.place?.identifier;
  const artistMemberships: CurrentProfileInfoModel[] = loggedUser?.getMembershipsByEntity('artists') || [];

  const renderArtistMembershipsSwitcher = () => (
    <Stack spacing={1}>
      {artistMemberships.map((membership) => (
        <ProfilePictureWithName
          key={membership.identifier}
          element={membership}
          direction={ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL}
          showSubtitle
          actionable
          onProfileClick={() => dispatch(usersActions.switchProfile({ id: membership.identifier }))}
        />
      ))}
    </Stack>
  );

  const handleApplyClick = () => {
    // Validar si el artista tiene documentos faltantes
    if (isArtistProfile && currentArtist && currentArtist.openCallDocumentCheckList.length > 0) {
      // Abrir el diálogo de documentos faltantes
      setIsMissingDocsDialogOpen(true);
    } else {
      // Si no hay documentos faltantes, navegar a la página de aplicación
      // navigateToInnerPath({ path: ${PATHS.OPEN_CALLS}/${SUB_PATHS.APPLY}/${openCallId}` });
      navigateToEntity({ entityType: OpenCallModelV1.name, id: openCallId, action: SUB_PATHS.APPLY });
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
            alreadyApplied={isArtistProfile && !applicationsLoading && (!!myApplication || hasAppliedByStatus)}
            isOwner={isActingAsOwningPlace}
          />
        )}

        <div className="step-content">
          {isActingAsOwningPlace && (
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
              <div className="applications-grid">
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
              </div>
            </>
          )}

          {isArtistProfile && !!myApplication && (
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

          {/* Caso 1: dueño de la convocatoria, pero navegando con otro perfil */}
          {isPlaceOwner && !isActingAsOwningPlace && (
            <div className="unauthorized-section">
              <p>
                {getFormattedMessage(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.owner_switch_message`, {
                  placeName: currentOpenCall?.placeProfileInfo?.name,
                })}
              </p>
              {currentOpenCall?.placeProfileInfo && (
                <ProfilePictureWithName
                  element={currentOpenCall.placeProfileInfo}
                  direction={ProfilePictureWithNameConstants.DISPLAY_HORIZONTAL}
                  showSubtitle
                  actionable
                  zoomable
                  onProfileClick={() =>
                    currentOpenCallPlaceId && dispatch(usersActions.switchProfile({ id: currentOpenCallPlaceId }))
                  }
                />
              )}
              {/* Ser dueño del lugar no excluye tener también perfiles de artista asociados. */}
              {artistMemberships.length > 0 && !isArtistProfile && (
                <>
                  <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.or_switch_to_artist_message`)}</p>
                  {renderArtistMembershipsSwitcher()}
                </>
              )}
            </div>
          )}

          {/* Caso 2: logueado, pero sin perfil de artista activo (ni dueño del lugar) */}
          {!!loggedUser && !isPlaceOwner && !isArtistProfile && (
            <div className="unauthorized-section">
              <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.not_artist_profile_message`)}</p>
              {artistMemberships.length > 0 ? (
                renderArtistMembershipsSwitcher()
              ) : (
                <>
                  <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.no_artist_memberships_message`)}</p>
                  <Button variant="outlined" onClick={() => navigateToInnerPath({ path: PATHS.INDUSTRY })}>
                    {translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.go_to_industry_button`)}
                  </Button>
                </>
              )}
            </div>
          )}

          {/* Caso 3: usuario no logueado */}
          {!loggedUser && (
            <div className="unauthorized-section">
              <p>{translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.unauthorized_message`)}</p>
              <Button variant="outlined" onClick={() => navigateToInnerPath({ path: PATHS.LOGIN })}>
                {translateGlobalDict('actions.accounts.login')}
              </Button>
            </div>
          )}
        </div>

        <div className="step-navigation">
          <button
            type="button"
            className="nav-btn btn-prev"
            onClick={() => navigateToInnerPath({ path: PATHS.OPEN_CALLS })}
          >
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
                  <li key={index}>{doc.translationPath && `${translateGlobalDict(doc.translationPath)}`}</li>
                ))}
              </ol>
            </div>
          }
          actions={[
            {
              label: translateText('app.pages.OpenCallDetailsPage.actions.complete_profile'),
              handler: () =>
                navigateToEntity({
                  entityType: ArtistModel.name,
                  id: currentArtist.identifier,
                  action: SUB_PATHS.EDIT,
                }),
            },
          ]}
        />
      )}
    </>
  );
};

export default OpenCallDetailsPage;
