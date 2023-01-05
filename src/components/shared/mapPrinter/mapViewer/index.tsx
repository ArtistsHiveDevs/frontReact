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

    data?.marksLocation?.forEach((position: any) => {
      new google.maps.Marker({
        position,
        map: map,
      });
    });
  });

  return <div ref={ref} id="map-viewer"></div>;
};

export default MapViewer;
