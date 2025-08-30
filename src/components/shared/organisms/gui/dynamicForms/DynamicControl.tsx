import {
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormRegister,
  UseFormWatch,
  useFormContext,
} from 'react-hook-form';
import { createCheckbox } from './components/Checkbox';
import { createChipPicker } from './components/ChipPicker';
import { createCitySelect } from './components/CitySelector';
import { createDatePicker } from './components/DateSelector';
import { createFileUpload } from './components/FileUpload';
import { createHiddenField } from './components/HiddenField';
import { createInstrumentSelector } from './components/InstrumentSelector';
import { createRadio } from './components/Radio';
import { createRelationshipSelector } from './components/RelationshipSelector';
import { createSelect } from './components/Select';
import { createSlider } from './components/Slider';
import { createTextArea } from './components/TextArea';
import { createAddressTextField, createSocialNetworkTextField, createTextField } from './components/TextField';
import { createTimeField } from './components/TimeField';
import { DynamicFieldData } from './dynamic-control-types';

export interface ComponentGeneratorParams {
  errors?: FieldErrors<FieldValues>;
  fieldData: DynamicFieldData;
  getValues?: UseFormGetValues<FieldValues>;
  handlers?: { [handlerName: string]: Function };
  register?: UseFormRegister<FieldValues>;
  watch?: UseFormWatch<FieldValues>;
  formContext?: any;
}

export const DynamicControl = (params: {
  fieldData: DynamicFieldData;
  errors: FieldErrors<FieldValues>;
  handlers: { [handlerName: string]: Function };
  control?: any;
}) => {
  const { fieldData, errors, handlers } = params;
  const { register, getValues, watch } = useFormContext() || {};

  const { inputType }: DynamicFieldData = fieldData;
  const fieldParams = {
    register,
    getValues,
    watch,
    fieldData,
    errors,
    handlers,
  };

  switch (inputType) {
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
    case 'select':
      return createSelect(fieldParams);
    case 'checkbox':
      return createCheckbox(fieldParams);
    case 'radio':
      return createRadio(fieldParams);

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

    default:
      fieldData.inputType = 'text';
      return createTextField(fieldParams);
  }
};
