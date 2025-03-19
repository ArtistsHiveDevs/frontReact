import { Avatar, Button, Dialog, DialogContent, IconButton } from '@mui/material';
import { useEffect, useState } from 'react';
import { RegisterOptions } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import { DynamicControl, DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms';
import { ProfileModel } from '~/models/base';
import { PlaceModel } from '~/models/domain/place/place.model';
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
  showPlaceHolderWhenEmpty?: boolean;
  config?: RegisterOptions;
  renderField?: string;
}
export const ProfileHeader = (props: any) => {
  const { translateGlobalDict } = useI18n();
  const { element, formMethods, handlers: parentHandlers, customHeaderConfig } = props;

  const elementAsProfileModel = element as ProfileModel<PlaceModel>;

  const isEditable = !!formMethods;
  const { register, formState } = formMethods || {};
  const { errors } = formState || {};

  const avatarSize = 120;

  const [fields, setFieldData] = useState<FieldInfo[]>(
    customHeaderConfig || [
      {
        name: 'name',
        label: 'Nombre',
        config: { required: true, minLength: 3 },
        renderField: 'nameKnownAs',
      },
      { name: 'subtitle', label: 'Subtitle', showPlaceHolderWhenEmpty: false },
      {
        name: 'username',
        label: 'username',
        config: { required: true, minLength: 3 },
      },
    ]
  );

  const [zoomProfilePic, setZoomProfilePic] = useState(false);
  const [currentUserCanEdit, setCurrentUserCanEdit] = useState(false);
  const [currentUserIsInProfile, setCurrentUserIsInProfile] = useState(false);
  const { actions: userActions } = useUsersSlice();

  const dispatch = useDispatch();

  const { setFocus } = formMethods || {};

  const [profilePictureConfig, setProfilePictureConfig] = useState({
    value: undefined,
  });

  const loggedUser = useSelector(selectCurrentUser);

  const getProfilePicURL = async () => {
    const photoURL =
      element && !!element?.avatarURL ? await element.avatarURL() : element?.profile_pic || element?.photo;

    setImage(photoURL);
  };

  useEffect(() => {
    if (element) {
      getProfilePicURL();

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

    const value =
      element &&
      (newField?.renderField && newField?.renderField in element
        ? element[newField?.renderField]
        : newField?.config?.value);

    return (
      <>
        {!showEditableField && (
          <span
            onClick={() => clickOnField(fieldName)}
            className={`${errors && errors[fieldName] ? 'error-field' : ''}`}
          >
            {prefix}{' '}
            {!!element &&
              (value ||
                ((newField?.showPlaceHolderWhenEmpty === undefined || newField?.showPlaceHolderWhenEmpty) &&
                  placeholder))}
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

  const handleCloseZoomDialog = () => {
    setZoomProfilePic(false);
  };

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
            onClick={() => !!image && setZoomProfilePic(true)}
            onBadgeClick={() => switchProfile()}
          ></AvatarWithIcon>
        )}
        <div className="header-title d-grid align-items-bottom">
          {!!fields.find((field) => field.name === 'username') && (
            <div className="username">
              <span>
                {generateEditableField('username', element, isEditable, '@')}{' '}
                <VerifiedArtist verifiedStatus={element?.verified_status} />
              </span>
            </div>
          )}
          {!!fields.find((field) => field.name === 'name') && (
            <div className="profile-name">
              <h2>
                {generateEditableField('name', element, isEditable)}

                {element && !currentUserIsInProfile && (
                  <>
                    <FavoriteSubscription
                      size={24}
                      iconType={FavoriteSubscritionIconDefaultTypes.HEART}
                      customSubscriberTo={loggedUser?.currentSessionLikesProfile(element)}
                      callback={parentHandlers['onClickFollowSucription']}
                    />
                  </>
                )}
              </h2>
            </div>
          )}

          <div className="profile-name">{generateEditableField('subtitle', element, isEditable)}</div>
          {element?.followed_by_count !== undefined && (
            <div className="followers-box">
              <div>
                <span className="follow-number">{element.followed_by_count}</span>
                <br />
                {translateGlobalDict(`follows.followers`)}
              </div>
              <div>
                <span className="follow-number">{element.followed_profiles_count}</span>
                <br />
                {translateGlobalDict(`follows.following`)}
              </div>
            </div>
          )}
        </div>
      </div>
      {currentUserIsInProfile && (
        <div className="profile-header actions" onClick={() => setEditableMode(element)}>
          <Button variant="contained">Edit</Button>
        </div>
      )}
      <Dialog open={zoomProfilePic} onClose={handleCloseZoomDialog} fullWidth>
        <DialogContent style={{ textAlign: 'center', position: 'relative', padding: 0 }}>
          <IconButton onClick={handleCloseZoomDialog} style={{ position: 'absolute', top: '0.5%', right: '0.5%' }}>
            <DynamicIcons iconName="MdClose" />
          </IconButton>
          {zoomProfilePic && <img src={image} alt={element?.name} style={{ maxWidth: '100%' }} />}
        </DialogContent>
      </Dialog>
    </>
  );
};
