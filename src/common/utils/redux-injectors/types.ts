// import {RootState} from "types";
import { SagaInjectionModes } from '@nixjs23n6/redux-injectors';
import { AnyAction, Reducer } from '@reduxjs/toolkit';
import { Saga } from 'redux-saga';
import { IndustryOfferState } from '~/common/slices/app-base/IndustryOffer/types';
import { PrivacyPolicyState } from '~/common/slices/app-base/policies/PrivacyPolicy/types';

import { TermsAndConditionsState } from '~/common/slices/app-base/policies/TermsAndConditions/types';
import { ArtistState } from '~/common/slices/artists/types';
import { AcademyState } from '~/common/slices/domain/academies/types';
import { SavedState } from '~/common/slices/domain/favourites/saved/types';
import { TourOutlineState } from '~/common/slices/domain/favourites/tour-outlines/types';

import { RiderState } from '~/common/slices/domain/riders/types';
import { EventState } from '~/common/slices/events/types';
import { PlaceState } from '~/common/slices/places/types';
import { SearchState } from '~/common/slices/search/types';
import { UserState } from '~/common/slices/users/types';

export interface RootState {
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
  AcademiesReducer?: AcademyState;
  ArtistsReducer?: ArtistState;
  RidersReducer?: RiderState;
  EventsReducer?: EventState;
  PlacesReducer?: PlaceState;
  SearchReducer?: SearchState;
  UsersReducer?: UserState;
  TermsAndConditionsReducer?: TermsAndConditionsState;
  PrivacyPolicyReducer?: PrivacyPolicyState;
  IndustryOfferReducer?: IndustryOfferState;
  // SavedFavouritesReducer?: SavedFavouritesState;
  // SavedFavouritesReducer?: SavedFavouritesState;
  ToursOutlinesReducer?: TourOutlineState;
  SavedReducer?: SavedState;
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
