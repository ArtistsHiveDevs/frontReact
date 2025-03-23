import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { PayloadAction } from '@reduxjs/toolkit';
import { defaultLang } from '~/common/context';
import { APIResponse, request } from '~/common/utils/request';
import { EntityModel } from '~/models/base';
import { selectApiKey } from '../../app-base/APIKey/selectors';
import { getSliceInfoFromInstance } from '../../utils/slices-utils';
import { profileActions } from './ProfileSlice';

export function* loadProfileEndpoint(actionParams?: PayloadAction<{ entity: EntityModel<any>; endpoint: string }>) {
  yield delay(500);

  const { entity, endpoint } = actionParams.payload;
  const { identifier: idProfile } = entity;

  const authInfo: { apiKey: string; userId: string; username: string; sub: string } = yield select(selectApiKey);
  const userId = authInfo.userId || authInfo.username || authInfo.sub;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/p/${idProfile}/${endpoint}`;

  const slice = getSliceInfoFromInstance(entity);
  const { actions } = slice;

  try {
    const response: APIResponse = yield call(request, requestURL, {
      headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
    });
    if (response?.data) {
      yield put(actions.itemUpdatePartial({ id: idProfile, item: response.data }));
    }
  } catch (err) {
    console.log(err);
  }
}

export function* loadProfileSubset(actionParams?: PayloadAction<{ fields: string[] }>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string; username: string; sub: string } = yield select(selectApiKey);
  const userId = authInfo.userId || authInfo.username || authInfo.sub;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/p/`;

  // try {
  //   const { id, identifier, username } = actionParams.payload.profile as ProfileModel<any>;

  //   const body = {
  //     action: actionParams.payload.action,
  //     id,
  //     identifier,
  //     username,
  //     entity: getModelInfoFromInstance(actionParams.payload.profile).entityName,
  //   };

  //   const response: APIResponse = yield call(putRequest, requestURL, {
  //     body: JSON.stringify({ ...body }),
  //     headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
  //   });
  //   if (response?.data) {
  //     console.log(response.data);
  //     yield put(actionsArtists.getItemById({ id: identifier }));
  //     yield put(actionsPlaces.getItemById({ id: identifier }));

  //     yield put(profileActions.loadCurrentUser());
  //   }
  //   // const currentUser: AppUserTemplate = yield call(putRequest, requestURL, {
  //   //   headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false)  },
  //   //   body: { currentProfileIdentifier: actionParams?.payload.id },
  //   // });
  // } catch (err) {
  //   // yield put(usersActions.logout());
  //   // yield delay(500);
  //   // window.location.reload();
  // }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* profileSaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(profileActions.loadProfileSubset.type, loadProfileSubset);
  yield takeLatest(profileActions.loadProfileEndpoint.type, loadProfileEndpoint);
}
