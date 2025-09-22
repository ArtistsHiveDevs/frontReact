export enum ElementType {
  GUITAR = 'guitar',
  MANNEQUIN = 'mannequin',
  PLATFORM = 'platform',
  VOCAL_MICROPHONE = 'vocal_microphone',
  // Futuras expansiones:
  BASS_GUITAR = 'bass_guitar',
  DRUMS = 'drums',
  KEYBOARD = 'keyboard',
  FLOOR_MONITOR = 'floor_monitor',
  MUSIC_SHEET_STAND = 'music_sheet_stand',
  // AMPLIFIER = 'amplifier',
}

export interface BaseElementProps {
  color?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  name?: string;
  isSelected?: boolean;
  onClick?: () => void;
  platforms?: StageElement[]; // Para calcular física simple
  hideText?: boolean; // Ocultar el texto del elemento
  showAxes?: boolean; // Mostrar ejes de referencia local
  // Propiedades específicas para platform (opcionales para otros elementos)
  width?: number;
  depth?: number;
  height?: number;
}

export interface StageElement {
  type: ElementType;
  position: [number, number, number];
  rotation?: [number, number, number]; // Rotación inicial del tipo de elemento
  name?: string;
  color?: string;
  scale?: [number, number, number];
  hideText?: boolean; // Ocultar el texto del elemento
  showAxes?: boolean; // Mostrar ejes de referencia local
  // Propiedades específicas para platform
  width?: number;
  depth?: number;
  height?: number;
}
