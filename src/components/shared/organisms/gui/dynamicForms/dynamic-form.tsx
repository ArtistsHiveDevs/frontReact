import { Button, FormLabel, Stack } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import { useEffect, useState } from 'react';
import { ErrorType } from '~/common/slices/app-base/APIKey/types';
import { I18nPaths, useI18n } from '~/common/utils';
import { AppErrorCodes } from '~/constants/app.errors';
import { DynamicControl } from './DynamicControl';
import { DynamicFieldData } from './dynamic-control-types';
import './dynamic-form.scss';

interface FormProps {
  fields: DynamicFieldData[];
  handlers: { onSubmit: Function; [handlerName: string]: Function };
  translationBasePath: string;
  entityType: string;
  submitLabel?: string;
  errors?: ErrorType;
}

export const DynamicForm = (props: FormProps) => {
  const { fields, handlers, submitLabel, errors: responseErrors } = props;
  const [responseErrorsRender, setResponseErrorsRender] = useState([]);
  const formMethods = useForm();
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="fullwidth">
      <FormProvider {...formMethods}>
        <Stack spacing={2}>
          {fields.map((d, i) => (
            <div key={i}>
              <DynamicControl fieldData={d} handlers={{ ...handlers }} errors={{ ...errors }} />
            </div>
          ))}

          {responseErrorsRender?.length > 0 &&
            responseErrorsRender.map((error, index) => (
              <FormLabel error key={`error-${index}`}>
                {translateError(error?.error?.errorCode || AppErrorCodes.UNKNOWN_ERROR)}
              </FormLabel>
            ))}
          <Button type="submit" variant="contained">
            {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.${submitLabel || 'submit'}`)}
          </Button>
        </Stack>
      </FormProvider>
    </form>
  );
};
