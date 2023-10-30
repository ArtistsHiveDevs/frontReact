import { PayloadAction } from "@reduxjs/toolkit";
import { call, delay, put, takeLatest } from "redux-saga/effects";

import { request } from "~/common/utils/request";

import { TourOutlineModel } from "~/models/domain/favourites/tourOutline";
import { tourOutlineActions as actions } from ".";

export function* getToursOutlinesByUser(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const { payload: userId } = actionParams;

  const requestURL = `${
    import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
  }/users/${userId}/tours_outlines`;

  try {
    const toursOutlines: TourOutlineModel[] = yield call(request, requestURL);

    yield put(actions.getToursOutlinesByUserResponse(toursOutlines));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

export function* getTourOutlineById(actionParams?: PayloadAction<string>) {
  yield delay(500);

  const { payload: outlineId } = actionParams;

  const requestURL = `${
    import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
  }/tours_outlines/${outlineId}`;

  try {
    const toursOutlines: TourOutlineModel[] = yield call(request, requestURL);

    yield put(actions.getTourOutlineByIdResponse(toursOutlines));
  } catch (err) {
    console.log(err);
    yield put(actions.repoError(1));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* tourOutlineSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.getToursOutlinesByUser.type, getToursOutlinesByUser);
  yield takeLatest(actions.getTourOutlineById.type, getTourOutlineById);
}
