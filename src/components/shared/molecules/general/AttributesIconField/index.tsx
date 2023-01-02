import "./index.scss";
import IconFieldReadOnly from "~/components/shared/atoms/IconField";

export interface IconDetailedAttribute {
  name: string;
  title?: string;
  icon?: string;
  value: string;
}
export const AttributesIconFieldReadOnly = (props: any) => {
  const { attributes } = props;

  return (
    <>
      {attributes?.map((attribute: IconDetailedAttribute, idx: number) => {
        return (
          <IconFieldReadOnly
            key={`attr-icon-field-${idx}`}
            icon={attribute?.icon}
            fieldName={attribute.title}
            fieldValue={attribute.value}
          />
        );
      })}
    </>
  );
};
