import IconFieldReadOnly from "~/components/shared/atoms/IconField";
import RequireAuthComponent from "~/components/shared/atoms/IconField/app/auth/RequiredAuth";
import "./index.scss";

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
          <RequireAuthComponent
            key={`attr-icon-field-${idx}`}
            requiredSession={attribute.requireSession}
          >
            <IconFieldReadOnly
              fieldName={attribute.name}
              fieldTitle={attribute.title}
              icon={attribute?.icon}
              fieldValue={attribute.value}
            />
          </RequireAuthComponent>
        );
      })}
    </>
  );
};
