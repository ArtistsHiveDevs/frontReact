import "./index.scss";
import { useParams } from "react-router-dom";
import { URL_PARAMETER_NAMES } from "~/constants";
import { ARTIST_DETAIL_SUB_PAGE_CONFIG } from "~/constants/config-artist-detail";
import { useEffect, useState } from "react";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import DynamicIcons from "~/components/shared/DynamicIcons";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { useSelector, useDispatch } from "react-redux";
import { selectArtists } from "~/common/slices/artists/selectors";
import { useArtistsSlice } from "~/common/slices/artists";
import { useI18n } from "~/common/utils";
import IconFieldReadOnly from "~/components/shared/atoms/IconField";

const ArtistDetailPage = () => {
  const { translateText } = useI18n();

  const urlParameters = useParams();

  const artistId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const subPage = [...ARTIST_DETAIL_SUB_PAGE_CONFIG];
  const [activeSectionIndex, setSection] = useState(0);

  const dispatch = useDispatch();
  useEffect(() => {
    if (artistList.length === 0) {
      dispatch(artistsActions.loadArtists());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getData = (attribute: string, artist: ArtistModel) => {
    return artist[attribute as keyof ArtistModel] || "No disponible";
  };

  const getArtistInfo = (id: string) => {
    return artistList.find((artist) => artist.id === id);
  };

  const changeSection = (activeSection: number) => {
    setSection(activeSection);
  };

  const artistInfo = getArtistInfo(artistId);

  const profileInfo = (artist: ArtistModel) => {
    return (
      <div className="profile-header">
        <img className="avatar" src={artist?.profile_pic} alt={artist?.name} />
        <div className="header-title d-grid align-items-bottom">
          <div className="artist-name">
            <h2>
              {artist?.name}
              <VerifiedArtist verifiedStatus={artist?.verified_status} />
            </h2>
          </div>
          <div className="artist-name">
            <p>{artist?.subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  const subPages = () => {
    return (
      <div className="full-content">
        <div className="subpages-tabs">
          {subPage.map((subpage, idx) => {
            return (
              <div
                className="subpage-tab"
                key={`subpage-section-${idx}`}
                onClick={() => changeSection(idx)}
              >
                <h5>{subpage?.title}</h5>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const subPageContent = (artist: ArtistModel, activeSection: number) => {
    return (
      <div className="full-content">
        {subPage[activeSection]?.sections.map((subpage, idx) => {
          return (
            <div key={`sub-page-content-${idx}`}>
              <>
                <h2 className="section-title">{subpage?.title}</h2>
                {subpage?.attributes?.map((attribute, idx) => {
                  return (
                    <IconFieldReadOnly
                      key={`sub-page-attr-${idx}`}
                      icon={attribute?.icon}
                      fieldName={attribute.name}
                      fieldValue={getData(attribute.name, artist)}
                    />
                  );
                })}
              </>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <>
      {!!artistInfo && (
        <div className="artist-container">
          {profileInfo(artistInfo)}
          {subPages()}
          {subPageContent(artistInfo, activeSectionIndex)}
        </div>
      )}
    </>
  );
};

export default ArtistDetailPage;
