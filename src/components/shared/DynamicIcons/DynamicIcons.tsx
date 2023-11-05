import { useEffect, useState } from "react";
import { IconBaseProps, IconType } from "react-icons/lib";
import { RiLoader2Line } from "react-icons/ri/index";
import "./DynamicIcons.scss";

interface typesPropsIcon {
  iconName: string;
  size?: any;
  color?: any;
  propsIcon?: IconBaseProps;
}

export function DynamicIcons({
  iconName,
  size,
  color,
  propsIcon,
}: typesPropsIcon): JSX.Element {
  const props = { ...propsIcon };
  const specificLib =
    iconName.indexOf(" ") >= 0 ? iconName.split(" ")[0] : undefined;
  const name = iconName.indexOf(" ") >= 0 ? iconName.split(" ")[1] : iconName;
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
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .split(" ")[0]
      .toLocaleLowerCase();

  useEffect(() => {
    switch (lib) {
      case "ai":
        import("react-icons/ai/index").then(loadIcon);
        break;
      case "bi":
        import("react-icons/bi/index").then(loadIcon);
        break;
      case "bs":
        import("react-icons/bs/index").then(loadIcon);
        break;
      case "fa":
        import(`react-icons/fa/index`).then(loadIcon);
        break;
      case "gi":
        import("react-icons/gi/index").then(loadIcon);
        break;
      case "gr":
        import("react-icons/gr/index").then(loadIcon);
        break;
      case "im":
        import("react-icons/im/index").then(loadIcon);
        break;
      case "io":
        import("react-icons/io/index").then(loadIcon);
        break;
      case "io5":
        import("react-icons/io5/index").then(loadIcon);
        break;
      case "hi":
        import("react-icons/hi/index").then(loadIcon);
        break;
      case "hi2":
        import("react-icons/hi2/index").then(loadIcon);
        break;
      case "md":
        import("react-icons/md/index").then(loadIcon);
        break;
      case "ri":
        import("react-icons/ri/index").then(loadIcon);
        break;
      case "si":
        import("react-icons/si/index").then(loadIcon);
        break;
      default:
        import("react-icons/fa/index").then(loadIcon);
    }
  }, []);

  return (
    <span className="icon-container" style={{ fontSize: size, color: color }}>
      <Icon color={propsIcon?.color} size={propsIcon?.size} />
    </span>
  );
}

export default DynamicIcons;
