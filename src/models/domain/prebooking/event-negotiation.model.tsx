import { Dayjs } from 'dayjs';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { EntityModel, EntityTemplate, ProfileModel, ProfileTemplate } from '~/models/base';

export type NegotiationStatus = 'draft' | 'in_negotiation' | 'all_approved' | 'contract_generated' | 'cancelled';

export type ContractType = 'venue_hires_artist' | 'co_production' | 'artist_rents_venue' | 'hospitality';

// ─────────────────────────────────────────────────────────────────────────────
// RIDER
// ─────────────────────────────────────────────────────────────────────────────

export interface RiderBlock {
  artist: string; // V1: free text. V2: structured item list
  venue: string; // V1: free text. V2: structured item list
}

export interface TechnicalRider {
  sound: RiderBlock;
  backline: RiderBlock;
  lights: RiderBlock;
  visuals: RiderBlock;
}

// ─────────────────────────────────────────────────────────────────────────────
// SETLIST
// ─────────────────────────────────────────────────────────────────────────────

export interface SetlistTrack {
  title: string;
  author: string;
  arrangement?: string;
  duration_seconds?: number; // used to compute total vs available slot
}

// ─────────────────────────────────────────────────────────────────────────────
// SCHEDULE
// ─────────────────────────────────────────────────────────────────────────────

export interface NegotiationSchedule {
  event_date: string; // ISO date YYYY-MM-DD
  soundcheck_time: string; // HH:mm
  doors_open_time: string; // HH:mm
  show_start_time: string; // HH:mm
  show_end_time: string; // HH:mm
  // Derived / read-only (from venue profile)
  regulatory_closing_time?: string; // HH:mm — venue fixed
  estimated_teardown_minutes?: number;
  max_show_end_time?: string; // derived: closing - teardown
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPENSATION
// ─────────────────────────────────────────────────────────────────────────────

export interface NegotiationCompensation {
  contract_type: ContractType;
  // venue_hires_artist
  fee?: number;
  // co_production
  door_split_artist_pct?: number;
  door_split_venue_pct?: number;
  bar_split_artist_pct?: number;
  // artist_rents_venue
  venue_rental_fee?: number;
  // hospitality
  hospitality_description?: string;
  // common
  advance_payment?: number;
  advance_payment_due_date?: string; // ISO date
  currency?: string; // e.g. 'COP', 'EUR', 'USD'
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIBILITIES
// ─────────────────────────────────────────────────────────────────────────────

export interface NegotiationResponsibilities {
  //   publicity_responsible: ResponsibleParty;
  //   ticketing_responsible: Extract<ResponsibleParty, 'venue' | 'artist'>;
  //   security_responsible: Extract<ResponsibleParty, 'venue' | 'promoter' | 'artist'>;
  //   bar_staff_responsible: Extract<ResponsibleParty, 'venue' | 'promoter'>;
}

// ─────────────────────────────────────────────────────────────────────────────
// APPROBATION
// ─────────────────────────────────────────────────────────────────────────────

export interface SectionApproval {
  // section: NegotiationSectionName;
  // status: NegotiationSectionStatus;
  approved_by: string[]; // participant IDs who approved
  approved_at?: string; // ISO datetime of last approval
}

export interface EventNegotiationTemplate extends EntityTemplate {
  status: NegotiationStatus;
  created_at?: string;
  updated_at?: string;

  description?: string;
  event_date?: Dayjs;

  load_in_time?: Dayjs;
  soundcheck_time?: Dayjs;
  doors_open_time?: Dayjs;
  show_start_time?: Dayjs;
  show_end_time?: Dayjs;
  load_out_time?: Dayjs;
  regulatory_closing_time?: Dayjs;

  participants: CurrentProfileInfoModel[];

  notes?: string;
}

export class EventNegotiationModel extends ProfileModel<EventNegotiationTemplate> implements EventNegotiationTemplate {
  declare status: NegotiationStatus;
  declare participants: CurrentProfileInfoModel[];

  declare description?: string;
  declare event_date?: Dayjs;
  declare load_in_time?: Dayjs;
  declare soundcheck_time?: Dayjs;
  declare doors_open_time?: Dayjs;
  declare show_start_time?: Dayjs;
  declare show_end_time?: Dayjs;
  declare load_out_time?: Dayjs;
  declare regulatory_closing_time?: Dayjs;

  declare notes?: string;

  constructor(template: EventNegotiationTemplate) {
    super(template);
  }

  get hasFetchAllData(): boolean {
    return !this.isExpiredCache() && !!this.id && !!this.name;
  }
}
