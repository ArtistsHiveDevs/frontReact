import { Button, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { DynamicControl } from "./DynamicControl";
import { DynamicFieldData } from "./dynamic-control-types";
import "./dynamic-form.scss";

interface FormProps {
  fields: DynamicFieldData[];
  handlers: { onSubmit: Function; [handlerName: string]: Function };
}

export const DynamicForm = (props: FormProps) => {
  const { fields, handlers } = props;
  const formMethods = useForm();
  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  const onSubmit: any = handlers["onSubmit"];

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="fullwidth">
      <FormProvider {...formMethods}>
        <Stack spacing={2}>
          {fields.map((d, i) => (
            <div key={i}>
              <DynamicControl
                fieldData={d}
                handlers={{ ...handlers }}
                errors={{ ...errors }}
              />
            </div>
          ))}
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Stack>
      </FormProvider>
    </form>
  );
};
