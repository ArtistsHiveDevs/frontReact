import React, { useState, useRef, useEffect } from 'react';

interface NumberInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
  width?: string;
  precision?: number; // Número de decimales
  disabled?: boolean;
}

export const NumberInput: React.FC<NumberInputProps> = ({
  label,
  value,
  onChange,
  step = 0.1,
  min,
  max,
  width = '60px',
  precision = 1,
  disabled = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Función para redondear a la precisión especificada
  const roundToPrecision = (num: number): number => {
    return Math.round(num * Math.pow(10, precision)) / Math.pow(10, precision);
  };

  // Función para ajustar valor con límites
  const clampValue = (newValue: number): number => {
    let clampedValue = newValue;
    if (min !== undefined) clampedValue = Math.max(min, clampedValue);
    if (max !== undefined) clampedValue = Math.min(max, clampedValue);
    return roundToPrecision(clampedValue);
  };

  // Manejo de teclas de flecha
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isFocused || disabled) return;

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newValue = clampValue(value + step);
      onChange(newValue);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newValue = clampValue(value - step);
      onChange(newValue);
    }
  };

  // Manejo de cambio manual
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(clampValue(newValue));
    } else if (e.target.value === '') {
      onChange(0);
    }
  };

  // Efecto para manejar eventos globales de teclado cuando está enfocado
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (isFocused && !disabled && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        e.preventDefault();
        if (e.key === 'ArrowUp') {
          const newValue = clampValue(value + step);
          onChange(newValue);
        } else if (e.key === 'ArrowDown') {
          const newValue = clampValue(value - step);
          onChange(newValue);
        }
      }
    };

    if (isFocused) {
      document.addEventListener('keydown', handleGlobalKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [isFocused, value, step, onChange, min, max, precision]);

  return (
    <div>
      <label style={{ fontSize: '12px' }}>{label}:</label>
      <input
        ref={inputRef}
        type="number"
        step={step}
        min={min}
        max={max}
        value={value.toFixed(precision)}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        disabled={disabled}
        style={{
          width,
          marginLeft: '5px',
          backgroundColor: disabled ? '#e0e0e0' : (isFocused ? '#e3f2fd' : 'white'),
          border: disabled ? '1px solid #bdbdbd' : (isFocused ? '2px solid #1976d2' : '1px solid #ccc'),
          borderRadius: '3px',
          padding: '2px 4px',
          color: disabled ? '#757575' : 'inherit'
        }}
        title={`Use ↑↓ para incrementar/decrementar por ${step}`}
      />
    </div>
  );
};