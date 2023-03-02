// import {RootState} from "types";
import { SagaInjectionModes } from "@nixjs23n6/redux-injectors";
import { AnyAction, Reducer } from "@reduxjs/toolkit";
import { Saga } from "redux-saga";

import { TermsAndConditionsState } from "~/common/slices/app-base/TermsAndConditions/types";
import { ArtistState } from "~/common/slices/artists/types";
import { EventState } from "~/common/slices/events/types";
import { PlaceState } from "~/common/slices/places/types";
import { SearchState } from "~/common/slices/search/types";
import { UserState } from "~/common/slices/users/types";

export interface RootState {
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  ArtistsReducer?: ArtistState;
  EventsReducer?: EventState;
  PlacesReducer?: PlaceState;
  SearchReducer?: SearchState;
  UsersReducer?: UserState;
  TermsAndConditionsReducer?: TermsAndConditionsState;
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
