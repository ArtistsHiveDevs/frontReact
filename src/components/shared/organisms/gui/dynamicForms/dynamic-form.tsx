import { Button, Stack } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { DynamicControl } from "./DynamicControl";
import { DynamicFieldData } from "./dynamic-control-types";

interface FormProps {
  fields: DynamicFieldData[];
}

export const DynamicForm = ({ fields }: FormProps) => {
  const formMethods = useForm();
  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  function onSubmit(data: any, error: any) {
    // your logic on what to do with data
    console.log("ASDASDADASD");
    console.log("###  ", data, error);

    console.log(errors);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FormProvider {...formMethods}>
        <Stack spacing={2}>
          {fields.map((d, i) => (
            <div key={i}>
              <DynamicControl fields={d} errors={{ ...errors }} />
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
