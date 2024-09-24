import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { APIResponse, postRequest, putRequest, request } from '~/common/utils/request';
import { AppUserTemplate } from '~/models/app/user/user.model';

import { PayloadAction } from '@reduxjs/toolkit';
import { defaultLang } from '~/common/context';
import { LocalStorageVariables } from '~/constants/localstorage';
import { usersActions } from '.';
import { actions as apiKeyActions } from '../app-base/APIKey';
import { selectApiKey } from '../app-base/APIKey/selectors';
import { UsernameAvailabilityStatus } from '~/constants/app.constants';

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
      headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
    });

    yield put(usersActions.currentUserLoaded(currentUser));
  } catch (err) {
    yield put(usersActions.logout());
    // yield delay(500);
    // window.location.reload();
  }
}

export function* switchProfile(actionParams?: PayloadAction<{ id: string }>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/${authInfo.userId}`;

  try {
    const response: APIResponse = yield call(putRequest, requestURL, {
      body: JSON.stringify({ currentProfileIdentifier: actionParams.payload.id }),
      headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
    });

    if (response?.data) {
      yield put(usersActions.loadCurrentUser());
    }
    // const currentUser: AppUserTemplate = yield call(putRequest, requestURL, {
    //   headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false)  },
    //   body: { currentProfileIdentifier: actionParams?.payload.id },
    // });
  } catch (err) {
    yield put(usersActions.logout());
    // yield delay(500);
    // window.location.reload();
  }
}

export function* switchLanguage(actionParams?: PayloadAction<{ newLang: string }>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
  if (authInfo?.userId) {
    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/${authInfo.userId}`;

    try {
      const response: APIResponse = yield call(putRequest, requestURL, {
        body: JSON.stringify({ user_language: actionParams.payload.newLang }),
        headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
      });

      if (response?.data) {
        //TODO pedir paramétricos
        yield put(usersActions.loadCurrentUser());
        window.location.reload();
      }
      // const currentUser: AppUserTemplate = yield call(putRequest, requestURL, {
      //   headers: { 'x-api-key': authInfo?.apiKey , lang: defaultLang(false) },
      //   body: { currentProfileIdentifier: actionParams?.payload.id },
      // });
    } catch (err) {
      yield put(usersActions.logout());
      // yield delay(500);
      // window.location.reload();
    }
  }
  //  else {
  //   window.location.reload();
  // }
}

export function* logout() {
  yield delay(500);
  localStorage.removeItem(LocalStorageVariables.TOKEN_API_KEY);
  yield put(usersActions.currentUserLoaded(null));
  yield put(apiKeyActions.loadApiKey({ isLogout: true }));
  yield delay(500);
  window.location.reload();
}


export function* checkUsernameAvailability(actionParams?: PayloadAction<string>) {
  if (actionParams?.payload) {
    yield delay(500);

    console.log('consultando username ', actionParams.payload);
    const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/cid/${actionParams.payload}`;

    try {
      const currentUser: {data?:{status:UsernameAvailabilityStatus}} = yield call(request, requestURL, {
        headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
      });

      yield put(usersActions.usernameStatusVefication(currentUser?.data?.status));
    } catch (err) {
      yield put(usersActions.logout());
      // yield delay(500);
      // window.location.reload();
    }
  }
}


export function* createUser(actionParams?: PayloadAction<{ username: string, sub:string }>) {
  if (actionParams?.payload?.username) {
    yield delay(500);

    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users`;

    try {
      const response: APIResponse = yield call(postRequest, requestURL, {
        body: JSON.stringify(actionParams.payload),
        headers: {  lang: defaultLang(false) },
      });

      if (response?.data) {
        //TODO pedir paramétricos
        console.log('Create user  ', response);
        const userData = <AppUserTemplate> (response?.data || {});
        console.log('pidiendo api key...')
        yield put(apiKeyActions.loadApiKey({username: userData.username, sub: userData.sub}))
        //console.log('cargando usuario actual')
        //yield put(usersActions.loadCurrentUser());
        //window.location.reload();
      }
      
    } catch (err) {
      yield put(usersActions.logout());
      // yield delay(500);
      // window.location.reload();
    }
  }
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
  yield takeLatest(usersActions.switchLang.type, switchLanguage);
  yield takeLatest(usersActions.checkUsernameAvailability.type, checkUsernameAvailability);
  yield takeLatest(usersActions.createUser.type, createUser);
}
