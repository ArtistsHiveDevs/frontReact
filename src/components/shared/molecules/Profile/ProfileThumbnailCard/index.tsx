import VerifiedArtist from '~/components/shared/VerifiedArtist';
import './index.scss';

export const ProfileThumbnailCard = (props: any) => {
  const { elementData, footer, styles, callbacks } = props;

  const { profile_pic, name, subtitle, username, verified_status } = elementData || {};

  function onClickCardHandler() {
    if (callbacks?.onClickCard) {
      callbacks.onClickCard(elementData);
    }
  }
  return (
    <div className="profile-thumbnail-card" onClick={onClickCardHandler}>
      <div className="profile-header">
        <img className={styles ? styles.avatar : 'avatar'} src={profile_pic} alt={name} />
        <div className="header-title d-grid align-items-bottom">
          <div className="artist-name">
            <h2>{name}</h2>
          </div>
          <div className="artist-name">
            <span>
              @{username} <VerifiedArtist verifiedStatus={verified_status} />
            </span>
          </div>
        </div>
      </div>
      {footer && (
        <div className="profile-thumbnail-card-footer">
          <div className="artist-name">
            <p>{subtitle}</p>
          </div>
          {footer()}
        </div>
      )}
    </div>
  );
};
