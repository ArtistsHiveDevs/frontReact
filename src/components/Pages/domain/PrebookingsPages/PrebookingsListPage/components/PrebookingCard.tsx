import { Card, CardContent, CardHeader, Divider, FormControl, IconButton, MenuItem, Select } from '@mui/material';
import React from 'react';
import Flag from 'react-world-flags';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ParticipantStatus } from '~/models/domain/prebooking';
import { createApprovalStatusOptions } from '../config';
import { PrebookingCardProps } from '../types';
import { ApprovalMenuItem } from './ApprovalMenuItem';
import { ParticipantAvatars } from './ParticipantAvatars';

export const PrebookingCard: React.FC<PrebookingCardProps> = ({
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
    <div className="pb-card-container">
      <Card sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardHeader
          title={prebooking.event_name}
          action={
            loggedUser?.currentProfileIdentifier === prebooking?.requester?.identifier && (
              <IconButton onClick={(e: any) => onMenuOpen(e, prebooking.id)}>
                <DynamicIcons iconName="HiDotsVertical" size={20} />
              </IconButton>
            )
          }
        />
        <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 0 }}>
          <div className="pb-card-content-container">
            <p className="pb-card-description">{prebooking.description}</p>
            <div className="pb-card-date">
              <DynamicIcons
                iconName={prebooking.flexible_dates ? 'TbCalendarQuestion' : 'LuCalendarDays'}
                size={25}
              />
              <div>
                {prebooking.requested_date_start?.format('LL')}
                {prebooking.flexible_dates ? ' - (Flexibles)' : ''}
              </div>
            </div>
            <div className="pb-card-location">
              <DynamicIcons iconName="fa6 FaLocationDot" size={25} />
              <ul className="pb-card-location-list">
                {prebooking.venues.map((venue: CurrentProfileInfoModel, indexVenue: number) => (
                  <li key={`pb_card_venue_${indexVenue}`} className="pb-card-location-element-list">
                    {venue.name} - ({venue.location && Array.isArray(venue.location) && `${venue.cityWithCountry}`})
                    {
                      <Flag
                        code={'CO'}
                        height="15"
                        style={{ border: '1px solid #999', marginLeft: '0.6rem' }}
                      />
                    }
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <Divider />
          <div className="pb-card-participants-container">
            <p>Participantes:</p>
            <div className="pb-card-participants-box">
              <ParticipantAvatars
                participants={prebooking.recipients}
                prebooking={prebooking}
                maxAvatars={4}
                avatarSize={40}
                badgeIconSize={25}
                onAvatarClick={onParticipantClick}
                onMoreClick={onPrebookingClick}
                getParticipantApprovalStatus={getParticipantApprovalStatus}
                sortParticipants={sortParticipants}
              />
              {loggedUser?.currentProfileIdentifier && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <div className="pb-card-response-box">
                    {!isUpdating && (
                      <FormControl>
                        <Select
                          value={myApprovalStatus || ParticipantStatus.PENDING}
                          onChange={(e) => onStatusChange(prebooking.identifier, e.target.value)}
                          disabled={isUpdating}
                          displayEmpty
                          renderValue={(value) => {
                            const icon = getApprovalIcon(value);
                            return (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {icon && (
                                  <DynamicIcons iconName={icon.icon} color={icon.color} size={30} background="white" />
                                )}
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
                    {isUpdating && <AppLoader fullHeight={false} />}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
