import "./index.scss";
import VerifiedArtist from "~/components/shared/VerifiedArtist";

const ProfileThumbnailCard = (props: any) => {
  const { elementData, footer, styles, callbacks } = props;

  const { profile_pic, name, subtitle, verified_status } = elementData || {};

  function onClickCardHandler() {
    if (callbacks?.onClickCard) {
      callbacks.onClickCard(elementData);
    }
  }
  return (
    <div className="profile-thumbnail-card" onClick={onClickCardHandler}>
      <div className="profile-header">
        <img
          className={styles ? styles.avatar : "avatar"}
          src={profile_pic}
          alt={name}
        />
        <div className="header-title d-grid align-items-bottom">
          <div className="artist-name">
            <h2>
              {name} <VerifiedArtist verifiedStatus={verified_status} />
            </h2>
          </div>
          <div className="artist-name">
            <p>{subtitle}</p>
          </div>
        </div>
      </div>
      {footer && (
        <div className="profile-thumbnail-card-footer">{footer()}</div>
      )}
    </div>
  );
};

export default ProfileThumbnailCard;
