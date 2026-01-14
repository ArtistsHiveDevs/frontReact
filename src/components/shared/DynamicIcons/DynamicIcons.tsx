import { useEffect, useState } from 'react';
import { IconBaseProps, IconType } from 'react-icons/lib';
import { RiLoader2Line } from 'react-icons/ri/index';
import './DynamicIcons.scss';

interface typesPropsIcon {
  iconName: string;
  size?: any;
  color?: any;
  background?: string;
  propsIcon?: IconBaseProps;
  customStyle?: { [property: string]: any };
  className?: string;
  onClick?: Function;
}

export function DynamicIcons(params: typesPropsIcon): JSX.Element {
  let { iconName, size, color, background, propsIcon, customStyle = {}, className = '', onClick } = params;
  const props = { ...propsIcon };
  const specificLib = iconName.indexOf(' ') >= 0 ? iconName.split(' ')[0] : undefined;
  const name = iconName.indexOf(' ') >= 0 ? iconName.split(' ')[1] : iconName;
  props.color = color;
  props.size = size;

  const [Icon, setIcon] = useState<IconType>(() => RiLoader2Line);

  useEffect(() => {
    let isMounted = true;

    const loadIcon = async () => {
      try {
        const lib =
          specificLib ||
          name
            .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
            .split(' ')[0]
            .toLowerCase();

        const libraryMap: Record<string, () => Promise<any>> = {
          ai: () => import('react-icons/ai/index'),
          bi: () => import('react-icons/bi/index'),
          bs: () => import('react-icons/bs/index'),
          fa: () => import('react-icons/fa/index'),
          fa6: () => import('react-icons/fa6/index'),
          gi: () => import('react-icons/gi/index'),
          gr: () => import('react-icons/gr/index'),
          im: () => import('react-icons/im/index'),
          io: () => import('react-icons/io/index'),
          io5: () => import('react-icons/io5/index'),
          hi: () => import('react-icons/hi/index'),
          hi2: () => import('react-icons/hi2/index'),
          lu: () => import('react-icons/lu/index'),
          md: () => import('react-icons/md/index'),
          pi: () => import('react-icons/pi/index'),
          ri: () => import('react-icons/ri/index'),
          si: () => import('react-icons/si/index'),
          sl: () => import('react-icons/sl/index'),
          tb: () => import('react-icons/tb/index'),
        };

        const loadLibrary = libraryMap[lib] || libraryMap['fa']; // Default: FontAwesome
        const iconsLibrary = await loadLibrary();
        const SelectedIcon = iconsLibrary[name as keyof typeof iconsLibrary] as IconType;

        if (isMounted && SelectedIcon) {
          setIcon(() => SelectedIcon);
        }
      } catch (error) {
        console.error('Error loading icon:', error);
      }
    };

    loadIcon();

    return () => {
      isMounted = false;
    };
  }, [iconName]); // 🔄 Se reactiva cuando cambia el nombre del icono

  return (
    <span
      className={`icon-container ${className}`}
      style={{
        fontSize: size,
        color,
        background,
        padding: background ? '0.1rem' : '',
        borderRadius: background ? '50%' : '',
        display: background ? 'flex' : '',
        alignItems: background ? 'center' : '',
        justifyContent: background ? 'center' : '',
        ...customStyle,
      }}
      onClick={() => {
        if (onClick && typeof onClick === 'function') {
          onClick();
        }
      }}
    >
      <Icon {...props} />
    </span>
  );
}

export default DynamicIcons;
