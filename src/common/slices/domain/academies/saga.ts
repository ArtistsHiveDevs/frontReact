import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';
import { AcademyModel } from '~/models/domain/academy/academy.model';

import { academiesActions as actions } from '.';
import { selectApiKey } from '../../app-base/APIKey/selectors';

export function* getAcademies() {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  let queryParams = ''; //`f=events,events.main_artist,events.guest_artist`;
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/academies?${queryParams}`;

  try {
    const academies: AcademyModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.academiesLoaded(academies));
  } catch (err) {
    console.log(err);
  }
}

export function* getQueriedAcademies(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload } = actionParams;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/academies?q=${payload}`;

  try {
    const academies: AcademyModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.queriedAcademies(academies));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* academySaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadAcademies.type, getAcademies);
  yield takeLatest(actions.queryAcademies.type, getQueriedAcademies);
}
