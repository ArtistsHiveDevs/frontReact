import { Menu, MenuItem } from '@mui/material';
import './burgerProfileMenu.scss';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { useState } from 'react';
// import React, { useState, useEffect, useRef } from 'react';

const BurgerProfileMenu = (proops:any) => {
  let {
    globalDictionary = {},
    options = [],
    onClickOption = () =>{}
  } = proops;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  return (
    <>
      {!!options && options?.length > 0 && (
        <div>
        <button className="subpages-tabs-more" onClick={(e) => setMenuAnchor(e.currentTarget)}>
          <DynamicIcons iconName={'BsThreeDotsVertical'} color={'white'} size={25} />
        </button>
        <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)}>
          {options?.map((option: any) => 
          <MenuItem
              onClick = {() => {
                setMenuAnchor(null);
                onClickOption(option?.id);
              }}>{!!option?.translate && option?.translate?.length>0 ? globalDictionary(option?.translate) : option?.defalutText}</MenuItem>)}
        </Menu>
      </div>
      )}
    </>
  );
};

export default BurgerProfileMenu;
