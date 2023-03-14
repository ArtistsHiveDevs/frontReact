import { useState } from "react";
import DynamicIcons from "../../../DynamicIcons";
import "./favoriteSubscribe.scss";

type FavoriteSubscribeInputTemplate = {
  callback?: { [nameParam: string]: Function };
  color?: string;
  customSubscriberTo?: boolean;
  size?: number;
  tooltipCustomText?: string;
  iconType?: {
    active: string;
    disabled: string;
  };
};

export const FavoriteDefaultTypes = {
  ALARM: {
    active: "BsAlarmFill",
    disabled: "BsAlarm",
  },
  BELL: {
    active: "BsBellFill",
    disabled: "BsBell",
  },
  HEART: {
    active: "BsHeartFill",
    disabled: "BsHeart",
  },
};

export const FavoriteSubscribe: React.FC<FavoriteSubscribeInputTemplate> = (
  props: FavoriteSubscribeInputTemplate
) => {
  // Hooks
  const [subscriberTo, setSubscriberTo] = useState(
    props?.customSubscriberTo || false
  );

  // Constants
  const inconRender = props.iconType || FavoriteDefaultTypes.HEART;
  const defaultText = subscriberTo ? "Quitar favorito" : "Agregar favorito";

  // Functions
  function onClickIconHandler() {
    const { callback } = props;
    setSubscriberTo(!subscriberTo);
    if (callback?.onClick) {
      callback.onClickIcon(subscriberTo);
    }
  }

  return (
    <span
      onClick={() => onClickIconHandler()}
      className={`fav-subs-${subscriberTo ? "active" : "initial"}`}
      data-toggle="tooltip"
      title={`${props?.tooltipCustomText || defaultText}`}
    >
      <DynamicIcons
        color={props?.color}
        size={props?.size}
        iconName={subscriberTo ? inconRender.active : inconRender.disabled}
      />
    </span>
  );
};
