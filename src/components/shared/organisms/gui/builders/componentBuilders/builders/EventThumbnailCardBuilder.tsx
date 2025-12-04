import { EventThumbnailCard } from '~/components/shared/molecules/Profile/EventThumbnailCard/EventThumbnailCard';
import { EventModel } from '~/models/domain/event/event.model';
import { ComponentBuilderParams, ComponentBuilderFunction } from '../types';
import { buildComponent } from '../ComponentBuilder';

/**
 * Builder para EVENT_THUMBNAIL_CARD
 *
 * Características:
 * - Soporta arrays de eventos
 * - Agrupa eventos por mes/año con títulos
 * - Soporta componentes footer anidados
 * - Maneja click handlers
 */
export const createEventThumbnailCardComponent: ComponentBuilderFunction = (
  params: ComponentBuilderParams
): JSX.Element => {
  const { componentDescriptor, entityData, section, handlers } = params;

  // Extraer data source
  const data: any = entityData[componentDescriptor.data?.data_source as keyof typeof entityData];
  let elements = Array.isArray(data) ? data : [data];

  // Configurar footer si existe
  let footer: any = () => <></>;
  const footerDescriptor = componentDescriptor.data?.footer;

  if (footerDescriptor?.components) {
    footer = (element: any) => {
      return (footerDescriptor.components || []).map((footerComponent: any, idx: number) => {
        return buildComponent({
          ...params,
          componentDescriptor: footerComponent,
          componentIndex: idx,
          parentDataSource: element,
        });
      });
    };
  }

  // Click handler
  const clickHandlerName = section.clickHandlerName || componentDescriptor.clickHandlerName;
  const onClickCard = clickHandlerName ? handlers?.[clickHandlerName] : undefined;

  // Renderizar eventos con agrupación por mes
  return (
    <>
      {(elements || []).map((element, index, eventsArray) => {
        const event = new EventModel(element);
        const previous = index > 0 ? new EventModel(eventsArray[index - 1]) : undefined;

        // Verificar si es el mismo mes/año que el evento anterior
        const sameMonth = previous?.timetable__initial_date.month() === event.timetable__initial_date.month();
        const sameYear = previous?.timetable__initial_date?.year() === event.timetable__initial_date.year();

        return (
          <div key={`event-thumbnail-wrapper-${index}`}>
            {/* Título de mes (solo si cambia el mes) */}
            {!sameMonth && (
              <h3 className="month-title">
                {event.timetable__initial_date.format(`MMMM${!!previous && !sameYear ? ' / YYYY' : ''}`)}
              </h3>
            )}

            {/* Card del evento */}
            <EventThumbnailCard
              key={`event-thumbnail-${index}`}
              elementData={event}
              footer={footer}
              callbacks={{
                onClickCard,
              }}
            />
          </div>
        );
      })}
    </>
  );
};
