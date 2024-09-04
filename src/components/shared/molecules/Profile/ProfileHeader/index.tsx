import { Avatar, Button, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { useUsersSlice } from '~/common/slices/users';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import AvatarWithIcon from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import { DynamicControl, DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms';
import {
  FavoriteSubscription,
  FavoriteSubscritionIconDefaultTypes,
} from '../../general/favoriteSubscribe/favoriteSubscribe';
import './index.scss';

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
  const { element, formMethods, handlers: parentHandlers } = props;

  const isEditable = !!formMethods;
  const { register, formState } = formMethods || {};
  const { errors } = formState || {};

  const avatarSize = 120;

  const [fields, setFieldData] = useState<FieldInfo[]>([
    {
      name: 'name',
      label: 'Nombre',
      config: { required: false, minLength: 3 },
    },
    { name: 'subtitle', label: 'Subtitle' },
    {
      name: 'username',
      label: 'username',
      config: { required: false, minLength: 3 },
    },
  ]);

  const [currentUserCanEdit, setCurrentUserCanEdit] = useState(false);
  const [currentUserIsInProfile, setCurrentUserIsInProfile] = useState(false);
  const { actions: userActions } = useUsersSlice();

  const dispatch = useDispatch();

  const { setFocus } = formMethods || {};

  const [profilePictureConfig, setProfilePictureConfig] = useState({
    value: undefined,
  });

  const { loggedUser } = useAuth();

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

  const setEditableMode = (element: any) => {
    if (loggedUser && parentHandlers && parentHandlers['onEditProfile']) {
      parentHandlers['onEditProfile'](element);
    }
  };

  useEffect(() => {
    const userID = getStoredUserIdToken();
    let permissions = { canEdit: false, isInProfile: false };
    if (userID && loggedUser && element && parentHandlers && parentHandlers['onEditProfile']) {
      const userPermissions = loggedUser.checkPermissions(element.identifier);
      permissions = userPermissions;
    }
    setCurrentUserCanEdit(permissions.canEdit);
    setCurrentUserIsInProfile(permissions.isInProfile);
  }, [element, loggedUser]);

  const generateEditableField = (fieldName: string, element: any, isEditable?: boolean, prefix?: any) => {
    const newField = fields.find((item) => item.name === fieldName);

    const showEditableField = isEditable && newField.showEditableField;

    const placeholder = fieldName;

    const fieldData: DynamicFieldData = {
      inputType: 'text',
      fieldName,
      placeholder,
      focused: true,
      componentParams: {
        variant: 'standard',
        startAdornment: prefix,
      },
      config: newField.config || {},
    };
    const handlers = {
      onBlur: (data: any) => {
        const targetFieldName = data.target.name;
        const targetFieldValue = data.target.value;

        const targetFieldIndex = fields.findIndex((item) => item.name === targetFieldName);
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

    const field = <DynamicControl fieldData={fieldData} errors={errors} handlers={handlers} />;

    return (
      <>
        {!showEditableField && (
          <span
            onClick={() => clickOnField(fieldName)}
            className={`${errors && errors[fieldName] ? 'error-field' : ''}`}
          >
            {prefix} {element && newField?.config?.value}
            {!element && (
              <>
                {newField?.config?.value || placeholder}
                {!newField?.config?.value && newField?.config?.required && ' *'}
              </>
            )}
          </span>
        )}
        {showEditableField && <>{field}</>}
      </>
    );
  };

  const clickOnField = (fieldName: string) => {
    if (isEditable) {
      const targetFieldIndex = fields.findIndex((item) => item.name === fieldName);
      const targetField = fields[targetFieldIndex];

      targetField.showEditableField = !!!targetField.showEditableField;

      const newData = [...fields];
      newData[targetFieldIndex] = targetField;

      setFieldData(newData);
      setFocus(fieldName);
    }
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

  const switchProfile = () => {
    dispatch(userActions.switchProfile({ id: element.identifier }));
  };

  if (isEditable) {
    register('profile_pic', profilePictureConfig);
    fields.forEach((field) => register(field.name, field.config));
  }

  return (
    <>
      <div className="profile-header">
        {isEditable && (
          <>
            <input accept="image/*" id="profile-pic-button-file" type="file" hidden onChange={handleOnChange} />
            <label htmlFor="profile-pic-button-file">
              <IconButton color="primary" component="span">
                <Avatar
                  src={image}
                  alt={element?.name}
                  sx={{ width: avatarSize, height: avatarSize, border: '2px solid white' }}
                  className={errors && errors['profile_pic'] && 'error-profile-pic'}
                />
              </IconButton>
            </label>
          </>
        )}
        {!isEditable && (
          <AvatarWithIcon
            image={image}
            name={element?.name}
            avatarSize={avatarSize}
            bottomBadgeSize={avatarSize / 3}
            buttonIcon={currentUserCanEdit && !currentUserIsInProfile && 'PiUserSwitch'}
            onBadgeClick={() => switchProfile()}
          ></AvatarWithIcon>
        )}
        <div className="header-title d-grid align-items-bottom">
          <div className="username">
            <span>
              {generateEditableField('username', element, isEditable, '@')}{' '}
              <VerifiedArtist verifiedStatus={element?.verified_status} />
            </span>
          </div>
          <div className="profile-name">
            <h2>
              {generateEditableField('name', element, isEditable)}

              {element && (
                <>
                  <FavoriteSubscription size={24} iconType={FavoriteSubscritionIconDefaultTypes.HEART} />
                </>
              )}
            </h2>
          </div>

          <div className="profile-name">{generateEditableField('subtitle', element, isEditable)}</div>
        </div>
      </div>
      {currentUserIsInProfile && (
        <div className="profile-header actions" onClick={() => setEditableMode(element)}>
          <Button variant="contained">Edit</Button>
        </div>
      )}
    </>
  );
};
