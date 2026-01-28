import { FormControl } from '@mui/base';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ComponentGeneratorParams } from '../DynamicControl';

export const createIconTextButton = (params: ComponentGeneratorParams) => {
  const { errors, register, fieldData, handlers } = params;
  const { label, fieldName, options = [], config, icon } = fieldData;

  const { required } = config || {};

  return (
    <>
      <FormControl>
        <div
          onClick={() => {
            if (handlers[`on${fieldName}Click`]) {
              handlers[`on${fieldName}Click`]();
            }
          }}
        >
          {label}
          <DynamicIcons iconName={icon || 'FaAccessibleIcon'} size={20} />
        </div>
      </FormControl>
    </>
  );
};
