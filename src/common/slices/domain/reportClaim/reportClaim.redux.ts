import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { selectApiKey } from '~/common/slices/app-base/APIKey/selectors';
import { createEntitySelectors } from '~/common/slices/base/generic-selector';
import { createEntitySlice } from '~/common/slices/base/generic-slice';
import { useInjectReducer, useInjectSaga } from '~/common/utils/redux-injectors';
import { postRequest, ResponseError } from '~/common/utils/request';
import { ReportClaimModel, ReportClaimTemplate } from '~/models/domain/reportClaim/reportClaim.model';

const sliceName = 'reportClaims';
const resourceEndpoint = `/reportclaims`;

export enum ReportClaimErrorType {
  RESPONSE_ERROR = 1,
  DUPLICATE_PENDING_REPORT = 2,
}

export const selectorReportClaims = createEntitySelectors<typeof sliceName, ReportClaimModel, ReportClaimTemplate>({
  sliceName,
});

// Extended state type for custom fields
interface ReportClaimState {
  items: string[];
  loading: boolean;
  error: number | null;
  detailedItems: { [id: string]: ReportClaimModel };
  newItemRQ: ReportClaimTemplate | null;
  createdItem: ReportClaimModel | null;
  // Custom fields
  success: boolean;
  customError: ReportClaimErrorType | null;
  errorContent: any;
}

const { slice: reportClaimSlice } = createEntitySlice({
  name: sliceName,
  Model: ReportClaimModel,
  initialState: {
    items: [],
    loading: false,
    error: null,
    detailedItems: {},
    newItemRQ: null,
    createdItem: null,
    // Custom state for submission tracking
    success: false,
    customError: null,
    errorContent: null,
  } as ReportClaimState,
  resourceEndpoint,
  selectors: {
    ...selectorReportClaims,
  },
  options: {
    disableOperations: {
      update: true,
      delete: true,
      postAction: true,
    },
    customOperations: {
      reducers: {
        itemCreated(state: ReportClaimState, action: PayloadAction<ReportClaimTemplate>) {
          const newItem = new ReportClaimModel(action.payload);
          state.detailedItems[newItem.id] = newItem;
          state.items.push(newItem.id);
          state.createdItem = newItem;
          state.newItemRQ = null;
          state.loading = false;
          state.success = true;
          state.customError = null;
          state.errorContent = null;
        },
        reportClaimFailed(state: ReportClaimState, action: PayloadAction<{ errorType: ReportClaimErrorType; error: any }>) {
          state.loading = false;
          state.success = false;
          state.customError = action.payload.errorType;
          state.errorContent = action.payload.error;
        },
        resetReportClaimState(state: ReportClaimState) {
          state.loading = false;
          state.success = false;
          state.customError = null;
          state.errorContent = null;
        },
      },
    },
  },
});

// Custom saga with specific error handling
function* sagaReportClaims() {
  yield takeLatest(reportClaimSlice.actions.createItem.type, function* createItem(
    actionParams?: PayloadAction<{ data: ReportClaimTemplate }>
  ): Generator<any, void, any> {
    yield delay(500);

    const authInfo: { apiKey: string } = yield select(selectApiKey);
    const { payload } = actionParams || {};
    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}`;

    try {
      const response: any = yield call(postRequest, requestURL, {
        body: JSON.stringify(payload?.data),
        headers: { 'x-api-key': authInfo?.apiKey },
      });

      if (response.data) {
        yield put(reportClaimSlice.actions.itemCreated(response.data));
      }
    } catch (err) {
      const responseError = err as ResponseError;
      const errorContent: any = yield call(() => responseError.content);
      const errorType =
        responseError.response?.status === 409
          ? ReportClaimErrorType.DUPLICATE_PENDING_REPORT
          : ReportClaimErrorType.RESPONSE_ERROR;
      yield put((reportClaimSlice.actions as any).reportClaimFailed({ errorType, error: errorContent }));
    }
  });
}

export const reducerReportClaims = reportClaimSlice.reducer;
export const actionsReportClaims = reportClaimSlice.actions;

// Backward compatibility aliases
export const reportClaimActions = {
  submitReportClaim: (payload: ReportClaimTemplate) => reportClaimSlice.actions.createItem({ data: payload }),
  reportClaimSucceeded: reportClaimSlice.actions.itemCreated,
  reportClaimFailed: (reportClaimSlice.actions as any).reportClaimFailed,
  resetReportClaimState: (reportClaimSlice.actions as any).resetReportClaimState,
};

export { sagaReportClaims };

export const useReportClaimSlice = () => {
  useInjectReducer({ key: reportClaimSlice.name, reducer: reportClaimSlice.reducer });
  useInjectSaga({ key: reportClaimSlice.name, saga: sagaReportClaims });

  return { actions: reportClaimActions };
};

// Custom selectors
export const selectReportClaimLoading = (state: any) => state[sliceName]?.loading;
export const selectReportClaimSuccess = (state: any) => state[sliceName]?.success;
export const selectReportClaimError = (state: any) => state[sliceName]?.customError;
export const selectReportClaimErrorContent = (state: any) => state[sliceName]?.errorContent;
