import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import { request } from "~/common/utils/request";
import { SearchModel } from "~/models/domain/search/search.model";

import { searchActions as actions } from ".";


export function* queriedSearch(actionParams?:PayloadAction<string>) {
  yield delay(500);

  const {payload} = actionParams;
  const requestURL = `${
    import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
  }/search?q=${payload}`;


  try {
    const search: SearchModel = yield call(request, requestURL);

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