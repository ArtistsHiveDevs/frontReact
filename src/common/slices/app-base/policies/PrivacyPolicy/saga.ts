import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import { request } from "~/common/utils/request";
import { PrivacyPolicyModel } from "~/models/app/policies/privacy/PrivacyPolicy.model";

import { actions } from ".";
import { PrivacyPolicyErrorType } from "./types";

export function* getPrivacyPolicy(
  actionParams?: PayloadAction<{ version?: string }>
) {
  yield delay(500);

  const requestURL = `${
    import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
  }/privacy?v=1.0`;

  try {
    const privacyPolicy: PrivacyPolicyModel = yield call(request, requestURL);

    yield put(actions.privacyPolicyLoaded(privacyPolicy));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(PrivacyPolicyErrorType.RESPONSE_ERROR));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* privacyPolicySaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadPrivacyPolicy.type, getPrivacyPolicy);
}
