import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import { request } from "~/common/utils/request";
import { TermsAndConditionsModel } from "~/models/app/termsAndConditions/TermsAndConditions.model";

import { actions } from ".";

export function* getTermsAndConditions(
  actionParams?: PayloadAction<{ version?: string }>
) {
  yield delay(500);

  console.log(actionParams);
  const requestURL = `${
    import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
  }/terms?v=1.0`;

  try {
    const termsAndConditions: TermsAndConditionsModel = yield call(
      request,
      requestURL
    );

    yield put(actions.termsAndConditionsLoaded(termsAndConditions));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* termsAndConditionsSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadTermsAndConditions.type, getTermsAndConditions);
}
