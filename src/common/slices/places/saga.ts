import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';
import { PlaceModel } from '~/models/domain/place/place.model';

import { placesActions as actions } from '.';
import { selectApiKey } from '../app-base/APIKey/selectors';
import { selectPlaces } from './selectors';

export function* getPlaces() {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
  let queryParams = `f=events,events.main_place,events.guest_place`;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/places?${queryParams}`;

  try {
    const places: PlaceModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.placesLoaded(places));
  } catch (err) {
    console.log(err);
  }
}

export function* getPlaceById(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload: requestedPlaceID } = actionParams;
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/places/${requestedPlaceID}`;

  try {
    const previousPlaces: PlaceModel[] = yield select(selectPlaces);
    const previousPlace = previousPlaces.find((place) => place.id === requestedPlaceID);

    let placeById: PlaceModel = undefined;
    if (previousPlace) {
      placeById = previousPlace;
    } else {
      placeById = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });
    }

    yield put(actions.placeByIdLoaded(placeById));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

export function* getQueriedPlaces(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload } = actionParams;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/places?q=${payload}`;

  try {
    const places: PlaceModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.queriedPlaces(places));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* placeSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadPlaces.type, getPlaces);
  yield takeLatest(actions.queryPlaces.type, getQueriedPlaces);
  yield takeLatest(actions.getPlaceById.type, getPlaceById);
}
