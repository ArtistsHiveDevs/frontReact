# DateSelector - Documentación de Parámetros

Componente de selección de fecha con soporte para restricciones de edad y rangos de años.

## Parámetros Disponibles en `componentParams`

### 1. **disablePast** (boolean)
Deshabilita todas las fechas pasadas (antes de hoy).

```typescript
componentParams: {
  disablePast: true
}
```

### 2. **disableFuture** (boolean)
Deshabilita todas las fechas futuras (después de hoy).

```typescript
componentParams: {
  disableFuture: true
}
```

### 3. **minDate** (Date | string | Dayjs)
Fecha mínima permitida (fecha exacta).

```typescript
componentParams: {
  minDate: '2000-01-01' // No permitir fechas antes del 1 de enero de 2000
}
```

### 4. **maxDate** (Date | string | Dayjs)
Fecha máxima permitida (fecha exacta).

```typescript
componentParams: {
  maxDate: '2025-12-31' // No permitir fechas después del 31 de diciembre de 2025
}
```

### 5. **minYearsAgo** (number)
Número de años atrás desde hoy como fecha mínima.

```typescript
componentParams: {
  minYearsAgo: 100 // Fecha mínima: hace 100 años desde hoy
}
```

### 6. **maxYearsAgo** (number)
Número de años atrás desde hoy como fecha máxima.

```typescript
componentParams: {
  maxYearsAgo: 18 // Fecha máxima: hace 18 años desde hoy
}
```

### 7. **minAgeInYears** (number)
Edad mínima requerida (en años). Calcula la fecha como: hoy - minAgeInYears.

```typescript
componentParams: {
  minAgeInYears: 18 // Usuario debe tener al menos 18 años
}
```

### 8. **maxAgeInYears** (number)
Edad máxima permitida (en años). Calcula la fecha como: hoy - maxAgeInYears.

```typescript
componentParams: {
  maxAgeInYears: 100 // Usuario no puede tener más de 100 años
}
```

### 9. **displayWeekNumber** (boolean)
Muestra el número de semana en el calendario.

```typescript
componentParams: {
  displayWeekNumber: true
}
```

### 10. **defaultToMinAge** (boolean)
Preselecciona automáticamente la fecha correspondiente a la edad mínima. Útil para fechas de nacimiento.

```typescript
componentParams: {
  minAgeInYears: 18,
  defaultToMinAge: true  // Preselecciona "hoy - 18 años"
}
```

### 11. **defaultToMaxAge** (boolean)
Preselecciona automáticamente la fecha correspondiente a la edad máxima.

```typescript
componentParams: {
  maxAgeInYears: 100,
  defaultToMaxAge: true  // Preselecciona "hoy - 100 años"
}
```

## Prioridad de Parámetros

Cuando se usan múltiples parámetros, se aplica el siguiente orden de prioridad:

### Para fecha mínima:
1. `minDate` (prioridad más alta)
2. `minYearsAgo`
3. `minAgeInYears`

### Para fecha máxima:
1. `maxDate` (prioridad más alta)
2. `maxYearsAgo`
3. `maxAgeInYears`

## Ejemplos de Uso

### Ejemplo 1: Fecha de nacimiento para mayores de edad (18+) CON FECHA PRESELECCIONADA

```typescript
{
  name: 'birth_date',
  formMetaData: {
    inputType: 'date',
    componentParams: {
      disableFuture: true,      // No puede ser en el futuro
      minAgeInYears: 18,         // Debe tener al menos 18 años
      maxAgeInYears: 120,        // No más de 120 años
      defaultToMinAge: true      // ✨ Preselecciona "hoy - 18 años"
    },
    config: {
      required: true
    }
  }
}
```

**Resultado**: Solo permite fechas entre hace 120 años y hace 18 años desde hoy. **El calendario se abre con la fecha de hace 18 años preseleccionada**.

### Ejemplo 2: Fecha de nacimiento para menores (menos de 18 años)

```typescript
{
  name: 'child_birth_date',
  formMetaData: {
    inputType: 'date',
    componentParams: {
      disableFuture: true,      // No puede ser en el futuro
      maxYearsAgo: 18,           // Máximo hace 18 años
      minYearsAgo: 0             // Mínimo hoy
    }
  }
}
```

**Resultado**: Solo permite fechas entre hoy y hace 18 años.

### Ejemplo 3: Fecha de fundación de empresa (entre 1900 y hoy)

```typescript
{
  name: 'founded_date',
  formMetaData: {
    inputType: 'date',
    componentParams: {
      disableFuture: true,
      minDate: '1900-01-01',
      maxDate: new Date()
    }
  }
}
```

### Ejemplo 4: Fecha de evento futuro (no antes de hoy)

```typescript
{
  name: 'event_date',
  formMetaData: {
    inputType: 'date',
    componentParams: {
      disablePast: true          // Solo fechas futuras
    }
  }
}
```

### Ejemplo 5: Rango específico de años (últimos 10 años)

```typescript
{
  name: 'recent_date',
  formMetaData: {
    inputType: 'date',
    componentParams: {
      minYearsAgo: 10,           // Hace 10 años
      maxDate: new Date()        // Hasta hoy
    }
  }
}
```

### Ejemplo 6: Fecha de inicio de carrera artística (mayor de 16 años)

```typescript
{
  name: 'career_start_date',
  formMetaData: {
    inputType: 'date',
    componentParams: {
      disableFuture: true,
      minAgeInYears: 16,         // Debe tener al menos 16 años
      maxYearsAgo: 0             // Hasta hoy
    }
  }
}
```

## Uso en DynamicTabbedForm

```typescript
const userFormConfig: ProfileDetailsSubpage[] = [
  {
    name: 'personal_info',
    sections: [
      {
        name: 'basic',
        components: [
          {
            componentName: ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS,
            data: {
              attributes: [
                {
                  name: 'birth_date',
                  title: 'Fecha de Nacimiento',
                  formMetaData: {
                    inputType: 'date',
                    componentParams: {
                      disableFuture: true,
                      minAgeInYears: 18,    // Mayores de 18 años
                      maxAgeInYears: 100
                    },
                    config: {
                      required: true
                    }
                  }
                }
              ]
            }
          }
        ]
      }
    ]
  }
];

<DynamicTabbedForm
  tabsInfo={userFormConfig}
  handlers={{ onSubmit: handleSubmit }}
  translationBasePath="user.profile"
/>
```

## Validación Adicional

El componente automáticamente previene la selección de fechas fuera de los rangos establecidos en la interfaz del calendario. Sin embargo, si necesitas validación adicional del lado del servidor, asegúrate de validar:

1. La fecha no es nula (si es requerida)
2. La fecha está dentro del rango permitido
3. La edad calculada cumple con los requisitos

## Notas Importantes

- Todos los cálculos de edad se basan en la fecha actual (`dayjs()`)
- Las fechas se manejan usando `dayjs` para mejor compatibilidad
- Si se combinan parámetros conflictivos, se aplica la prioridad mencionada arriba
- `disablePast` y `disableFuture` son absolutos y no dependen de otros parámetros
- `minAgeInYears` y `minYearsAgo` son equivalentes pero `minAgeInYears` es más semántico para fechas de nacimiento
