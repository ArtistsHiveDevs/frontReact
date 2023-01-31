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
import { selectArtistsQuery } from "~/common/slices/artists/selectors";
import { selectQueriedPlaces } from "~/common/slices/places/selectors";
import { usePlacesSlice } from "~/common/slices/places";
import { selectQueriedEvents } from "~/common/slices/events/selectors";
import { EventModel } from "~/models/domain/event/event.model";
import { useEventsSlice } from "~/common/slices/events";

type Prop = {
  q: string;
};


export const SearchItem: React.FC<Prop> = ({q = consts.defaultSearch}) => {
  const [results, setResults] = useState(new Set(consts.defaultTypes));
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

    const queriedArtistsList: ArtistModel[] = useSelector(selectArtistsQuery);
    const { actions: artistsActions } = useArtistsSlice();

    const queriedPlacesList: PlaceModel[] = useSelector(selectQueriedPlaces);
    const { actions: placesActions } = usePlacesSlice();

    const queriedEventsList: EventModel[] = useSelector(selectQueriedEvents);
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
      data: queriedArtistsList
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

    dispatch(artistsActions.queryArtists(q));
    dispatch(placesActions.queryPlaces(q));
    dispatch(eventsActions.queryEvents(q));
    

    if (!hasWords && (results.has(Type.ARTISTS) || results.has(Type.PLACES) || results.has(Type.EVENTS))) {
      setResults((prev) => new Set([...prev, ...consts.defaultTypes]));
      setChecked((prev) => new Set([...prev, ...consts.defaultTypes]));
    }

    if (
      artistSearchObject.id === Type.ARTISTS &&
      !results.has(Type.ARTISTS) &&
      Boolean(artistSearchObject.data?.length)
    ) {
      setResults((prev) => new Set([...prev, Type.ARTISTS]));
      setChecked((prev) => new Set([...prev, Type.ARTISTS]));
    }

    if (
      placesSearchObject.id === Type.PLACES &&
      !results.has(Type.PLACES) &&
      Boolean(placesSearchObject.data?.length)
    ) {
      setResults((prev) => new Set([...prev, Type.PLACES]));
      setChecked((prev) => new Set([...prev, Type.PLACES]));
    }

    if (
      placesSearchObject.id === Type.EVENTS &&
      !results.has(Type.PLACES) &&
      Boolean(eventsSearchObject.data?.length)
    ) {
      setResults((prev) => new Set([...prev, Type.EVENTS]));
      setChecked((prev) => new Set([...prev, Type.EVENTS]));
    }

    if (artistSearchObject.data?.length === 0) {
      setResults(
        (prev) => new Set([...prev].filter((types) => types !== Type.ARTISTS))
        );
        setChecked(
          (prev) => new Set([...prev].filter((types) => types !== Type.ARTISTS))
          );
        }

    if (placesSearchObject.data?.length === 0) {
      setResults(
        (prev) => new Set([...prev].filter((types) => types !== Type.PLACES))
        );
        setChecked(
          (prev) => new Set([...prev].filter((types) => types !== Type.PLACES))
          );
    }

    if (eventsSearchObject.data?.length === 0) {
      setResults(
        (prev) => new Set([...prev].filter((types) => types !== Type.EVENTS))
        );
        setChecked(
          (prev) => new Set([...prev].filter((types) => types !== Type.EVENTS))
          );
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const handleChecked = (check: Type) => {
    if (results.has(check) && checked.has(check)) {
      setChecked(
        (prev) => new Set([...prev].filter((types) => types !== check))
      );
    } else {
      setChecked((prev) => new Set([...prev, check]));
    }
  };

  return (
    <ListGroup className="search-list">
      <ListGroup.Item className="search-item-head">
        <h4 className="search-item-head__title">
          {hasWords ? "Lista de resultados" : "Recomendados"}
        </h4>
        <div className="search-item-head__subtitle">
          <Badge
            bg={
              checked.has(Type.ARTISTS) ? "ah-secundary" : "ah-border-secundary"
            }
            onClick={() =>
              results.has(Type.ARTISTS) ? handleChecked(Type.ARTISTS) : {}
            }
          >
            Artists
          </Badge>
          <Badge
            bg={checked.has(Type.PLACES) ? "ah-third" : "ah-border-third"}
            onClick={() =>
              results.has(Type.PLACES) ? handleChecked(Type.PLACES) : {}
            }
          >
            Places
          </Badge>
          <Badge
            bg={checked.has(Type.PLACES) ? "ah-fourth" : "ah-border-fourth"}
            onClick={() =>
              results.has(Type.PLACES) ? handleChecked(Type.EVENTS) : {}
            }
          >
            Events
          </Badge>
        </div>
      </ListGroup.Item>

      {/* Search Artists */}

      {queriedArtistsList
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
            type  = {`${artist.id}`}
          />
        : 
          <SearchListGroup
            key={`full-${artist.name}-${artist.id}${idx}`}
            search={artist}
            type = {`${artist.id}`}
          />

      })}

      {/* Search places */}

      {queriedPlacesList
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
            type  = {`${place.id}`}
          />
        : 
          <SearchListGroup
            key={`full-${place.name}-${place.id}${idx}`}
            search={place}
            type = {`${place.id}`}
          />

      })}

      {/* Search events */}

      {queriedEventsList
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
            type  = {`${event.id}`}
          />
        : 
          <SearchListGroup
            key={`full-${event.name}-${event.id}${idx}`}
            search={event}
            type = {`${event.id}`}
          />

      })}
    </ListGroup>
  );
};
