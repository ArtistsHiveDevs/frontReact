import React, { useCallback, useEffect, useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";

import "./search.scss";
import { SearchItem } from "./search-item";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { PlaceModel } from "~/models/domain/place/place.model";
import { useDispatch, useSelector } from "react-redux";
import { useArtistsSlice } from "~/common/slices/artists";
import { usePlacesSlice } from "~/common/slices/places";
import { selectArtists } from "~/common/slices/artists/selectors";
import { selectPlaces } from "~/common/slices/places/selectors";

export const SearchComponent = (props: any) => {

  // Hooks
  const dispatch = useDispatch();

  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const placesList: PlaceModel[] = useSelector(selectPlaces);
  const { actions: placesActions } = usePlacesSlice();

  const { openedStatus } = props;
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  const wrapperRef = useRef<HTMLHeadingElement>(null);

  const handleOnBlur = () => {
    if (!focused) {
      setFocused(!focused);
    }
  };

  const handleOnClickOut = useCallback(
    (e: any) => {
      if (
        wrapperRef?.current &&
        !wrapperRef.current.contains(e.target) &&
        focused
      ) {
        setFocused(!focused);
      }
    },
    [focused]
  );

  useEffect(() => {

    if (artistList.length === 0) {
      dispatch(artistsActions.loadArtists());
    }
    if (placesList.length === 0) {
      dispatch(placesActions.loadPlaces());
    }

    window.addEventListener("click", (e) => handleOnClickOut(e));

    return window.removeEventListener("click", (e) => handleOnClickOut(e));
  }, [handleOnClickOut]);

  const handleText = (event: any) => {
    setText(event.target.value || "");
  };

  let stylesSearchField = ["hidden"];
  if (openedStatus) {
    stylesSearchField = ["ah-nav-search"];
  }
  return (
    <>
      <div ref={wrapperRef} className={stylesSearchField.join(" ")}>
        <InputGroup>
          <Form.Control
            aria-describedby="basic-addon2"
            aria-label="Artistas, lugares..."
            autoComplete="off"
            className="ah-nav-search__input"
            name="search"
            placeholder="Artistas, lugares..."
            value={text}
            onChange={handleText}
            onClick={() => handleOnBlur()}
          />
        </InputGroup>
        {focused && (
          <div className="ah-combobox-search">
            <SearchItem q={text}
                 artistList = {artistList}
                 placesList = {placesList} />
          </div>
        )}
      </div>
    </>
  );
};
