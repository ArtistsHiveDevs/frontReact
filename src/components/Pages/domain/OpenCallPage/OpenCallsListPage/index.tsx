import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useOpenCallsSlice, selectorOpenCalls } from '~/common/slices/domain/open-calls/open-calls.redux';
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
  const loading = useSelector(selectorOpenCalls.selectLoading);

  const isPlaceProfile = loggedUser?.currentProfileInfo?.entity === 'PlaceModel';

  useEffect(() => {
    dispatch(openCallActions.loadItems({}));
  }, []);

  const activeCalls = openCalls.filter((oc: any) => oc.status === 'OPEN');
  const pastCalls = openCalls.filter((oc: any) => oc.status !== 'OPEN');

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
    applications: [],
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
  };

  const defaultTransformerContext: DefaultTransformerContext = {
    entityData,
    handlers,
    translationBasePath: TRANSLATION_BASE_OPEN_CALLS_LIST_PAGE,
    translateText,
  };

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
