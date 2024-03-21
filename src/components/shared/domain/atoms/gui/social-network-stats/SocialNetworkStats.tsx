import { numberFormatterThousands } from '~/common/utils/string-utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './SocialNetworkStats.scss';

export const SocialNetworkStats = (props: { followers?: number; extraData?: { [field: string]: number | string } }) => {
  const { followers, extraData } = props;

  const variation = extraData ? extraData['variation'] : 0;
  const timelapse = (extraData ? extraData['timelapse'] : 'semanal') || 'semanal';

  const generateIcon = (variation: number) => {
    let icon = <></>;

    if (variation === 0) {
      icon = (
        <>
          <DynamicIcons iconName="GoDash" size={20} color="blue" />
        </>
      );
    } else {
      icon = (
        <DynamicIcons
          iconName={Number(variation) >= 0 ? 'BiUpArrow' : 'BiDownArrow'}
          size={20}
          color={Number(variation) >= 0 ? 'green' : 'red'}
        />
      );
    }

    return icon;
  };

  return followers ? (
    <>
      <div className="grid-feature-row">
        <div>{numberFormatterThousands(followers, 1)} followers</div>
        <div>{generateIcon(Number(variation))}</div>
        <div>
          {variation} %<br />
          {timelapse}
        </div>
      </div>
      {/* <div>2.4 oyentes mensuales</div>
      <div>4 álbums</div>
      <div>Canción con más streams</div>
      <div>La pollera colorá (231k)</div> */}
    </>
  ) : (
    <></>
  );
};
