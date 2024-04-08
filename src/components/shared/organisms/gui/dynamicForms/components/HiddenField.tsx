import { ComponentGeneratorParams } from '../DynamicControl';

export const createHiddenField = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register } = params || {};

  const { label, fieldName, options = [], config } = fieldData;

  const { required } = config || {};

  return (
    <>
      <input {...register(fieldName, config)} type="hidden" />
    </>
  );
};
