// import {RootState} from "types";
import { SagaInjectionModes } from '@nixjs23n6/redux-injectors';
import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { ApiKeyState } from '~/common/slices/app-base/APIKey/types';
import { IndustryOfferState } from '~/common/slices/app-base/IndustryOffer/types';
import { PrivacyPolicyState } from '~/common/slices/app-base/policies/PrivacyPolicy/types';

import { TermsAndConditionsState } from '~/common/slices/app-base/policies/TermsAndConditions/types';

import { SearchState } from '~/common/slices/search/types';
import { UserState } from '~/common/slices/users/types';

export interface RootState {
  [key: string]: any;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  ApiKeyReducer?: ApiKeyState;
  SearchReducer?: SearchState;
  UsersReducer?: UserState;
  TermsAndConditionsReducer?: TermsAndConditionsState;
  PrivacyPolicyReducer?: PrivacyPolicyState;
  IndustryOfferReducer?: IndustryOfferState;
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
