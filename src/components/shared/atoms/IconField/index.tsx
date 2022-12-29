import { DynamicIcons } from "~/components/shared/DynamicIcons";
import "./index.scss";

const IconFieldReadOnly = (props: any) => {
  const { icon, fieldName, fieldValue } = props;
  return (
    <>
      <p className="info-line">
        {icon && (
          <span>
            <DynamicIcons iconName={icon} size={20} color="#7a260a" />
          </span>
        )}
        <span>
          <>
            {fieldName && <strong>{fieldName}: </strong>}
            {fieldValue}
          </>
        </span>
      </p>
    </>
  );
};

export default IconFieldReadOnly;
