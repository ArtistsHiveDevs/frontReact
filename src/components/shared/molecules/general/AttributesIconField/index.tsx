import "./index.scss";
import IconFieldReadOnly from "~/components/shared/atoms/IconField";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";

export interface IconDetailedAttribute {
  name: string;
  title?: string;
  icon?: string;
  value: string;
  requireSession?: boolean;
}
export const AttributesIconFieldReadOnly = (props: any) => {
  const { attributes } = props;

  return (
    <>
      {attributes?.map((attribute: IconDetailedAttribute, idx: number) => {
        return (
          <RequireAuthComponent requiredSession={attribute.requireSession}>
            <IconFieldReadOnly
              key={`attr-icon-field-${idx}`}
              icon={attribute?.icon}
              fieldName={attribute.title}
              fieldValue={attribute.value}
            />
          </RequireAuthComponent>
        );
      })}
    </>
  );
};
