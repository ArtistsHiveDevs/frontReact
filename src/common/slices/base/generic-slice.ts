import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { EntityStateTemplate } from '~/common/utils/redux-injectors/types';
import { APIResponse, deleteRequest, postRequest, putRequest, request } from '~/common/utils/request';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { EntityModel, EntityTemplate } from '~/models/base';
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
        if (action.payload.item) {
          let foundItem = new Model(action.payload.item);
          state.detailedItems[foundItem.identifier] = foundItem;
        }
        state.loading = false;
        state.queryParams = undefined;
      },
      ...(options?.disableOperations?.create
        ? {}
        : {
            createItem(state: EntityStateTemplate<T, M>, action: PayloadAction<{ data: T }>) {
              state.loading = true;
              state.newItemRQ = action.payload.data;
              state.createdItem = undefined;
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
            },
          }),
      ...(options?.disableOperations?.delete
        ? {}
        : {
            deleteItem(state: EntityStateTemplate<T, M>, action: PayloadAction<{ id: string }>) {
              state.loading = true;
            },
          }),
      repoError(state: EntityStateTemplate<T, M>, action: PayloadAction<number>) {
        state.error = action.payload;
        state.loading = false;
      },
      ...(options?.customOperations?.reducers || {}),
    },
  });

  function* entitySaga() {
    // ==================================   GET ALL ==============================================================
    yield takeLatest(slice.actions.loadItems.type, function* getItems() {
      yield delay(500);

      const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

      const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}`;

      try {
        const response: APIResponse = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });

        if (response.error) {
          yield put(slice.actions.repoError(1));
        } else if (response.data) {
          yield put(slice.actions.itemsLoaded(<T[]>response.data));
        }
      } catch (err) {
        yield put(slice.actions.repoError(1));
      }
    });

    // ==================================   GET By ID ==============================================================
    yield takeLatest(
      slice.actions.getItemById.type,
      function* getItemById(actionParams?: PayloadAction<{ id: string; queryParams?: { [param: string]: any } }>) {
        yield delay(500);

        const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

        const { id: requestedItemID, queryParams } = actionParams?.payload || {};
        const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}/${requestedItemID}`;

        try {
          const cacheItems: M[] = yield select(selectors.selectItems);
          const cacheItem = cacheItems.find((item) => item.id === requestedItemID);

          let itemById: T = undefined;
          if (cacheItem && cacheItem.hasFetchAllData) {
            itemById = cacheItem.template;
          } else {
            const response: any = yield call(request, requestURL, { headers: { 'x-api-key': authInfo?.apiKey } });
            if (response.data) {
              itemById = response.data;
            }
          }

          yield put(slice.actions.itemByIdLoaded({ id: requestedItemID, item: itemById }));
        } catch (err) {
          console.log(JSON.stringify(err));
          yield put(slice.actions.repoError(1));
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
            headers: { 'x-api-key': authInfo?.apiKey },
          });

          if (response.data) {
            const newProfileInfo = new CurrentProfileInfoModel(response.data);
            yield put(usersActions.switchProfile({ id: newProfileInfo.identifier }));
            // yield put(slice.actions.itemCreated(response.data));
          }
        } catch (err) {
          yield put(slice.actions.repoError(1));
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
              const response: any = yield call(putRequest, requestURL, {
                body: JSON.stringify(newItem),
                headers: { 'x-api-key': authInfo?.apiKey },
              });

              if (response.data) {
                yield put(usersActions.loadCurrentUser());
                yield put(slice.actions.itemByIdLoaded({ id: requestedItemID, item: response.data }));
              }
            }
          } catch (err) {
            yield put(slice.actions.repoError(1));
          }
        }
      );
    }

    if (!options?.disableOperations?.delete) {
      // ==================================   DELETE  ==============================================================
      yield takeLatest(slice.actions.deleteItem.type, function* deleteItem(actionParams?: PayloadAction<string>) {
        yield delay(500);

        const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);
        const id = actionParams?.payload;
        const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}/${id}`;

        try {
          if (id) {
            const response: any = yield call(deleteRequest, requestURL, {
              headers: { 'x-api-key': authInfo?.apiKey },
            });

            if (response.data) {
              yield put(slice.actions.itemByIdLoaded({ id, item: undefined }));
            }
          }
        } catch (err) {
          yield put(slice.actions.repoError(1));
        }
      });
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
