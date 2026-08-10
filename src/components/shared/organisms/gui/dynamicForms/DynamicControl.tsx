import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormReturn,
  UseFormWatch,
  useFormContext,
} from 'react-hook-form';
import { createAutocompletePicker } from './components/AutocompletePicker';
import { createCheckbox } from './components/Checkbox';
import { createChipPicker } from './components/ChipPicker';
import { createCitySelect } from './components/CitySelector';
import { createDatePicker } from './components/DateSelector';
import { createFileUpload } from './components/FileUpload';
import { createHiddenField } from './components/HiddenField';
import { createIconTextButton } from './components/IconTextButton';
import { createInstrumentSelector } from './components/InstrumentSelector';
import { createRadio } from './components/Radio';
import { createRelationshipSelector } from './components/RelationshipSelector';
import { createSelect } from './components/Select';
import { createSlider } from './components/Slider';
import { createSwitch } from './components/Switch';
import { createTextArea } from './components/TextArea';
import { createAddressTextField, createSocialNetworkTextField, createTextField } from './components/TextField';
import { createTimeField } from './components/TimeField';
import { DynamicFieldData } from './dynamic-control-types';
import { createMembersList } from './components/MembersList';

export interface ComponentGeneratorParams {
  errors: FieldErrors<FieldValues>;
  fieldData: DynamicFieldData;
  getValues?: UseFormGetValues<FieldValues>;
  handlers?: { [handlerName: string]: Function };
  register: UseFormRegister<FieldValues>;
  watch?: UseFormWatch<FieldValues>;
  formContext?: UseFormReturn<FieldValues>;
}

export const DynamicControl = (params: {
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers: { [handlerName: string]: Function };
  formContext?: UseFormReturn<FieldValues>;
  control?: any;
}) => {
  const { fieldData, errors, handlers, formContext: externalContext } = params;

  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;

  // Extraer métodos del contexto final
  const { register, getValues, watch } = finalContext || {};

  const { inputType }: DynamicFieldData = fieldData;
  const fieldParams: ComponentGeneratorParams = {
    register,
    getValues,
    watch,
    fieldData,
    errors,
    handlers,
    formContext: finalContext,
  };

  switch (inputType) {
    // Botones
    case 'iconTextButton':
      return createIconTextButton(fieldParams);

    // Campos de texto
    case 'text':
    case 'password':
    case 'tel':
    case 'number':
    case 'url':
      return createTextField(fieldParams);
    case 'address':
      return createAddressTextField(fieldParams);
    case 'socialNetwork':
      return createSocialNetworkTextField(fieldParams);

    // Área de texto
    case 'textarea':
      return createTextArea(fieldParams);

    // Ubicación
    case 'citySelector':
      return createCitySelect(fieldParams);

    // Opciones y selección múltiple
    case 'chipPicker':
      return createChipPicker(fieldParams);
    case 'autocompletePicker':
      return createAutocompletePicker(fieldParams);
    case 'select':
      return createSelect(fieldParams);
    case 'checkbox':
      return createCheckbox(fieldParams);
    case 'radio':
      return createRadio(fieldParams);
    case 'switch':
      return createSwitch(fieldParams);

    // Rangos
    case 'range':
    case 'interval':
      return createSlider(fieldParams);

    // Fechas y horas
    case 'date':
    case 'dateInterval':
      return createDatePicker(fieldParams);
    case 'time':
      return createTimeField(fieldParams);
    // case 'datetime':
    // case 'month':
    // case 'week':

    // Carga de archivos
    case 'file':
      return createFileUpload(fieldParams);

    // Relaciones a otras entidades
    case 'relationship':
      return createRelationshipSelector(fieldParams);

    // Relación de instrumentos interpretados
    case 'instrumentSelector':
      return createInstrumentSelector(fieldParams);

    // Campos ocultos
    case 'hidden':
      return createHiddenField(fieldParams);

    // Lista de miembros
    case 'membersList':
      return createMembersList(fieldParams);

    default:
      fieldData.inputType = 'text';
      return createTextField(fieldParams);
  }
};
