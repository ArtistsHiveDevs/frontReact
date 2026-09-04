import { Button, FormLabel, Stack } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import { useEffect, useState } from 'react';
import { ErrorType } from '~/common/slices/app-base/APIKey/types';
import { I18nPaths, useI18n } from '~/common/utils';
import { AppErrorCodes } from '~/constants/app.constants';
import { DynamicControl } from './DynamicControl';
import { DynamicFieldData } from './dynamic-control-types';
import './dynamic-form.scss';

interface FormProps {
  fields: DynamicFieldData[];
  handlers: { onSubmit?: Function; [handlerName: string]: Function };
  translationBasePath: string;
  submitLabel?: string;
  errors?: ErrorType;
  styles?: { className?: string; spacing?: number };
  formMethods?: any;
  fieldOptions?: { [fieldName: string]: any[] | { [nestedFieldName: string]: any[] } };
  hideSubmitButton?: boolean;
  useExternalForm?: boolean;
}

export const DynamicForm = (props: FormProps) => {
  const {
    fields,
    handlers,
    submitLabel,
    errors: responseErrors,
    styles,
    formMethods: externalFormMethods,
    fieldOptions,
    hideSubmitButton = false,
    useExternalForm = false,
  } = props;
  const [responseErrorsRender, setResponseErrorsRender] = useState([]);
  const internalFormMethods = useForm();
  const formMethods = externalFormMethods || internalFormMethods;
  const { translateError, translateText } = useI18n();
  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const onSubmit: any = handlers['onSubmit'];

  useEffect(() => {
    if (!!responseErrors) {
      if (Array.isArray(responseErrors)) {
        setResponseErrorsRender(responseErrors.filter((error) => !!error?.error));
      } else {
        if (responseErrors.error) {
          setResponseErrorsRender([responseErrors]);
        }
      }
    } else {
      setResponseErrorsRender([]);
    }
  }, [responseErrors]);

  const formContent = (
    <Stack spacing={styles?.spacing || 2}>
      {fields.map((d, i) => {
        let fieldDataWithOptions = d;
        if (fieldOptions && fieldOptions[d.fieldName]) {
          const fieldOption = fieldOptions[d.fieldName];
          if (Array.isArray(fieldOption)) {
            fieldDataWithOptions = { ...d, options: fieldOption };
          } else {
            fieldDataWithOptions = { ...d, nestedOptions: fieldOption };
          }
        }

        return (
          <div key={d.fieldName || i}>
            <DynamicControl
              fieldData={fieldDataWithOptions}
              handlers={{ ...handlers }}
              errors={{ ...errors }}
              formContext={formMethods}
            />
          </div>
        );
      })}

      {responseErrorsRender?.length > 0 &&
        responseErrorsRender.map((error, index) => (
          <FormLabel error key={`error-${index}`}>
            {translateError(error?.error?.errorCode || AppErrorCodes.UNKNOWN_ERROR)}
          </FormLabel>
        ))}
      {!hideSubmitButton && (
        <Button type="submit" variant="contained">
          {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.${submitLabel || 'submit'}`)}
        </Button>
      )}
    </Stack>
  );

  if (useExternalForm) {
    return formContent;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(onSubmit)();
      }}
      noValidate
      className={`${styles?.className || ''} fullwidth`.trim()}
    >
      <FormProvider {...formMethods}>
        {formContent}
      </FormProvider>
    </form>
  );
};
