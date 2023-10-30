import { DynamicIcons } from "~/components/shared/DynamicIcons";
import { SocialNetworks } from "~/constants/social-networks.const";
import "./index.scss";

const IconFieldReadOnly = (props: any) => {
  let { fieldName, fieldTitle, icon, fieldValue } = props;
  let renderFieldValue = fieldValue;
  const socialNetwork = SocialNetworks[fieldName];
  if (!!socialNetwork && typeof fieldValue === "string") {
    if (fieldValue && socialNetwork.url !== undefined) {
      const domainPrefix = socialNetwork.url ? `${socialNetwork.url}/` : "";
      renderFieldValue = (
        <a href={`${domainPrefix}${fieldValue}`} target="_blank">{`${
          socialNetwork.user_prefix || ""
        }${fieldValue}`}</a>
      );
    }

    if (!icon) {
      icon = socialNetwork.icon;
    }
  }
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
