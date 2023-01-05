import { useEffect, useRef } from "react";
import "./index.scss";

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
      console.log("entra con marca: ", position);
      new google.maps.Marker({
        position,
        map: map,
      });
    });
  });

  return <div ref={ref} id="map-viewer"></div>;
};

export default MapViewer;
