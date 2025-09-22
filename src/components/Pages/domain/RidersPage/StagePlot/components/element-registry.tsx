import { Mannequin } from '~/components/Pages/domain/RidersPage/StagePlot/renders/crew/mannequin/mannequin';
import { PlatformElement } from '~/components/Pages/domain/RidersPage/StagePlot/renders/furniture/platform/platform';
import { Guitar } from '~/components/Pages/domain/RidersPage/StagePlot/renders/instruments/guitars/guitar';
import { VocalMicrophone } from '~/components/Pages/domain/RidersPage/StagePlot/renders/instruments/microphones/vocal-microphone';
import { BassGuitar } from '~/components/Pages/domain/RidersPage/StagePlot/renders/instruments/bass-guitar/BassGuitar';
import { Drums } from '~/components/Pages/domain/RidersPage/StagePlot/renders/instruments/drums/Drums';
import { Keyboard } from '~/components/Pages/domain/RidersPage/StagePlot/renders/instruments/keyboards/Keyboard';
import { FloorMonitor } from '~/components/Pages/domain/RidersPage/StagePlot/renders/equipment/floor-monitor/FloorMonitor';
import { MusicSheetStand } from '~/components/Pages/domain/RidersPage/StagePlot/renders/furniture/music-sheet-stand/MusicSheetStand';
import { ElementType, StageElement } from '~/components/Pages/domain/RidersPage/StagePlot/types/element.types';

interface ElementRendererProps {
  element: StageElement;
  isSelected: boolean;
  onClick: () => void;
  platforms?: StageElement[];
}

// Registro de componentes usando métodos estáticos
export const ElementRegistry: Record<ElementType, (props: ElementRendererProps) => JSX.Element> = {
  [ElementType.GUITAR]: Guitar.renderElement,
  [ElementType.MANNEQUIN]: Mannequin.renderElement,
  [ElementType.PLATFORM]: PlatformElement.renderElement,
  [ElementType.VOCAL_MICROPHONE]: VocalMicrophone.renderElement,
  [ElementType.DRUMS]: Drums.renderElement,
  [ElementType.BASS_GUITAR]: BassGuitar.renderElement,
  [ElementType.FLOOR_MONITOR]: FloorMonitor.renderElement,
  [ElementType.KEYBOARD]: Keyboard.renderElement,
  [ElementType.MUSIC_SHEET_STAND]: MusicSheetStand.renderElement,
};

// Helper para renderizar cualquier elemento
export const renderElement = (
  element: StageElement,
  isSelected: boolean,
  onClick: () => void,
  platforms?: StageElement[]
): JSX.Element => {
  const renderer = ElementRegistry[element.type];
  if (!renderer) {
    console.error(`No renderer found for element type: ${element.type}`);
    return <></>;
  }
  return renderer({ element, isSelected, onClick, platforms });
};
