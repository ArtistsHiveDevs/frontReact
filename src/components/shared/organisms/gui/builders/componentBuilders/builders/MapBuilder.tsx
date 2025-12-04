import { faMicrophoneLines } from '@fortawesome/free-solid-svg-icons';
import { GMapsSvgMaker } from '~/common/utils/object-utils/object-utils-index';
import MapContainer from '~/components/shared/mapPrinter/mapContainer';
import { ComponentBuilderParams } from '../types';
import { getData, getDataSource } from '../utils/dataExtraction';

export const createMapComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource } = params;

  const dataSourceElement = getDataSource(componentDescriptor, entityData, parentDataSource);

  const lat = getData(componentDescriptor.data?.lat, dataSourceElement);
  const lng = getData(componentDescriptor.data?.lng, dataSourceElement);

  const mapData = {
    fitBounds: false,
    zoom: 17,
    center: { lat, lng },
    marksLocation: [
      {
        position: { lat, lng },
        iconData: GMapsSvgMaker(faMicrophoneLines.icon, {
          color: 'rgb(94, 90, 90)',
          scale: 0.07,
        }),
      },
    ],
    anotherOpts: {},
  };

  const mapContainerStyles = {
    width: '100%',
    height: '400px',
  };

  return <MapContainer apiKey={import.meta.env.VITE_GMAPS_KEY} stylesc={mapContainerStyles} mapData={mapData} />;
};
