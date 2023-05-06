import "./index.scss";
import { useEffect, useRef } from "react";

const MapViewer = (props: any) => {
  const ref = useRef();
  const { data } = props;

  useEffect(() => {
    let map = new window.google.maps.Map(ref.current, {
      zoom: data?.zoom,
      center: data?.center,
      ...data?.anotherOpts,
    });

    data?.marksLocation?.forEach((data: any) => {
      const { position, icon } = data;
      new google.maps.Marker({
        position,
        icon: {
          ...icon,
          anchor: new google.maps.Point(icon.iconAnchor[0], icon.iconAnchor[1]),
        },
        map: map,
      });
    });
  });

  return <div ref={ref} id="map-viewer"></div>;
};

export default MapViewer;
