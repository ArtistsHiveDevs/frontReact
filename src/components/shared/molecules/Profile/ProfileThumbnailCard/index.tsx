import { useEffect, useState } from 'react';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import './index.scss';

export const ProfileThumbnailCard = (props: any) => {
  const { elementData, footer, styles, callbacks } = props;

  const [imageURL, setImageURL] = useState<string>(undefined);
  const { profile_pic, name, subtitle, username, verified_status } = elementData || {};

  function onClickCardHandler() {
    if (callbacks?.onClickCard) {
      callbacks.onClickCard(elementData);
    }
  }

  const getProfilePicURL = async () => {
    const photoURL = elementData && !!elementData?.avatarURL ? await elementData.avatarURL() : elementData?.profile_pic;

    setImageURL(photoURL);
  };

  useEffect(() => {
    if (!!elementData) {
      getProfilePicURL();
    }
  }, [elementData]);

  return (
    <div className="profile-thumbnail-card" onClick={onClickCardHandler}>
      <div className="profile-thumbnail-header">
        {/* <img className={styles ? styles.avatar : 'avatar'} src={imageURL} alt={name} /> */}
        <AvatarWithIcon image={imageURL} avatarSize={'7rem'} name={name} />
        <div className="header-title d-grid align-items-bottom">
          <h2>{name}</h2>
          <p>
            @{username} <VerifiedArtist verifiedStatus={verified_status} size={20} />
          </p>
        </div>
      </div>
      {!!footer && <div className="profile-thumbnail-card-footer">{footer && footer()}</div>}
    </div>
  );
};
