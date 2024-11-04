import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { useI18n } from '~/common/utils';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import { AlbumShortView } from '~/components/shared/domain/molecules/AlbumShortView/AlbumShortView';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { TrackTemplate } from '~/models/domain/artist/artist.model';
import './AlbumsShortListView.scss';

const DISCOGRAPHY_PAGINATION_LIMIT = 4;
const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS = 'app.global_dictionary.actions';

export const AlbumsShortListView = (props: any) => {
  const { discography } = props;

  const { translateText } = useI18n();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [currentAlbum, setCurrentAlbum] = useState<any>();

  const [zoomProfilePic, setZoomProfilePic] = useState(false);

  const [seeMoreVisible, setVisibleSeeMore] = useState(false);
  const [seeMoreOpened, setOpenSeeMore] = useState(false);

  const tracksViewerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleSeeMore(discography.length > DISCOGRAPHY_PAGINATION_LIMIT);
    setOpenSeeMore(false);
  }, []);

  useEffect(() => {
    setVisibleSeeMore(discography.length > DISCOGRAPHY_PAGINATION_LIMIT);
    setOpenSeeMore(false);
  }, [discography]);

  const formatDuration = (ms: number): string => {
    // Calcular las horas, minutos y segundos
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    // Formatear la cadena de resultado
    const formattedHours = hours > 0 ? `${hours}h ` : '';
    const formattedMinutes = `${minutes}m `;
    const formattedSeconds = `${seconds}s`;

    return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  };

  const handleClose = () => {
    setSelectedIndex(null);
    setCurrentAlbum(undefined);
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex - 1 + discography.length) % discography.length;
      setSelectedIndex(newIndex);
      setCurrentAlbum(discography[newIndex]);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      const newIndex = (selectedIndex + 1) % discography.length;
      setSelectedIndex(newIndex);
      setCurrentAlbum(discography[newIndex]);
    }
  };

  const handleKeyboard = (event: any) => {
    if (event.key === 'ArrowLeft') {
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Enable swipe with mouse for testing on desktop
    trackTouch: true,
  });

  const btnSeeMore = () => {
    const text = seeMoreOpened
      ? translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_less`)
      : `${translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_more`)} (${
          discography.length - DISCOGRAPHY_PAGINATION_LIMIT
        }+)`;
    return (
      <div className="btn-see-more" onClick={() => setOpenSeeMore(!seeMoreOpened)}>
        {text}
      </div>
    );
  };

  const handleCloseZoomDialog = () => {
    setZoomProfilePic(false);
  };

  useEffect(() => {
    if (tracksViewerRef.current) {
      tracksViewerRef.current.scrollTop = 0; // Reinicia el scroll al top
    }
  }, [selectedIndex]);

  if (!discography || !Array.isArray(discography) || !discography.length) {
    return <div>No se encontró ningún álbum.</div>;
  } else {
    const discographyShortList =
      seeMoreVisible && !seeMoreOpened ? discography.slice(0, DISCOGRAPHY_PAGINATION_LIMIT) : discography;

    return (
      <div>
        {discographyShortList.map((album: any, index: number) => {
          return (
            <AlbumShortView
              key={`album-${index}`}
              album={album}
              albumNumber={index}
              totalAlbums={discography.length}
              onClick={(element: any) => {
                setSelectedIndex(index);
                setCurrentAlbum(discography[index]);
              }}
            />
          );
        })}
        {seeMoreVisible && btnSeeMore()}

        <Dialog
          open={selectedIndex !== null}
          onClose={handleClose}
          onKeyUp={handleKeyboard}
          maxWidth="lg"
          PaperProps={{
            style: {
              width: '80vw',
              maxHeight: '80vh',
            },
          }}
          {...swipeHandlers}
        >
          <DialogTitle className="dialog-title">
            {currentAlbum?.name}
            <br />[{discography.length - selectedIndex} / {discography.length} {' ]'}
            <IconButton onClick={handleClose} className="close-icon">
              <DynamicIcons iconName="MdClose" />
            </IconButton>
          </DialogTitle>

          <DialogContent className="dialog-content" {...swipeHandlers}>
            {selectedIndex !== null && (
              <>
                <div id="header">
                  <div className="avatar-container">
                    <AvatarWithIcon
                      image={currentAlbum.images[0].url}
                      name={currentAlbum.name}
                      avatarSize={'5rem'}
                      // className="avatar"
                      variant="rounded"
                      {...swipeHandlers}
                      onClick={() => setZoomProfilePic(true)}
                      onBadgeClick={() => setZoomProfilePic(true)}
                      buttonIcon="AiOutlineZoomIn"
                    />
                  </div>

                  <div id="album-info">
                    {currentAlbum.total_tracks} tracks ⬢ {formatDuration(currentAlbum.totalDurationMs)}
                    <br />({dayjs(currentAlbum.release_date).format('MMM / YYYY')})
                  </div>
                </div>

                <div id="tracks-viewer-header">
                  <div>#</div>
                  <div>Canción</div>
                  <div>Dur.</div>
                </div>

                <div id="tracks-viewer" ref={tracksViewerRef}>
                  {currentAlbum.tracks.map((track: TrackTemplate, idx: number) => (
                    <div key={`track-${idx}`} className="track-row">
                      <div>{track.track_number}.</div>
                      <div className="track-name">
                        <strong>{track.name}</strong>
                        <p>{track.artists.map((artist) => artist.name).join(', ')}</p>
                      </div>
                      <div>{formatDuration(track.duration_ms)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <IconButton onClick={handlePrev} className="arrow left">
              <DynamicIcons iconName="MdArrowBackIosNew" />
            </IconButton>

            <IconButton onClick={handleNext} className="arrow right">
              <DynamicIcons iconName="MdArrowForwardIos" />
            </IconButton>
          </DialogContent>
        </Dialog>

        <Dialog id="zoomAlbumImg" open={zoomProfilePic} onClose={handleCloseZoomDialog} fullWidth>
          <DialogContent className="zoom-dialog">
            <IconButton onClick={handleCloseZoomDialog} className="close-icon">
              <DynamicIcons iconName="MdClose" />
            </IconButton>
            {zoomProfilePic && (
              <img src={currentAlbum.images[0].url} alt={currentAlbum.name} className="zoom-image" {...swipeHandlers} />
            )}
          </DialogContent>
        </Dialog>
      </div>
    );
  }
};
