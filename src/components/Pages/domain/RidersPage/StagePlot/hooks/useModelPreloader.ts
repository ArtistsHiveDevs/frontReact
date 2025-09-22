import { useGLTF } from '@react-three/drei';
import { useEffect } from 'react';
import { getModelConfig } from '../config/model-config';
import { ElementType } from '../types/element.types';

// Configurar timeout más largo para GLB grandes (60 segundos)
useGLTF.setDecoderPath = () => {};
if (typeof window !== 'undefined') {
  // Aumentar timeout para requests HTTP
  const originalFetch = window.fetch;
  window.fetch = function(url, options = {}) {
    if (typeof url === 'string' && url.includes('.glb')) {
      return originalFetch(url, {
        ...options,
        // Timeout de 60 segundos para archivos GLB
        signal: AbortSignal.timeout ? AbortSignal.timeout(60000) : options.signal
      });
    }
    return originalFetch(url, options);
  };
}

export const useModelPreloader = (): any => {
  // Modelos por prioridad
  const PRIORITY_MODELS: ElementType[] = [ElementType.VOCAL_MICROPHONE, ElementType.MANNEQUIN];
  const SECONDARY_MODELS: ElementType[] = [ElementType.GUITAR, ElementType.BASS_GUITAR];

  // Obtener todos los demás tipos que no están en priority ni secondary
  const getAllOtherModels = (): ElementType[] => {
    const allTypes = Object.values(ElementType);
    return allTypes.filter((type: ElementType) => !PRIORITY_MODELS.includes(type) && !SECONDARY_MODELS.includes(type));
  };

  // Progressive preloading
  useEffect(() => {
    // 1. Precargar modelos prioritarios inmediatamente
    PRIORITY_MODELS.forEach((type: ElementType) => {
      const config = getModelConfig(type);
      if (config?.modelPath) {
        try {
          useGLTF.preload(config.modelPath);
        } catch (error) {
          console.warn(`Failed to preload priority model for ${type}:`, error);
        }
      }
    });

    // 2. Precargar modelos secundarios después de 10s
    const secondaryTimer = setTimeout(() => {
      SECONDARY_MODELS.forEach((type: ElementType) => {
        const config = getModelConfig(type);
        if (config?.modelPath) {
          try {
            useGLTF.preload(config.modelPath);
          } catch (error) {
            console.warn(`Failed to preload secondary model for ${type}:`, error);
          }
        }
      });
    }, 10000);

    // 3. Precargar los demás después de 20s
    const othersTimer = setTimeout(() => {
      getAllOtherModels().forEach((type: ElementType) => {
        const config = getModelConfig(type);
        if (config?.modelPath) {
          try {
            useGLTF.preload(config.modelPath);
          } catch (error) {
            console.warn(`Failed to preload model for ${type}:`, error);
          }
        }
      });
    }, 20000);

    return () => {
      clearTimeout(secondaryTimer);
      clearTimeout(othersTimer);
    };
  }, []);

  return null; // Este hook solo precarga, no retorna nada
};
