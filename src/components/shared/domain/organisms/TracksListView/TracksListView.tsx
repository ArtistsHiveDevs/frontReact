import { formatDurationMillis } from '~/common/utils/string-utils';
import { TrackTemplate } from '~/models/domain/artist/artist.model';
import './TracksListView.scss';

const DISCOGRAPHY_PAGINATION_LIMIT = 4;
const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS = 'app.global_dictionary.actions';

export const TracksListView = (props: any) => {
  const { tracks } = props;

  // const { translateText } = useI18n();

  // const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // const [currentAlbum, setCurrentAlbum] = useState<any>();

  // const [zoomProfilePic, setZoomProfilePic] = useState(false);

  // const [seeMoreVisible, setVisibleSeeMore] = useState(false);
  // const [seeMoreOpened, setOpenSeeMore] = useState(false);

  // const tracksViewerRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setVisibleSeeMore(tracks.length > DISCOGRAPHY_PAGINATION_LIMIT);
  //   setOpenSeeMore(false);
  // }, []);

  // useEffect(() => {
  //   setVisibleSeeMore(tracks.length > DISCOGRAPHY_PAGINATION_LIMIT);
  //   setOpenSeeMore(false);
  // }, [tracks]);

  // const formatDuration = (ms: number): string => {
  //   // Calcular las horas, minutos y segundos
  //   const hours = Math.floor(ms / (1000 * 60 * 60));
  //   const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  //   const seconds = Math.floor((ms % (1000 * 60)) / 1000);

  //   // Formatear la cadena de resultado
  //   const formattedHours = hours > 0 ? `${hours}h ` : '';
  //   const formattedMinutes = `${minutes}m `;
  //   const formattedSeconds = `${seconds}s`;

  //   return `${formattedHours}${formattedMinutes}${formattedSeconds}`;
  // };

  // const handleClose = () => {
  //   setSelectedIndex(null);
  //   setCurrentAlbum(undefined);
  // };

  // const handlePrev = () => {
  //   if (selectedIndex !== null) {
  //     const newIndex = (selectedIndex - 1 + tracks.length) % tracks.length;
  //     setSelectedIndex(newIndex);
  //     setCurrentAlbum(tracks[newIndex]);
  //   }
  // };

  // const handleNext = () => {
  //   if (selectedIndex !== null) {
  //     const newIndex = (selectedIndex + 1) % tracks.length;
  //     setSelectedIndex(newIndex);
  //     setCurrentAlbum(tracks[newIndex]);
  //   }
  // };

  // const handleKeyboard = (event: any) => {
  //   if (event.key === 'ArrowLeft') {
  //     handlePrev();
  //   } else if (event.key === 'ArrowRight') {
  //     handleNext();
  //   }
  // };

  // const swipeHandlers = useSwipeable({
  //   onSwipedLeft: handleNext,
  //   onSwipedRight: handlePrev,
  //   // preventDefaultTouchmoveEvent: true,
  //   trackMouse: true, // Enable swipe with mouse for testing on desktop
  //   trackTouch: true,
  // });

  // const btnSeeMore = () => {
  //   const text = seeMoreOpened
  //     ? translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_less`)
  //     : `${translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.show_more`)} (${
  //         tracks.length - DISCOGRAPHY_PAGINATION_LIMIT
  //       }+)`;
  //   return (
  //     <div className="btn-see-more" onClick={() => setOpenSeeMore(!seeMoreOpened)}>
  //       {text}
  //     </div>
  //   );
  // };

  // const handleCloseZoomDialog = () => {
  //   setZoomProfilePic(false);
  // };

  // useEffect(() => {
  //   if (tracksViewerRef.current) {
  //     tracksViewerRef.current.scrollTop = 0; // Reinicia el scroll al top
  //   }
  // }, [selectedIndex]);

  if (!tracks || !Array.isArray(tracks) || !tracks.length) {
    return <div>No se encontró ninguna canción.</div>;
  } else {
    return (
      <>
        {/* <div id="tracks-viewer-header">
          <div>#</div>
          <div>Canción</div>
          <div>Dur.</div>
        </div> */}

        <div id="tracks-viewer-list-view">
          {tracks.map((track: TrackTemplate, idx: number) => (
            <div key={`track-${idx}`} className="track-row">
              {/* <div>{track.track_number}.</div> */}
              <div className="track-name-list-view">
                <strong>{track.name}</strong>
                <p style={{ fontStyle: 'italic' }}>[{track.album?.name}]</p>
                <p>{track.artists?.map((artist) => artist.name).join(', ')}</p>
              </div>
              <div>{formatDurationMillis(track.duration_ms)}</div>
            </div>
          ))}
        </div>
      </>
    );
  }
};
