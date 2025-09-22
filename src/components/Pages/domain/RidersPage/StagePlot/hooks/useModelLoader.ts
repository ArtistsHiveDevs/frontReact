import { useState, useEffect } from 'react';
import { useGLTF } from '@react-three/drei';
import { getModelConfig } from '../config/model-config';
import { ElementType } from '../types/element.types';

interface ModelLoaderState {
  loadedModels: Map<string, any>;
  loadingModels: Set<string>;
  failedModels: Set<string>;
}

export const useModelLoader = () => {
  const [loadedModels, setLoadedModels] = useState<Map<string, any>>(new Map());
  const [loadingModels, setLoadingModels] = useState<Set<string>>(new Set());
  const [failedModels, setFailedModels] = useState<Set<string>>(new Set());

  // Modelos por prioridad
  const PRIORITY_MODELS: ElementType[] = [ElementType.VOCAL_MICROPHONE, ElementType.MANNEQUIN];
  const SECONDARY_MODELS: ElementType[] = [ElementType.GUITAR, ElementType.BASS_GUITAR];

  // Obtener todos los demás tipos que no están en priority ni secondary
  const getAllOtherModels = (): ElementType[] => {
    const allTypes = Object.values(ElementType);
    return allTypes.filter((type: ElementType) =>
      !PRIORITY_MODELS.includes(type) && !SECONDARY_MODELS.includes(type)
    );
  };

  const loadModel = async (modelPath: string, elementType: ElementType): Promise<any> => {
    // Si ya está cargado, devolver inmediatamente
    if (loadedModels.has(modelPath)) {
      return loadedModels.get(modelPath);
    }

    // Si ya falló anteriormente, rechazar inmediatamente
    if (failedModels.has(modelPath)) {
      throw new Error(`Model ${modelPath} failed to load previously`);
    }

    // Si está cargando, esperar a que termine
    if (loadingModels.has(modelPath)) {
      return new Promise<any>((resolve, reject) => {
        const checkLoaded = () => {
          if (loadedModels.has(modelPath)) {
            resolve(loadedModels.get(modelPath));
          } else if (failedModels.has(modelPath)) {
            reject(new Error(`Model ${modelPath} failed to load`));
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
      });
    }

    // Marcar como cargando
    setLoadingModels(prev => new Set(prev).add(modelPath));

    try {
      // Cargar el modelo usando fetch y THREE.GLTFLoader directamente
      const response = await fetch(modelPath);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();

      // Aquí normalmente usarías THREE.GLTFLoader, pero para simplicidad
      // vamos a marcar como cargado y dejar que useGLTF maneje la carga real
      const scene = { loaded: true, path: modelPath };

      // Marcar como cargado
      setLoadedModels(prev => new Map(prev).set(modelPath, scene));
      return scene;
    } catch (error) {
      // Marcar como fallido
      setFailedModels(prev => new Set(prev).add(modelPath));
      console.warn(`Failed to load model ${modelPath} for ${elementType}:`, error);
      throw error;
    } finally {
      // Remover de cargando
      setLoadingModels(prev => {
        const newSet = new Set(prev);
        newSet.delete(modelPath);
        return newSet;
      });
    }
  };

  // Progressive preloading
  useEffect(() => {
    // 1. Cargar modelos prioritarios inmediatamente
    PRIORITY_MODELS.forEach((type: ElementType) => {
      const config = getModelConfig(type);
      if (config?.modelPath) {
        loadModel(config.modelPath, type).catch(() => {
          // Silenciosamente ignorar errores de precarga
        });
      }
    });

    // 2. Cargar modelos secundarios después de 2s
    const secondaryTimer = setTimeout(() => {
      SECONDARY_MODELS.forEach((type: ElementType) => {
        const config = getModelConfig(type);
        if (config?.modelPath) {
          loadModel(config.modelPath, type).catch(() => {
            // Silenciosamente ignorar errores de precarga
          });
        }
      });
    }, 2000);

    // 3. Cargar los demás después de 5s
    const othersTimer = setTimeout(() => {
      getAllOtherModels().forEach((type: ElementType) => {
        const config = getModelConfig(type);
        if (config?.modelPath) {
          loadModel(config.modelPath, type).catch(() => {
            // Silenciosamente ignorar errores de precarga
          });
        }
      });
    }, 5000);

    return () => {
      clearTimeout(secondaryTimer);
      clearTimeout(othersTimer);
    };
  }, []);

  return {
    loadModel,
    loadedModels,
    loadingModels,
    failedModels,
    isLoading: (modelPath: string) => loadingModels.has(modelPath),
    hasFailed: (modelPath: string) => failedModels.has(modelPath),
    isLoaded: (modelPath: string) => loadedModels.has(modelPath)
  };
};