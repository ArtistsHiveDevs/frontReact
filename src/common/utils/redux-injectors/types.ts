// import {RootState} from "types";
import { SagaInjectionModes } from "@nixjs23n6/redux-injectors";
import { AnyAction, Reducer } from "@reduxjs/toolkit";
import { Saga } from "redux-saga";

import { ArtistState } from "~/common/slices/artists/types";

export interface RootState {
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  ArtistsReducer?: ArtistState;
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
