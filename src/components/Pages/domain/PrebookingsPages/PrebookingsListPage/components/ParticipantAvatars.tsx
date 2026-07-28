import { AvatarGroup, Badge } from '@mui/material';
import React from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { S3Avatar } from '~/components/shared/molecules/general/S3Avatar/S3Avatar';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ParticipantAvatarsProps } from '../types';

export const ParticipantAvatars: React.FC<ParticipantAvatarsProps> = ({
  participants,
  prebooking,
  maxAvatars = 3,
  avatarSize = 32,
  badgeIconSize = 20,
  onAvatarClick,
  onMoreClick,
  getParticipantApprovalStatus,
  sortParticipants,
}) => {
  const sortedParticipants = sortParticipants(participants);

  return (
    <AvatarGroup
      max={maxAvatars}
      spacing={-6}
      sx={{ justifyContent: 'flex-start' }}
      componentsProps={{
        additionalAvatar: {
          sx: {
            fontSize: '1rem',
            color: 'white',
            border: 'none !important',
          },
          onClick: (event) => {
            event.stopPropagation();
            onMoreClick?.(prebooking);
          },
        },
      }}
    >
      {sortedParticipants.map((participant: CurrentProfileInfoModel, index: number) => {
        const approvalInfo = getParticipantApprovalStatus(prebooking, participant.id);

        return (
          <Badge
            key={`participant_${participant.id}_${index}`}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              approvalInfo ? (
                <DynamicIcons
                  iconName={approvalInfo.icon}
                  color={approvalInfo.color}
                  size={badgeIconSize}
                  background="white"
                />
              ) : null
            }
            onClick={() => onAvatarClick?.(participant)}
          >
            <S3Avatar
              alt={participant.name}
              src={participant.profile_pic}
              sx={{
                width: avatarSize,
                height: avatarSize,
                color: 'white',
                border: (approvalInfo ? `2px solid ${approvalInfo.color}` : 'none') + ' !important',
              }}
            />
          </Badge>
        );
      })}
    </AvatarGroup>
  );
};
