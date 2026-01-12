import { Status, Wrapper } from '@googlemaps/react-wrapper';
import { ReactElement } from 'react';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import MapViewer from '../mapViewer';
import './index.scss';

const MapContainer = (props: any) => {
  const render = (status: Status): ReactElement => {
    if (status === Status.FAILURE) return <h1>ERROR</h1>;
    return (
      <div>
        <AppLoader />
      </div>
    );
  };

  return (
    <div className="map-container" style={props?.stylesc}>
      <Wrapper apiKey={props.apiKey} render={render} libraries={['marker']}>
        <MapViewer data={props?.mapData} onClickMapMarker={props?.onClickMapMarker} />
      </Wrapper>
    </div>
  );
};

export default MapContainer;
