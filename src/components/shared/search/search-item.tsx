import ListGroup from "react-bootstrap/ListGroup";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";

import { ArtistModel } from "~/constants";

import { SearchListGroup } from "./search-list-group";
import { ISearchMock, searchMock } from "./search-mock";
import consts, { Type } from "./constants";

type Prop = {
  q?: string;
};

export const SearchItem: React.FC<Prop> = ({ q = consts.defaultSearch }) => {
  const [results, setResults] = useState(new Set(consts.defaultTypes));
  const [checked, setChecked] = useState(new Set(consts.defaultTypes));

  const hasWords = Boolean(q);
  const sliceCount = (name: string) =>
    name === "artists" ? consts.maxDefaultArtists : consts.maxDefaultPlaces;

  useEffect(() => {
    /* TODO */
    const list1: ISearchMock = searchMock()(q)[0];
    const list2: ISearchMock = searchMock()(q)[1];

    if (!hasWords && (results.has(Type.ARTISTS) || results.has(Type.PLACES))) {
      setResults((prev) => new Set([...prev, ...consts.defaultTypes]));
      setChecked((prev) => new Set([...prev, ...consts.defaultTypes]));
    }

    if (
      list1.id === Type.ARTISTS &&
      !results.has(Type.ARTISTS) &&
      Boolean(list1.data().length)
    ) {
      setResults((prev) => new Set([...prev, Type.ARTISTS]));
      setChecked((prev) => new Set([...prev, Type.ARTISTS]));
    }

    if (
      list2.id === Type.PLACES &&
      !results.has(Type.PLACES) &&
      Boolean(list2.data().length)
    ) {
      setResults((prev) => new Set([...prev, Type.PLACES]));
      setChecked((prev) => new Set([...prev, Type.PLACES]));
    }

    if (list1.data().length === 0) {
      setResults(
        (prev) => new Set([...prev].filter((types) => types !== Type.ARTISTS))
      );
      setChecked(
        (prev) => new Set([...prev].filter((types) => types !== Type.ARTISTS))
      );
    }

    if (list2.data().length === 0) {
      setResults(
        (prev) => new Set([...prev].filter((types) => types !== Type.PLACES))
      );
      setChecked(
        (prev) => new Set([...prev].filter((types) => types !== Type.PLACES))
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
        </div>
      </ListGroup.Item>

      {searchMock()(q).map((list: ISearchMock) => {
        if (!checked.has(Type.ARTISTS) && Type.ARTISTS === list.id) {
          return;
        }

        if (!checked.has(Type.PLACES) && Type.PLACES === list.id) {
          return;
        }

        return !hasWords
          ? list
              .data()
              .slice(0, sliceCount(list.id))
              .map((search: ArtistModel, idx: number) => (
                <SearchListGroup
                  key={`three-${list.name}-${search.id}${idx}`}
                  search={search}
                />
              ))
          : list
              .data()
              .map((search: ArtistModel, idx: number) => (
                <SearchListGroup
                  key={`full-${list.name}-${search.id}${idx}`}
                  search={search}
                />
              ));
      })}
    </ListGroup>
  );
};
