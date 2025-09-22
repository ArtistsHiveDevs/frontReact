import { ElementType } from '../types/element.types';

// Configuración interna de modelos GLB para cada tipo de elemento
export const MODEL_CONFIG = {
  [ElementType.VOCAL_MICROPHONE]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/microphone_small.glb',
    fallbackEnabled: true,
    defaultScale: 0.11, // Número único o array [x, y, z]
    defaultRotation: [0, 0, 0] as [number, number, number], // En grados
    defaultPosition: [0, 0, 2] as [number, number, number], // Y = altura desde el suelo
    labelDistance: 1.6, // Distancia fija del texto arriba del modelo
  },
  [ElementType.MANNEQUIN]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/mannequin.glb',
    fallbackEnabled: true,
    defaultScale: 3, // Número único o array [x, y, z]
    defaultRotation: [0, 0, 0] as [number, number, number], // En grados
    defaultPosition: [0, 3.8, 0] as [number, number, number], // Y = altura desde el suelo (0 = apoyo directo)
    labelDistance: 0.000001, // Distancia fija del texto arriba del modelo
  },
  // Futuros modelos GLB pueden agregarse aquí
  [ElementType.GUITAR]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/electric_guitar_squier_by_fender.glb',
    fallbackEnabled: true,
    defaultScale: 0.6, // Número único o array [x, y, z]
    defaultRotation: [0, 0, 20] as [number, number, number], // En grados
    defaultPosition: [0.3, 3, 0.4] as [number, number, number],
    labelDistance: 1.6, // Distancia fija del texto arriba del modelo
  },
  [ElementType.BASS_GUITAR]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/fender_pj_bass.glb',
    fallbackEnabled: true,
    defaultScale: 3, // Número único o array [x, y, z]
    defaultRotation: [0, 0, -50] as [number, number, number], // En grados - girado para que se vea mejor
    defaultPosition: [-0.4, 4.2, 0.4] as [number, number, number],
    labelDistance: 1.6, // Distancia fija del texto arriba del modelo
  },
  [ElementType.KEYBOARD]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/yamaha_keyboard.glb',
    fallbackEnabled: true,
    defaultScale: 3, // Número único o array [x, y, z]
    defaultRotation: [0, 180, 0] as [number, number, number], // En grados
    defaultPosition: [0, 0.1, 1] as [number, number, number],
    labelDistance: 1.6, // Distancia fija del texto arriba del modelo
  },
  [ElementType.DRUMS]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/drum_set.glb',
    fallbackEnabled: true,
    defaultScale: 1, // Número único o array [x, y, z]
    defaultRotation: [0, -90, 0] as [number, number, number], // En grados
    defaultPosition: [0, -0.5, 1.5] as [number, number, number],
    labelDistance: 1.6, // Distancia fija del texto arriba del modelo
  },
  [ElementType.FLOOR_MONITOR]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/stage_monitor_speaker.glb',
    fallbackEnabled: true,
    defaultScale: 0.02, // Número único o array [x, y, z]
    defaultRotation: [0, 90, 0] as [number, number, number], // En grados - girado hacia el centro
    defaultPosition: [0, 0.7, 0] as [number, number, number],
    labelDistance: 1.6, // Distancia fija del texto arriba del modelo
  },
  [ElementType.MUSIC_SHEET_STAND]: {
    modelPath:
      'https://frontreact324120fdb9be43adaf2e5990711a2be9ff5d3-staging.s3.us-east-1.amazonaws.com/public/models/music_stand.glb',
    fallbackEnabled: true,
    defaultScale: 0.05, // Número único o array [x, y, z]
    defaultRotation: [0, 0, 0] as [number, number, number], // En grados
    defaultPosition: [-1, 0.5, 2] as [number, number, number], // Ya incluye la altura en el fallback
    labelDistance: 1.8, // Distancia fija del texto arriba del modelo
  },
} as const;

// Helper para normalizar escala (número -> [número, número, número])
export const normalizeScale = (scale: number | [number, number, number]): [number, number, number] => {
  if (typeof scale === 'number') {
    return [scale, scale, scale];
  }
  return scale;
};

// Helper para obtener configuración de modelo
export const getModelConfig = (elementType: ElementType) => {
  const config = MODEL_CONFIG[elementType as keyof typeof MODEL_CONFIG] || null;
  if (config && config.defaultScale) {
    return {
      ...config,
      defaultScale: normalizeScale(config.defaultScale),
    };
  }
  return config;
};
