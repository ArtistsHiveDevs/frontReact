import { useState } from "react";
import { useParams } from "react-router-dom";
import { DynamicIcons } from "~/components/shared/DynamicIcons";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { URL_PARAMETER_NAMES } from "~/constants";
import { ARTIST_DETAIL_SUB_PAGE_CONFIG } from "~/constants/config-artist-detail";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import "./index.scss";

const ArtistDetailPage = () => {
  const artistList: ArtistModel[] = [];
  const subPage = [...ARTIST_DETAIL_SUB_PAGE_CONFIG];
  const [activeSectionIndex, setSection] = useState(0);

  const getData = (attribute: string, artist: ArtistModel) => {
    return artist[attribute as keyof ArtistModel] || "No disponible";
  };

  const getArtistInfo = (id: number) => {
    return artistList[id];
  };

  const changeSection = (activeSection: number) => {
    setSection(activeSection);
  };

  const urlParameters = useParams();

  const artistId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  const artistInfo = getArtistInfo(Number(artistId));

  const profileInfo = (artist: ArtistModel) => {
    return (
      <div className="profile-header">
        <img className="avatar" src={artist?.profile_pic} alt={artist?.name} />
        <div className="header-title d-grid align-items-bottom">
          <div className="artist-name">
            <VerifiedArtist verifiedStatus={artist?.verified_status} />
          </div>
          <div className="artist-name">
            <h2>{artist?.name}</h2>
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
                    <div key={`sub-page-attr-${idx}`}>
                      <p className="info-line">
                        <span>
                          <DynamicIcons
                            iconName={attribute?.icon}
                            size={20}
                            color="#7a260a"
                          />
                        </span>
                        <span>
                          <>
                            <strong>{attribute.name}: </strong>
                            {getData(attribute.name, artist)}
                          </>
                        </span>
                      </p>
                    </div>
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
