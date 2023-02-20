import { useEffect, useState } from "react";
import Badge from "react-bootstrap/Badge";
import ListGroup from "react-bootstrap/ListGroup";
import { useDispatch, useSelector } from "react-redux";
import { useSearchSlice } from "~/common/slices/search";
import {
  selectSearch,
  selectSearchLoading,
} from "~/common/slices/search/selectors";
import { useI18n } from "~/common/utils";
import { SearchableTemplate } from "~/models/base";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import { SearchModel } from "~/models/domain/search/search.model";
import { ResultElement } from "./result-element";
import consts, { EntityType } from "./search-constants";

type SearchProperties = {
  q: string;
  onClick?: Function;
};

const TRANSLATION_BASE_SEARCH = "app.appbase.search";

export const ResultsList: React.FC<SearchProperties> = (params) => {
  const { q, onClick } = params;

  const { translateText, locale } = useI18n();

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  }

  const [checkedFilterEntities, setCheckedFilterEntities] = useState(
    [...consts.defaultTypes] || []
  );

  const hasQueryTerms = Boolean(q);

  const dispatch = useDispatch();

  const queriedSearchList: SearchModel = useSelector(selectSearch);
  const querySearchLoading: boolean = useSelector(selectSearchLoading);
  const { actions: searchActions } = useSearchSlice();

  useEffect(() => {
    if (q?.length > 0) {
      setCheckedFilterEntities([...consts.defaultTypes]);
      dispatch(searchActions.querySearch(q));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleChecked = (check: EntityType) => {
    let newChecks = [...checkedFilterEntities];
    if (
      checkedFilterEntities.find((checkedEntity) => checkedEntity === check)
    ) {
      newChecks = newChecks.filter((checkedEntity) => checkedEntity !== check);
    } else {
      newChecks.push(check);
    }
    setCheckedFilterEntities(newChecks);
  };

  const handleClickOnResult = (target: any) => {
    if (onClick) {
      onClick(target);
    }
  };

  const entityBadgesAndResults: {
    type: EntityType;
    color: string;
    title: string;
    data: SearchableTemplate[];
  }[] = [
    {
      type: EntityType.ARTISTS,
      color: "secundary",
      title: translate("types.ARTISTS"),
      data: queriedSearchList?.artists,
    },
    {
      type: EntityType.PLACES,
      color: "third",
      title: translate("types.PLACES"),
      data: queriedSearchList?.places,
    },
    {
      type: EntityType.EVENTS,
      color: "fourth",
      title: translate("types.EVENTS"),
      data: queriedSearchList?.events,
    },
  ];

  const entitiesWithResults =
    entityBadgesAndResults.filter(
      (badge) =>
        checkedFilterEntities.find((checked) => checked === badge.type) &&
        !!badge.data?.length
    ).length || checkedFilterEntities.length;

  const totalElementsByEntity = entityBadgesAndResults
    .filter((badge) =>
      checkedFilterEntities.find((checked) => checked === badge.type)
    )
    .map((entitySearchObject) => entitySearchObject.data?.length || 0);

  const totalElements = totalElementsByEntity.reduce(
    (previous, current) => previous + current,
    0
  );

  const maxElementsPerEntity = entitiesWithResults
    ? consts.totalDefaultSearchElements / entitiesWithResults
    : 0;

  const foundElements = entityBadgesAndResults
    .filter((badge) =>
      checkedFilterEntities.find((checked) => checked === badge.type)
    )
    .map((entitySearchObject) => {
      let resultSize = maxElementsPerEntity;
      if (entitySearchObject.data?.length < resultSize) {
        resultSize = entitySearchObject.data?.length;
      }
      return entitySearchObject.data?.slice(0, resultSize) || [];
    })
    .flat(1);

  return (
    q?.length > 0 && (
      <ListGroup className="search-list">
        <ListGroup.Item className="search-item-head">
          <h4 className="search-item-head__title">
            {hasQueryTerms
              ? translate("results")
              : translate("recommendations")}
          </h4>
          <div className="search-item-head__subtitle disable-select">
            {entityBadgesAndResults.map((badge) => (
              <Badge
                key={`badge-${badge.title}`}
                bg={
                  badge.data?.length === 0
                    ? `ah-border-disabled`
                    : checkedFilterEntities.find(
                        (check) => check === badge.type
                      )
                    ? `ah-${badge.color} color-hor-an`
                    : `ah-border-${badge.color}`
                }
                onClick={() =>
                  badge.data?.length > 0 ? handleChecked(badge.type) : {}
                }
              >
                {badge.title}
              </Badge>
            ))}
          </div>
        </ListGroup.Item>

        {querySearchLoading && (
          <ListGroup.Item>
            <p className="label-search-waiting line-up-an">
              {translate("type_your_search")}...
            </p>
          </ListGroup.Item>
        )}

        {!querySearchLoading && totalElements === 0 && (
          <ListGroup.Item>
            <p className="label-search-waiting line-up-an">
              {translate("not_found_results")}
            </p>
          </ListGroup.Item>
        )}

        {/* Results */}

        {foundElements.map((element, idx) => {
          let elementType = undefined;
          if (element instanceof ArtistModel) {
            elementType = EntityType.ARTISTS;
          } else if (element instanceof PlaceModel) {
            elementType = EntityType.PLACES;
          } else if (element instanceof EventModel) {
            elementType = EntityType.EVENTS;
          }
          return (
            <ResultElement
              key={`full-${element.name}-${element.id}${idx}`}
              element={element}
              elementType={elementType}
              onClick={handleClickOnResult}
            />
          );
        })}

        {totalElements > foundElements.length && (
          <ListGroup.Item>
            <p className="label-search-waiting line-up-an">
              {translate("see_more")}
            </p>
          </ListGroup.Item>
        )}
      </ListGroup>
    )
  );
};
