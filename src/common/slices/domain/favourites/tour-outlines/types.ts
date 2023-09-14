import { AcademyModel } from "~/models/domain/academy/academy.model";

export enum AcademyErrorType {
  RESPONSE_ERROR = 1,
}

export interface AcademyState {
  academies: AcademyModel[] | [];
  loading: boolean;
  error: AcademyErrorType | null;
  academiesQueryParams: string;
  queriedAcademies: AcademyModel[] | [];
}
