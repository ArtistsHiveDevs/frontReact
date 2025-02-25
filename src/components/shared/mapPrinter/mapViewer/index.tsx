import { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LocatableTemplate } from '~/models/base';

import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import './index.scss';

const MapViewer = (props: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const { data, onClickMapMarker } = props;
  const [lastClickedMarker, setLastClickedMarker] = useState(undefined);

  const [imageURL, setImageURL] = useState<string[]>(undefined);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  const markerClickHandler = (element: LocatableTemplate) => {
    if (!!onClickMapMarker && onClickMapMarker instanceof Function) {
      onClickMapMarker(element);
    }
  };

  const getProfilePicURL = async () => {
    if (!data?.marksLocation) return;

    const images = await Promise.all(
      data.marksLocation.map(async (markerData: any) => {
        const { element } = markerData;
        return element && element.avatarURL ? await element.avatarURL() : element?.profile_pic;
      })
    );

    setImageURL(images);
    setImagesLoaded(true);
  };

  useEffect(() => {
    setImagesLoaded(false);
    getProfilePicURL();
  }, [data]);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    if (imagesLoaded) {
      const bounds = new window.google.maps.LatLngBounds();
      const map = new window.google.maps.Map(ref.current as HTMLDivElement, {
        zoom: data?.zoom,
        center: data?.center,
        ...data?.anotherOpts,
      });

      const infoWindow = new google.maps.InfoWindow();

      data?.marksLocation?.forEach((markerData: any, markerIndex: number) => {
        const { id, title, content, position, icon, iconData, element } = markerData;
        const marker = new google.maps.Marker({
          position,
          ...(!!iconData && {
            icon: {
              ...iconData,
              anchor: new google.maps.Point(iconData.iconAnchor[0], iconData.iconAnchor[1]),
            },
          }),
          map: map,
        });

        bounds.extend(new google.maps.LatLng(position.lat, position.lng));

        // Agregar evento de clic para abrir el InfoWindow
        marker.addListener('click', () => {
          if (lastClickedMarker) {
            infoWindow.close();
          }
          const headerDiv = document.createElement('div');

          createRoot(headerDiv).render(
            <div className="custom-info-window-title" onClick={() => markerClickHandler(element)}>
              {title}
            </div>
          );
          infoWindow.setHeaderContent(headerDiv);

          const contentDiv = document.createElement('div');
          contentDiv.id = `marker-${id}`;
          createRoot(contentDiv).render(
            <div className="custom-info-window" onClick={() => markerClickHandler(element)}>
              <div>
                <AvatarWithIcon image={imageURL[markerIndex]} name={title} avatarSize={'4rem'} id={`marker_${id}`} />
              </div>
              <div className="info-window-address-div" id={`marker_${id}`}>
                {content}
              </div>
            </div>
          );
          infoWindow.setContent(contentDiv);
          infoWindow.open(map, marker);
          setLastClickedMarker(marker);
        });
      });

      if (data.fitBounds === undefined || data.fitBounds) {
        map.fitBounds(bounds);
      }
    }
  }, [data, onClickMapMarker, imagesLoaded]);

  return <div ref={ref} id="map-viewer"></div>;
};

export default MapViewer;
