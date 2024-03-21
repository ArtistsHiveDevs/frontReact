import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';

import { IndustryOfferModel } from '~/models/domain/industryOffer/IndustryOffer.model';
import { actions } from '.';
import { IndustryOfferErrorType } from './types';

export function* getIndustryOffer(actionParams?: PayloadAction<{ role?: string }>) {
  yield delay(500);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/industryOffer?role=${actionParams.payload.role}`;

  try {
    const industryOffer: IndustryOfferModel = yield call(request, requestURL);

    yield put(actions.industryOfferLoaded(industryOffer));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(IndustryOfferErrorType.RESPONSE_ERROR));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* industryOfferSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadIndustryOffer.type, getIndustryOffer);
}
