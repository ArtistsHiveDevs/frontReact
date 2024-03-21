import { call, delay, put, takeLatest } from 'redux-saga/effects';

import { request } from '~/common/utils/request';
import { AppUserModel } from '~/models/app/user/user.model';

import { usersActions as actions } from '.';

export function* getUsers() {
  yield delay(500);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users`;

  try {
    const users: AppUserModel[] = yield call(request, requestURL);

    yield put(actions.userLoaded(users));
  } catch (err) {
    console.log(err);
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
  yield takeLatest(actions.loadUsers.type, getUsers);
}
