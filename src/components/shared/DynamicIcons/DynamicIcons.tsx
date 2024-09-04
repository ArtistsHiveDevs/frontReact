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
}

export function DynamicIcons(params: typesPropsIcon): JSX.Element {
  let { iconName, size, color, background, propsIcon, customStyle = {} } = params;
  const props = { ...propsIcon };
  const specificLib = iconName.indexOf(' ') >= 0 ? iconName.split(' ')[0] : undefined;
  const name = iconName.indexOf(' ') >= 0 ? iconName.split(' ')[1] : iconName;
  props.color = color;
  props.size = size;

  const [Icon, setIcon] = useState(() => RiLoader2Line);

  const loadIcon = (iconslibrary: any) => {
    const icon = iconslibrary[name as keyof typeof iconslibrary] as IconType;
    if (!!icon) {
      setIcon(() => icon);
    }
  };
  const lib =
    specificLib ||
    name
      .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
      .split(' ')[0]
      .toLocaleLowerCase();

  useEffect(() => {
    switch (lib) {
      case 'ai':
        import('react-icons/ai/index').then(loadIcon);
        break;
      case 'bi':
        import('react-icons/bi/index').then(loadIcon);
        break;
      case 'bs':
        import('react-icons/bs/index').then(loadIcon);
        break;
      case 'fa':
        import(`react-icons/fa/index`).then(loadIcon);
        break;
      case 'gi':
        import('react-icons/gi/index').then(loadIcon);
        break;
      case 'gr':
        import('react-icons/gr/index').then(loadIcon);
        break;
      case 'im':
        import('react-icons/im/index').then(loadIcon);
        break;
      case 'io':
        import('react-icons/io/index').then(loadIcon);
        break;
      case 'io5':
        import('react-icons/io5/index').then(loadIcon);
        break;
      case 'hi':
        import('react-icons/hi/index').then(loadIcon);
        break;
      case 'hi2':
        import('react-icons/hi2/index').then(loadIcon);
        break;
      case 'md':
        import('react-icons/md/index').then(loadIcon);
        break;
      case 'pi':
        import('react-icons/pi/index').then(loadIcon);
        break;
      case 'ri':
        import('react-icons/ri/index').then(loadIcon);
        break;
      case 'si':
        import('react-icons/si/index').then(loadIcon);
        break;
      case 'sl':
        import('react-icons/sl/index').then(loadIcon);
        break;
      case 'tb':
        import('react-icons/tb/index').then(loadIcon);
        break;
      default:
        import('react-icons/fa/index').then(loadIcon);
    }
  }, []);

  const customStyleParam: { [property: string]: any } = { ...customStyle };

  if (!!size) {
    customStyleParam['fontSize'] = size;
  }
  if (!!color) {
    customStyleParam['color'] = color;
  }

  return (
    <span className="icon-container" style={customStyleParam}>
      <Icon
        className={'icon'}
        color={propsIcon?.color}
        size={propsIcon?.size}
        // fill="red"
        style={{ background: background, padding: background ? `0.1rem` : '', borderRadius: background ? '50%' : '' }}
      />
    </span>
  );
}

export default DynamicIcons;
