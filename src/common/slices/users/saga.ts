import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { APIResponse, putRequest, request } from '~/common/utils/request';
import { AppUserTemplate } from '~/models/app/user/user.model';

import { PayloadAction } from '@reduxjs/toolkit';
import { LocalStorageVariables } from '~/constants/localstorage';
import { usersActions } from '.';
import { actions as apiKeyActions } from '../app-base/APIKey';
import { selectApiKey } from '../app-base/APIKey/selectors';

export function* getUsers() {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users`;

  try {
    const users: AppUserTemplate[] = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

    yield put(usersActions.userLoaded(users));
  } catch (err) {
    console.log(err);
  }
}

export function* getCurrentUserInfo() {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/me`;

  try {
    const currentUser: AppUserTemplate = yield call(request, requestURL, {
      headers: { 'x-api-key': authInfo?.apiKey },
    });

    yield put(usersActions.currentUserLoaded(currentUser));
  } catch (err) {
    console.log(err);
  }
}

export function* switchProfile(actionParams?: PayloadAction<{ id: string }>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/${authInfo.userId}`;

  try {
    const response: APIResponse = yield call(putRequest, requestURL, {
      body: JSON.stringify({ currentProfileIdentifier: actionParams.payload }),
      headers: { 'x-api-key': authInfo?.apiKey },
    });

    if (response?.data) {
      yield put(usersActions.loadCurrentUser());
    }
    // const currentUser: AppUserTemplate = yield call(putRequest, requestURL, {
    //   headers: { 'x-api-key': authInfo?.apiKey },
    //   body: { currentProfileIdentifier: actionParams?.payload.id },
    // });
  } catch (err) {
    console.log(err);
  }
}

export function* logout() {
  yield delay(500);
  localStorage.removeItem(LocalStorageVariables.TOKEN_API_KEY);
  yield put(usersActions.currentUserLoaded(null));
  yield put(apiKeyActions.loadApiKey({ isLogout: true }));
}

/**
 * Root saga manages watcher lifecycle
 */
export function* userSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(usersActions.loadUsers.type, getUsers);
  yield takeLatest(usersActions.loadCurrentUser.type, getCurrentUserInfo);
  yield takeLatest(usersActions.logout.type, logout);
  yield takeLatest(usersActions.switchProfile.type, switchProfile);
}
