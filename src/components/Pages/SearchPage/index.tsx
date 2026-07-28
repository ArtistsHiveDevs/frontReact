import { useEffect, useState } from 'react';
import './search.scss';

import { Collapse, Form, Image, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchSlice } from '~/common/slices/search';
import { selectSearch, selectSearchLoading } from '~/common/slices/search/selectors';
import { useI18n } from '~/common/utils';
import { trackSearchResultClick } from '~/common/utils/analytics';
import { EntityType } from '~/common/utils/analytics/events';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ResultElement } from '~/components/shared/search/result-element';
import consts from '~/components/shared/search/search-constants';
import { EntityModel, EntityTemplate, LocatableTemplate, SearchableProfileTemplate } from '~/models/base';
import { SearchModel } from '~/models/domain/search/search.model';

import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useSwipeable } from 'react-swipeable';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { GMapsSvgMaker } from '~/common/utils/object-utils/object-utils-index';
import MapContainer from '~/components/shared/mapPrinter/mapContainer';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DynamicTabbedForm } from '~/components/shared/organisms/gui/dynamicForms/DynamicTabbedForm';
import { SocialNetworks } from '~/constants/social-networks.const';
import { PlaceModel } from '~/models/domain/place/place.model';
import { SEARCH_FILTERS_CONFIG } from './config-search';

const TRANSLATION_BASE_SEARCH = 'app.appbase.search';
const TRANSLATION_BASE_FILTERS = `${TRANSLATION_BASE_SEARCH}.filters`;
const MAX_RESULTS_PER_PAGE = 40;

interface FilterTemplate extends EntityTemplate {
  country: string;
  city: string;
  genres: string[];
  has_social_networks: string[];
}
class FilterModel extends EntityModel<FilterTemplate> {
  declare country: string;
  declare city: string;
  declare genres: string[];
  declare has_social_networks: string[];

  get hasFetchAllData(): boolean {
    return false;
  }
}

export default function SearchPage() {
  const { translateText, locale } = useI18n();

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  }

  const queriedSearchList: SearchModel = useSelector(selectSearch);
  const querySearchLoading: boolean = useSelector(selectSearchLoading);
  const { actions: searchActions } = useSearchSlice();

  const [open, setOpen] = useState([]);
  const [resultViewType, setResultViewType] = useState<'list' | 'map'>('list');
  const [results, setResults] = useState<SearchModel>(undefined);

  const [queryTextFieldValue, setQueryTextFieldValue] = useState('');

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
      setOpen(results?.foundEntities?.map((entityName, index) => index === 0) || []);
    }
  }, [results]);

  const dispatch = useDispatch();

  const { navigateToEntity } = useNavigation();

  const handleResultOnClick = (element: SearchableProfileTemplate) => {
    navigateToEntity({ entityType: element.constructor.name, id: element.identifier });
  };
  // Effects

  const handleText = (event: any) => {
    setQueryTextFieldValue(event.target.value || '');
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
          <h3>{translate('empty_results.title')}</h3>
          <p>{translate('empty_results.suggestions.statement')}</p>
          <ul>
            <li>{translate('empty_results.suggestions.spelling')}</li>
            <li>{translate('empty_results.suggestions.less_words')}</li>
            <li>{translate('empty_results.suggestions.related_things')}</li>
          </ul>
        </article>
      );
    }
    return emptyContent;
  };

  // =====================================================================================================================================================================

  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [filtersObject, setFiltersObject] = useState<FilterModel>(undefined);

  const handleCloseFiltersModal = (params?: any) => setShowFiltersModal(false);

  const [availableLanguages, updateAvailableLanguages] = useState([]);
  const [availableGenres, updateAvailableGenres] = useState([]);
  const [availableGenders, updateAvailableGenders] = useState([]);
  const [availableSocialNetworks, updateAvailableSocialNetworks] = useState([]);
  const [availableAllergies, updateAvailableAllergies] = useState([]);
  const [availableBloodGroups, updateAvailableBloodGroups] = useState([]);
  const [availableDietaryRestritions, updateAvailableDietaryRestrictions] = useState([]);
  const [availableArtists, updateAvailableArtists] = useState([]);
  const [availablePlaces, updateAvailablePlaces] = useState([]);

  useEffect(() => {
    // console.log('showFiltersModal: ', showFiltersModal, filtersObject);
  }, [showFiltersModal]);

  useEffect(() => {
    const langsOR = [
      { label: 'ES', value: 'es', selected: false },
      { label: 'DE', value: 'de' },
      { label: 'FR', value: 'fr' },
      { label: 'PT', value: 'pt' },
    ];
    let langs = [...langsOR];

    Array(20)
      .fill('x')
      .forEach((valu, number) =>
        langsOR.forEach((lng) =>
          langs.push({
            label: `${lng.label}${number}`,
            value: `${lng.value}${number}`,
            selected: Math.random() > 1 - 10 / 100,
          })
        )
      );

    updateAvailableLanguages(langs);
    updateAvailableGenres([
      { label: 'Cumbia', value: 'genre1' },
      { label: 'Reggaetón', value: 'genre2' },
      { label: 'Rock', value: 'genre3', selected: true },
      { label: 'Jazz', value: 'genr4' },
    ]);

    //
    const groupList = ['A', 'B', 'AB', 'O'];
    const fullGroup = groupList.map((group) => {
      return [`${group}+`, `${group}-`];
    });
    const defaultBloodGroup = 'O+';
    // updateAvailableBloodGroups(
    //   fullGroup.flat().map((group) => {
    //     let bloodGroup: SelectOption = { label: group, value: group };
    //     if (group === defaultBloodGroup) {
    //       bloodGroup = { ...bloodGroup, selected: true };
    //     }
    //     return bloodGroup;
    //   })
    // );

    updateAvailableAllergies([
      { label: 'Polen', value: 'Polen' },
      { label: 'Polvo', value: 'Polvo' },
      { label: 'Leche', value: 'Leche' },
      { label: 'Maní', value: 'Maní' },
      { label: 'Gluten', value: 'Gluten' },
      { label: 'Ibuprofeno', value: 'Ibuprofeno' },
      { label: 'Perros', value: 'Perros' },
      { label: 'Gatos', value: 'Gatos' },
    ]);

    updateAvailableGenders([
      { label: 'Man', value: 'male' },
      { label: 'Woman', value: 'female' },
      { label: 'Non binary', value: 'non_binary' },
      { label: 'Non specified', value: 'non_specified' },
    ]);

    updateAvailableDietaryRestrictions([
      { label: 'None', value: 'none' },
      { label: 'Vegetarian', value: 'vegetarian' },
      { label: 'Vegan', value: 'vegan' },
      { label: 'Celiac', value: 'celiac' },
    ]);

    updateAvailableSocialNetworks(
      Object.keys(SocialNetworks)
        .filter((socialNetworkKey) => !!SocialNetworks[socialNetworkKey].title)
        .map((socialNetworkKey) => {
          return {
            icon: SocialNetworks[socialNetworkKey].icon,
            label: SocialNetworks[socialNetworkKey].title,
            value: socialNetworkKey,
          };
        })
    );

    // if (availableArtistsComplete.length === 0) {
    //   dispatch(artistsActions.loadArtists());
    // }
    // if (availablePlacesComplete.length === 0) {
    //   dispatch(placesActions.loadPlaces());
    // }
  }, []);

  const handlers = {
    onSubmit: (params?: any) => {
      console.error(params);
      const newFilters = { ...params };
      setFiltersObject(newFilters);
      console.warn('>>> ', newFilters);

      setShowFiltersModal(false);
    },
  };
  const openModal = () => {
    return (
      <AppDialog
        isOpenDialog={showFiltersModal}
        title={translateText(`${TRANSLATION_BASE_FILTERS}.title`)}
        onClose={() => {
          console.log('CERRAAAAAAAAARR--------');
          handlers['onSubmit']();
        }}
        content={
          showFiltersModal && (
            <DynamicTabbedForm
              tabsInfo={SEARCH_FILTERS_CONFIG}
              handlers={handlers}
              translationBasePath={TRANSLATION_BASE_FILTERS}
              fieldOptions={{
                gender: availableGenders,
                genres: availableGenres,
                user_language: availableLanguages,
                spoken_languages: availableLanguages,
                stage_languages: availableLanguages,
                art_languages: availableLanguages,
                has_social_networks: availableSocialNetworks,
              }}
              elementData={filtersObject}
              externalData={{}}
            />
          )
        }
      />
    );
  };

  const RESULT_VIEW_TYPES = [
    { name: 'list', icon: 'IoIosList' },
    { name: 'map', icon: 'GrMapLocation' },
  ];

  const handlePrev = (source?: any) => {
    setResultViewType('list');
  };

  const handleNext = (source?: any) => {
    if (resultViewType !== 'map') {
      setResultViewType('map');
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    // onSwipedRight: handlePrev,
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Enable swipe with mouse for testing on desktop
  });

  const handleMapTouchStart = (e: any) => {
    e?.stopPropagation();
  };

  const handleMapTouchMove = (e: any) => {
    e?.stopPropagation();
  };

  const handleMapTouchEnd = (e: any) => {
    e?.stopPropagation();
  };

  const clickHandlerMap = useSwipeable({
    onTouchStartOrOnMouseDown: (a) => {
      const target = a?.event?.target as HTMLElement;
    },
  });

  const onClickMapMarker = (element: LocatableTemplate) => {
    navigateToEntity({ entityType: PlaceModel.name, id: element.identifier });
  };

  let mapData;

  if (results) {
    const markers = Object.keys(results.locatedResults)
      .map((entityName) =>
        results.locatedResults[entityName].map((result: LocatableTemplate) => {
          const element = result as PlaceModel;

          let address = element.location;
          if (element.location && Array.isArray(element.location)) {
            address = element.location?.[0]?.address;
          } else if (typeof element.location === 'string') {
            address = element.location;
          }

          return {
            id: element.identifier,
            title: element.name,
            content: address,
            position: { ...element.latLng },
            iconData: GMapsSvgMaker(faMapMarkerAlt.icon, { color: '#D30000', opacity: 0.6 }),
            element: element,
          };
        })
      )
      .flat(1);

    mapData = {
      fitBounds: true,
      zoom: 6,
      // center: {
      //   lat: (results.location_boundaries.max_lat + results.location_boundaries.min_lat) / 2,
      //   lng: (results.location_boundaries.max_lng + results.location_boundaries.min_lng) / 2,
      // },
      marksLocation: markers,
      anotherOpts: {},
    };
  }

  const mapContainerStyles = {
    width: '90vw',
    height: '400px',
    minWidth: '90%',
  };
  return (
    <div className="result-box" {...clickHandlerMap}>
      <h1>{translate('what_are_you_looking_for')}</h1>
      <div className="search-controls">
        <InputGroup>
          <Form.Control
            aria-describedby="basic-addon2"
            aria-label={translate('search_placeholder')}
            autoComplete="off"
            className="ah-nav-search__input"
            name="search"
            placeholder={translate('search_placeholder')}
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
        <div className="result-box" {...swipeHandlers}>
          <div className="select-result-view-types">
            {RESULT_VIEW_TYPES.map((type) => (
              <div
                key={type.name}
                className={`result-view-type ${resultViewType === type.name ? 'active' : ''}`}
                onClick={() => setResultViewType(type.name as 'list' | 'map')}
              >
                <DynamicIcons iconName={type.icon} size={20} />
                {translate(`result_view_types.${type.name}`)}
              </div>
            ))}
          </div>
          {resultViewType === 'list' &&
            results.foundEntities.map((entityName, entityIndex) => {
              const entityColorIndex =
                consts.defaultTypes.findIndex((type) => type.toLowerCase() === entityName.toLowerCase()) + 1;

              return (
                <section key={`section-${entityIndex}-${entityName}`}>
                  <div
                    className={`group-title-icon  entity-${entityColorIndex}-item`}
                    onClick={() => {
                      const newObjectValues = [...open];
                      newObjectValues[entityIndex] = !newObjectValues[entityIndex];
                      setOpen(newObjectValues);
                    }}
                  >
                    <h3 className="main-section-title">
                      {translate(`types.${entityName.toUpperCase()}`)} (
                      {results.pagination[`total_${entityName}` as keyof typeof results.pagination]})
                    </h3>
                    <DynamicIcons color="#7a260a" iconName="AiOutlineDown" size="20" />
                  </div>
                  <Collapse in={open[entityIndex]}>
                    <div id="example-collapse-text-2">
                      <article className="day-forecast">
                        {(results[entityName as keyof typeof results] || [])
                          .slice(0, MAX_RESULTS_PER_PAGE)
                          .map((entityObject: SearchableProfileTemplate, objectIndex: number) => (
                            <div
                              className="result-element-container"
                              key={`result-${entityName}-${objectIndex}-${entityObject.id}`}
                              onClick={() => handleResultOnClick(entityObject)}
                            >
                              <ResultElement element={entityObject} elementType={entityName} />
                            </div>
                          ))}
                      </article>
                    </div>
                  </Collapse>
                </section>
              );
            })}
          {resultViewType === 'map' && (
            <>
              {/* {!results.location_boundaries && emptyResults()} */}

              {
                <div
                  id="map-container"
                  {...clickHandlerMap}
                  onTouchStart={handleMapTouchStart}
                  onTouchMove={handleMapTouchMove}
                  onTouchEnd={handleMapTouchEnd}
                >
                  <MapContainer
                    id="MAPA"
                    //   key={`section-${section.name}-${index}-${componentIndex}`}
                    apiKey={import.meta.env.VITE_GMAPS_KEY}
                    stylesc={mapContainerStyles}
                    mapData={mapData}
                    onClickMapMarker={onClickMapMarker}
                  />
                </div>
              }
            </>
          )}
        </div>
      )}

      {emptyResults()}
      {(!results || results.totalResults === 0) && (
        <div style={{ maxWidth: '10rem' }}>
          <Image src="https://artist-hive.com/img/search.png" fluid />
        </div>
      )}
      {openModal()}
    </div>
  );
}
