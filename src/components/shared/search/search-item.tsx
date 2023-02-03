import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";

import { SearchListGroup } from "./search-list-group";
import { ISearchList, ISearchMock, searchMock } from "./search-mock";
import consts, { Type } from "./constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import { useDispatch, useSelector } from "react-redux";
import { useArtistsSlice } from "~/common/slices";
import { selectArtistsQuery, artistsSelectLoading } from "~/common/slices/artists/selectors";
import { selectQueriedPlaces, placesSelectLoading } from "~/common/slices/places/selectors";
import { usePlacesSlice } from "~/common/slices/places";
import { eventsSelectLoading, selectQueriedEvents } from "~/common/slices/events/selectors";
import { EventModel } from "~/models/domain/event/event.model";
import { useEventsSlice } from "~/common/slices/events";
import { useStore } from "react-redux";

type Prop = {
  q: string;
};


export const SearchItem: React.FC<Prop> = ({q = consts.defaultSearch}) => {
  const [checked, setChecked] = useState(new Set(consts.defaultTypes));

  const hasWords = Boolean(q);

  const sliceCount = (search: ISearchList) => {
    let maxListValues = consts.maxDefaultSearchElements;
    if(search?.ratio) {
      maxListValues = search?.ratio;
    }
    return maxListValues;
  }
    
    const dispatch = useDispatch();
    const esto = useStore();

    const queriedArtistsList: ArtistModel[] = useSelector(selectArtistsQuery);
    const queryArtistListLoading: boolean = useSelector(artistsSelectLoading);
    const { actions: artistsActions } = useArtistsSlice();

    const queriedPlacesList: PlaceModel[] = useSelector(selectQueriedPlaces);
    const queryPlacesLoading: boolean = useSelector(placesSelectLoading);
    const { actions: placesActions } = usePlacesSlice();

    const queriedEventsList: EventModel[] = useSelector(selectQueriedEvents);
    const queryEventsLoading: boolean = useSelector(eventsSelectLoading);
    const { actions: eventsActions } = useEventsSlice();

    const artistSearchObject : ISearchList = {
      id: "artists",
      name: "Artists",
      displayField: "name",
      searchType: "startswith",
      data: queriedArtistsList
    }

    const placesSearchObject : ISearchList = {
      id: "places",
      name: "Places",
      displayField: "name",
      searchType: "contains",
      data: queriedPlacesList
    }

    const eventsSearchObject : ISearchList = {
      id: "events",
      name: "Events",
      displayField: "name",
      ratio: 1,
      searchType: "contains",
      data: queriedEventsList
    }

  useEffect(() => {

    if (q?.length > 0) {
      dispatch(artistsActions.queryArtists(q));
      dispatch(placesActions.queryPlaces(q));
      dispatch(eventsActions.queryEvents(q));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleChecked = (check: Type) => {
    if (checked.has(check)) {
      setChecked(
        (prev) => new Set([...prev].filter((types) => types !== check))
      );
    } else {
      setChecked((prev) => new Set([...prev, check]));
    }
  };

  return q?.length > 0 && (
    <ListGroup className="search-list">
      <ListGroup.Item className="search-item-head">
        <h4 className="search-item-head__title">
          {hasWords ? "Lista de resultados" : "Recomendados"}
        </h4>
        <div className="search-item-head__subtitle disable-select">
          <Badge
            bg={
              checked.has(Type.ARTISTS) && artistSearchObject?.data?.length > 0 ?
              "ah-secundary color-hor-an" : "ah-border-secundary"
            }
            onClick={() =>
              artistSearchObject?.data?.length > 0 ?
              handleChecked(Type.ARTISTS) : {}
            }
          >
            Artists
          </Badge>
          <Badge
            bg={
              checked.has(Type.PLACES) && placesSearchObject?.data?.length > 0 ?
              "ah-third color-hor-an" : "ah-border-third"
            }
            onClick={() =>
              placesSearchObject?.data?.length > 0 ?
              handleChecked(Type.PLACES) : {}
            }
          >
            Places
          </Badge>
          <Badge
            bg={
              checked.has(Type.EVENTS) && eventsSearchObject?.data?.length > 0 ?
              "ah-fourth color-hor-an" : "ah-border-fourth"
            }
            onClick={() =>
              eventsSearchObject?.data?.length > 0 ?
              handleChecked(Type.EVENTS) : {}
            }
          >
            Events
          </Badge>
        </div>
      </ListGroup.Item>

      {
      queryArtistListLoading &&
      queryEventsLoading &&
      queryPlacesLoading && (
        <ListGroup.Item>
        <p className="label-search-waiting line-up-an">Escribe tu búsqueda...</p>
      </ListGroup.Item>
      )}

      {
      !queryArtistListLoading &&
      !queryEventsLoading &&
      !queryPlacesLoading &&
      !artistSearchObject?.data.length &&
      !placesSearchObject?.data.length &&
      !eventsSearchObject?.data.length &&  
      (
        <ListGroup.Item>
        <p className="label-search-waiting line-up-an">No se ha encontrado ningún resultado</p>
      </ListGroup.Item>
      )}

      {/* Search Artists */}

      {checked.has(Type.ARTISTS) && artistSearchObject?.data
        ?.slice(0, sliceCount(artistSearchObject))
        ?.map((artist, idx) => {
        if (!checked.has(Type.ARTISTS) && Type.ARTISTS === artist.id) {
          return;
        }

        if (!checked.has(Type.PLACES) && Type.PLACES === artist.id) {
          return;
        }

        return !hasWords
        ?
          <SearchListGroup
            key={`three-${artist.name}-${artist.id}${idx}`}
            search={artist}
            type  = {`${artistSearchObject.id}`}
          />
        : 
          <SearchListGroup
            key={`full-${artist.name}-${artist.id}${idx}`}
            search={artist}
            type = {`${artistSearchObject.id}`}
          />

      })}

      {/* Search places */}

      {checked.has(Type.PLACES) && placesSearchObject?.data
        ?.slice(0, sliceCount(placesSearchObject))
        ?.map((place, idx) => {
        if (!checked.has(Type.ARTISTS) && Type.ARTISTS === place.id) {
          return;
        }

        if (!checked.has(Type.PLACES) && Type.PLACES === place.id) {
          return;
        }

        return !hasWords
        ?
          <SearchListGroup
            key={`three-${place.name}-${place.id}${idx}`}
            search={place}
            type  = {`${placesSearchObject.id}`}
          />
        : 
          <SearchListGroup
            key={`full-${place.name}-${place.id}${idx}`}
            search={place}
            type = {`${placesSearchObject.id}`}
          />

      })}

      {/* Search events */}

      {checked.has(Type.EVENTS) && eventsSearchObject?.data
        ?.slice(0, sliceCount(eventsSearchObject))
        ?.map((event, idx) => {
        if (!checked.has(Type.ARTISTS) && Type.ARTISTS === event.id) {
          return;
        }

        if (!checked.has(Type.PLACES) && Type.PLACES === event.id) {
          return;
        }

        return !hasWords
        ?
          <SearchListGroup
            key={`three-${event.name}-${event.id}${idx}`}
            search={event}
            type  = {`${eventsSearchObject.id}`}
          />
        : 
          <SearchListGroup
            key={`full-${event.name}-${event.id}${idx}`}
            search={event}
            type = {`${eventsSearchObject.id}`}
          />

      })}



    </ListGroup>
  );
};
