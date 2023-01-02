import "./index.scss";
import { useParams } from "react-router-dom";
import { URL_PARAMETER_NAMES } from "~/constants";
import {
  ARTIST_DETAIL_SUB_PAGE_CONFIG,
  DetailAttribute,
} from "~/constants/config-artist-detail";
import { useEffect, useState } from "react";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import DynamicIcons from "~/components/shared/DynamicIcons";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { useSelector, useDispatch } from "react-redux";
import { selectArtists } from "~/common/slices/artists/selectors";
import { useArtistsSlice } from "~/common/slices/artists";
import { useI18n } from "~/common/utils";
import IconFieldReadOnly from "~/components/shared/atoms/IconField";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.ArtistsPages.ArtistsDetailsPage";

const ArtistDetailPage = () => {
  const { translateText } = useI18n();

  const urlParameters = useParams();

  const [artistId, setCurrentArtistId] = useState(
    urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]
  );

  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const subPagesInfo = [...ARTIST_DETAIL_SUB_PAGE_CONFIG];
  const [activeSectionIndex, setSection] = useState(0);

  const [currentArtist, setCurrentArtist] = useState<ArtistModel>(undefined);

  const dispatch = useDispatch();
  useEffect(() => {
    if (artistList.length === 0) {
      dispatch(artistsActions.loadArtists());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!!artistList.length) {
      setCurrentArtist(getArtistInfo(artistId));
    }
  }, [artistList]);

  useEffect(() => {
    setCurrentArtist(getArtistInfo(artistId));
  }, [artistId]);

  const getData = (attribute: string) => {
    return currentArtist[attribute as keyof ArtistModel];
  };

  const getArtistInfo = (id: string) => {
    return artistList.find((artist) => artist.id === id);
  };

  const changeSection = (activeSection: number) => {
    setSection(activeSection);
  };

  const profileInfo = () => {
    return (
      <div className="profile-header">
        <img
          className="avatar"
          src={currentArtist?.profile_pic}
          alt={currentArtist?.name}
        />
        <div className="header-title d-grid align-items-bottom">
          <div className="artist-name">
            <h2>
              {currentArtist?.name}
              <VerifiedArtist verifiedStatus={currentArtist?.verified_status} />
            </h2>
          </div>
          <div className="artist-name">
            <p>{currentArtist?.subtitle}</p>
          </div>
        </div>
      </div>
    );
  };

  const translateSubpage = (subpage: string) => {
    return translateText(
      `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.subpages.${subpage}.name`
    );
  };

  const translateSection = (subpage: string, section: string) => {
    return translateText(
      `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.subpages.${subpage}.sections.${section}.name`
    );
  };
  const getAttributeName = (
    subpageName: string,
    sectionName: string,
    attribute: DetailAttribute
  ) => {
    return attribute.emptyTitle
      ? ""
      : attribute.literal
      ? attribute.name
      : translateAttribute(subpageName, sectionName, attribute.name);
  };
  const translateAttribute = (
    subpage: string,
    section: string,
    attribute: string
  ) => {
    return translateText(
      `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.subpages.${subpage}.sections.${section}.attributes.${attribute}`
    );
  };

  const subPages = () => {
    return (
      <div className="full-content">
        <div className="subpages-tabs">
          {subPagesInfo.map((subpage, idx) => {
            return (
              <div
                className="subpage-tab"
                key={`subpage-section-${idx}`}
                onClick={() => changeSection(idx)}
              >
                <h5>{translateSubpage(subpage.name)}</h5>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const subPageContent = (activeSection: number) => {
    const subpage = subPagesInfo[activeSection];
    return (
      subpage && (
        <div className="full-content">
          {subpage?.sections.map((section, idx) => {
            return (
              <div key={`sub-page-content-${idx}`}>
                <>
                  <h2 className="section-title">
                    {translateSection(subpage.name, section?.name)}
                  </h2>
                  {section?.attributes
                    ?.filter(
                      (attribute: DetailAttribute) =>
                        true || !!getData(attribute.name)
                    )
                    .map((attribute: DetailAttribute, idx: number) => {
                      return (
                        <IconFieldReadOnly
                          key={`sub-page-attr-${idx}`}
                          icon={attribute?.icon}
                          fieldName={getAttributeName(
                            subpage.name,
                            section.name,
                            attribute
                          )}
                          fieldValue={getData(attribute.name)}
                        />
                      );
                    })}
                </>
              </div>
            );
          })}
        </div>
      )
    );
  };

  return (
    <>
      {!!currentArtist && (
        <div className="artist-container">
          {profileInfo()}
          {subPages()}
          <div className="content subpage">
            {subPageContent(activeSectionIndex)}
          </div>
        </div>
      )}
    </>
  );
};

export default ArtistDetailPage;
