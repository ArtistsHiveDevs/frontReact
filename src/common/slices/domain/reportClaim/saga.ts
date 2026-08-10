import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { selectApiKey } from '~/common/slices/app-base/APIKey/selectors';
import { ResponseError, postRequest } from '~/common/utils/request';

import { reportClaimActions as actions } from '.';
import { ReportClaimErrorType, SubmitReportClaimPayload } from './types';

function* submitReportClaim(actionParams?: PayloadAction<SubmitReportClaimPayload>): Generator<any, void, any> {
  const { apiKey }: { apiKey: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/reportclaims`;

  try {
    yield call(postRequest, requestURL, {
      body: JSON.stringify(actionParams?.payload),
      headers: { 'x-api-key': apiKey },
    });
    yield put(actions.reportClaimSucceeded());
  } catch (err) {
    const responseError = err as ResponseError;
    const errorContent = yield call(() => responseError.content);
    const errorType =
      responseError.response?.status === 409
        ? ReportClaimErrorType.DUPLICATE_PENDING_REPORT
        : ReportClaimErrorType.RESPONSE_ERROR;
    yield put(actions.reportClaimFailed({ errorType, error: errorContent }));
  }
}

export function* reportClaimSaga() {
  yield takeLatest(actions.submitReportClaim.type, submitReportClaim);
}
