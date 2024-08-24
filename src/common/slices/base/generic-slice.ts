import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { call, delay, put, select, takeLatest } from 'redux-saga/effects';
import { APIResponse, deleteRequest, postRequest, putRequest, request } from '~/common/utils/request';
import { EntityModel, EntityTemplate } from '~/models/base';
import { selectApiKey } from '../app-base/APIKey/selectors';

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
    [param: string]: any;
    customPaths?: { getAll?: string; getByID?: string; create?: string; update?: string; delete?: string };
  };
}) {
  const slice = createSlice({
    name,
    initialState,
    reducers: {
      loadItems(state, action?: PayloadAction<{ queryParams?: { [param: string]: any } }>) {
        state.loading = true;
        state.error = null;
        state.items = [];
        state.queryParams = action?.payload?.queryParams;
      },
      itemsLoaded(state, action: PayloadAction<T[]>) {
        state.items = (action.payload || []).map((template) => new Model(template));
        state.loading = false;
        state.queryParams = undefined;
      },
      getItemById(state, action: PayloadAction<{ id: string; queryParams?: { [param: string]: any } }>) {
        state.loading = true;
        state.error = null;
        state.queriedId = action.payload.id;
        state.queryParams = action.payload.queryParams;
      },
      itemByIdLoaded(state, action: PayloadAction<{ id: string; item: T }>) {
        if (action.payload.item) {
          let foundItem = new Model(action.payload.item);
          state.detailedItems[foundItem.id] = foundItem;
          const previousIndex = state.items.findIndex((item: any) => item.id === foundItem.id);
          if (previousIndex >= 0) {
            state.items[previousIndex] = foundItem;
          } else {
            state.items = [...state.items, foundItem];
          }
        }
        state.loading = false;
        state.queryParams = undefined;
      },
      createItem(state, action: PayloadAction<T>) {
        state.loading = true;
        state.newItemRQ = action.payload;
        state.createdItem = undefined;
      },
      itemCreated(state, action: PayloadAction<T>) {
        const newItem = new Model(action.payload);
        state.detailedItems[newItem.id] = newItem;
        const previousIndex = state.items.findIndex((item: M) => item.id === newItem.id);
        if (previousIndex >= 0) {
          state.items[previousIndex] = newItem;
        } else {
          state.items = [...state.items, newItem];
        }
        state.createdItem = newItem;
        state.newItemRQ = undefined;
        state.loading = false;
      },
      updateItem(state, action: PayloadAction<{ id: string; newItem: T }>) {
        state.loading = true;
      },
      deleteItem(state, action: PayloadAction<string>) {
        state.loading = true;
      },
      repoError(state, action: PayloadAction<number>) {
        state.error = action.payload;
        state.loading = false;
      },
    },
  });

  const entitySaga = function* () {
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
    yield takeLatest(slice.actions.getItemById.type, function* getItemById(actionParams?: PayloadAction<string>) {
      yield delay(500);

      const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

      const { payload: requestedItemID } = actionParams;
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
        yield put(slice.actions.repoError(1));
      }
    });

    // ==================================   CREATE ==============================================================
    yield takeLatest(slice.actions.createItem.type, function* createItem(actionParams?: PayloadAction<M>) {
      yield delay(500);

      const authInfo: { apiKey: string; userId: string } = yield select(selectApiKey);

      const { payload } = actionParams;
      const requestURL = `${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}${resourceEndpoint}`;

      try {
        const response: any = yield call(postRequest, requestURL, {
          body: JSON.stringify(payload.template),
          headers: { 'x-api-key': authInfo?.apiKey },
        });

        if (response.data) {
          yield put(slice.actions.itemCreated(response.data));
        }
      } catch (err) {
        yield put(slice.actions.repoError(1));
      }
    });

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
              yield put(slice.actions.itemByIdLoaded({ id: requestedItemID, item: response.data }));
            }
          }
        } catch (err) {
          yield put(slice.actions.repoError(1));
        }
      }
    );

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
  };

  return {
    slice,
    saga: entitySaga, // Asegúrate de exportar el saga
  };
}
