import { ReportClaimReason } from '~/constants/domain/reportClaim.constants';
import { EntityModel, EntityTemplate } from '~/models/base';

export type ReportClaimEntityType = 'Artist' | 'Place';

export interface ReportClaimTemplate extends EntityTemplate {
  entityType: ReportClaimEntityType;
  entityId: string;
  identifier: any;
  reason: ReportClaimReason;
  description?: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export class ReportClaimModel extends EntityModel<ReportClaimTemplate> implements ReportClaimTemplate {
  declare entityType: ReportClaimEntityType;
  declare entityId: string;
  declare reason: ReportClaimReason;
  declare description?: string;
  declare status?: 'pending' | 'approved' | 'rejected';

  get hasFetchAllData(): boolean {
    return !!this.id && !!this.entityType && !!this.entityId && !!this.reason;
  }
}
