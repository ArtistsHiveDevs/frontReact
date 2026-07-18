// import {RootState} from "types";
import { SagaInjectionModes } from '@nixjs23n6/redux-injectors';
import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { ApiKeyState } from '~/common/slices/app-base/APIKey/types';

import { SearchState } from '~/common/slices/search/types';
import { UserState } from '~/common/slices/users/types';
import { EntityModel, EntityTemplate } from '~/models/base';

export interface RootState {
  [key: string]: any;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  ApiKeyReducer?: ApiKeyState;
  SearchReducer?: SearchState;
  UsersReducer?: UserState;
  // SavedFavouritesReducer?: SavedFavouritesState;
  // SavedFavouritesReducer?: SavedFavouritesState;
}

type RequiredRootState = Required<RootState>;

export type RootStateKeyType = keyof RootState;

export type InjectedReducersType = {
  [P in RootStateKeyType]?: Reducer<RequiredRootState[P], AnyAction>;
};
export interface InjectReducerParams<Key extends RootStateKeyType> {
  key: Key;
  reducer: Reducer<RequiredRootState[Key], AnyAction>;
}

export interface InjectSagaParams {
  key: RootStateKeyType | string;
  saga: Saga;
  mode?: SagaInjectionModes;
}

export interface RepoErrorPayload {
  status?: number;
  errorCode?: string;
  message?: string;
}

export interface EntityStateTemplate<T extends EntityTemplate, M extends EntityModel<T>> {
  loading: boolean;
  error: RepoErrorPayload | null;
  items: string[];
  detailedItems: { [identifier: string]: M };
  queriedId?: string;
  queryParams?: { [param: string]: any };
  newItemRQ?: T;
  createdItem?: M;
  deletedItem?: M;
}

// Definición de la función para crear el estado inicial
export function createInitialState<T extends EntityTemplate, M extends EntityModel<T>>(): EntityStateTemplate<T, M> {
  return {
    loading: false,
    error: null,
    items: [],
    detailedItems: {},
    queriedId: undefined,
    queryParams: undefined,
    newItemRQ: undefined,
    createdItem: undefined,
  };
}
