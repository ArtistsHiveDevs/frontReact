import { useEffect, useRef } from 'react';
import './index.scss';

const MapViewer = (props: any) => {
  const ref = useRef();
  const { data } = props;

  useEffect(() => {
    const bounds = new window.google.maps.LatLngBounds();

    let map = new window.google.maps.Map(ref.current, {
      zoom: data?.zoom,
      center: data?.center,
      ...data?.anotherOpts,
    });

    data?.marksLocation?.forEach((data: any) => {
      const { position, iconData } = data;
      new google.maps.Marker({
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
    });

    map.fitBounds(bounds);
  });

  return <div ref={ref} id="map-viewer"></div>;
};

export default MapViewer;
