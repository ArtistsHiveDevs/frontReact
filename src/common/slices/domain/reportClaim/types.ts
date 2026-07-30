import { ReportClaimReason } from '~/constants/domain/reportClaim.constants';

export type ReportClaimEntityType = 'Artist' | 'Place';

export interface SubmitReportClaimPayload {
  entityType: ReportClaimEntityType;
  entityId: string;
  reason: ReportClaimReason;
  description?: string;
  identifier?: string;
}

export enum ReportClaimErrorType {
  RESPONSE_ERROR = 1,
  DUPLICATE_PENDING_REPORT = 2,
}

export interface ReportClaimState {
  loading: boolean;
  success: boolean;
  error: ReportClaimErrorType | null;
  errorContent: any;
}
