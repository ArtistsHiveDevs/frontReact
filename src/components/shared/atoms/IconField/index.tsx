import DynamicIcons from "~/components/shared/DynamicIcons";
import "./index.scss";

const IconFieldReadOnly = (props: any) => {
  let { fieldName, fieldTitle, icon, fieldValue } = props;
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
            {fieldTitle && <strong>{fieldTitle}: </strong>}
            {renderFieldValue}
          </>
        </span>
      </p>
    </>
  );
};

export default IconFieldReadOnly;
