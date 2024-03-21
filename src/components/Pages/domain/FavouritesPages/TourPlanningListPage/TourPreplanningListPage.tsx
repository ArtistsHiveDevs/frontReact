import moment from 'moment';
import { useEffect, useState } from 'react';
import { Button, Collapse } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Flag from 'react-world-flags';
import { useTourOutlineSlice } from '~/common/slices/domain/favourites/tour-outlines';
import { selectToursOutlinesByUser } from '~/common/slices/domain/favourites/tour-outlines/selectors';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { formatDateInMomentType } from '~/constants';
import { TourOutlineModel } from '~/models/domain/favourites/tourOutline';
import './TourPreplanningListPage.scss';

const TRANSLATION_BASE_SEARCH = 'app.appbase.search';

const TourPreplanningListPage = () => {
  const { translateText, locale } = useI18n();
  const { navigateToEntity } = useNavigation();

  const [open, setOpen] = useState([]);
  // Slices
  const toursOutlineList: TourOutlineModel[] = useSelector(selectToursOutlinesByUser);

  const { actions: toursOutlinesList } = useTourOutlineSlice();

  // Hooks
  const dispatch = useDispatch();

  const momentFormmatter = moment();

  // Effects
  useEffect(() => {
    dispatch(toursOutlinesList.getToursOutlinesByUser('asdasd'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setOpen(toursOutlineList?.map((entityName, index) => index === 0) || []);
  }, [toursOutlineList]);

  // function navigateTo(newEntity: PATHS, id: string = null) {
  //   navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  // }

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  }

  const flags = {
    Colombia: 'co',
    España: 'es',
    Inglaterra: 'GB-ENG',
  };

  return (
    <>
      <h1>My tours</h1>

      {toursOutlineList &&
        toursOutlineList.map((tourOutline, entityIndex) => {
          const budget = tourOutline?.summary?.budget;

          const budget_labels = {
            internal_transportation: 'Transporte interno',
            intercity_transportation: 'Transporte entre ciudades',
            accomodation: 'Acomodación',
            food: 'Alimentación',
          };
          const buget_subtotals = {
            intercity_transportation: Object.keys(budget?.transportation?.intercity_transportation || [])
              .map(
                (medium) =>
                  budget.transportation?.intercity_transportation[
                    medium as keyof typeof budget.transportation.intercity_transportation
                  ]
              )
              .reduce((accumulated, currentValue) => accumulated + currentValue, 0),
            accomodation: Object.keys(budget?.accomodation || [])
              .map(
                (accomodationService) => budget.accomodation[accomodationService as keyof typeof budget.accomodation]
              )
              .reduce((accumulated, currentValue) => accumulated + currentValue, 0),
            food: budget?.food,
          };

          function seeMore(id: string) {
            navigateToEntity({ entityType: TourOutlineModel.name, id });
          }

          function formatDate(date: string) {
            const newDate = moment(date);
            const dateFormat =
              newDate.year() === moment(moment.now()).year() ? 'dddd, MMMM DD' : 'dddd, MMMM DD (YYYY)';
            return formatDateInMomentType(date, dateFormat);
          }

          return (
            <section key={`section-${entityIndex}-${tourOutline}`}>
              <div
                className={`group-title-icon`}
                onClick={() => {
                  const newObjectValues = [...open];
                  newObjectValues[entityIndex] = !newObjectValues[entityIndex];
                  setOpen(newObjectValues);
                }}
              >
                <img
                  className="avatar"
                  src={tourOutline.pictures.thumbnail || 'https://npcarlos.co/artistsHive_mocks/tour_default.png'}
                  alt={tourOutline?.name}
                />
                <div>
                  <h3 className="main-section-title">{tourOutline.name}</h3>
                  {tourOutline.subtitle && <p>{tourOutline.subtitle}</p>}
                </div>
                <DynamicIcons color="#7a260a" iconName="AiOutlineDown" size="20" />
              </div>
              <Collapse in={open[entityIndex]}>
                <div id="example-collapse-text-2">
                  <article className="tour-outline-card">
                    <div>
                      <>
                        <p>
                          <b>Desde: </b>
                          {formatDate(tourOutline.summary.days.initial_date.toString())}
                        </p>
                        <p>
                          <b>Hasta: </b>
                          {formatDate(tourOutline.summary.days.final_date.toString())}
                        </p>
                        <p>
                          <b>Countries:</b>
                        </p>
                        <div className="inner-content">
                          {tourOutline.summary.countries.map((country, index, countries) => (
                            <p key={country.name}>
                              <Flag
                                code={flags[country.name as keyof typeof flags]}
                                height="15"
                                style={{ border: '1px solid #999' }}
                              />{' '}
                              <b>{country.name}</b>
                              <br />
                              {country.cities.join(', ')}
                            </p>
                          ))}
                        </div>
                        {/* <p>
                            <b>Presupuesto:</b>
                          </p>
                          <div className="inner-content">
                            {Object.keys(buget_subtotals).map((category) => (
                              <p key={category}>
                                <b>
                                  {
                                    budget_labels[
                                      category as keyof typeof buget_subtotals
                                    ]
                                  }
                                  :{" "}
                                </b>
                                $
                                {
                                  buget_subtotals[
                                    category as keyof typeof buget_subtotals
                                  ]
                                }
                              </p>
                            ))}
                          </div> */}
                      </>
                      <div className="align-center">
                        <Button
                          className="button-styles"
                          // href={``}
                          onClick={() => seeMore(tourOutline.id)}
                        >
                          Ver más
                        </Button>
                      </div>
                    </div>
                  </article>
                </div>
              </Collapse>
            </section>
          );
        })}
    </>
  );
};

export default TourPreplanningListPage;
