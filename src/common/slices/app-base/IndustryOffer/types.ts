import { IndustryOfferModel } from '~/models/domain/industryOffer/IndustryOffer.model';

export enum IndustryOfferErrorType {
  RESPONSE_ERROR = 1,
}

export interface IndustryOfferState {
  queriedRole: string;
  offer: IndustryOfferModel;
  loading: boolean;
  error: IndustryOfferErrorType | null;
}
