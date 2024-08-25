import { Avatar } from '@mui/material';
import React from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './Avatar-with-icon.scss';

interface Props {
  image: string;
  name: string;
  avatarSize: number;
  buttonIcon?: string;
  onClick?: Function;
}

const AvatarWithIcon: React.FC<Props> = ({ image, name, avatarSize, buttonIcon, onClick }) => {
  return (
    <div style={{ position: 'relative', display: 'inline-block', paddingTop: '1rem' }}>
      <Avatar
        src={image}
        alt={name}
        sx={{
          width: avatarSize,
          height: avatarSize,
          border: '2px solid white',
        }}
      />
      {buttonIcon && (
        <div className="icon-button-avatar" onClick={() => onClick && onClick()}>
          <DynamicIcons
            iconName={buttonIcon || ''}
            size={30}
            customStyle={{ position: 'absolute', top: '-1rem', left: '-0.35rem' }}
          />
        </div>
      )}
    </div>
  );
};

export default AvatarWithIcon;
