import { PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, takeLatest } from 'redux-saga/effects';

import { ResponseError, postRequest } from '~/common/utils/request';

import { jwtDecode } from 'jwt-decode';
import { LocalStorageVariables } from '~/constants/localstorage';
import { actions } from '.';

import { AppErrorCodes } from '~/constants/app.errors';
import { usersActions } from '../../users';
import { ApiKeyErrorType, ApiKeyPayload, ApiKeyResponse, ApiKeyVeficationStatus } from './types';

function verifyToken(token: string) {
  if (token) {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp > currentTime) {
        return ApiKeyVeficationStatus.VALID;
      } else {
        localStorage.removeItem(LocalStorageVariables.TOKEN_API_KEY);
        return ApiKeyVeficationStatus.INVALID;
      }
    } catch (err) {
      console.error('Error decodificando el token:', err);
      localStorage.removeItem(LocalStorageVariables.TOKEN_API_KEY);
      return ApiKeyVeficationStatus.INVALID;
    }
  }
  return ApiKeyVeficationStatus.NOT_FOUND;
}

export function getStoredUserIdToken() {
  let userId;

  const token = localStorage.getItem(LocalStorageVariables.TOKEN_API_KEY);
  if (verifyToken(token) === ApiKeyVeficationStatus.VALID) {
    const decoded = jwtDecode(token);
    userId = (<any>decoded)?.id;
  }
  return userId;
}

export function* getApiKey(actionParams?: PayloadAction<ApiKeyPayload>): Generator<any, void, any> {
  yield delay(500);
  const { payload } = actionParams || {};
  const { userId, password, remember_me } = payload || {};

  const existingAPIKey = localStorage.getItem(LocalStorageVariables.TOKEN_API_KEY);

  let hasToRequestToken = verifyToken(existingAPIKey) !== ApiKeyVeficationStatus.VALID;

  let response: ApiKeyResponse = undefined;
  try {
    if (hasToRequestToken) {
      if (!userId) {
        yield put(
          actions.repoError({
            errorType: ApiKeyErrorType.RESPONSE_ERROR,
            error: { message: 'UserId is required', errorCode: AppErrorCodes.AUTH_NO_USER_PROVIDED },
          })
        );
        return;
      } else if (!password) {
        yield put(
          actions.repoError({
            errorType: ApiKeyErrorType.RESPONSE_ERROR,
            error: { message: 'Password is required', errorCode: AppErrorCodes.AUTH_NO_PASSWORD_PROVIDED },
          })
        );
        return;
      } else {
        const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/api/generate-key`;

        const body = { userId, password, remember_me };
        response = yield call(postRequest, requestURL, {
          body: JSON.stringify(body),
        });
      }
    } else {
      response = { apiKey: existingAPIKey };
    }

    if (response?.apiKey) {
      yield put(usersActions.loadCurrentUser());
    }
    yield put(actions.apiKeyLoaded(response));
  } catch (err) {
    const error: ResponseError = <ResponseError>err;
    const errorContent = yield call(() => error.content);
    yield put(actions.repoError({ errorType: ApiKeyErrorType.RESPONSE_ERROR, error: errorContent }));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export function* apiKeySaga() {
  // Watches for loadRepos actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(actions.loadApiKey.type, getApiKey);
}
