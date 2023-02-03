import VerifiedArtist from "~/components/shared/VerifiedArtist";
import { VerificationStatus } from "~/constants";
import "./index.scss";

export interface ProfileHeaderElement {
  name: string;
  profile_pic?: string;
  verified_status?: string;
  subtitle?: string;
}

export const ProfileHeader = (props: any) => {
  const { element } = props;
  console.log(
    element,
    element?.verified_status,
    element?.verified_status === VerificationStatus.NON_VERIFIED,
    element?.verified_status === VerificationStatus.VERIFIED,
    element?.verified_status === VerificationStatus.VERIFIED_AND_APPROVED
  );
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
