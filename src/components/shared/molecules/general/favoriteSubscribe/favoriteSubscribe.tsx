import { useEffect, useState } from 'react';
import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './favoriteSubscribe.scss';

type FavoriteSubscribeInputTemplate = {
  // callback?: { [nameParam: string]: Function };
  callback?: Function;
  color?: string;
  customSubscriberTo?: boolean;
  size?: number;
  tooltipCustomText?: string;
  iconType?: {
    active: string;
    disabled: string;
  };
};

export const FavoriteSubscritionIconDefaultTypes = {
  ALARM: {
    active: 'BsAlarmFill',
    disabled: 'BsAlarm',
  },
  BELL: {
    active: 'BsBellFill',
    disabled: 'BsBell',
  },
  HEART: {
    active: 'BsHeartFill',
    disabled: 'BsHeart',
  },
};

const TRANSLATION_BASE_SUBSCRIPTION = 'app.global_dictionary.actions.subscription';

export const FavoriteSubscription: React.FC<FavoriteSubscribeInputTemplate> = (
  props: FavoriteSubscribeInputTemplate
) => {
  // Hooks
  const [subscriberTo, setSubscriberTo] = useState(props?.customSubscriberTo || false);

  useEffect(() => {
    setSubscriberTo(props?.customSubscriberTo);
  }, [props]);

  const { translateText } = useI18n();

  // Constants
  const inconRender = props.iconType || FavoriteSubscritionIconDefaultTypes.HEART;
  const defaultText = subscriberTo
    ? translateText(`${TRANSLATION_BASE_SUBSCRIPTION}.unsubscribe`)
    : translateText(`${TRANSLATION_BASE_SUBSCRIPTION}.subscribe`);

  // Functions
  function onClickIconHandler() {
    const { callback } = props;
    const newValue = !subscriberTo;
    setSubscriberTo(newValue);

    if (callback && typeof callback === 'function') {
      callback(!subscriberTo);
    }
  }
  const buttonState = `fav-subs-${subscriberTo ? 'active' : 'initial'}`;
  const classes = ['fav-button', buttonState];

  return (
    <span
      onClick={() => onClickIconHandler()}
      className={classes.join(' ')}
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
