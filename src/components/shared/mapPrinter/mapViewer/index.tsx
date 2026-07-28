import { useEffect, useMemo, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { LocatableTemplate } from '~/models/base';

import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import './index.scss';

const MapViewer = (props: any) => {
  const ref = useRef<HTMLDivElement>(null);
  const { data, onClickMapMarker } = props;

  const [imageURL, setImageURL] = useState<string[]>(undefined);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  const dataSignature = useMemo(
    () =>
      JSON.stringify({
        zoom: data?.zoom,
        center: data?.center,
        fitBounds: data?.fitBounds,
        anotherOpts: data?.anotherOpts,
        marks: data?.marksLocation?.map((m: any) => ({
          id: m.id,
          title: m.title,
          content: m.content,
          position: m.position,
          iconData: m.iconData,
        })),
      }),
    [data]
  );

  const onClickMapMarkerRef = useRef(onClickMapMarker);
  onClickMapMarkerRef.current = onClickMapMarker;

  const markerClickHandler = (element: LocatableTemplate) => {
    const handler = onClickMapMarkerRef.current;
    if (!!handler && handler instanceof Function) {
      handler(element);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSignature]);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    if (!imagesLoaded) return;

    const bounds = new window.google.maps.LatLngBounds();
    const map = new window.google.maps.Map(ref.current as HTMLDivElement, {
      zoom: data?.zoom,
      center: data?.center,
      ...data?.anotherOpts,
    });

    const infoWindow = new google.maps.InfoWindow();
    let lastClickedMarker: google.maps.Marker | undefined;

    data?.marksLocation?.forEach((markerData: any, markerIndex: number) => {
      const { id, title, content, position, iconData, element } = markerData;
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
        lastClickedMarker = marker;
      });
    });

    if (data.fitBounds === undefined || data.fitBounds) {
      map.fitBounds(bounds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSignature, imagesLoaded]);

  return <div ref={ref} id="map-viewer"></div>;
};

export default MapViewer;
