import { call, delay, put, takeLatest } from "redux-saga/effects";

import { request } from "~/common/utils/request";
import { ArtistModel } from "~/models/domain/artist/artist.model";

import { artistsActions as actions } from ".";

export function* getArtists() {
  yield delay(500);
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/artists`;

  try {
    const artists: ArtistModel[] = yield call(request, requestURL);

    yield put(actions.artistLoaded(artists));
  } catch (err) {
    console.log(err);
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* artistSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadArtists.type, getArtists);
}
