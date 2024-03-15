import { Avatar, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { RegisterOptions } from "react-hook-form";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import {
  FavoriteSubscription,
  FavoriteSubscritionIconDefaultTypes,
} from "~/components/shared/molecules/general/favoriteSubscribe/favoriteSubscribe";
import {
  DynamicControl,
  DynamicFieldData,
} from "~/components/shared/organisms/gui/dynamicForms";
import "./index.scss";

export interface ProfileHeaderElement {
  name: string;
  profile_pic?: string;
  verified_status?: string;
  subtitle?: string;
}

interface FieldInfo {
  name: string;
  label?: string;
  showEditableField?: boolean;
  config?: RegisterOptions;
}
export const ProfileHeader = (props: any) => {
  const { element, formMethods } = props;

  const isEditable = !!formMethods;
  const { register, formState } = formMethods || {};
  const { errors } = formState || {};

  const avatarSize = 120;

  const [fields, setFieldData] = useState<FieldInfo[]>([
    { name: "name", label: "Nombre", config: { required: true, minLength: 3 } },
    { name: "subtitle", label: "Subtitle" },
  ]);

  const { setFocus } = formMethods || {};

  const [profilePictureConfig, setProfilePictureConfig] = useState({
    value: undefined,
  });

  useEffect(() => {
    if (element) {
      setImage(element?.profile_pic);

      const newData = [...fields];
      newData.forEach((field) => {
        const fieldName: string = field?.name;
        if (!field.config) {
          field.config = {};
        }
        field.config.value = element[fieldName];
      });
      setFieldData(newData);
    }
  }, [element]);

  const generateEditableField = (
    fieldName: string,
    element: any,
    isEditable?: boolean
  ) => {
    const newField = fields.find((item) => item.name === fieldName);

    const showEditableField = isEditable && newField.showEditableField;

    const placeholder = fieldName;

    const fieldData: DynamicFieldData = {
      inputType: "text",
      fieldName,
      label: newField.label,
      placeholder,
      focused: true,
      componentParams: {
        variant: "standard",
      },
      config: newField.config || {},
      // label: getAttributeTitle(subpage.name, section.name, attributeInfo),
    };
    const handlers = {
      onBlur: (data: any) => {
        const targetFieldName = data.target.name;
        const targetFieldValue = data.target.value;

        const targetFieldIndex = fields.findIndex(
          (item) => item.name === targetFieldName
        );
        const targetField = fields[targetFieldIndex];
        targetField.showEditableField = !!!targetField.showEditableField;
        if (!targetField.config) {
          targetField.config = {};
        }
        targetField.config.value = targetFieldValue.trim();

        const newData = [...fields];
        newData[targetFieldIndex] = targetField;
        setFieldData(newData);
      },
    };

    const field = (
      <DynamicControl
        fieldData={fieldData}
        errors={errors}
        handlers={handlers}
      />
    );

    return (
      <>
        {!showEditableField && (
          <span
            onClick={() => clickOnField(fieldName)}
            className={errors && errors[fieldName] && "error-field"}
          >
            {element && newField?.config?.value}
            {!element && (
              <>
                {newField?.config?.value || placeholder}
                {!newField?.config?.value && newField?.config?.required && " *"}
              </>
            )}
          </span>
        )}
        {showEditableField && <>{field}</>}
      </>
    );
  };

  const clickOnField = (fieldName: string) => {
    const targetFieldIndex = fields.findIndex(
      (item) => item.name === fieldName
    );
    const targetField = fields[targetFieldIndex];

    targetField.showEditableField = !!!targetField.showEditableField;

    const newData = [...fields];
    newData[targetFieldIndex] = targetField;

    setFieldData(newData);
    setFocus(fieldName);
  };

  const [image, _setImage] = useState(null);

  const cleanup = () => {
    URL.revokeObjectURL(image);
    // inputFileRef.current.value = null;
  };

  const setImage = (newImage: any) => {
    if (image) {
      cleanup();
    }
    _setImage(newImage);
  };

  const handleOnChange = (event: any) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setImage(URL.createObjectURL(newImage));

      setProfilePictureConfig({ ...profilePictureConfig, value: newImage });
    }
  };

  const handleClick = (event: any) => {
    if (image) {
      event.preventDefault();
      setImage(null);
    }
  };

  if (isEditable) {
    register("profile_pic", profilePictureConfig);
    fields.forEach((field) => register(field.name, field.config));
  }

  return (
    <div className="profile-header">
      {isEditable && (
        <>
          <input
            accept="image/*"
            id="profile-pic-button-file"
            type="file"
            hidden
            onChange={handleOnChange}
          />
          <label htmlFor="profile-pic-button-file">
            <IconButton color="primary" component="span">
              <Avatar
                src={image}
                alt={element?.name}
                sx={{ width: avatarSize, height: avatarSize }}
                className={
                  errors && errors["profile_pic"] && "error-profile-pic"
                }
              />
            </IconButton>
          </label>
        </>
      )}
      {!isEditable && (
        <>
          <Avatar
            src={image}
            alt={element?.name}
            sx={{ width: avatarSize, height: avatarSize }}
          />
        </>
      )}

      <div className="header-title d-grid align-items-bottom">
        <div className="profile-name">
          <h2>
            {generateEditableField("name", element, isEditable)}

            {element && (
              <>
                <VerifiedArtist verifiedStatus={element?.verified_status} />

                <FavoriteSubscription
                  color={"#7a260a"}
                  size={24}
                  iconType={FavoriteSubscritionIconDefaultTypes.HEART}
                />
              </>
            )}
          </h2>
        </div>
        <div className="profile-name">
          {generateEditableField("subtitle", element, isEditable)}
        </div>
      </div>
    </div>
  );
};
