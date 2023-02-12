import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest, delay } from "redux-saga/effects";

import { request } from "~/common/utils/request";
import { PlaceModel } from "~/models/domain/place/place.model";

import { placesActions as actions } from ".";

export function* getPlaces() {
  yield delay(500);
  let queryParams = `f=events,events.main_artist,events.guest_artist`;

  const requestURL = `${
    import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
  }/places?${queryParams}`;

  try {
    const places: PlaceModel[] = yield call(request, requestURL);

    yield put(actions.placesLoaded(places));
  } catch (err) {
    console.log(err);
  }
}

export function* getQueriedPlaces(actionParams?:PayloadAction<string>) {
  yield delay(500);

  const {payload} = actionParams;

  const requestURL = `${
    import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
  }/places?q=${payload}`;

  try {
    const places: PlaceModel[] = yield call(request, requestURL);

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
}
