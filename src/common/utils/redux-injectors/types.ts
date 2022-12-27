// import {RootState} from "types";
import { Saga } from "redux-saga";
import { SagaInjectionModes } from "@nixjs23n6/redux-injectors";
import { Reducer, AnyAction } from "@reduxjs/toolkit";

import { ArtistState } from "~/common/slices/artists/types";
import { EventState } from "~/common/slices/events/types";

export interface RootState {
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  ArtistsReducer?: ArtistState;
  EventsReducer?: EventState;
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
