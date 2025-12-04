import { ProfileThumbnailCard } from '~/components/shared/molecules/Profile/ProfileThumbnailCard';
import { ComponentBuilderParams } from '../types';
import { buildComponent } from '../ComponentBuilder';

export const createProfileThumbnailCardComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData, parentDataSource, handlers, section, subpage } = params;

  // Data source
  const propertyPath = componentDescriptor.data?.data_source?.split('.') || [];
  const data =
    propertyPath.reduce((previous: any, current: any) => {
      return previous ? previous[current as keyof typeof previous] : '';
    }, entityData) || '';

  let elements = [];
  if (Array.isArray(data)) {
    elements = data;
  } else if (data) {
    elements.push(data);
  }

  // Footers
  let footer: any = undefined;
  const footerDescriptor = componentDescriptor.data?.footer;

  if (footerDescriptor?.components) {
    footer = (element: any) => {
      return (footerDescriptor.components || []).map(
        (footerComponent: any, idx: number) => {
          return buildComponent({
            ...params,
            componentDescriptor: footerComponent,
            componentIndex: idx,
            parentDataSource: element,
          });
        }
      );
    };
  } else if (footerDescriptor && typeof footerDescriptor === 'function') {
    footer = (element: any) => footerDescriptor(element);
  }

  // Avatar Size
  const avatarSize = componentDescriptor.data?.avatarSize;

  return (
    <>
      {(elements || []).map((element, index) => (
        <ProfileThumbnailCard
          key={`${section.name}-profile-thumbnail-${index}`}
          elementData={element}
          footer={() => footer?.(element)}
          avatarSize={avatarSize}
          callbacks={{
            onClickCard: (elementData: any) => {
              if (componentDescriptor.clickHandlerName && handlers) {
                handlers[componentDescriptor.clickHandlerName](elementData);
              }
            },
          }}
        />
      ))}
    </>
  );
};
