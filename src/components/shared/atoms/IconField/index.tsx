import DynamicIcons from "~/components/shared/DynamicIcons";
import {
  buildSocialNetworkLinkData,
  SocialNetworks,
} from "~/constants/social-networks.const";
import "./index.scss";

const IconFieldReadOnly = (props: any) => {
  let {
    fieldName,
    fieldTitle,
    icon,
    fieldValue,
    customTitle,
    emptyTitle,
    useDivInValue,
  } = props;
  let renderFieldValue = fieldValue;
  const socialNetwork = SocialNetworks[fieldName];

  if (!!socialNetwork) {
    if (
      typeof fieldValue === "string" ||
      typeof fieldValue === "number" ||
      typeof fieldValue === undefined
    ) {
      if (fieldValue && socialNetwork.url !== undefined) {
        const urlSocialNetwork = buildSocialNetworkLinkData(
          fieldName,
          fieldValue
        );
        renderFieldValue = (
          <a href={urlSocialNetwork.url} target={urlSocialNetwork.target}>
            {`${socialNetwork.user_prefix || ""}${fieldValue}`}
          </a>
        );
      }
    }
    if (!icon) {
      icon = socialNetwork.icon;
    }

    if (!customTitle) {
      if (socialNetwork.emptyTitle) {
        fieldTitle = "";
      } else {
        fieldTitle = socialNetwork.title;
      }
    }
  }

  return (
    <div className="icon-field-container">
      {icon && (
        <span>
          <DynamicIcons iconName={icon} size={20} color="#7a260a" />
        </span>
      )}
      {useDivInValue && (
        <div className="field-content">
          {fieldTitle && <strong>{fieldTitle}: </strong>}
          {renderFieldValue}
        </div>
      )}
      {!useDivInValue && (
        <span className="field-content">
          {fieldTitle && <strong>{fieldTitle}: </strong>}
          {renderFieldValue}
        </span>
      )}
    </div>
  );
};

export default IconFieldReadOnly;
