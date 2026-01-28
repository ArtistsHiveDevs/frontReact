import { createSelector } from '@reduxjs/toolkit';
import { Dayjs } from 'dayjs';
import { PreBookingRequestModel, PreBookingRequestStatus, PreBookingRequestTemplate } from '~/models/domain/prebooking';

import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { RootState } from '~/common/utils/redux-injectors/types';

const sliceName = 'prebookingRequests';
const resourceEndpoint = `/prebooking`;

export const selectorPreBookingRequests = createEntitySelectors<
  typeof sliceName,
  PreBookingRequestModel,
  PreBookingRequestTemplate
>({ sliceName });

const { slice: preBookingRequestSlice, saga: sagaPreBookingRequests } = createEntitySlice({
  name: sliceName,
  Model: PreBookingRequestModel,
  initialState: {
    items: [],
    loading: false,
    error: null,
    detailedItems: {},
    newItemRQ: null,
    createdItem: null,
  },
  resourceEndpoint,
  selectors: {
    ...selectorPreBookingRequests,
  },
});

// Exporta el reducer y el saga para integrarlo en tu store y rootSaga respectivamente
export const reducerPreBookingRequests = preBookingRequestSlice.reducer;
export const actionsPreBookingRequests = preBookingRequestSlice.actions;
export { sagaPreBookingRequests };

export const usePreBookingRequestsSlice = () => {
  useInjectReducer({ key: preBookingRequestSlice.name, reducer: preBookingRequestSlice.reducer });
  useInjectSaga({ key: preBookingRequestSlice.name, saga: sagaPreBookingRequests });

  return { actions: preBookingRequestSlice.actions };
};

// ===== SELECTORES PERSONALIZADOS (Fase 1.5) =====

// Estado inicial por defecto
const prebookingInitialState: any = {
  items: [],
  loading: false,
  error: null,
  detailedItems: {},
  newItemRQ: null,
  createdItem: null,
};

// Seleccionar el dominio de prebooking del state
const selectDomain = (state: RootState) => state?.[sliceName] || prebookingInitialState;

// Selectores básicos adicionales
export const selectAllPreBookingRequests = createSelector(
  [selectDomain],
  (prebookingState) => prebookingState.items as PreBookingRequestModel[]
);

/**
 * Selecciona solicitudes pendientes del usuario (como participante)
 * Incluye tanto recibidas como enviadas que estén activas
 */
export const selectPendingRequests = createSelector(
  [selectAllPreBookingRequests, (_state: RootState, userId: string) => userId],
  (requests, userId) => {
    return requests.filter((request) => {
      const isParticipant = request.getAllParticipantIds().includes(userId);
      const isActive = request.isActive();
      const isPending =
        request.status !== PreBookingRequestStatus.ALL_ACCEPTED && request.status !== PreBookingRequestStatus.CONVERTED;
      return isParticipant && isActive && isPending;
    });
  }
);

/**
 * Selecciona solicitudes recibidas por el usuario
 * (donde el usuario es recipient o additional_participant, NO requester)
 */
export const selectReceivedRequests = createSelector(
  [selectAllPreBookingRequests, (_state: RootState, userId: string) => userId],
  (requests, userId) => {
    return requests.filter((request) => {
      const isRecipient = request.recipient_ids.includes(userId);
      const isAdditional = request.additional_participant_ids.includes(userId);
      const isNotRequester = request.requester_id !== userId;
      return (isRecipient || isAdditional) && isNotRequester;
    });
  }
);

/**
 * Selecciona solicitudes enviadas por el usuario
 * (donde el usuario es el requester)
 */
export const selectSentRequests = createSelector(
  [selectAllPreBookingRequests, (_state: RootState, userId: string) => userId],
  (requests, userId) => {
    return requests.filter((request) => request.requester_id === userId);
  }
);

/**
 * Selecciona solicitudes por rango de fechas
 */
export const selectRequestsByDateRange = createSelector(
  [
    selectAllPreBookingRequests,
    (_state: RootState, startDate: Dayjs) => startDate,
    (_state: RootState, _startDate: Dayjs, endDate: Dayjs) => endDate,
  ],
  (requests, startDate, endDate) => {
    return requests.filter((request) => {
      const requestDate = request.requested_date_start;
      return requestDate.isAfter(startDate) && requestDate.isBefore(endDate);
    });
  }
);

/**
 * Selecciona solicitudes que requieren acción del usuario
 * (solicitudes recibidas donde el usuario puede aprobar/rechazar)
 */
export const selectRequestsRequiringAction = createSelector(
  [selectAllPreBookingRequests, (_state: RootState, userId: string) => userId],
  (requests, userId) => {
    return requests.filter((request) => request.canApprove(userId));
  }
);

/**
 * Cuenta solicitudes que requieren acción del usuario
 * Útil para badges en UI
 */
export const selectRequestsRequiringActionCount = createSelector(
  [selectRequestsRequiringAction],
  (requests) => requests.length
);
