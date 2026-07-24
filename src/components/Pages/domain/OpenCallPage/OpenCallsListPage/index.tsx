import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useOpenCallsSlice, selectorOpenCalls } from '~/common/slices/domain/open-calls/open-calls.redux';
import {
  useOpenCallApplicationsSlice,
  selectorOpenCallApplications,
} from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { OpenCallApplicationModel } from '~/models/domain/open-call/open-call-application.model';
import { useI18n } from '~/common/utils';
import { DefaultTransformerContext, TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { PATHS, SUB_PATHS } from '~/constants';
import {
  MyOpenCallsDataTemplate,
  OPEN_CALLS_LIST_ARTIST_CONFIG,
  OPEN_CALLS_LIST_PLACE_CONFIG,
  TRANSLATION_BASE_OPEN_CALLS_LIST_PAGE,
} from './config-open-calls-list';

const OpenCallsListPage = () => {
  const { translateText } = useI18n();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectCurrentUser);

  const { actions: openCallActions } = useOpenCallsSlice();
  const openCalls = useSelector(selectorOpenCalls.selectItems);
  const openCallsLoading = useSelector(selectorOpenCalls.selectLoading);

  const { actions: openCallApplicationActions } = useOpenCallApplicationsSlice();
  const applications: OpenCallApplicationModel[] = useSelector(selectorOpenCallApplications.selectItems);
  const applicationsLoading = useSelector(selectorOpenCallApplications.selectLoading);

  // `.id` en vez de `.entity`/`.identifier`: estos últimos dependen de que el username cacheado en
  // roles[].entityRoleMap[] esté sincronizado con la entidad viva, lo que hoy no ocurre para Place.
  const isPlaceProfile = !!loggedUser?.isPlaceProfile;
  const isArtistProfile = !!loggedUser?.isArtistProfile;
  const currentArtistId = isArtistProfile ? loggedUser?.currentProfileInfo?.id : undefined;
  const currentPlaceId = isPlaceProfile ? loggedUser?.currentProfileInfo?.id : undefined;

  useEffect(() => {
    dispatch(openCallActions.loadItems({}));
  }, []);

  useEffect(() => {
    if (currentArtistId) {
      // La ruta /open-call-applications no filtra por query params server-side hoy; el filtro real ocurre en `myApplications` abajo.
      dispatch(openCallApplicationActions.loadItems({ queryParams: { artist_id: currentArtistId } }));
    }
  }, [currentArtistId]);

  // `oc.placeId` resuelve tanto `place_id` string como el sub-documento populado por Mongoose, siempre por id real.
  const myOpenCalls = currentPlaceId ? openCalls.filter((oc) => oc.placeId === currentPlaceId) : openCalls;
  const activeCalls = myOpenCalls.filter((oc) => oc.status === 'OPEN');
  const pastCalls = myOpenCalls.filter((oc) => oc.status !== 'OPEN');
  const myApplications = currentArtistId ? applications.filter((app) => app.artistId === currentArtistId) : [];

  const entityData: MyOpenCallsDataTemplate = {
    active_calls: activeCalls.map((oc: any) => ({
      id: oc.identifier || oc.id,
      event_name: oc.event_name,
      event_date: oc.event_date,
      start_date: oc.start_date,
      end_date: oc.end_date,
      status: oc.status,
      applications_count: oc.applications_count || 0,
      city: oc.city,
      genres: Array.isArray(oc.genres) ? oc.genres.join(', ') : oc.genres || '',
    })),
    past_calls: pastCalls.map((oc: any) => ({
      id: oc.identifier || oc.id,
      event_name: oc.event_name,
      event_date: oc.event_date,
      status: oc.status,
    })),
    applications: myApplications.map((app) => ({
      id: app.identifier,
      open_call_id: app.openCallId,
      event_name: app.openCallSummary?.event_name || '',
      event_date: app.openCallSummary?.event_date || '',
      city: app.openCallSummary?.city || '',
      application_status: app.status,
    })),
  };

  const config = isPlaceProfile ? OPEN_CALLS_LIST_PLACE_CONFIG : OPEN_CALLS_LIST_ARTIST_CONFIG;

  const handlers = {
    onClickRow: (row: any) => {
      if (isPlaceProfile) {
        navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}/${row.id}`);
      } else {
        navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.APPLY}/${row.id}`);
      }
    },
    onClickApplicationRow: (row: any) => {
      if (row.open_call_id) {
        navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}/${row.open_call_id}`);
      }
    },
  };

  const defaultTransformerContext: DefaultTransformerContext = {
    entityData,
    handlers,
    translationBasePath: TRANSLATION_BASE_OPEN_CALLS_LIST_PAGE,
    translateText,
  };

  const loading = openCallsLoading || (isArtistProfile && applicationsLoading);

  return (
    <>
      <h2>{isPlaceProfile ? 'Mis Convocatorias' : 'Convocatorias Disponibles'}</h2>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <TabbedPanel rawConfig={config} defaultTransformerContext={defaultTransformerContext} />
      )}
    </>
  );
};

export default OpenCallsListPage;
