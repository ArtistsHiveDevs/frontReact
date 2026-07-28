import { MenuItem } from '@mui/material';
import React from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ApprovalStatusOption } from '../types';

interface ApprovalMenuItemProps {
  status: ApprovalStatusOption;
}

export const ApprovalMenuItem: React.FC<ApprovalMenuItemProps> = ({ status }) => {
  const icon = status.getIcon();

  return (
    <MenuItem value={status.value}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {icon && <DynamicIcons iconName={icon.icon} color={icon.color} size={20} background="white" />}
        <span>{status.label}</span>
      </div>
    </MenuItem>
  );
};
