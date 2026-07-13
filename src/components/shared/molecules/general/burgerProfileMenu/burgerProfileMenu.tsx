import { Menu, MenuItem } from '@mui/material';
import './burgerProfileMenu.scss';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { useState } from 'react';
// import React, { useState, useEffect, useRef } from 'react';

const BurgerProfileMenu = () => {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  return (
    <>
      <div>
        <button className="subpages-tabs-more" onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <DynamicIcons iconName={'BsThreeDotsVertical'} color={'white'} size={25} />
        </button>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          <MenuItem>Compartir</MenuItem>
        </Menu>
      </div>
    </>
  );
};

export default BurgerProfileMenu;
