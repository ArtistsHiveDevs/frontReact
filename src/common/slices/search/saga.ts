import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';
import { SearchModel } from '~/models/domain/search/search.model';

import { defaultLang } from '~/common/context';
import { searchActions as actions } from '.';
import { selectApiKey } from '../app-base/APIKey/selectors';

export function* queriedSearch(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const { payload } = actionParams;
  const params = {
    q: payload,
    f: 'location_boundaries',
  };

  const urlParams = Object.keys(params)
    .reduce((info, currentValue) => {
      info.push([currentValue, params[currentValue as keyof typeof params]].join('='));
      return info;
    }, [])
    .join('&');

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/search?${urlParams}`;

  try {
    const search: SearchModel = yield call(request, requestURL, {
      headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
    });

    yield put(actions.searchQueried(search));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* searchSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.querySearch.type, queriedSearch);
}
