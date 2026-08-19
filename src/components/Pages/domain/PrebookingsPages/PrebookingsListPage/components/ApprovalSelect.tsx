import { FormControl, Select } from '@mui/material';
import React from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ParticipantStatus } from '~/models/domain/prebooking';
import { ApprovalSelectProps } from '../types';
import { ApprovalMenuItem } from './ApprovalMenuItem';

export const ApprovalSelect: React.FC<ApprovalSelectProps> = ({
  prebooking,
  myApprovalStatus,
  isDisabled,
  onStatusChange,
  iconSize = 20,
}) => {
  // Nota: approvalStatusOptions se pasa desde el componente padre
  // para evitar dependencias circulares con getApprovalIcon
  const getApprovalIcon = (status: string | undefined): { icon: string; color: string } | undefined => {
    // Esta función debe venir del padre
    return undefined;
  };

  return (
    <FormControl size="small">
      <Select
        value={myApprovalStatus || ParticipantStatus.PENDING}
        onChange={(e) => onStatusChange(e.target.value)}
        disabled={isDisabled}
        renderValue={(value) => {
          const icon = getApprovalIcon(value);
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {icon && <DynamicIcons iconName={icon.icon} color={icon.color} size={iconSize} background="white" />}
            </div>
          );
        }}
        sx={{
          '& .MuiSelect-select': { padding: '4px 8px' },
          '& fieldset': { borderColor: '#ddd', borderRadius: '20px' },
        }}
      >
        {/* Los items se renderizan desde el padre */}
      </Select>
    </FormControl>
  );
};
