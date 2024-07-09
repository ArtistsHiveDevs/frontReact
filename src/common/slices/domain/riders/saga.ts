import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';
import { ArtistRiderModel } from '~/models/domain/rider/rider.model';

import { ridersActions as actions } from '.';
import { selectApiKey } from '../../app-base/APIKey/selectors';

export function* getRiders() {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
  let queryParams = `f=events,events.main_artist,events.guest_artist`;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/riders?${queryParams}`;

  try {
    const riders: ArtistRiderModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.ridersLoaded(riders));
  } catch (err) {
    console.log(err);
  }
}

export function* getQueriedRiders(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload } = actionParams;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/riders?q=${payload}`;

  try {
    const riders: ArtistRiderModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.queriedRiders(riders));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* riderSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadRiders.type, getRiders);
  yield takeLatest(actions.queryRiders.type, getQueriedRiders);
}
