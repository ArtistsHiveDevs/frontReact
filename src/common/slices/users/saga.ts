import { call, delay, put, select, takeLatest } from 'redux-saga/effects';

import { APIResponse, generatePreAuthHeaders, postRequest, putRequest, request } from '~/common/utils/request';
import { AppUserModel, AppUserTemplate } from '~/models/app/user/user.model';

import { PayloadAction } from '@reduxjs/toolkit';
import { fetchUserAttributes, signOut, updateUserAttributes } from 'aws-amplify/auth';
import { defaultLang } from '~/common/context';
import { UsernameAvailabilityStatus } from '~/constants/app.constants';
import { LocalStorageVariables } from '~/constants/localstorage';
import { PATHS } from '~/constants/routes.constants';
import { ProfileModel, ProfileTemplate } from '~/models/base';
import { getModelInfoFromInstance } from '~/models/base/modelHelpers';
import { usersActions } from '.';
import { actions as apiKeyActions } from '../app-base/APIKey';
import { selectApiKey } from '../app-base/APIKey/selectors';
import { actionsArtists } from '../domain/artists/artist.redux';
import { actionsPlaces } from '../domain/places/places.redux';

export interface CidUserData {
  email: string;
  username: string | null;
}

/**
 * Helper function para obtener email y username por username/email durante el login
 * Esta función NO es una saga, se puede llamar directamente desde componentes
 */
export async function getEmailByUsername(usernameOrEmail: string): Promise<CidUserData | null> {
  try {
    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/cid/${usernameOrEmail}`;

    const response = await request(requestURL, {
      headers: {
        lang: defaultLang(false),
        ...generatePreAuthHeaders('username_signin'),
      },
    });

    // Verificar si hay error en la respuesta
    if ('err' in response) {
      console.error('Error in response:', response.err);
      return null;
    }

    // Type assertion para el tipo de respuesta exitosa
    const successResponse = response as { data?: { status: UsernameAvailabilityStatus; email?: string; username?: string } };

    // El endpoint retorna { data: { status: "TAKEN", email: "...", username: "..." } } o { data: { status: "AVAILABLE" } }
    if (successResponse?.data?.status === 'TAKEN' && successResponse?.data?.email) {
      return {
        email: successResponse.data.email,
        username: successResponse.data.username || null,
      };
    }

    return null;
  } catch (error) {
    console.error('Error fetching email by username:', error);
    return null;
  }
}

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

  const authInfo: { apiKey: string; userId: string; username: string; sub: string } = yield select(selectApiKey);

  const userId = authInfo.username || authInfo.sub || authInfo.userId;

  if (userId) {
    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/${userId}`;

    try {
      const response: APIResponse = yield call(putRequest, requestURL, {
        body: JSON.stringify({ currentProfileIdentifier: actionParams.payload.id }),
        headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
      });

      yield delay(300);

      if (response?.data) {
        yield put(usersActions.loadCurrentUser());
      }
      // const currentUser: AppUserTemplate = yield call(putRequest, requestURL, {
      //   headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false)  },
      //   body: { currentProfileIdentifier: actionParams?.payload.id },
      // });
    } catch (err) {
      yield put(usersActions.logout());
      // yield put(usersActions.logout());
      // yield delay(500);
      // window.location.reload();
    }
  } else {
    console.error('There is no user Id to switch profile');
  }
}

export function* switchLanguage(actionParams?: PayloadAction<{ newLang: string }>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string; username: string; sub: string } = yield select(selectApiKey);

  const userId = authInfo.userId || authInfo.username || authInfo.sub;

  if (userId) {
    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/${userId}`;

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
      // console.log('errooooor ', err);
      yield put(usersActions.logout());
      yield delay(500);
      window.location.reload();
    }
  } else {
    window.location.reload();
    window.scrollTo(0, 0);
  }
}

export function* logout() {
  yield delay(500);
  localStorage.removeItem(LocalStorageVariables.TOKEN_API_KEY);
  yield put(usersActions.currentUserLoaded(null));
  yield put(apiKeyActions.loadApiKey({ isLogout: true }));
  signoutAWS();
  yield delay(500);
  localStorage.removeItem(LocalStorageVariables.TOKEN_API_KEY);
  window.location.href = `/${PATHS.HOME}`;
}

async function signoutAWS() {
  await signOut();
}

export function* checkUsernameAvailability(actionParams?: PayloadAction<string>) {
  if (actionParams?.payload) {
    yield delay(500);

    const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/cid/${actionParams.payload}`;

    try {
      const currentUser: { data?: { status: UsernameAvailabilityStatus } } = yield call(request, requestURL, {
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

export function* createUser(actionParams?: PayloadAction<{ username: string; sub: string; email: string }>) {
  if (actionParams?.payload?.username) {
    yield delay(500);

    const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users`;

    try {
      const response: APIResponse = yield call(postRequest, requestURL, {
        body: JSON.stringify(actionParams.payload),
        headers: { lang: defaultLang(false) },
      });

      if (response?.data) {
        //TODO pedir paramétricos
        console.log('Create user  ', response);
        const userData = <AppUserTemplate>(response?.data || {});
        console.log('pidiendo api key...');
        yield put(apiKeyActions.loadApiKey({ username: userData.username, sub: userData.sub }));
        yield put(usersActions.loadCurrentUser());
        window.location.reload();
      }
    } catch (err) {
      yield put(usersActions.logout());
      // yield delay(500);
      // window.location.reload();
    }
  }
}

export function* updateUser(actionParams?: PayloadAction<{ id: string; newItem: Partial<AppUserModel> }>) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/${actionParams.payload.id}`;

  try {
    const response: APIResponse = yield call(putRequest, requestURL, {
      body: JSON.stringify({ ...actionParams.payload.newItem }),
      headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
    });

    if (response?.data) {
      // Si se actualizó el username, sincronizar con Cognito
      if (actionParams.payload.newItem.username) {
        try {
          // Obtener atributos actuales del usuario de Cognito
          const currentAttributes: Record<string, string> = yield call(fetchUserAttributes);

          // Actualizar solo si el preferred_username es diferente
          if (currentAttributes.preferred_username !== actionParams.payload.newItem.username) {
            yield call(updateUserAttributes, {
              userAttributes: {
                preferred_username: actionParams.payload.newItem.username,
              },
            });
          }
        } catch (cognitoError) {
          // No bloqueamos el flujo si falla la sincronización con Cognito
        }
      }

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

export function* claimProfileUser(actionParams?: PayloadAction<{ profile: ProfileTemplate }>) {
  const { identifier } = actionParams.payload.profile as ProfileModel<any>;

  const response: APIResponse = yield callActionInUser({
    action: 'claim',
    profile: actionParams.payload.profile,
  });

  if (response) {
    yield put(usersActions.voidRQ(response));
    yield put(actionsArtists.getItemById({ id: identifier }));
    yield put(actionsPlaces.getItemById({ id: identifier }));
  }
}

export function* followProfileUser(
  actionParams?: PayloadAction<{ action: 'follow' | 'unfollow'; profile: ProfileTemplate }>
) {
  const { identifier } = actionParams.payload.profile as ProfileModel<any>;

  const response: APIResponse = yield callActionInUser({
    action: actionParams.payload.action,
    profile: actionParams.payload.profile,
  });

  if (response) {
    yield put(actionsArtists.getItemById({ id: identifier }));
    yield put(actionsPlaces.getItemById({ id: identifier }));

    yield put(usersActions.loadCurrentUser());
  }
}

function* callActionInUser(params: { action: string; profile: ProfileTemplate; body?: any }) {
  yield delay(500);

  const authInfo: { apiKey: string; userId: string; username: string; sub: string } = yield select(selectApiKey);

  const userId = authInfo.userId || authInfo.username || authInfo.sub;

  const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/${userId}/action`;

  try {
    const { id, identifier, username } = params.profile as ProfileModel<any>;

    const body = params?.body || {
      action: params.action,
      id,
      identifier,
      username,
      entity: getModelInfoFromInstance(params.profile).entityName,
    };

    const response: APIResponse = yield call(putRequest, requestURL, {
      body: JSON.stringify({ ...body }),
      headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
    });
    return response?.data ?? null; // <<< Retornas SOLO el data
  } catch (err) {
    console.error(err);
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
  yield takeLatest(usersActions.updateUser.type, updateUser);
  yield takeLatest(usersActions.claimProfileUser.type, claimProfileUser);
  yield takeLatest(usersActions.followProfileUser.type, followProfileUser);
}
