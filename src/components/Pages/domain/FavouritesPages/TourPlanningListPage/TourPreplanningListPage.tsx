import { useEffect, useState } from "react";
import { Collapse } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Flag from "react-world-flags";
import { useTourOutlineSlice } from "~/common/slices/domain/favourites/tour-outlines";
import { selectTourOutline } from "~/common/slices/domain/favourites/tour-outlines/selectors";
import { useI18n } from "~/common/utils";
import DynamicIcons from "~/components/shared/DynamicIcons";
import { TourOutlineModel } from "~/models/domain/favourites/tourOutline";
import "./TourPreplanningListPage.scss";

const TRANSLATION_BASE_SEARCH = "app.appbase.search";

const TourPreplanningListPage = () => {
  const { translateText, locale } = useI18n();
  const navigate = useNavigate();

  const [open, setOpen] = useState([]);
  // Slices
  const toursOutlineList: TourOutlineModel[] = useSelector(selectTourOutline);

  const { actions: toursOutlinesList } = useTourOutlineSlice();

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    dispatch(toursOutlinesList.queryTourOutline("asdasd"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("#### ", toursOutlineList);
    setOpen(toursOutlineList?.map((entityName, index) => index === 0) || []);
  }, [toursOutlineList]);

  // function navigateTo(newEntity: PATHS, id: string = null) {
  //   navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${id}`);
  // }

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  }

  const flags = {
    Colombia: "co",
    España: "es",
    Inglaterra: "GB-ENG",
  };

  return (
    <>
      Academies funciona
      {Array(60).fill(<br />)}
      <>
        <h1>My favourites</h1>

        {toursOutlineList &&
          toursOutlineList.map((tourOutline, entityIndex) => {
            const budget = tourOutline?.summary?.budget;

            const budget_labels = {
              internal_transportation: "Transporte interno",
              intercity_transportation: "Transporte entre ciudades",
              accomodation: "Acomodación",
              food: "Alimentación",
            };
            const buget_subtotals = {
              internal_transportation: Object.keys(
                budget?.transportation?.internal_transportation || []
              )
                .map(
                  (medium) =>
                    budget.transportation?.internal_transportation[
                      medium as keyof typeof budget.transportation.internal_transportation
                    ]
                )
                .reduce(
                  (accumulated, currentValue) => accumulated + currentValue,
                  0
                ),
              intercity_transportation: Object.keys(
                budget?.transportation?.intercity_transportation || []
              )
                .map(
                  (medium) =>
                    budget.transportation?.intercity_transportation[
                      medium as keyof typeof budget.transportation.intercity_transportation
                    ]
                )
                .reduce(
                  (accumulated, currentValue) => accumulated + currentValue,
                  0
                ),
              accomodation: Object.keys(budget?.accomodation || [])
                .map(
                  (accomodationService) =>
                    budget.accomodation[
                      accomodationService as keyof typeof budget.accomodation
                    ]
                )
                .reduce(
                  (accumulated, currentValue) => accumulated + currentValue,
                  0
                ),
              food: budget?.food,
            };

            return (
              <section key={`section-${entityIndex}-${tourOutline}`}>
                <div
                  className={`group-title-icon`}
                  onClick={() => {
                    const newObjectValues = [...open];
                    newObjectValues[entityIndex] =
                      !newObjectValues[entityIndex];
                    setOpen(newObjectValues);
                  }}
                >
                  <img
                    className="avatar"
                    src={
                      tourOutline.pictures.thumbnail ||
                      "https://randomuser.me/api/portraits/men/75.jpg"
                    }
                    alt={tourOutline?.name}
                  />
                  <h3 className="main-section-title">{tourOutline.name})</h3>
                  <DynamicIcons
                    color="#7a260a"
                    iconName="AiOutlineDown"
                    size="20"
                  />
                </div>
                <Collapse in={open[entityIndex]}>
                  <div id="example-collapse-text-2">
                    <article className="tour-outline-card">
                      <div>
                        <>
                          <p>
                            <b>Desde: </b>
                            {tourOutline.summary.days.initial_date.toLocaleString(
                              "en-GB"
                            )}
                          </p>
                          <p>
                            <b>Hasta: </b>
                            {tourOutline.summary.days.final_date.toLocaleString(
                              "en-GB"
                            )}
                          </p>
                          <p>
                            <b>Countries:</b>
                          </p>
                          <p className="inner-content">
                            {tourOutline.summary.countries.map(
                              (country, index, countries) => (
                                <p key={country.name}>
                                  <Flag
                                    code={
                                      flags[country.name as keyof typeof flags]
                                    }
                                    height="15"
                                    style={{ border: "1px solid #999" }}
                                  />{" "}
                                  <b>{country.name}</b>
                                  <br />
                                  {country.cities.join(", ")}
                                </p>
                              )
                            )}
                          </p>
                          <p>
                            <b>Presupuesto:</b>
                          </p>
                          <p className="inner-content">
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
                          </p>
                        </>
                        <a>Ver más</a>
                      </div>
                    </article>
                  </div>
                </Collapse>
              </section>
            );
          })}
      </>
      {Array(60).fill(<br />)}
    </>
  );
};

export default TourPreplanningListPage;
