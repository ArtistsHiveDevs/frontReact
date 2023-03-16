import IconFieldReadOnly from "~/components/shared/atoms/IconField";
import { RequireAuthComponent } from "~/components/shared/atoms/app/auth/RequiredAuth";
import "./index.scss";

export interface IconDetailedAttribute {
  name: string;
  title?: string;
  customTitle?: boolean;
  icon?: string;
  value: string;
  requireSession?: boolean;
}
export const AttributesIconFieldReadOnly = (props: any) => {
  const { title, attributes, useDivInValue, useColon } = props;

  return (
    <>
      {title && <h3>{title}</h3>}
      {attributes?.map((attribute: IconDetailedAttribute, idx: number) => {
        return (
          <RequireAuthComponent
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
            />
          </RequireAuthComponent>
        );
      })}
    </>
  );
};
