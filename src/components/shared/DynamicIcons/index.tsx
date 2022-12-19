import "./index.scss";
import * as Icons from "react-icons/all";
import React from "react";

const DynamicIcons = (props: any) => {
  const { iconName, size, color } = props;
  const validatedNamde = !!iconName ? iconName : "IoAlertCircleOutline";
  const icon = React.createElement(Icons[validatedNamde]);
  return (
    <span className="icon-container" style={{ fontSize: size, color: color }}>
      {icon}
    </span>
  );
};

export default DynamicIcons;
