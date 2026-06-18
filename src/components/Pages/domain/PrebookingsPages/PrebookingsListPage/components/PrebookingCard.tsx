/**
 * PrebookingCard Component
 *
 * Card component exactamente igual al diseño original de PrebookingsListPage
 * Compatible con GenericFilterableList
 */

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  AvatarGroup,
  Badge,
  IconButton,
  Menu,
  Divider,
  MenuItem as MenuItemMUI,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import Flag from 'react-world-flags';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { S3Avatar } from '~/components/shared/molecules/general/S3Avatar/S3Avatar';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import {
  PreBookingRequestModel,
  PrebookingParticipantStatus,
  ParticipantApprovalStatus,
} from '~/models/domain/prebooking';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { usePreBookingRequestsSlice } from '~/common/slices/domain/prebooking/prebooking-requests.redux';
import { useI18n } from '~/common/utils';
import './PrebookingCard.scss';

export interface PrebookingCardProps {
  /** Prebooking item */
  item: PreBookingRequestModel;
  /** Loading state */
  loading?: boolean;
}

/**
 * Helper: Get approval icon config
 */
const getApprovalIcon = (status: string | undefined) => {
  switch (status) {
    case PrebookingParticipantStatus.INTERESTED:
      return { icon: 'FaCheckCircle', color: 'green' };
    case PrebookingParticipantStatus.PENDING:
      return { icon: 'TbClockHour2Filled', color: 'orange' };
    case PrebookingParticipantStatus.NOT_INTERESTED:
      return { icon: 'FaTimesCircle', color: '#b70707' };
    default:
      return undefined;
  }
};

/**
 * Helper: Get participant approval status
 */
const getParticipantApprovalStatus = (
  prebooking: PreBookingRequestModel,
  idParticipant: string
) => {
  const approval = prebooking.participant_approvals.find(
    (approval: ParticipantApprovalStatus) =>
      approval.participant_profile_id === idParticipant
  );
  return getApprovalIcon(approval?.status);
};

/**
 * Helper: Sort participants (Artists first, then Places)
 */
const sortParticipants = (participants: CurrentProfileInfoModel[]) => {
  const entityOrder = ['Artist', 'Place'];

  return [...participants].sort((a, b) => {
    const indexA = entityOrder.indexOf(a.entity);
    const indexB = entityOrder.indexOf(b.entity);

    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }

    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;

    return 0;
  });
};

/**
 * Prebooking Card - Diseño exacto del original
 */
export const PrebookingCard: React.FC<PrebookingCardProps> = ({
  item,
  loading,
}) => {
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectCurrentUser);
  const { actions: prebookingActions } = usePreBookingRequestsSlice();
  const { translateGlobalDict } = useI18n();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  // Check if current user is the requester
  const isRequester =
    loggedUser?.currentProfileIdentifier === item?.requester?.identifier;

  // Get user's approval status
  const myApprovalStatus = item.participant_approvals.find(
    (approval) =>
      approval.participant_profile_id === loggedUser?.currentProfileInfo.id
  )?.status;

  // Handle menu
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    console.log('Editar prebooking:', item.id);
    // TODO: Implementar lógica de edición
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(prebookingActions.deleteItem({ id: item.id }));
    handleMenuClose();
  };

  // Handle status change
  const handleStatusChange = (event: any) => {
    event.stopPropagation();
    setIsUpdatingStatus(true);

    dispatch(
      prebookingActions.postActionItem({
        id: item.id,
        action: 'setStatus',
        newItem: {},
        params: { status: event.target.value },
      })
    );

    // Reset loading after a delay (will be handled by Redux update)
    setTimeout(() => setIsUpdatingStatus(false), 1000);
  };

  if (loading) {
    return (
      <div className="pb-card-container">
        <Card sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent>
            <AppLoader fullHeight={false} height="200px" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pb-card-container">
      <Card sx={{ display: 'flex', flexDirection: 'column' }}>
        {/* HEADER */}
        <CardHeader
          title={item.event_name}
          action={
            isRequester && (
              <IconButton onClick={handleMenuOpen}>
                <DynamicIcons iconName="HiDotsVertical" size={20} />
              </IconButton>
            )
          }
        />

        {/* CONTENT */}
        <CardContent
          sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 0 }}
        >
          {/* Event details */}
          <div className="pb-card-content-container">
            {/* Description */}
            <p className="pb-card-description">{item.description}</p>

            {/* Date */}
            <div className="pb-card-date">
              <DynamicIcons
                iconName={
                  item.flexible_dates ? 'TbCalendarQuestion' : 'LuCalendarDays'
                }
                size={25}
              />
              <div>
                {item.requested_date_start?.format('LL')}
                {item.flexible_dates ? ' - (Flexibles)' : ''}
              </div>
            </div>

            {/* Location/Venues */}
            <div className="pb-card-location">
              <DynamicIcons iconName="fa6 FaLocationDot" size={25} />
              <ul className="pb-card-location-list">
                {item.venues.map(
                  (venue: CurrentProfileInfoModel, indexVenue: number) => (
                    <li
                      key={`pb_card_venue_${indexVenue}`}
                      className="pb-card-location-element-list"
                    >
                      {venue.name} - (
                      {venue.location &&
                        Array.isArray(venue.location) &&
                        `${venue.cityWithCountry}`}
                      )
                      {
                        <Flag
                          code={'CO'}
                          height="15"
                          style={{ border: '1px solid #999', marginLeft: '0.6rem' }}
                        />
                      }
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <Divider />

          {/* Participants section */}
          <div className="pb-card-participants-container">
            <p>Participantes:</p>
            <div className="pb-card-participants-box">
              <AvatarGroup
                max={4}
                spacing={-6}
                componentsProps={{
                  additionalAvatar: {
                    sx: {
                      color: 'white',
                      border: 'none !important',
                    },
                    onClick: (event) => {
                      event.stopPropagation();
                      // TODO: Open participant details modal
                    },
                  },
                }}
              >
                {sortParticipants(item.recipients).map(
                  (
                    participant: CurrentProfileInfoModel,
                    participant_index: number
                  ) => {
                    const approvalInfo = getParticipantApprovalStatus(
                      item,
                      participant.id
                    );

                    return (
                      <Badge
                        key={`participant_${participant.id}_${participant_index}`}
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          approvalInfo ? (
                            <DynamicIcons
                              iconName={approvalInfo.icon}
                              color={approvalInfo.color}
                              size={25}
                              background="white"
                            />
                          ) : null
                        }
                        onClick={() => {
                          // TODO: Show participant details
                        }}
                      >
                        <S3Avatar
                          alt={participant.name}
                          src={participant.profile_pic}
                          sx={{
                            color: 'white',
                            border:
                              (approvalInfo
                                ? `2px solid ${approvalInfo.color}`
                                : 'none') + ' !important',
                          }}
                        />
                      </Badge>
                    );
                  }
                )}
              </AvatarGroup>

              {/* My response selector */}
              {loggedUser?.currentProfileIdentifier && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <div className="pb-card-response-box">
                    {!isUpdatingStatus && (
                      <FormControl>
                        <Select
                          value={
                            myApprovalStatus || PrebookingParticipantStatus.PENDING
                          }
                          onChange={handleStatusChange}
                          disabled={isUpdatingStatus}
                          displayEmpty
                          renderValue={(value) => {
                            const icon = getApprovalIcon(value);
                            return (
                              <div
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                }}
                              >
                                {icon && (
                                  <DynamicIcons
                                    iconName={icon.icon}
                                    color={icon.color}
                                    size={30}
                                    background="white"
                                  />
                                )}
                              </div>
                            );
                          }}
                          sx={{
                            '& .MuiSelect-select': {
                              padding: '4px 8px',
                            },
                            '& fieldset': {
                              borderColor: '#ddd',
                              borderRadius: '20px',
                            },
                          }}
                        >
                          <MenuItem value={PrebookingParticipantStatus.INTERESTED}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                              }}
                            >
                              <DynamicIcons
                                iconName={
                                  getApprovalIcon(
                                    PrebookingParticipantStatus.INTERESTED
                                  )!.icon
                                }
                                color={
                                  getApprovalIcon(
                                    PrebookingParticipantStatus.INTERESTED
                                  )!.color
                                }
                                size={20}
                              />
                              <span>
                                {translateGlobalDict(
                                  `prebooking.participant_status.${PrebookingParticipantStatus.INTERESTED}`
                                )}
                              </span>
                            </div>
                          </MenuItem>
                          <MenuItem value={PrebookingParticipantStatus.PENDING}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                              }}
                            >
                              <DynamicIcons
                                iconName={
                                  getApprovalIcon(
                                    PrebookingParticipantStatus.PENDING
                                  )!.icon
                                }
                                color={
                                  getApprovalIcon(
                                    PrebookingParticipantStatus.PENDING
                                  )!.color
                                }
                                size={20}
                              />
                              <span>
                                {translateGlobalDict(
                                  `prebooking.participant_status.${PrebookingParticipantStatus.PENDING}`
                                )}
                              </span>
                            </div>
                          </MenuItem>
                          <MenuItem
                            value={PrebookingParticipantStatus.NOT_INTERESTED}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                              }}
                            >
                              <DynamicIcons
                                iconName={
                                  getApprovalIcon(
                                    PrebookingParticipantStatus.NOT_INTERESTED
                                  )!.icon
                                }
                                color={
                                  getApprovalIcon(
                                    PrebookingParticipantStatus.NOT_INTERESTED
                                  )!.color
                                }
                                size={20}
                              />
                              <span>
                                {translateGlobalDict(
                                  `prebooking.participant_status.${PrebookingParticipantStatus.NOT_INTERESTED}`
                                )}
                              </span>
                            </div>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                    {isUpdatingStatus && (
                      <AppLoader fullHeight={false} height="1rem" />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItemMUI onClick={handleEdit}>
          <DynamicIcons iconName="FaEdit" size={16} />
          Editar
        </MenuItemMUI>
        <MenuItemMUI onClick={handleDelete}>
          <DynamicIcons iconName="FaRegTrashAlt" size={16} />
          Eliminar
        </MenuItemMUI>
      </Menu>
    </div>
  );
};
