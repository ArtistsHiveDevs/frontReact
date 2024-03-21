import Flag from 'react-world-flags';
import { useI18n } from '~/common/utils';
import './CountriesCitiesListView.scss';

const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS = 'app.global_dictionary.actions';

export const CountriesCitiesListView = (props: any) => {
  const { cities } = props;

  const compareCity = (a: any, b: any) => {
    if (a.country < b.country) {
      return -1;
    } else if (a.country > b.country) {
      return 1;
    } else {
      if (a.totalEvents < b.totalEvents) {
        return 1;
      } else if (a.totalEvents > b.totalEvents) {
        return -1;
      } else {
        if (a.state < b.state) {
          return -1;
        } else if (a.state > b.state) {
          return 1;
        } else {
          if (a.city < b.city) {
            return -1;
          } else if (a.city > b.city) {
            return 1;
          } else {
            return 0;
          }
        }
      }
    }
  };

  const sortedCities = cities.sort(compareCity);

  const { translateText } = useI18n();

  if (!cities) {
    return <div>No se encontró ningún álbum.</div>;
  } else {
    return (
      <div>
        <p>
          <Flag code={'co'} height="15" />
          <strong>{'  '}Colombia (CO)</strong>
        </p>
        <p>{cities.map((city: any) => `${city.city} (${city.totalEvents})`).join(', ')}</p>
      </div>
    );
  }
};
