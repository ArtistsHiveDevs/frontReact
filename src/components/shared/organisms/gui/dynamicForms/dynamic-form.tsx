import { Button, Stack } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';

import { useI18n } from '~/common/utils';
import { DynamicControl } from './DynamicControl';
import { DynamicFieldData } from './dynamic-control-types';
import './dynamic-form.scss';

interface FormProps {
  fields: DynamicFieldData[];
  handlers: { onSubmit: Function; [handlerName: string]: Function };
  translationBasePath: string;
  entityType: string;
}

const TRANSLATION_GLOBAL_DICTIONARY = 'app.global_dictionary';

export const DynamicForm = (props: FormProps) => {
  const { fields, handlers } = props;
  const formMethods = useForm();
  const { translateText } = useI18n();
  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const onSubmit: any = handlers['onSubmit'];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="fullwidth">
      <FormProvider {...formMethods}>
        <Stack spacing={2}>
          {fields.map((d, i) => (
            <div key={i}>
              <DynamicControl fieldData={d} handlers={{ ...handlers }} errors={{ ...errors }} />
            </div>
          ))}
          <Button type="submit" variant="contained">
            {translateText(`${TRANSLATION_GLOBAL_DICTIONARY}.actions.submit`)}
          </Button>
        </Stack>
      </FormProvider>
    </form>
  );
};
