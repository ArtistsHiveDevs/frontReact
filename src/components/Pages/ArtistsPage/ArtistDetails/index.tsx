import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useArtistsSlice } from "~/common/slices/artists";
import { selectArtists } from "~/common/slices/artists/selectors";
import { useNavigation } from "~/common/utils/hooks/navigation/navigation";
import { ARTIST_DETAIL_SUB_PAGE_CONFIG } from "~/components/Pages/ArtistsPage/ArtistDetails/config-artist-detail";
import {
  GalleryImageParams,
  ImageGallery,
} from "~/components/shared/atoms/ImageGallery/ImageGallery";
import { ProfileTabsPage } from "~/components/shared/organisms/ProfileTabsPage/ProfileTabsPage";
import { URL_PARAMETER_NAMES } from "~/constants";
import { ArtistModel } from "~/models/domain/artist/artist.model";
import { EventModel } from "~/models/domain/event/event.model";
import "./index.scss";

const TRANSLATION_BASE_ARTIST_DETAIL_PAGE =
  "app.pages.ArtistsPages.ArtistsDetailsPage";

const ArtistDetailPage = () => {
  const { navigateToEntity } = useNavigation();

  const urlParameters = useParams();

  const [artistId, setCurrentArtistId] = useState(
    urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]
  );

  const artistList: ArtistModel[] = useSelector(selectArtists);
  const { actions: artistsActions } = useArtistsSlice();

  const subPagesInfo = [...ARTIST_DETAIL_SUB_PAGE_CONFIG];

  const [currentArtist, setCurrentArtist] = useState<ArtistModel>(undefined);
  const [currentGalleryImage, setGalleryImage] = useState(undefined);

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

    if (artistId !== urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]) {
      setCurrentArtistId(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
    }
  }, [artistId, urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]]);

  const getArtistInfo = (id: string) => {
    return artistList.find((artist) => artist.id === id);
  };

  const handlers = {
    onClickGalleryImage: (
      source: GalleryImageParams,
      images: GalleryImageParams[]
    ) => {
      const image = <ImageGallery images={images} imageSize="fs" />;
      setGalleryImage(image);
    },
    onCloseGalleryImage: (value: any) => {
      setGalleryImage(undefined);
    },
    onClickEvent: (value: any) => {
      navigateToEntity({ entityType: EventModel.name, id: value.id });
    },
  };

  return (
    <>
      {!!currentArtist && (
        <ProfileTabsPage
          entityName="Artist"
          entityData={currentArtist}
          translation_base_path={TRANSLATION_BASE_ARTIST_DETAIL_PAGE}
          subpagesConfig={subPagesInfo}
          handlers={handlers}
        />
      )}
    </>
  );
};

export default ArtistDetailPage;
