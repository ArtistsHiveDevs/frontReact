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
import { createFileUpload } from './components/FileUpload';
import { createRadio } from './components/Radio';
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

  switch (inputType) {
    // Campos de texto
    case 'text':
    case 'password':
    case 'tel':
    case 'number':
    case 'url':
      return createTextField({ register, fieldData, errors, handlers });
    case 'address':
      return createAddressTextField({ register, fieldData, errors });
    case 'socialNetwork':
      return createSocialNetworkTextField({ register, fieldData, errors });

    // Área de texto
    case 'textarea':
      return createTextArea({ register, fieldData, errors });

    // Ubicación
    case 'citySelector':
      return createCitySelect({ fieldData, handlers });

    // Opciones y selección múltiple
    case 'chipPicker':
      return createChipPicker({ register, fieldData, errors, handlers });
    case 'select':
      return createSelect({ register, fieldData, errors, handlers });
    case 'checkbox':
      return createCheckbox({
        register,
        getValues,
        watch,
        fieldData,
        errors,
        handlers,
      });
    case 'radio':
      return createRadio({ register, fieldData, errors });

    // Rangos
    case 'range':
      return createSlider({ register, fieldData, errors });

    // Fechas y horas
    case 'datetime':
    case 'date':
    case 'time':
    case 'month':
    case 'week':
      return createTimeField({ register, fieldData, errors });

    // Carga de archivos
    case 'file':
      return createFileUpload({ register, fieldData, errors });

    default:
      fieldData.inputType = 'text';
      return createTextField({ register, fieldData, errors });
  }
};
