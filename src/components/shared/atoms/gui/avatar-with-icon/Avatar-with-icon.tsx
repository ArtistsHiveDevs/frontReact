import { Avatar, Badge } from '@mui/material';
import { forwardRef } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './Avatar-with-icon.scss';

interface Props {
  image: string;
  name: string;
  avatarSize: number | string;
  bottomBadgeSize?: number | string;
  buttonIcon?: string;
  onClick?: Function;
  onBadgeClick?: Function;
  variant?: 'circular' | 'rounded' | 'square';
}

export const AvatarWithIcon = forwardRef<HTMLDivElement, Props>((params, ref) => {
  const { image, name, avatarSize, bottomBadgeSize, buttonIcon, onClick, onBadgeClick, variant } = params || {};

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <Badge
        overlap="circular"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        badgeContent={
          buttonIcon && (
            <div style={{ zIndex: 1000 }} onClick={() => onBadgeClick && onBadgeClick()}>
              <DynamicIcons
                iconName={buttonIcon || ''}
                size={bottomBadgeSize || 25}
                color={'white'}
                background={'#228963'}
              />
            </div>
          )
        }
      >
        <Avatar
          src={image}
          alt={name}
          sx={{
            width: avatarSize,
            height: avatarSize,
            border: variant === 'rounded' ? '1px solid #999' : '2px solid white',
          }}
          variant={variant || 'circular'}
          onClick={() => onClick && onClick()}
        />
      </Badge>
    </div>
  );
});

// export default AvatarWithIcon;
