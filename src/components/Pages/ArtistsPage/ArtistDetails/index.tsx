import "./index.scss";
import { useParams } from "react-router-dom";
import { URL_PARAMETER_NAMES } from "~/constants";
import { ARTIST_DETAIL_SUB_PAGE_CONFIG } from "~/components/Pages/ArtistsPage/ArtistDetails/config-artist-detail";
import { useEffect, useState } from "react";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { useSelector, useDispatch } from "react-redux";
import { selectArtists } from "~/common/slices/artists/selectors";
import { useArtistsSlice } from "~/common/slices/artists";
import { useI18n } from "~/common/utils";
import ProfileHeader from "~/components/shared/molecules/Profile/ProfileHeader";
import {
  TabbedPanel,
  TabbedPage,
} from "~/components/shared/layout/TabbedPanel";
import SectionsPanel from "~/components/shared/layout/SectionPanel";
import {
  AttributesIconFieldReadOnly,
  IconDetailedAttribute,
} from "~/components/shared/molecules/general/AttributesIconField";
import { ProfileDetailAttributeConfiguration } from "~/components/shared/organisms/ProfilePage/profile-details.def";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";

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
    const data = currentArtist[attribute as keyof ArtistModel];
    const response = Array.isArray(data) ? data.join(", ") : data;
    return response;
  };

  const getArtistInfo = (id: string) => {
    return artistList.find((artist) => artist.id === id);
  };

  const getAttributeTitle = (
    subpageName: string,
    sectionName: string,
    attribute: ProfileDetailAttributeConfiguration
  ) => {
    return attribute.emptyTitle
      ? ""
      : attribute.literal
      ? attribute.name
      : translateAttribute(subpageName, sectionName, attribute.name);
  };

  // Translation helpers
  const translateAttribute = (
    subpage: string,
    section: string,
    attribute: string
  ) => {
    return translateText(
      `${TRANSLATION_BASE_ARTIST_DETAIL_PAGE}.subpages.${subpage}.sections.${section}.attributes.${attribute}`
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

  // Data config
  const ARTIST_DETAILS_TABBED_PAGES: TabbedPage[] = subPagesInfo.map(
    (subpage) => {
      return {
        name: translateSubpage(subpage.name),
        requireSession: subpage.requireSession,
        tabContent: () => {
          return (
            <RequireAuthComponent requiredSession={subpage.requireSession}>
              {subpage.sections.map((section, index) => {
                // Icon Detailed Attributes
                const sectionAttributes: IconDetailedAttribute[] =
                  section.attributes?.map((attribute) => {
                    return {
                      name: attribute.name,
                      title: getAttributeTitle(
                        subpage.name,
                        section.name,
                        attribute
                      ),
                      icon: attribute?.icon,
                      value: getData(attribute.name),
                      requireSession: attribute.requireSession,
                    };
                  });

                const sectionContent = () => (
                  <AttributesIconFieldReadOnly attributes={sectionAttributes} />
                );
                return (
                  <RequireAuthComponent
                    requiredSession={section.requireSession}
                  >
                    <SectionsPanel
                      key={`section-${section.name}-${index}`}
                      sectionName={translateSection(
                        subpage.name,
                        section?.name
                      )}
                      sectionContent={sectionContent}
                    />
                  </RequireAuthComponent>
                );
              })}
            </RequireAuthComponent>
          );
        },
      };
    }
  );

  return (
    <>
      {!!currentArtist && (
        <div className="artist-container">
          <ProfileHeader element={currentArtist} />
          <TabbedPanel tabs={ARTIST_DETAILS_TABBED_PAGES} />
        </div>
      )}
    </>
  );
};

export default ArtistDetailPage;
