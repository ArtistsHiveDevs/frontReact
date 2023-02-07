// import {RootState} from "types";
import { Saga } from "redux-saga";
import { SagaInjectionModes } from "@nixjs23n6/redux-injectors";
import { Reducer, AnyAction } from "@reduxjs/toolkit";

import { ArtistState } from "~/common/slices/artists/types";
import { EventState } from "~/common/slices/events/types";
import { PlaceState } from "~/common/slices/places/types";
import { SearchState } from "~/common/slices/search/types";

export interface RootState {
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  ArtistsReducer?: ArtistState;
  EventsReducer?: EventState;
  PlacesReducer?: PlaceState;
  SearchReducer?: SearchState;
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
