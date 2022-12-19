import "./index.scss";
import * as Icons from "react-icons/all";
import React from "react";
import { IconType } from "react-icons/lib";

const DynamicIcons = (props: any) => {
  const { iconName, size, color } = props;

  const validatedName = iconName || "IoAlertCircleOutline";

  const icon = React.createElement(
    (Icons as { [key: string]: IconType })[validatedName]
  );
  return (
    <span className="icon-container" style={{ fontSize: size, color: color }}>
      {icon}
    </span>
  );
};

export default DynamicIcons;
