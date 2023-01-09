import { Status, Wrapper } from "@googlemaps/react-wrapper";
import { ReactElement } from "react";
import MapViewer from "../mapViewer";
import "./index.scss";

const MapContainer = (props: any) => {
  const render = (status: Status): ReactElement => {
    if (status === Status.FAILURE) return <h1>ERROR</h1>;
    return <h1>SPINNER</h1>;
  };

  return (
    <div className="map-container" style={props?.stylesc}>
      <Wrapper apiKey={props.apiKey} render={render}>
        <MapViewer data={props?.mapData} />
      </Wrapper>
    </div>
  );
};

export default MapContainer;
