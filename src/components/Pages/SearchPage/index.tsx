import { useEffect, useState } from "react";
import "./search.scss";

import { Collapse, Form, InputGroup, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useSearchSlice } from "~/common/slices/search";
import {
  selectSearch,
  selectSearchLoading,
} from "~/common/slices/search/selectors";
import { useI18n } from "~/common/utils";
import DynamicIcons from "~/components/shared/DynamicIcons";
import MapContainer from "~/components/shared/mapPrinter/mapContainer";
import { ResultElement } from "~/components/shared/search/result-element";
import consts from "~/components/shared/search/search-constants";
import { PATHS, SUB_PATHS } from "~/constants";
import { LocatableTemplate, SearchableTemplate } from "~/models/base";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import { SearchModel } from "~/models/domain/search/search.model";

const TRANSLATION_BASE_SEARCH = "app.appbase.search";
const MAX_RESULTS_PER_PAGE = 10;

export default function SearchPage() {
  const { translateText, locale } = useI18n();

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  }

  const queriedSearchList: SearchModel = useSelector(selectSearch);
  const querySearchLoading: boolean = useSelector(selectSearchLoading);
  const { actions: searchActions } = useSearchSlice();

  const [open, setOpen] = useState([]);
  const [resultViewType, setResultViewType] = useState<"list" | "map">("list");
  const [results, setResults] = useState<SearchModel>(undefined);

  const [queryTextFieldValue, setQueryTextFieldValue] = useState("");

  useEffect(() => {
    if (!!queryTextFieldValue) {
      dispatch(searchActions.querySearch(queryTextFieldValue));
    } else if (!queryTextFieldValue) {
      setResults(undefined);
      setOpen([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryTextFieldValue]);

  useEffect(() => {
    setResults(queriedSearchList);
  }, [queriedSearchList]);

  useEffect(() => {
    if (results) {
      setOpen(
        results?.foundEntities?.map((entityName, index) => index === 0) || []
      );
    }
  }, [results]);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleResultOnClick = (element: SearchableTemplate) => {
    let newEntity = PATHS.ARTISTS;
    if (element instanceof PlaceModel) {
      newEntity = PATHS.PLACES;
    } else if (element instanceof EventModel) {
      newEntity = PATHS.EVENTS;
    }

    navigate(`${newEntity}/${SUB_PATHS.ELEMENT_DETAILS}/${element.id}`);
  };
  // Effects

  const handleText = (event: any) => {
    setQueryTextFieldValue(event.target.value || "");
  };

  const emptyResults = () => {
    let emptyContent = <></>;
    if (!queryTextFieldValue) {
      // emptyContent = (
      // <>
      //   <h3>Ingresa tu búsqueda.</h3>
      //   Podrás encontrar
      //   <ul>
      //     <li>Artistas</li>
      //     <li>Eventos</li>
      //     <li>Lugares</li>
      //   </ul>
      // </>
      // );
    } else if (results && results.totalResults === 0) {
      emptyContent = (
        <article>
          <h3>{translate("empty_results.title")}</h3>
          <p>{translate("empty_results.suggestions.statement")}</p>
          <ul>
            <li>{translate("empty_results.suggestions.spelling")}</li>
            <li>{translate("empty_results.suggestions.less_words")}</li>
            <li>{translate("empty_results.suggestions.related_things")}</li>
          </ul>
        </article>
      );
    }
    return emptyContent;
  };

  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const openModal = () => {
    return (
      <Modal
        show={showFiltersModal}
        onHide={() => setShowFiltersModal(false)}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-custom-modal-styling-title">
            More filters
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Arte</h4>
          <p>Ipsum molestiae natus adipisci modi eligendi?.</p>
          <h4>Género</h4>
          <p>Ipsum molestiae natus adipisci modi eligendi?.</p>
          <h4>Instrumentos</h4>
          <p>Ipsum molestiae natus adipisci modi eligendi?.</p>
          <h4>Ubicación</h4>
          <p>Ipsum molestiae natus adipisci modi eligendi?.</p>
        </Modal.Body>
      </Modal>
    );
  };

  const RESULT_VIEW_TYPES = [
    { name: "list", icon: "IoIosList" },
    { name: "map", icon: "GrMapLocation" },
  ];

  let mapData;
  if (results?.location_boundaries) {
    const markers = Object.keys(results.locatedResults)
      .map((entityName) =>
        results.locatedResults[entityName].map((element: LocatableTemplate) => {
          return {
            ...element.latLng, //text: JSON.stringify(element.latLng)
          };
        })
      )
      .flat(1);

    mapData = {
      zoom: 6,
      center: {
        lat:
          (results.location_boundaries.max_lat +
            results.location_boundaries.min_lat) /
          2,
        lng:
          (results.location_boundaries.max_lng +
            results.location_boundaries.min_lng) /
          2,
      },
      marksLocation: markers,
      anotherOpts: {},
    };
  }

  const googleApiKey = "AIzaSyBzyzf0hnuMJBdOB9sR0kBbBTtqYs-XECs";

  const mapContainerStyles = {
    width: "100%",
    height: "400px",
  };

  return (
    <>
      <h1>{translate("what_are_you_looking_for")}</h1>
      <div className="search-controls">
        <InputGroup>
          <Form.Control
            aria-describedby="basic-addon2"
            aria-label={translate("search_placeholder")}
            autoComplete="off"
            className="ah-nav-search__input"
            name="search"
            placeholder={translate("search_placeholder")}
            value={queryTextFieldValue}
            onChange={handleText}
            // onClick={() => handleOnBlur()}
          />
        </InputGroup>
        <div onClick={() => setShowFiltersModal(true)}>
          <DynamicIcons iconName="BsSliders" size={20} />
        </div>
      </div>
      {!!results && !!open.length && (
        <>
          <div className="select-result-view-types">
            {RESULT_VIEW_TYPES.map((type) => (
              <div
                key={type.name}
                className={`result-view-type ${
                  resultViewType === type.name ? "active" : ""
                }`}
                onClick={() => setResultViewType(type.name as "list" | "map")}
              >
                <DynamicIcons iconName={type.icon} size={20} />
                {translate(`result_view_types.${type.name}`)}
              </div>
            ))}
          </div>
          {resultViewType === "list" &&
            results.foundEntities.map((entityName, entityIndex) => {
              const entityColorIndex =
                consts.defaultTypes.findIndex(
                  (type) => type.toLowerCase() === entityName.toLowerCase()
                ) + 1;

              return (
                <section key={`section-${entityIndex}-${entityName}`}>
                  <div
                    className={`group-title-icon  entity-${entityColorIndex}-item`}
                    onClick={() => {
                      const newObjectValues = [...open];
                      newObjectValues[entityIndex] =
                        !newObjectValues[entityIndex];
                      setOpen(newObjectValues);
                    }}
                  >
                    <h3 className="main-section-title">
                      {translate(`types.${entityName.toUpperCase()}`)} (
                      {
                        results.pagination[
                          `total_${entityName}` as keyof typeof results.pagination
                        ]
                      }
                      )
                    </h3>
                    <DynamicIcons
                      color="#7a260a"
                      iconName="AiOutlineDown"
                      size="20"
                    />
                  </div>
                  <Collapse in={open[entityIndex]}>
                    <div id="example-collapse-text-2">
                      <article className="day-forecast">
                        {(results[entityName as keyof typeof results] || [])
                          .slice(0, MAX_RESULTS_PER_PAGE)
                          .map(
                            (
                              entityObject: SearchableTemplate,
                              objectIndex: number
                            ) => (
                              <div
                                className="result-element-container"
                                key={`result-${entityName}-${objectIndex}-${entityObject.id}`}
                                onClick={() =>
                                  handleResultOnClick(entityObject)
                                }
                              >
                                <ResultElement
                                  element={entityObject}
                                  elementType={entityName}
                                />
                              </div>
                            )
                          )}
                      </article>
                    </div>
                  </Collapse>
                </section>
              );
            })}
          {resultViewType === "map" && (
            <>
              {!results.location_boundaries && emptyResults()}

              {results.location_boundaries && (
                <MapContainer
                  //   key={`section-${section.name}-${index}-${componentIndex}`}
                  apiKey={googleApiKey}
                  stylesc={mapContainerStyles}
                  mapData={mapData}
                />
              )}
            </>
          )}
        </>
      )}

      {emptyResults()}
      {openModal()}
    </>
  );
}
