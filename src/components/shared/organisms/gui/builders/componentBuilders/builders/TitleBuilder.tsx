import { Title } from '~/components/shared/atoms/Title/Title';
import { ComponentBuilderParams } from '../types';

export const createTitleComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, handlers } = params;

  let clickHandler: Function | undefined = undefined;

  if (componentDescriptor.clickHandlerName && handlers) {
    clickHandler = handlers[componentDescriptor.clickHandlerName];
  }

  return (
    <Title
      title={componentDescriptor.data?.title}
      size={componentDescriptor.data?.size || '2'}
      onClickHandler={clickHandler}
    />
  );
};
