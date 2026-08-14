import { CalendarSimpleLayout } from '~/components/shared/molecules/general/calendar/CalendarSimpleLayout/CalendarSimpleLayout';
import { EventModel } from '~/models/domain/event/event.model';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';

export const createCalendarSimpleLayoutComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, handlers } = params;

  const eventsInfo: EventModel[] = getData(componentDescriptor.data?.data_source, entityData) || [];

  let clickHandler: Function | undefined = undefined;

  if (componentDescriptor.clickHandlerName && handlers) {
    clickHandler = handlers[componentDescriptor.clickHandlerName];
  }

  return (
    <CalendarSimpleLayout
      resourceEntity={entityData}
      events={eventsInfo}
      onClickHandler={clickHandler}
      options={componentDescriptor.data?.options}
    />
  );
};
