import VerifiedArtist from "~/components/shared/VerifiedArtist";
import "./index.scss";

export interface ProfileHeaderElement {
  name: string;
  profile_pic?: string;
  verified_status?: string;
  subtitle?: string;
}

export const ProfileHeader = (props: any) => {
  const { element } = props;

  return (
    <div className="profile-header">
      <img className="avatar" src={element.profile_pic} alt={element?.name} />
      <div className="header-title d-grid align-items-bottom">
        <div className="profile-name">
          <h2>
            {element?.name}
            <VerifiedArtist verifiedStatus={element?.verified_status} />
          </h2>
        </div>
        <div className="profile-name">
          <p>{element?.subtitle}</p>
        </div>
      </div>
    </div>
  );
};
