import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { defaultLang } from '~/common/context';
import { EntityStateTemplate, RepoErrorPayload } from '~/common/utils/redux-injectors/types';
import {
  APIError,
  APIResponse,
  buildQueryString,
  deleteRequest,
  postRequest,
  putRequest,
  request,
  ResponseError,
} from '~/common/utils/request';
import { AVAILABLE_ENTITY_MEMBERSHIPS } from '~/constants/app.constants';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { EntityModel, EntityTemplate, ProfileModel } from '~/models/base';
import { selectApiKey } from '../app-base/APIKey/selectors';
import { usersActions } from '../users';

export interface CustomOperations<S> {
  reducers?: {
    [key: string]: (state: S, action: PayloadAction<any>) => void;
  };
  sagas?: {
    [key: string]: (action: PayloadAction<any>) => Generator<any, void, unknown>;
  };
}

function buildErrorPayloadFromAPIError(apiError?: APIError): RepoErrorPayload {
  return {
    status: apiError?.errorNumber,
    errorCode: apiError?.errorCode,
    message: apiError?.message,
  };
}

/**
 * Extrae el status HTTP real y el contenido del body de un `ResponseError` lanzado por
 * `~/common/utils/request`, para que los consumidores puedan diferenciar (ej. 403 vs 500)
 * en vez de recibir siempre un código genérico.
 */
function* buildErrorPayloadFromCaughtError(err: unknown): Generator<any, RepoErrorPayload, any> {
  const responseError = err as ResponseError;

  if (responseError?.response) {
    const content: APIError = yield call(() => responseError.content);
    return {
      status: responseError.response.status,
      errorCode: content?.errorCode,
      message: content?.message,
    };
  }

  return { message: err instanceof Error ? err.message : undefined };
}

export function createEntitySlice<T extends EntityTemplate, M extends EntityModel<T>>({
  name,
  Model,
  initialState,
  resourceEndpoint,
  selectors,
  options,
}: {
  name: string;
  Model: new (template: T) => M;
  initialState: any;
  resourceEndpoint: string;
  selectors: any;
  options?: {
    customPaths?: { getAll?: string; getByID?: string };
    disableOperations?: {
      create?: boolean;
      update?: boolean;
      postAction?: boolean;
      delete?: boolean;
    };
    customOperations?: CustomOperations<typeof initialState>;
  };
}) {
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      loadItems(state: EntityStateTemplate<T, M>, action?: PayloadAction<{ queryParams?: { [param: string]: any } }>) {
        state.loading = true;
        state.error = null;
        state.queryParams = action?.payload?.queryParams;
      },
      itemsLoaded(state: EntityStateTemplate<T, M>, action: PayloadAction<T[]>) {
        const response: M[] = (action.payload || []).map((template) => new Model(template));
        state.items = response.map((element) => element.identifier);
        state.detailedItems = response.reduce((dict, item) => {
          dict[item.identifier] = item;
          return dict;
        }, {} as { [id: string]: M });
        state.loading = false;
        state.queryParams = undefined;
      },
      getItemById(
        state: EntityStateTemplate<T, M>,
        action: PayloadAction<{ id: string; queryParams?: { [param: string]: any } }>
      ) {
        state.loading = true;
        state.error = null;
        state.queriedId = action.payload.id;
        state.queryParams = action.payload.queryParams;
      },
      itemByIdLoaded(state: EntityStateTemplate<T, M>, action: PayloadAction<{ id: string; item: T }>) {
        let foundItem: M;
        if (action.payload.item) {
          foundItem = new Model(action.payload.item);

          state.detailedItems[foundItem.identifier] = foundItem;

          // Actualizar en la lista de items si ya existe
          const itemIndex = state.items.findIndex((id) => id === foundItem.identifier);

          if (itemIndex >= 0) {
            state.items[itemIndex] = foundItem.identifier;
          }
        }
        state.loading = false;
        state.queryParams = undefined;
      },
      itemUpdatePartial(state: EntityStateTemplate<T, M>, action: PayloadAction<{ id: string; item: any }>) {
        const { id, item } = action.payload;
        if (!!id && !!item) {
          const oldData = state.detailedItems[id];

          // Verificamos si el objeto es un ProfileModel<T>
          if (oldData instanceof ProfileModel) {
            oldData.followed_by = [...item['followed_by']];
            oldData.followed_profiles = [...item['followed_profiles']];
            oldData.isFollowedByCurrentProfile = item['isFollowedByCurrentProfile'];
          }

          // Crear la nueva instancia del modelo
          state.detailedItems[id] = new Model({ ...oldData } as unknown as T);
        }
        state.loading = false;
        state.queryParams = undefined;
      },

      ...(options?.disableOperations?.create
        ? {}
        : {
            createItem(state: EntityStateTemplate<T, M>, action: PayloadAction<{ data: T }>) {
              state.loading = true;
              state.error = null;
              state.newItemRQ = action.payload.data;
              state.createdItem = undefined;
              if ('prebookingRequests' === name) {
                console.log('Created Item: .....   ', action.payload);
              }
            },
            itemCreated(state: EntityStateTemplate<T, M>, action: PayloadAction<T>) {
              const newItem = new Model(action.payload);
              state.detailedItems[newItem.id] = newItem;
              state.items.push(newItem.id);
              state.createdItem = newItem;
              state.newItemRQ = undefined;
              state.loading = false;
            },
          }),
      ...(options?.disableOperations?.update
        ? {}
        : {
            updateItem(state: EntityStateTemplate<T, M>, action: PayloadAction<{ id: string; newItem: Partial<T> }>) {
              state.loading = true;
              state.error = null;
            },
          }),
      ...(options?.disableOperations?.postAction
        ? {}
        : {
            postActionItem(
              state: EntityStateTemplate<T, M>,
              action: PayloadAction<{
                id: string;
                action: string;
                newItem: Partial<T>;
                params: { [name: string]: any };
              }>
            ) {
              state.loading = true;
            },
          }),
      ...(options?.disableOperations?.delete
        ? {}
        : {
            deleteItem(state: EntityStateTemplate<T, M>, action: PayloadAction<{ id: string }>) {
              state.loading = true;
            },
            deletedItem(state: EntityStateTemplate<T, M>, action: PayloadAction<{ id: string; item: T }>) {
              state.loading = false;
              console.log('Item eliminado....', action.payload.id, action.payload.item);

              // Remover el item del array de IDs (filter ya crea una nueva referencia)
              state.items = state.items.filter((item) => item !== action.payload.id);

              // Crear una nueva referencia del diccionario sin el item eliminado
              const { [action.payload.id]: deletedItem, ...restItems } = state.detailedItems;
              state.detailedItems = restItems as { [id: string]: M };

              // Guardar referencia al item eliminado
              // state.deletedItem = new Model(action.payload.item);
              // state.newItemRQ = undefined;

              console.log('terminamos....');
            },
          }),
      repoError(state: EntityStateTemplate<T, M>, action: PayloadAction<RepoErrorPayload>) {
        state.error = action.payload;
        state.loading = false;
      },
      ...(options?.customOperations?.reducers || {}),
    },
  });

  function* entitySaga() {
    // ==================================   GET ALL ==============================================================
    yield takeLatest(
      slice.actions.loadItems.type,
      function* getItems(actionParams?: PayloadAction<{ queryParams?: { [param: string]: any } }>) {
        yield delay(500);

        const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
        const queryString = buildQueryString(actionParams?.payload?.queryParams);

        const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}${queryString}`;

        try {
          const response: APIResponse = yield call(request, requestURL, {
            headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
          });

          if (response.error) {
            yield put(slice.actions.repoError(buildErrorPayloadFromAPIError(response.error)));
          } else if (response.data) {
            let resultInfo = response.data;
            if (!Array.isArray(resultInfo)) {
              resultInfo = [resultInfo];
            }
            yield put(slice.actions.itemsLoaded(<T[]>resultInfo));
          } else {
            yield put(slice.actions.repoError({}));
          }
        } catch (err) {
          console.log(err);
          const errorPayload: RepoErrorPayload = yield call(buildErrorPayloadFromCaughtError, err);
          yield put(slice.actions.repoError(errorPayload));
        }
      }
    );

    // ==================================   GET By ID ==============================================================
    yield takeLatest(
      slice.actions.getItemById.type,
      function* getItemById(actionParams?: PayloadAction<{ id: string; queryParams?: { [param: string]: any } }>) {
        yield delay(500);

        const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

        const { id: requestedItemID, queryParams } = actionParams?.payload || {};
        const queryString = buildQueryString(actionParams?.payload?.queryParams);

        const requestURL = `${
          import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL
        }${resourceEndpoint}/${requestedItemID}${queryString}`;

        try {
          const cacheItems: M[] = yield select(selectors.selectItems);
          const cacheItem = cacheItems.find((item) => item.id === requestedItemID);

          let itemById: T = undefined;
          if (cacheItem && cacheItem.hasFetchAllData) {
            itemById = cacheItem.template;
          } else {
            const response: any = yield call(request, requestURL, {
              headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
            });
            if (response.data) {
              itemById = response.data;
            }
          }

          yield put(slice.actions.itemByIdLoaded({ id: requestedItemID, item: itemById }));
        } catch (err) {
          console.log(JSON.stringify(err));
          const errorPayload: RepoErrorPayload = yield call(buildErrorPayloadFromCaughtError, err);
          yield put(slice.actions.repoError(errorPayload));
        }
      }
    );

    if (!options?.disableOperations?.create) {
      // ==================================   CREATE ==============================================================
      yield takeLatest(slice.actions.createItem.type, function* createItem(actionParams?: PayloadAction<{ data: T }>) {
        yield delay(500);

        const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
        const { payload } = actionParams;
        const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}`;

        try {
          const response: any = yield call(postRequest, requestURL, {
            body: JSON.stringify(payload.data),
            headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
          });

          if (response.data) {
            const newProfileInfo = new CurrentProfileInfoModel(response.data);
            if (AVAILABLE_ENTITY_MEMBERSHIPS.includes(resourceEndpoint)) {
              yield put(usersActions.switchProfile({ id: newProfileInfo.identifier }));
            }
            yield put(slice.actions.itemCreated(response.data));
          }
        } catch (err) {
          const errorPayload: RepoErrorPayload = yield call(buildErrorPayloadFromCaughtError, err);
          yield put(slice.actions.repoError(errorPayload));
        }
      });
    }

    if (!options?.disableOperations?.update) {
      // ==================================   UPDATE ==============================================================
      yield takeLatest(
        slice.actions.updateItem.type,
        function* updateItem(actionParams?: PayloadAction<{ id: string; newItem: M }>) {
          yield delay(500);

          const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
          const { id: requestedItemID, newItem } = actionParams?.payload || {};
          const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}/${requestedItemID}`;

          try {
            if (newItem) {
              if (Object.keys(newItem).length > 0) {
                const response: any = yield call(putRequest, requestURL, {
                  body: JSON.stringify(newItem),
                  headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
                });

                if (response.error) {
                  yield put(slice.actions.repoError(buildErrorPayloadFromAPIError(response.error)));
                } else if (response.data) {
                  yield put(usersActions.loadCurrentUser());
                  yield put(slice.actions.itemByIdLoaded({ id: requestedItemID, item: response.data }));
                } else {
                  yield put(slice.actions.repoError({ errorCode: response.errorCode, message: response.message }));
                }
              } else {
                yield put(slice.actions.itemByIdLoaded({ id: requestedItemID, item: undefined }));
              }
            }
          } catch (err) {
            const errorPayload: RepoErrorPayload = yield call(buildErrorPayloadFromCaughtError, err);
            yield put(slice.actions.repoError(errorPayload));
          }
        }
      );
    }

    if (!options?.disableOperations?.postAction) {
      // ==================================   POST ACTION ==============================================================
      yield takeLatest(
        slice.actions.postActionItem.type,
        function* postActionItem(
          actionParams?: PayloadAction<{
            id: string;
            action: string;
            newItem: Partial<M>;
            params: { [name: string]: any };
          }>
        ) {
          yield delay(500);

          const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
          const { id: requestedItemID, action, newItem, params } = actionParams?.payload || {};
          const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}/action`;

          try {
            if (newItem) {
              const response: any = yield call(postRequest, requestURL, {
                body: JSON.stringify({ id: requestedItemID, action, newItem, ...params }),
                headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
              });

              if (response.data) {
                // yield put(usersActions.loadCurrentUser());
                yield put(slice.actions.itemByIdLoaded({ id: requestedItemID, item: response.data }));
              }
            }
          } catch (err) {
            console.log(err);
            const errorPayload: RepoErrorPayload = yield call(buildErrorPayloadFromCaughtError, err);
            yield put(slice.actions.repoError(errorPayload));
          }
        }
      );
    }

    if (!options?.disableOperations?.delete) {
      // ==================================   DELETE  ==============================================================
      yield takeLatest(
        slice.actions.deleteItem.type,
        function* deleteItem(actionParams?: PayloadAction<{ id: string }>) {
          yield delay(500);

          const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
          const { id } = actionParams?.payload;
          console.log(id);
          const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}/${id}`;

          try {
            if (id) {
              const response: any = yield call(deleteRequest, requestURL, {
                headers: { 'x-api-key': authInfo?.apiKey, lang: defaultLang(false) },
              });

              console.log('Delete response:', response);

              if (response.data) {
                yield put(slice.actions.deletedItem({ id, item: response.data }));
              } else if (response.ok || response.status === 204) {
                // Si el servidor retorna 204 No Content o un OK sin data
                console.log('Delete exitoso sin data, usando id:', id);
                yield put(slice.actions.deletedItem({ id, item: { id } as T }));
              } else {
                console.error('Delete falló:', response);
                yield put(slice.actions.repoError({ status: response.status }));
              }
            }
          } catch (err) {
            console.error('Error en delete:', err);
            const errorPayload: RepoErrorPayload = yield call(buildErrorPayloadFromCaughtError, err);
            yield put(slice.actions.repoError(errorPayload));
          }
        }
      );
    }

    if (options?.customOperations?.sagas) {
      for (const [operationName, saga] of Object.entries(options.customOperations.sagas)) {
        yield takeLatest(slice.actions[operationName as keyof typeof slice.actions].type, saga);
      }
    }
  }

  return {
    slice,
    saga: entitySaga,
  };
}
