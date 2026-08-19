import { Chip, FormControl, IconButton, MenuItem, Select } from '@mui/material';
import React from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ParticipantStatus } from '~/models/domain/prebooking';
import { createApprovalStatusOptions } from '../config';
import { PrebookingTableRowProps } from '../types';
import { ApprovalMenuItem } from './ApprovalMenuItem';
import { ParticipantAvatars } from './ParticipantAvatars';

export const PrebookingTableRow: React.FC<PrebookingTableRowProps> = ({
  prebooking,
  loggedUser,
  isUpdating,
  onStatusChange,
  onMenuOpen,
  onParticipantClick,
  onPrebookingClick,
  getApprovalIcon,
  getParticipantApprovalStatus,
  sortParticipants,
}) => {
  const myApprovalStatus = prebooking.participant_approvals.find(
    (approval) => approval.participant_profile_id === loggedUser?.currentProfileInfo.id
  )?.status;

  const approvalStatusOptions = createApprovalStatusOptions(getApprovalIcon);

  return (
    <tr className="pb-table-row">
      <td className="pb-table-event-name">
        <strong>{prebooking.event_name}</strong>
        {prebooking.description && <div className="pb-table-description">{prebooking.description}</div>}
        <ParticipantAvatars
          participants={prebooking.recipients}
          prebooking={prebooking}
          maxAvatars={3}
          avatarSize={28}
          badgeIconSize={14}
          onAvatarClick={onParticipantClick}
          onMoreClick={onPrebookingClick}
          getParticipantApprovalStatus={getParticipantApprovalStatus}
          sortParticipants={sortParticipants}
        />
      </td>
      <td className="pb-table-date">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div>
            {prebooking.requested_date_start?.format('DD/MM/YY')}
            {prebooking.flexible_dates && <div style={{ fontSize: '0.7rem' }}>(Flex.)</div>}
          </div>
        </div>
      </td>
      <td className="pb-table-venue">
        {prebooking.venues.map((venue: CurrentProfileInfoModel, idx: number) => (
          <div key={`venue_${idx}`}>
            {venue.name}
            {venue.location && Array.isArray(venue.location) && venue.location.length > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#999' }}>
                {venue.location[0]?.city}, {venue.location[0]?.country_name}
              </div>
            )}
          </div>
        ))}
      </td>
      <td className="pb-table-status">
        <Chip label={prebooking.status} size="small" />
      </td>
      <td className="pb-table-my-response">
        {loggedUser?.currentProfileIdentifier && (
          <FormControl size="small">
            <Select
              value={myApprovalStatus || ParticipantStatus.PENDING}
              onChange={(e) => onStatusChange(prebooking.identifier, e.target.value)}
              disabled={isUpdating}
              renderValue={(value) => {
                const icon = getApprovalIcon(value);
                return (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    {icon && <DynamicIcons iconName={icon.icon} color={icon.color} size={20} background="white" />}
                  </div>
                );
              }}
              sx={{
                '& .MuiSelect-select': { padding: '4px 8px' },
                '& fieldset': { borderColor: '#ddd', borderRadius: '20px' },
              }}
            >
              {approvalStatusOptions.map((status) => (
                <ApprovalMenuItem key={status.value} status={status} />
              ))}
            </Select>
          </FormControl>
        )}
      </td>
      <td className="pb-table-actions">
        {loggedUser?.currentProfileIdentifier === prebooking?.requester?.identifier && (
          <IconButton size="small" onClick={(e: any) => onMenuOpen(e, prebooking.id)}>
            <DynamicIcons iconName="HiDotsVertical" size={16} />
          </IconButton>
        )}
      </td>
    </tr>
  );
};
