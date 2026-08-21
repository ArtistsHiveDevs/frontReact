import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectorOpenCallApplications,
  useOpenCallApplicationsSlice,
} from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { OpenCallApplicationModel } from '~/models/domain/open-call/open-call-application.model';

interface UseOpenCallApplicationsOptions {
  openCallId?: string;
  artistId?: string;
  autoLoad?: boolean;
}

/**
 * Hook para manejar las aplicaciones de un artista a open calls
 */
export const useOpenCallApplications = (options: UseOpenCallApplicationsOptions = {}) => {
  const { openCallId, artistId, autoLoad = true } = options;

  const dispatch = useDispatch();
  const { actions: applicationActions } = useOpenCallApplicationsSlice();

  const applications: OpenCallApplicationModel[] = useSelector(selectorOpenCallApplications.selectItems);
  const createdApplication: OpenCallApplicationModel = useSelector(selectorOpenCallApplications.selectCreatedItem);
  const loading = useSelector(selectorOpenCallApplications.selectLoading);
  const error = useSelector(selectorOpenCallApplications.selectError);

  const [requestedLoad, setRequestedLoad] = useState(false);
  const [previousApplication, setPreviousApplication] = useState<OpenCallApplicationModel | undefined>(undefined);

  // Cargar aplicaciones cuando se tienen los parámetros necesarios
  useEffect(() => {
    if (autoLoad && openCallId && artistId && !requestedLoad) {
      dispatch(applicationActions.loadItems({ queryParams: { open_call_id: openCallId } }));
      setRequestedLoad(true);
    }
  }, [openCallId, artistId, requestedLoad, autoLoad, dispatch, applicationActions]);

  // Buscar si ya existe una aplicación previa para esta open call y artista
  useEffect(() => {
    if (artistId && applications && applications.length > 0 && openCallId) {
      const found = applications.find(
        (app) => app.openCallId === openCallId && app.artistId === artistId
      );
      setPreviousApplication(found);
    } else {
      setPreviousApplication(undefined);
    }
  }, [applications, artistId, openCallId]);

  // Helper para verificar si una aplicación pertenece a este openCall y artista
  const belongsToThisOpenCallAndArtist = (application?: OpenCallApplicationModel) =>
    !!application && application.openCallId === openCallId && application.artistId === artistId;

  // Crear una nueva aplicación
  const createApplication = (data: any) => {
    dispatch(applicationActions.createItem({ data }));
  };

  return {
    applications,
    createdApplication,
    loading,
    error,
    previousApplication,
    requestedLoad,
    belongsToThisOpenCallAndArtist,
    createApplication,
    actions: applicationActions,
  };
};
