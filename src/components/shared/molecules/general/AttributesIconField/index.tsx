import IconFieldReadOnly from '~/components/shared/atoms/IconField';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import './index.scss';

export interface IconDetailedAttribute {
  name: string;
  title?: string;
  customTitle?: boolean;
  icon?: string;
  value: string;
  requireSession?: boolean;
}

export interface AttributesIconFieldReadOnlyProps {
  title?: string;
  attributes?: IconDetailedAttribute[];
  useDivInValue?: boolean;
  useColon?: boolean;
  direction?: string;
  resourceEntity: any;
  className?: string;
}

export const AttributesIconFieldReadOnly = (props: AttributesIconFieldReadOnlyProps) => {
  const { title, attributes, useDivInValue, useColon, direction, resourceEntity, className } = props;

  return (
    <div className={className}>
      {title && <h3>{title}</h3>}
      {attributes?.map((attribute: IconDetailedAttribute, idx: number) => {
        return (
          <RequireAuthComponent
            resourceEntity={resourceEntity}
            key={`attr-icon-field-${idx}`}
            requiredSession={attribute.requireSession}
          >
            <IconFieldReadOnly
              fieldName={attribute.name}
              fieldTitle={attribute.title}
              customTitle={attribute.customTitle}
              icon={attribute?.icon}
              fieldValue={attribute.value}
              useDivInValue={useDivInValue}
              useColon={useColon}
              direction={direction}
            />
          </RequireAuthComponent>
        );
      })}
    </div>
  );
};
