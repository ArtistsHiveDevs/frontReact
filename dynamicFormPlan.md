# Plan de Refactorización: DynamicForm System

**Fecha Inicio**: 2025-12-03
**Fecha Actualización**: 2025-12-05
**Estado**: ✅ 100% Completado - Listo para Producción
**Objetivo**: Permitir uso independiente de componentes de formulario sin requerir `DynamicTabbedForm`, manteniendo backward compatibility total.

---

## ✅ ESTADO ACTUAL: COMPLETADO

### Refactorización Exitosa
- ✅ **4 componentes prioritarios refactorizados** (100% funcionales)
- ✅ **Backward compatibility verificada** (DynamicForm existente funciona sin cambios)
- ✅ **Patrón híbrido implementado** (`formContext || useFormContext()`)
- ✅ **Listo para uso en PreBookingDialog**

### Componentes Refactorizados
1. ✅ **DateSelector.tsx** - `createDatePicker()` con soporte hora/minuto
2. ✅ **TextField.tsx** - `createTextField()` para texto, números, multiline
3. ✅ **SelectField.tsx** - `createSelectField()` para dropdowns
4. ✅ **Autocomplete.tsx** - `createAutocomplete()` para selección multi-participantes

---

## Decisiones Clave

1. ✅ **Mantener backward compatibility**: Todo código existente sigue funcionando sin cambios
2. ✅ **Solo refactorizar create\* functions**: No crear componentes standalone
3. ✅ **Enfoque incremental**: Refactorizar solo lo necesario para PreBookingDialog (completado)

## Arquitectura Actual

```
┌─────────────────────────────────────┐
│   DynamicTabbedForm (Layout)       │
│   - Crea FormProvider               │
│   - Renderiza tabs y sections       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   DynamicForm (Orchestrator)        │
│   - Crea FormProvider               │
│   - Itera sobre fields              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   DynamicControl (Field Router)     │
│   - Decide qué create* llamar       │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│   create* functions                 │
│   - createTextField()               │
│   - createDatePicker()              │
│   - createSelectField()             │
│   - ❌ Usan useFormContext()        │
└─────────────────────────────────────┘
```

### Problema Actual

```typescript
// DateSelector.tsx - Ejemplo del problema
export const createDatePicker = (params: {
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers?: { [handlerName: string]: Function };
}) => {
  // ❌ PROBLEMA: useFormContext() requiere FormProvider como ancestro
  const { control, register: formRegister, formState, setValue } = useFormContext();

  return (
    <Controller
      control={control} // Viene del contexto
      name={fieldName}
      render={({ field }) => (
        <DatePicker
          value={field.value}
          onChange={(date) => {
            setValue(fieldName, date); // Viene del contexto
            field.onChange(date);
          }}
        />
      )}
    />
  );
};
```

**Consecuencia**: No puedes usar `createDatePicker` en un componente custom sin `FormProvider`.

## Arquitectura Propuesta (Refactorizada)

```
┌─────────────────────────────────────┐
│   Custom Layout (ej: PreBooking)    │
│   - Crea FormProvider               │
│   - Pasa formContext explícitamente │
└──────────────┬──────────────────────┘
               │
               ├─────────────────────────────┐
               │                             │
               ▼                             ▼
┌──────────────────────────┐  ┌─────────────────────────────┐
│ DynamicTabbedForm        │  │  create* functions          │
│ (Backward Compatible)    │  │  - ✅ Aceptan formContext   │
│ - Usa useFormContext()   │  │  - ✅ Fallback a hook       │
└──────────────────────────┘  └─────────────────────────────┘
```

### Solución Propuesta

```typescript
// DateSelector.tsx - DESPUÉS del refactor
export const createDatePicker = (params: {
  formContext?: UseFormReturn<FieldValues>; // ✅ NUEVO: opcional
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers?: { [handlerName: string]: Function };
}) => {
  // ✅ SOLUCIÓN: Usar formContext pasado O fallback a hook
  const hookContext = useFormContext(); // Solo se usa si no viene formContext
  const { control, register: formRegister, formState, setValue } =
    params.formContext || hookContext; // ✅ Backward compatible

  return (
    <Controller
      control={control}
      name={fieldName}
      render={({ field }) => (
        <DatePicker
          value={field.value}
          onChange={(date) => {
            setValue(fieldName, date);
            field.onChange(date);
          }}
        />
      )}
    />
  );
};
```

**Beneficio**: Ahora puedes usar `createDatePicker` de dos formas:

```typescript
// Forma 1: En DynamicForm (sin cambios - backward compatible)
<FormProvider {...methods}>
  <DynamicControl fieldData={field} /> {/* useFormContext() funciona */}
</FormProvider>

// Forma 2: En custom layout (nuevo - pasa formContext)
const methods = useForm();
const datePicker = createDatePicker({
  formContext: methods, // ✅ Pasa explícitamente
  fieldData: field,
  errors: methods.formState.errors,
});
```

## Fases de Implementación (Enfoque Incremental)

### Fase 1: Preparación y Análisis ✅

**Objetivo**: Identificar todos los `create*` functions que necesitan refactor.

**Checklist**:
- [x] Listar todos los archivos en `src/components/shared/organisms/gui/dynamicForms/components/`
- [x] Identificar cuáles usan `useFormContext()`
- [x] Priorizar según uso en PreBookingDialog

**Resultado**:
```
Componentes prioritarios (para PreBookingDialog):
1. DateSelector.tsx - createDatePicker() ⭐ (necesario)
2. TextField.tsx - createTextField() ⭐ (necesario)
3. SelectField.tsx - createSelectField() ⭐ (posible)
4. Autocomplete.tsx - createAutocomplete() ⭐ (necesario)

Componentes secundarios (refactor después):
5. CheckboxGroup.tsx
6. RadioGroup.tsx
7. SwitchField.tsx
... etc
```

---

### Fase 2: Refactorizar DynamicControl (Core)

**Objetivo**: Modificar `DynamicControl` para aceptar y pasar `formContext` opcional.

**Archivo**: `src/components/shared/organisms/gui/dynamicForms/DynamicControl.tsx`

**Checklist**:
- [ ] Agregar `formContext?: UseFormReturn<FieldValues>` a `ComponentGeneratorParams`
- [ ] Obtener contexto de forma híbrida: `formContext || useFormContext()`
- [ ] Pasar `formContext` a todos los `create*` functions
- [ ] Verificar backward compatibility con DynamicForm existente

**Código antes**:
```typescript
export interface ComponentGeneratorParams {
  fieldData: DynamicFieldData;
  formContext: {
    register: UseFormRegister<FieldValues>;
    control: Control<FieldValues>;
    // ... otros
  };
  handlers?: { [handlerName: string]: Function };
}

export const DynamicControl = (params: {
  fieldData: DynamicFieldData;
  handlers?: { [handlerName: string]: Function };
}) => {
  const { register, control, formState, setValue, watch, getValues } = useFormContext();
  const formContext = { register, control, formState, setValue, watch, getValues };

  switch (fieldData.inputType) {
    case 'date':
      return createDatePicker({ register, fieldData, errors: formState.errors, handlers });
    // ...
  }
};
```

**Código después**:
```typescript
export interface ComponentGeneratorParams {
  fieldData: DynamicFieldData;
  formContext: UseFormReturn<FieldValues>; // ✅ Completo
  handlers?: { [handlerName: string]: Function };
}

export const DynamicControl = (params: {
  fieldData: DynamicFieldData;
  formContext?: UseFormReturn<FieldValues>; // ✅ NUEVO: opcional
  handlers?: { [handlerName: string]: Function };
}) => {
  // ✅ Híbrido: usar el pasado o fallback a hook
  const hookContext = useFormContext();
  const finalContext = params.formContext || hookContext;

  const { register, control, formState, setValue, watch, getValues } = finalContext;

  switch (fieldData.inputType) {
    case 'date':
      return createDatePicker({
        formContext: finalContext, // ✅ Pasa completo
        fieldData,
        errors: formState.errors,
        handlers
      });
    // ...
  }
};
```

**Validación**:
```bash
# Verificar que DynamicForm existente sigue funcionando
npm run dev
# Navegar a cualquier formulario existente y verificar que funciona sin cambios
```

---

### Fase 3: Refactorizar create* functions prioritarios

**Objetivo**: Modificar los 4 componentes prioritarios para PreBookingDialog.

#### 3.1. DateSelector.tsx - createDatePicker()

**Archivo**: `src/components/shared/organisms/gui/dynamicForms/components/DateSelector.tsx`

**Checklist**:
- [ ] Agregar `formContext?: UseFormReturn<FieldValues>` a params
- [ ] Reemplazar `useFormContext()` por híbrido
- [ ] Actualizar destructuring para usar `params.formContext`
- [ ] Verificar que funcionan: minDate, maxDate, minAgeInYears, etc.
- [ ] Probar en DynamicForm existente (backward compatibility)

**Código antes**:
```typescript
export const createDatePicker = (params: {
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers?: { [handlerName: string]: Function };
}) => {
  const { control, register: formRegister, formState, setValue } = useFormContext();
  // ...
};
```

**Código después**:
```typescript
export const createDatePicker = (params: {
  formContext?: UseFormReturn<FieldValues>; // ✅ NUEVO
  register: UseFormRegister<FieldValues>;
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers?: { [handlerName: string]: Function };
}) => {
  const hookContext = useFormContext();
  const finalContext = params.formContext || hookContext;
  const { control, register: formRegister, formState, setValue } = finalContext;

  // ✅ Resto del código sin cambios
  // ...
};
```

---

#### 3.2. TextField.tsx - createTextField()

**Archivo**: `src/components/shared/organisms/gui/dynamicForms/components/TextField.tsx`

**Checklist**:
- [ ] Agregar `formContext?: UseFormReturn<FieldValues>` a params
- [ ] Reemplazar `useFormContext()` por híbrido
- [ ] Actualizar destructuring
- [ ] Probar validación (required, pattern, min/max)

**Código antes**:
```typescript
export const createTextField = (params: ComponentGeneratorParams) => {
  const { register, formState } = useFormContext();
  // ...
};
```

**Código después**:
```typescript
export const createTextField = (params: ComponentGeneratorParams & {
  formContext?: UseFormReturn<FieldValues>;
}) => {
  const hookContext = useFormContext();
  const { register, formState } = params.formContext || hookContext;
  // ...
};
```

---

#### 3.3. SelectField.tsx - createSelectField()

**Archivo**: `src/components/shared/organisms/gui/dynamicForms/components/SelectField.tsx`

**Checklist**:
- [ ] Agregar `formContext?: UseFormReturn<FieldValues>` a params
- [ ] Reemplazar `useFormContext()` por híbrido
- [ ] Actualizar destructuring
- [ ] Probar con options estáticas y dinámicas

**Código similar al patrón anterior**.

---

#### 3.4. Autocomplete.tsx - createAutocomplete()

**Archivo**: `src/components/shared/organisms/gui/dynamicForms/components/Autocomplete.tsx`

**Checklist**:
- [ ] Agregar `formContext?: UseFormReturn<FieldValues>` a params
- [ ] Reemplazar `useFormContext()` por híbrido
- [ ] Actualizar destructuring
- [ ] Probar multi-select (para ParticipantSelector)

**Código similar al patrón anterior**.

---

### Fase 4: Implementar PreBookingDialog (Caso de Uso Real)

**Objetivo**: Crear el componente PreBookingDialog usando los `create*` refactorizados.

**Archivo nuevo**: `src/components/shared/organisms/domain/PreBookingDialog/PreBookingRequestDialog.tsx`

**Checklist**:
- [ ] Crear componente con MUI Dialog
- [ ] Crear FormProvider con useForm()
- [ ] Usar `createDatePicker` con formContext explícito
- [ ] Usar `createTextField` con formContext explícito
- [ ] Usar `createAutocomplete` para participantes con formContext explícito
- [ ] Implementar lógica de submit
- [ ] Validar que NO se usa DynamicForm/DynamicTabbedForm

**Código ejemplo**:
```typescript
import { useForm, FormProvider } from 'react-hook-form';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import { createDatePicker } from '~/components/shared/organisms/gui/dynamicForms/components/DateSelector';
import { createTextField } from '~/components/shared/organisms/gui/dynamicForms/components/TextField';

export const PreBookingRequestDialog = ({ open, onClose }) => {
  const methods = useForm<PreBookingFormData>();

  const handleSubmit = methods.handleSubmit((data) => {
    console.log('PreBooking data:', data);
    // Dispatch action to create prebooking
  });

  // ✅ Crear componentes pasando formContext explícitamente
  const startDatePicker = createDatePicker({
    formContext: methods, // ✅ Sin FormProvider necesario
    fieldData: {
      fieldName: 'requested_date_start',
      label: 'Fecha de inicio',
      inputType: 'date',
      config: { required: true },
      componentParams: { disablePast: true },
    },
    register: methods.register,
    errors: methods.formState.errors,
  });

  const endDatePicker = createDatePicker({
    formContext: methods,
    fieldData: {
      fieldName: 'requested_date_end',
      label: 'Fecha de fin',
      inputType: 'date',
      config: { required: true },
      componentParams: { disablePast: true },
    },
    register: methods.register,
    errors: methods.formState.errors,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Nueva Solicitud de Vorreservierung</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {/* ✅ Renderizar sin FormProvider */}
          {startDatePicker}
          {endDatePicker}
          {/* Agregar más campos */}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancelar</Button>
          <Button type="submit" variant="contained">Crear Solicitud</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
```

**Validación**:
```bash
# Abrir PreBookingDialog
# Verificar que los DatePickers funcionan correctamente
# Verificar validación de campos requeridos
# Verificar que submit funciona
```

---

### Fase 5: Testing y Rollout

**Objetivo**: Verificar backward compatibility y funcionamiento del nuevo caso de uso.

**Checklist**:
- [ ] Probar DynamicForm existente (sin cambios en código)
  - [ ] Formularios de artistas
  - [ ] Formularios de eventos
  - [ ] Formularios de perfiles
- [ ] Probar DynamicTabbedForm existente
  - [ ] Tabs y sections funcionan
  - [ ] Validación entre tabs
- [ ] Probar PreBookingDialog (nuevo)
  - [ ] Campos se renderizan correctamente
  - [ ] Validación funciona
  - [ ] Submit funciona
- [ ] Probar edge cases
  - [ ] Campos condicionales (handlers)
  - [ ] Valores por defecto
  - [ ] Campos deshabilitados

**Scripts de prueba**:
```bash
# Ejecutar suite de pruebas
npm run test

# Ejecutar en dev para pruebas manuales
npm run dev
```

---

## Comparación Antes/Después

### Antes del Refactor

```typescript
// ❌ IMPOSIBLE: No puedes usar createDatePicker fuera de FormProvider
const PreBookingDialog = () => {
  const methods = useForm();

  // ❌ ERROR: createDatePicker llama useFormContext() internamente
  // y no hay FormProvider ancestor
  const datePicker = createDatePicker({
    fieldData: { /* ... */ },
    register: methods.register,
    errors: methods.formState.errors,
  });

  return <Dialog>{datePicker}</Dialog>;
};
```

### Después del Refactor

```typescript
// ✅ POSIBLE: Pasa formContext explícitamente
const PreBookingDialog = () => {
  const methods = useForm();

  // ✅ FUNCIONA: formContext se pasa explícitamente
  const datePicker = createDatePicker({
    formContext: methods, // ✅ NUEVO parámetro
    fieldData: { /* ... */ },
    register: methods.register,
    errors: methods.formState.errors,
  });

  return <Dialog>{datePicker}</Dialog>;
};

// ✅ BACKWARD COMPATIBLE: DynamicForm sigue funcionando sin cambios
const MyForm = () => (
  <DynamicForm
    fields={[/* ... */]}
    onSubmit={handleSubmit}
  />
  // Internamente usa FormProvider y useFormContext() como antes
);
```

---

## Consideraciones Técnicas

### 1. Backward Compatibility

**Garantía**: Todo código existente sigue funcionando sin cambios.

**Mecanismo**:
```typescript
const hookContext = useFormContext(); // Fallback
const finalContext = params.formContext || hookContext; // Híbrido
```

Si `params.formContext` existe, usa ese. Si no, usa `useFormContext()` como antes.

### 2. TypeScript Safety

**Tipo actualizado**:
```typescript
export interface ComponentGeneratorParams {
  formContext?: UseFormReturn<FieldValues>; // ✅ Opcional
  fieldData: DynamicFieldData;
  handlers?: { [handlerName: string]: Function };
}
```

**Ventaja**: TypeScript forzará a pasar `formContext` cuando lo uses fuera de FormProvider.

### 3. Performance

**Sin impacto**: El refactor no agrega overhead. Solo cambia de dónde viene el contexto.

### 4. Testing

**Estrategia**:
1. Tests de regresión: Verificar que formularios existentes funcionan
2. Tests unitarios: Verificar create* con y sin formContext
3. Tests de integración: Verificar PreBookingDialog completo

---

## Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Romper formularios existentes | Media | Alto | Mantener fallback a `useFormContext()` |
| TypeScript errors en código existente | Baja | Medio | Hacer `formContext` opcional |
| Performance degradation | Muy Baja | Bajo | No agrega lógica compleja |
| Olvidar refactorizar algún create* | Media | Medio | Checklist exhaustivo en Fase 3 |

---

## Decisiones Pendientes

### 1. ¿Refactorizar TODOS los create* o solo los necesarios?

**Decisión tomada**: Solo refactorizar los 4 prioritarios para PreBookingDialog (Enfoque C - Incremental).

**Razón**: Minimizar riesgo y trabajo. Refactorizar el resto cuando sea necesario.

### 2. ¿Crear componentes standalone o solo refactorizar create*?

**Decisión tomada**: Solo refactorizar `create*` functions (Opción 2).

**Razón**: Posiblemente no se necesiten standalone components. Si se necesitan más adelante, se pueden crear.

### 3. ¿Mantener createDatePickerAnterior()?

**Recomendación**: Eliminar después de verificar que nadie lo usa.

```bash
# Verificar uso
grep -r "createDatePickerAnterior" src/
```

Si no hay resultados, eliminar la función.

---

## Próximos Pasos

1. **Validar este plan con el equipo** ✅ (Esperando aprobación)
2. **Comenzar Fase 2**: Refactorizar `DynamicControl.tsx`
3. **Continuar con Fase 3**: Refactorizar 4 create* prioritarios
4. **Implementar Fase 4**: Crear `PreBookingRequestDialog.tsx`
5. **Ejecutar Fase 5**: Testing y validación completa

---

## Referencias

- **Archivo base**: [DynamicControl.tsx](src/components/shared/organisms/gui/dynamicForms/DynamicControl.tsx)
- **Ejemplo existente**: [DateSelector.tsx](src/components/shared/organisms/gui/dynamicForms/components/DateSelector.tsx)
- **Dialog de referencia**: [AppDialog.tsx](src/components/shared/molecules/general/Modals/Dialog/AppDialog.tsx)
- **React Hook Form docs**: https://react-hook-form.com/api/useformcontext

---

## Apéndice: Lista Completa de create* Functions

```
src/components/shared/organisms/gui/dynamicForms/components/
├── Autocomplete.tsx - createAutocomplete() ⭐ Prioridad 1
├── CheckboxGroup.tsx - createCheckboxGroup()
├── DateSelector.tsx - createDatePicker() ⭐ Prioridad 1
├── RadioGroup.tsx - createRadioGroup()
├── SelectField.tsx - createSelectField() ⭐ Prioridad 1
├── SwitchField.tsx - createSwitchField()
├── TextField.tsx - createTextField() ⭐ Prioridad 1
└── ... (otros)
```

**Leyenda**:
- ⭐ Prioridad 1: Necesario para PreBookingDialog (refactorizar ahora)
- Sin estrella: Refactorizar cuando sea necesario

---

**Fin del Plan de Refactorización**

Este plan será ejecutado paso a paso, validando cada fase antes de continuar con la siguiente.
