import { Text, useGLTF } from '@react-three/drei';
import React, { Component, ReactNode, Suspense, useEffect, useState } from 'react';
import { getModelConfig, normalizeScale } from '../config/model-config';
import { METERS_SCALE } from '../StagePlotEditor';
import { BaseElementProps, ElementType } from '../types/element.types';

interface ModelElementState {
  modelLoadError: boolean;
}

export abstract class Model3DElement extends Component<BaseElementProps, ModelElementState> {
  protected abstract elementType: ElementType;

  // Cache espacial para optimizar cálculos de plataformas
  private static platformCache = new Map<string, number>();
  private static lastPlatformHash = '';

  // Método para limpiar cache cuando cambien plataformas
  static clearPlatformCache() {
    Model3DElement.platformCache.clear();
    Model3DElement.lastPlatformHash = '';
  }

  constructor(props: BaseElementProps) {
    super(props);
    this.state = {
      modelLoadError: false,
    };
  }

  // Método abstracto que cada hijo debe implementar para su fallback
  protected abstract renderFallback(): ReactNode;

  // Método para renderizar fallback por defecto (esfera)
  protected renderDefaultFallback(): ReactNode {
    const selectedColor = this.props.isSelected ? 'pink' : this.props.color || '#333333';
    const { scale } = this.getFinalProperties();

    // Calcular radio base en función del tipo de elemento
    let baseRadius = 0.5;
    switch (this.elementType) {
      case ElementType.MANNEQUIN:
        baseRadius = 0.8;
        break;
      case ElementType.DRUMS:
        baseRadius = 1.2;
        break;
      case ElementType.KEYBOARD:
        baseRadius = 0.7;
        break;
      case ElementType.GUITAR:
      case ElementType.BASS_GUITAR:
        baseRadius = 0.6;
        break;
      default:
        baseRadius = 0.5;
    }

    return (
      <mesh>
        <sphereGeometry args={[(baseRadius * Math.max(scale[0], scale[1], scale[2])) / METERS_SCALE, 16, 16]} />
        <meshStandardMaterial color={selectedColor} transparent opacity={0.7} />
      </mesh>
    );
  }

  // Componente para renderizar el modelo GLB con manejo de errores y timeout
  protected renderGLBModel(): ReactNode {
    const modelConfig = getModelConfig(this.elementType);
    if (!modelConfig?.modelPath) {
      return null;
    }

    // Crear un estado compartido para comunicar entre componentes
    let modelLoadedRef = { current: false };

    const GLBModelComponent = ({ onLoadCallback }: { onLoadCallback: (loaded: boolean) => void }) => {
      // console.log(`🚀 Starting GLB load for ${this.elementType}: ${modelConfig.modelPath}`);
      const { scene } = useGLTF(modelConfig.modelPath);
      // console.log(`✅ GLB loaded successfully for ${this.elementType}`);

      // Indicar que el modelo se cargó exitosamente
      useEffect(() => {
        if (scene && !modelLoadedRef.current) {
          // console.log(`📦 GLB component rendered successfully for ${this.elementType}`);
          modelLoadedRef.current = true;
          onLoadCallback(true);
        }
      }, [scene, onLoadCallback]);

      const selectedColor = this.props.isSelected ? 'pink' : this.props.color || '#333333';

      // Convertir rotación de grados a radianes para el modelo GLB
      const defaultRotationRadians = modelConfig.defaultRotation.map((deg) => (deg * Math.PI) / 180) as [
        number,
        number,
        number
      ];

      // Usar escala y posición del config para el modelo GLB
      const configScale = modelConfig?.defaultScale ? normalizeScale(modelConfig.defaultScale) : [1, 1, 1];
      const configPosition = modelConfig?.defaultPosition || [0, 0, 0];

      return (
        <group position={configPosition as any} rotation={defaultRotationRadians as any} scale={configScale as any}>
          <primitive
            object={scene.clone()}
            traverse={(child: any) => {
              if (child.isMesh && child.material) {
                child.material = child.material.clone();
                child.material.color.set(selectedColor);
              }
            }}
          />
        </group>
      );
    };

    const LoadingPlaceholder = () => {
      const selectedColor = this.props.isSelected ? 'pink' : this.props.color || '#666666';
      // console.log(`⏳ Loading placeholder shown for ${this.elementType}`);
      return (
        <mesh>
          <boxGeometry args={[0.5, 0.5, 0.5]} />
          <meshStandardMaterial color={selectedColor} transparent opacity={0.3} />
        </mesh>
      );
    };

    const ErrorBoundaryWrapper = () => {
      const [modelLoaded, setModelLoaded] = useState(false);
      const [hasError, setHasError] = useState(false);
      const [timeoutReached, setTimeoutReached] = useState(false);

      useEffect(() => {
        // Timeout de 90 segundos para mostrar fallback
        const timer = setTimeout(() => {
          if (!modelLoaded) {
            // console.log(
            //   `⏰ Timeout reached (90s) for GLB model: ${this.elementType} - no GLB loaded, switching to fallback`
            // );
            setTimeoutReached(true);
          } else {
            // console.log(`✅ GLB model ${this.elementType} loaded before timeout - keeping GLB`);
          }
        }, 90000);

        return () => clearTimeout(timer);
      }, [modelLoaded]);

      if (hasError || timeoutReached) {
        // console.log(`🔄 GLB failed or timed out for ${this.elementType}, using fallback`);
        // Usar setTimeout para evitar setState durante render
        setTimeout(() => {
          if (!this.state.modelLoadError) {
            this.setState({ modelLoadError: true });
          }
        }, 0);
        return null;
      }

      try {
        return (
          <Suspense fallback={<LoadingPlaceholder />}>
            <GLBModelComponent
              onLoadCallback={(loaded: boolean) => {
                // console.log(`📦 Callback received for ${this.elementType}: loaded=${loaded}`);
                setModelLoaded(loaded);
              }}
            />
          </Suspense>
        );
      } catch (error) {
        setHasError(true);
        // console.warn(`GLB model failed to load for ${this.elementType}:`, error);
        return null;
      }
    };

    return <ErrorBoundaryWrapper />;
  }

  // Método para renderizar el contenido principal
  protected renderContent(): ReactNode {
    const modelConfig = getModelConfig(this.elementType);
    const model = this.renderGLBModel();

    // Si el modelo GLB está disponible y no hay error, usarlo
    if (model && !this.state.modelLoadError) {
      return model;
    }

    // Si fallback está habilitado, intentar renderizar el fallback específico
    if (modelConfig?.fallbackEnabled ?? true) {
      try {
        return this.renderFallback();
      } catch (error) {
        console.warn(`Fallback failed for ${this.elementType}, using default sphere:`, error);
        // Si el fallback específico falla, usar el fallback por defecto (esfera)
        return this.renderDefaultFallback();
      }
    }

    // Si todo falla, usar fallback por defecto
    return this.renderDefaultFallback();
  }

  // Método para renderizar el texto del elemento
  protected renderText(): ReactNode {
    const { name, hideText } = this.props;
    const { scale } = this.getFinalProperties();

    if (!name || hideText) return null;

    // Calcular escala inversa para que el texto mantenga tamaño fijo
    const textScale = [1 / scale[0], 1 / scale[1], 1 / scale[2]] as [number, number, number];

    // Calcular el punto más alto del modelo que se está renderizando
    const modelConfig = getModelConfig(this.elementType);
    const labelGap = modelConfig?.labelDistance || 1.6; // Gap entre punto más alto y texto
    let modelTopY = 2; // Fallback por defecto

    // Determinar si se está renderizando GLB o fallback
    const model = this.renderGLBModel();
    const isUsingGLB = model && !this.state.modelLoadError;

    if (isUsingGLB && modelConfig) {
      // Calcular punto más alto del modelo GLB
      const configScale = modelConfig?.defaultScale ? normalizeScale(modelConfig.defaultScale) : [1, 1, 1];
      const configPosition = modelConfig?.defaultPosition || [0, 0, 0];

      // Punto más alto = posición Y del GLB + altura estimada del modelo escalado
      modelTopY = configPosition[1] + configScale[1] * 1.5; // 1.5 es factor estimado de altura
    } else {
      // Para fallback, usar una altura estimada basada en el tipo de elemento
      switch (this.elementType) {
        case 'mannequin':
          modelTopY = 3 * scale[1]; // Altura estimada del mannequin fallback
          break;
        case 'guitar':
          modelTopY = 3 * scale[1]; // Altura estimada de la guitarra fallback (extruded shape)
          break;
        case 'vocal_microphone':
          modelTopY = 2 * scale[1]; // Altura estimada del micrófono fallback
          break;
        default:
          modelTopY = 2 * scale[1]; // Altura por defecto
      }
    }

    // Posición final del texto = punto más alto + gap
    const textHeight = (modelTopY + labelGap) * METERS_SCALE;

    return (
      <group scale={textScale}>
        <Text
          position={[0, textHeight, 0]}
          color="black"
          fontSize={0.8 * METERS_SCALE}
          maxWidth={2 * METERS_SCALE}
          lineHeight={1}
          textAlign="center"
        >
          {name}
        </Text>
      </group>
    );
  }

  // Método para renderizar los ejes del elemento en el escenario (sólidos)
  protected renderElementAxes(): ReactNode {
    const { showAxes = false } = this.props;

    // Solo mostrar ejes si está habilitado
    if (!showAxes) return null;

    // Tamaño fijo independiente de la escala del elemento
    const axisLength = 3 * METERS_SCALE;
    const halfLength = axisLength / 2;
    const lineWidth = 0.05 * METERS_SCALE;

    return (
      <>
        {/* Ejes del elemento en el escenario - SÓLIDOS */}

        {/* Línea X negativa - Rojo oscuro */}
        <mesh position={[-halfLength / 2, 0, 0]}>
          <boxGeometry args={[halfLength, lineWidth, lineWidth]} />
          <meshBasicMaterial color="#AA0000" />
        </mesh>

        {/* Línea X positiva - Rojo */}
        <mesh position={[halfLength / 2, 0, 0]}>
          <boxGeometry args={[halfLength, lineWidth, lineWidth]} />
          <meshBasicMaterial color="#FF0000" />
        </mesh>

        {/* Línea Y negativa - Verde oscuro */}
        <mesh position={[0, -halfLength / 2, 0]}>
          <boxGeometry args={[lineWidth, halfLength, lineWidth]} />
          <meshBasicMaterial color="#00AA00" />
        </mesh>

        {/* Línea Y positiva - Verde */}
        <mesh position={[0, halfLength / 2, 0]}>
          <boxGeometry args={[lineWidth, halfLength, lineWidth]} />
          <meshBasicMaterial color="#00FF00" />
        </mesh>

        {/* Línea Z negativa - Azul oscuro */}
        <mesh position={[0, 0, -halfLength / 2]}>
          <boxGeometry args={[lineWidth, lineWidth, halfLength]} />
          <meshBasicMaterial color="#0000AA" />
        </mesh>

        {/* Línea Z positiva - Azul */}
        <mesh position={[0, 0, halfLength / 2]}>
          <boxGeometry args={[lineWidth, lineWidth, halfLength]} />
          <meshBasicMaterial color="#0000FF" />
        </mesh>

        {/* Punto de origen del elemento - Blanco sólido */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[lineWidth * 3, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
      </>
    );
  }

  // Método para renderizar los ejes del modelo GLB (transparentes)
  protected renderGLBAxes(): ReactNode {
    const { showAxes = false } = this.props;
    const modelConfig = getModelConfig(this.elementType);

    // Solo mostrar ejes si está habilitado
    if (!showAxes || !modelConfig) return null;

    // Tamaño más pequeño para los ejes del GLB
    const axisLength = 2 * METERS_SCALE;
    const halfLength = axisLength / 2;
    const lineWidth = 0.03 * METERS_SCALE;

    // Posición y rotación del modelo GLB (ya se aplican en el renderGLBModel)
    const configPosition = modelConfig?.defaultPosition || [0, 0, 0];
    const defaultRotationRadians = modelConfig.defaultRotation.map((deg) => (deg * Math.PI) / 180) as [
      number,
      number,
      number
    ];
    const configScale = modelConfig?.defaultScale ? normalizeScale(modelConfig.defaultScale) : [1, 1, 1];

    return (
      <group position={configPosition as any} rotation={defaultRotationRadians as any} scale={configScale as any}>
        {/* Ejes del modelo GLB - TRANSPARENTES */}

        {/* Línea X negativa - Rojo oscuro transparente */}
        <mesh position={[-halfLength / 2, 0, 0]}>
          <boxGeometry args={[halfLength, lineWidth, lineWidth]} />
          <meshBasicMaterial color="#AA0000" transparent opacity={0.3} />
        </mesh>

        {/* Línea X positiva - Rojo transparente */}
        <mesh position={[halfLength / 2, 0, 0]}>
          <boxGeometry args={[halfLength, lineWidth, lineWidth]} />
          <meshBasicMaterial color="#FF0000" transparent opacity={0.3} />
        </mesh>

        {/* Línea Y negativa - Verde oscuro transparente */}
        <mesh position={[0, -halfLength / 2, 0]}>
          <boxGeometry args={[lineWidth, halfLength, lineWidth]} />
          <meshBasicMaterial color="#00AA00" transparent opacity={0.3} />
        </mesh>

        {/* Línea Y positiva - Verde transparente */}
        <mesh position={[0, halfLength / 2, 0]}>
          <boxGeometry args={[lineWidth, halfLength, lineWidth]} />
          <meshBasicMaterial color="#00FF00" transparent opacity={0.3} />
        </mesh>

        {/* Línea Z negativa - Azul oscuro transparente */}
        <mesh position={[0, 0, -halfLength / 2]}>
          <boxGeometry args={[lineWidth, lineWidth, halfLength]} />
          <meshBasicMaterial color="#0000AA" transparent opacity={0.3} />
        </mesh>

        {/* Línea Z positiva - Azul transparente */}
        <mesh position={[0, 0, halfLength / 2]}>
          <boxGeometry args={[lineWidth, lineWidth, halfLength]} />
          <meshBasicMaterial color="#0000FF" transparent opacity={0.3} />
        </mesh>

        {/* Punto de origen del GLB - Blanco transparente */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[lineWidth * 4, 8, 8]} />
          <meshBasicMaterial color="#FFFFFF" transparent opacity={0.5} />
        </mesh>
      </group>
    );
  }

  // Detectar si hay colisión en XZ y retornar la altura máxima de plataforma
  protected detectPlatformCollision(x: number, z: number): { hasCollision: boolean; maxHeight: number } {
    const platforms = (this.props as any).platforms || [];

    // Invalidar cache si las plataformas cambiaron (dimensiones, posición, altura)
    const currentPlatformHash = platforms
      .map((p: any) => `${p.position.join(',')}-${p.width || 4}-${p.depth || 4}-${p.height || 1}`)
      .join('|');

    if (currentPlatformHash !== Model3DElement.lastPlatformHash) {
      Model3DElement.clearPlatformCache();
      Model3DElement.lastPlatformHash = currentPlatformHash;
    }

    // Cache key basado en posición redondeada para optimización
    const cacheKey = `${Math.round(x * 10) / 10},${Math.round(z * 10) / 10}`;
    if (Model3DElement.platformCache.has(cacheKey)) {
      const cachedHeight = Model3DElement.platformCache.get(cacheKey)!;
      // console.log(`🗄️ Cache HIT para ${cacheKey}: height=${cachedHeight}`);
      return {
        hasCollision: cachedHeight !== null,
        maxHeight: cachedHeight || 0,
      };
    }

    let maxPlatformHeight = -Infinity; // Permitir plataformas en Y negativo
    let hasCollision = false;

    // Verificar colisión en XZ con cada plataforma
    for (const platform of platforms) {
      const [px, py, pz] = platform.position;
      const width = platform.width || 4;
      const depth = platform.depth || 4;
      const height = platform.height || 1;

      // Bounding box check en XZ solamente
      const halfWidth = width / 2;
      const halfDepth = depth / 2;

      // console.log(`📦 Verificando plataforma "${platform.name}" en [${px}, ${py}, ${pz}] size: ${width}x${depth}x${height}`);
      // console.log(`   - Elemento en [${x}, _, ${z}] vs plataforma bounds: X[${px - halfWidth} to ${px + halfWidth}], Z[${pz - halfDepth} to ${pz + halfDepth}]`);

      // Colisión en el plano XZ
      if (x >= px - halfWidth && x <= px + halfWidth && z >= pz - halfDepth && z <= pz + halfDepth) {
        hasCollision = true;

        // Calcular altura de la superficie superior de esta plataforma
        // py es el centro, height/2 nos da la superficie superior
        const platformTop = py + height / 2;
        // console.log(`   ✅ COLISIÓN! Surface top: ${py} + ${height}/2 = ${platformTop}`);

        // Usar la plataforma más alta si hay varias superpuestas
        if (platformTop > maxPlatformHeight) {
          maxPlatformHeight = platformTop;
        }
      } else {
        // console.log(`   ❌ Sin colisión en XZ`);
      }
    }

    // Cache del resultado - usar null si no hay colisión
    const heightToCache = hasCollision ? maxPlatformHeight : null;
    Model3DElement.platformCache.set(cacheKey, heightToCache);

    // console.log(`💾 Cache MISS para ${cacheKey}: collision=${hasCollision}, height=${heightToCache}`);

    return {
      hasCollision,
      maxHeight: hasCollision ? maxPlatformHeight : 0,
    };
  }

  // Obtener propiedades finales con fallbacks básicos
  protected getFinalProperties() {
    const modelConfig = getModelConfig(this.elementType);
    const {
      position,
      rotation = [0, 0, 0], // Sin rotación por defecto para el elemento principal
      scale = [1, 1, 1], // Escala por defecto para el elemento principal
      onClick,
    } = this.props;

    // Calcular posición final con física simple
    let finalPosition: [number, number, number];

    if (position) {
      // Detectar colisión en XZ con plataformas
      const collision = this.detectPlatformCollision(position[0], position[2]);

      let finalY = position[1]; // Por defecto, mantener Y original

      if (collision.hasCollision) {
        // HAY COLISIÓN: Determinar si aplicar física o respetar Y manual
        // console.log(`🎯 COLISIÓN DETECTADA para elemento en [${position[0]}, ${position[1]}, ${position[2]}]`);
        // console.log(`   - Altura máxima plataforma: ${collision.maxHeight}`);

        // Si Y es positivo, el usuario lo elevó intencionalmente
        // Mantener esa elevación relativa sobre la plataforma
        if (position[1] > 0) {
          // Usuario elevó intencionalmente - mantener elevación relativa
          finalY = collision.maxHeight + position[1] + 0.1; // Pequeño offset para estar claramente encima
          // console.log(`   - Y > 0: finalY = ${collision.maxHeight} + ${position[1]} + 0.1 = ${finalY}`);
        } else {
          // Posicionar directamente sobre la superficie de la plataforma
          finalY = collision.maxHeight + 0.1; // Offset para no atravesar
          // console.log(`   - Y ≤ 0: finalY = ${collision.maxHeight} + 0.1 = ${finalY}`);
        }
      } else {
        // console.log(`❌ Sin colisión para elemento en [${position[0]}, ${position[1]}, ${position[2]}] - manteniendo Y original`);
      }
      // SI NO HAY COLISIÓN: Mantener Y original del elemento

      finalPosition = [
        position[0],
        finalY, // Y calculado según colisión con plataformas
        position[2],
      ];
    } else {
      // Si no hay posición, usar center del escenario
      finalPosition = [0, 0, 0];
    }

    return {
      position: finalPosition,
      rotation: rotation, // Usar rotación del props (en radianes)
      scale: [scale[0] * METERS_SCALE, scale[1] * METERS_SCALE, scale[2] * METERS_SCALE] as [number, number, number],
      onClick,
    };
  }

  render(): ReactNode {
    const { position, rotation, scale, onClick } = this.getFinalProperties();

    return (
      <group position={position} onClick={onClick}>
        {/* Grupo interno que rota desde el origen local */}
        <group rotation={rotation as any} scale={scale as any}>
          {this.renderContent()}
          {this.renderText()}

          {/* Ejes del modelo GLB (transparentes) - muestra el (0,0,0) interno del modelo */}
          {this.renderGLBAxes()}
        </group>

        {/* Ejes del elemento en el escenario (sólidos) - siempre muestran la orientación base */}
        <group position={[0, 0, 0] as any} rotation={[0, 0, 0] as any} scale={[1, 1, 1] as any}>
          {this.renderElementAxes()}
        </group>
      </group>
    );
  }
}
