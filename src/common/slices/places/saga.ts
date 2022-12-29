import { call, put, takeLatest, delay } from "redux-saga/effects";

import { request } from "~/common/utils/request";
import { PlaceModel } from "~/models/domain/place/place.model";

import { placesActions as actions } from ".";

export function* getPlaces() {
  yield delay(500);
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/places`;

  try {
    const places: PlaceModel[] = yield call(request, requestURL);

    yield put(actions.placesLoaded(places));
  } catch (err) {
    console.log(err);
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
}
