import { Menu, MenuItem } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './burgerProfileMenu.scss';

const SCROLL_CLOSE_THRESHOLD_REM = 3;

const BurgerProfileMenu = (proops: any) => {
  let { globalDictionary = {}, options = [], onClickOption = () => {} } = proops;

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const openScrollYRef = useRef(0);

  useEffect(() => {
    if (!menuAnchor) {
      return;
    }

    openScrollYRef.current = window.scrollY;
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const thresholdPx = SCROLL_CLOSE_THRESHOLD_REM * rootFontSize;

    const handleScroll = () => {
      if (Math.abs(window.scrollY - openScrollYRef.current) >= thresholdPx) {
        setMenuAnchor(null);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuAnchor]);

  return (
    <>
      {!!options && options.some((option: any) => option?.show) && (
        <div>
          <div onClick={(e) => setMenuAnchor(menuAnchor ? null : e.currentTarget)}>
            <DynamicIcons iconName={'BsThreeDotsVertical'} color={'white'} size={18} />
          </div>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { mt: 4 } }}
            sx={{ zIndex: 2100 }}
            disableScrollLock
          >
            {options?.map(
              (option: any, index: number) =>
                option?.show && (
                  <MenuItem
                    key={`burger-option-${option?.option}-${index}`}
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
