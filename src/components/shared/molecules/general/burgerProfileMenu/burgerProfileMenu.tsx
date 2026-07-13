import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './burgerProfileMenu.scss';

const BurgerProfileMenu = (proops: any) => {
  let { globalDictionary = {}, options = [], onClickOption = () => {} } = proops;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  return (
    <>
      {!!options && options?.length > 0 && (
        <div>
          <button className="subpages-tabs-more" onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <DynamicIcons iconName={'BsThreeDotsVertical'} color={'white'} size={18} />
          </button>
          <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
            {options?.map(
              (option: any) =>
                option?.show && (
                  <MenuItem
                    onClick={() => {
                      setMenuAnchor(null);
                      onClickOption(option?.id);
                    }}
                  >
                    {!!option?.icon && option?.icon?.length > 0 && (
                      <DynamicIcons iconName={option.icon} color={option?.color || 'white'} size={19} />
                    )}
                    <span style={{ color: option?.color }}>
                      {!!option?.translate && option?.translate?.length > 0
                        ? globalDictionary(option?.translate)
                        : option?.defalutText}
                    </span>
                  </MenuItem>
                )
            )}
          </Menu>
        </div>
      )}
    </>
  );
};

export default BurgerProfileMenu;
