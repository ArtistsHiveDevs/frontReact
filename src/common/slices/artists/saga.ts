import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';
import { ArtistModel } from '~/models/domain/artist/artist.model';

import { artistsActions as actions } from '.';
import { selectApiKey } from '../app-base/APIKey/selectors';
import { selectArtists } from './selectors';

export function* getArtists() {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const queryParams = 'f=events,events.main_artist,events.guest_artist,events.place';

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/artists?${queryParams}`;

  try {
    const artists: ArtistModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.artistLoaded(artists));
  } catch (err) {
    console.log(err);
  }
}

export function* getArtistById(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload: requestedArtistID } = actionParams;
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/artists/${requestedArtistID}`;

  try {
    const previousArtists: ArtistModel[] = yield select(selectArtists);
    const previousArtist = previousArtists.find((artist) => artist.id === requestedArtistID);

    let artistById: ArtistModel = undefined;
    if (previousArtist) {
      artistById = previousArtist;
    } else {
      artistById = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });
    }

    yield put(actions.artistByIdLoaded(artistById));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

export function* queriedArtists(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload } = actionParams;
  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/artists?q=${payload}`;

  try {
    const artists: ArtistModel[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(actions.artistsQueried(artists));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
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
  yield takeLatest(actions.queryArtists.type, queriedArtists);
  yield takeLatest(actions.getArtistById.type, getArtistById);
}
