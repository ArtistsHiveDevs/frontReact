export type ReviewableEntityType = 'Artist' | 'Place';
export type ReviewProfileStatus = 'approved' | 'rejected';

export interface PendingProfileItem {
  _id: string;
  name: string;
  username?: string;
  profile_pic?: string;
  city?: string;
  country_alpha2?: string;
  approval_status: string;
  createdAt: string;
  entityType: ReviewableEntityType;
}

export interface PendingProfilesData {
  artists: PendingProfileItem[];
  places: PendingProfileItem[];
}

export interface ReviewProfilePayload {
  entityType: ReviewableEntityType;
  id: string;
  status: ReviewProfileStatus;
}

export enum PendingProfilesErrorType {
  RESPONSE_ERROR = 1,
}

export interface PendingProfilesState extends PendingProfilesData {
  loading: boolean;
  reviewingId?: string;
  error: PendingProfilesErrorType | null;
  errorContent: any;
}
