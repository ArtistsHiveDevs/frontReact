import { PayloadAction } from '@reduxjs/toolkit';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { selectApiKey } from '~/common/slices/app-base/APIKey/selectors';
import { ResponseError, postRequest, request } from '~/common/utils/request';

import { pendingProfilesActions as actions } from '.';
import { PendingProfilesData, PendingProfilesErrorType, ReviewProfilePayload } from './types';

interface PendingProfilesResponse {
  data: PendingProfilesData;
}

function* getPendingProfiles(): Generator<any, void, any> {
  const { apiKey }: { apiKey: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/admin/pending-profiles`;

  try {
    const response: PendingProfilesResponse = yield call(request, requestURL, {
      headers: { 'x-api-key': apiKey },
    });
    yield put(actions.pendingProfilesLoaded(response?.data || { artists: [], places: [] }));
  } catch (err) {
    const errorContent = yield call(() => (err as ResponseError).content);
    yield put(actions.repoError({ errorType: PendingProfilesErrorType.RESPONSE_ERROR, error: errorContent }));
  }
}

function* reviewProfile(actionParams?: PayloadAction<ReviewProfilePayload>): Generator<any, void, any> {
  const { apiKey }: { apiKey: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/admin/pending-profiles/review`;

  try {
    yield call(postRequest, requestURL, {
      body: JSON.stringify(actionParams?.payload),
      headers: { 'x-api-key': apiKey },
    });
    yield put(actions.reviewProfileDone());
    yield put(actions.loadPendingProfiles());
  } catch (err) {
    const errorContent = yield call(() => (err as ResponseError).content);
    yield put(actions.repoError({ errorType: PendingProfilesErrorType.RESPONSE_ERROR, error: errorContent }));
  }
}

export function* pendingProfilesSaga() {
  yield takeLatest(actions.loadPendingProfiles.type, getPendingProfiles);
  yield takeLatest(actions.reviewProfile.type, reviewProfile);
}
