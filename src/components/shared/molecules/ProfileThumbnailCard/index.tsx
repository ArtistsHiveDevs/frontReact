import "./index.scss";
import VerifiedArtist from "../../VerifiedArtist";
import DynamicIcons from "../../DynamicIcons";

const ProfileThumbnailCard = (props: any) => {
  const { profile_pic, name, subtitle, verified_status, footer, styles } =
    props;
  return (
    <div className="profile-thumbnail-card">
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
