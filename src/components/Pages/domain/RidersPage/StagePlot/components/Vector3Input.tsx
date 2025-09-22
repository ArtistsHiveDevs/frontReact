import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import { NumberInput } from './NumberInput';
import { DynamicIcons } from '~/components/shared/DynamicIcons';

interface Vector3InputProps {
  label: string;
  value: [number, number, number];
  onChange: (axis: number, value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  precision?: number;
  labels?: [string, string, string];
  showLock?: boolean; // Mostrar el botón de candado para mantener proporciones
  scale?: number; // Factor de escala para conversión (ej: radianes a grados = 180/Math.PI)
  inverseScale?: number; // Factor inverso para convertir de vuelta (ej: grados a radianes = Math.PI/180)
}

export const Vector3Input: React.FC<Vector3InputProps> = ({
  label,
  value,
  onChange,
  step = 0.1,
  min,
  max,
  precision = 1,
  labels = ['X', 'Y', 'Z'],
  showLock = false,
  scale = 1,
  inverseScale = 1
}) => {
  const [isLocked, setIsLocked] = useState(false);

  // Convertir valores internos a valores mostrados
  const displayValues: [number, number, number] = [
    value[0] * scale,
    value[1] * scale,
    value[2] * scale
  ];

  const handleLockedChange = (axis: number, displayValue: number) => {
    // Convertir valor mostrado de vuelta a valor interno
    const internalValue = displayValue * inverseScale;

    if (!isLocked) {
      // Si no está bloqueado, comportamiento normal
      onChange(axis, internalValue);
      return;
    }

    if (axis === 0) {
      // Si está bloqueado y se modifica X, aplicar el mismo valor a Y y Z
      onChange(0, internalValue);
      onChange(1, internalValue);
      onChange(2, internalValue);
    }
    // Si está bloqueado y se intenta modificar Y o Z, no hacer nada (están deshabilitados)
  };
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
        <label style={{ fontWeight: 'bold' }}>
          {label}
        </label>
        {showLock && (
          <span
            onClick={() => setIsLocked(!isLocked)}
            style={{
              color: isLocked ? '#1976d2' : '#666',
              cursor: 'pointer',
              fontSize: '18px'
            }}
            title={isLocked ? 'Desbloquear proporciones' : 'Bloquear proporciones'}
          >
            <DynamicIcons iconName={isLocked ? 'gr GrLock' : 'gr GrUnlock'} />
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '5px' }}>
        {labels.map((axisLabel, index) => (
          <NumberInput
            key={axisLabel}
            label={axisLabel}
            value={displayValues[index]}
            onChange={(newValue) => handleLockedChange(index, newValue)}
            step={step}
            min={min}
            max={max}
            precision={precision}
            width="60px"
            disabled={isLocked && index > 0} // Deshabilitar Y y Z cuando está bloqueado
          />
        ))}
      </div>
    </div>
  );
};