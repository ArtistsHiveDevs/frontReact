import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { PreBookingRequestModel } from '~/models/domain/prebooking';

export interface FilterOption {
  value: string;
  label: string;
}

export interface HeaderFilterConfig {
  id: string;
  value: string;
  onChange: (value: string) => void;
  icon: string;
  options: FilterOption[];
  ariaLabel: string;
}

export interface HeaderActionButtonConfig {
  id: string;
  onClick: () => void;
  icon: string;
  ariaLabel: string;
  showBadge: boolean;
  className?: string;
}

export interface ApprovalStatusOption {
  value: string;
  label: string;
  getIcon: () => { icon: string; color: string } | undefined;
}

export interface ApprovalSelectProps {
  prebooking: PreBookingRequestModel;
  myApprovalStatus: string | undefined;
  isDisabled: boolean;
  onStatusChange: (status: string) => void;
  iconSize?: number;
}

export interface ParticipantAvatarsProps {
  participants: CurrentProfileInfoModel[];
  prebooking: PreBookingRequestModel;
  maxAvatars?: number;
  avatarSize?: number;
  badgeIconSize?: number;
  onAvatarClick?: (participant: CurrentProfileInfoModel) => void;
  onMoreClick?: (prebooking: PreBookingRequestModel) => void;
  getParticipantApprovalStatus: (prebooking: PreBookingRequestModel, participantId: string) => any;
  sortParticipants: (participants: CurrentProfileInfoModel[]) => CurrentProfileInfoModel[];
}

export interface PrebookingTableRowProps {
  prebooking: PreBookingRequestModel;
  loggedUser: any;
  isUpdating: boolean;
  onStatusChange: (prebookingId: string, status: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, prebookingId: string) => void;
  onParticipantClick: (participant: CurrentProfileInfoModel) => void;
  onPrebookingClick: (prebooking: PreBookingRequestModel) => void;
  getApprovalIcon: (status: string | undefined) => { icon: string; color: string } | undefined;
  getParticipantApprovalStatus: (prebooking: PreBookingRequestModel, participantId: string) => any;
  sortParticipants: (participants: CurrentProfileInfoModel[]) => CurrentProfileInfoModel[];
}

export interface PrebookingCardProps {
  prebooking: PreBookingRequestModel;
  loggedUser: any;
  isUpdating: boolean;
  onStatusChange: (prebookingId: string, status: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, prebookingId: string) => void;
  onParticipantClick: (participant: CurrentProfileInfoModel) => void;
  onPrebookingClick: (prebooking: PreBookingRequestModel) => void;
  getApprovalIcon: (status: string | undefined) => { icon: string; color: string } | undefined;
  getParticipantApprovalStatus: (prebooking: PreBookingRequestModel, participantId: string) => any;
  sortParticipants: (participants: CurrentProfileInfoModel[]) => CurrentProfileInfoModel[];
}

export interface TableColumn {
  id: string;
  label: string;
  className?: string;
}
