import { ErrorMessage } from "@hookform/error-message";
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
    formState: { isSubmitting, errors },
  } = formMethods;

  function onSubmit(data: any, error: any) {
    // your logic on what to do with data
    console.log(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormProvider {...formMethods}>
        {fields.map((d, i) => (
          <div key={i}>
            <label htmlFor={d.fieldName}>{d.label}</label>
            <DynamicControl {...d} />
            <ErrorMessage errors={errors} name={d.fieldName} />
          </div>
        ))}
      </FormProvider>
      <button type="submit">Submit</button>
    </form>
  );
};
