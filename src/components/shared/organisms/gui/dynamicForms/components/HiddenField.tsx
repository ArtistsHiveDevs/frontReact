import { ComponentGeneratorParams } from '../DynamicControl';

export const createHiddenField = (params: ComponentGeneratorParams) => {
  const { errors, fieldData, register } = params || {};

  const { label, fieldName, options = [], config, componentParams } = fieldData;

  const { render = <></> } = componentParams || {};

  const { required } = config || {};

  return (
    <>
      <input {...register(fieldName, config)} type="hidden" />
      {render}
    </>
  );
};
