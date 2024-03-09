import { Avatar } from "@mui/material";
import VerifiedArtist from "~/components/shared/VerifiedArtist";
import {
  FavoriteSubscription,
  FavoriteSubscritionIconDefaultTypes,
} from "~/components/shared/molecules/general/favoriteSubscribe/favoriteSubscribe";
import "./index.scss";

export interface ProfileHeaderElement {
  name: string;
  profile_pic?: string;
  verified_status?: string;
  subtitle?: string;
}

export const ProfileHeader = (props: any) => {
  const { element } = props;
  const isEditable = false;

  const generateEditableField = (
    fieldName: string,
    element: any,
    isEditable?: boolean
  ) => {
    return (
      <>
        {element && element[fieldName]}
        {!element && fieldName}
      </>
    );
  };

  return (
    <div className="profile-header">
      <Avatar
        src={element?.profile_pic}
        alt={element?.name}
        sx={{ width: 120, height: 120 }}
      />
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
          <p>{generateEditableField("subtitle", element, isEditable)}</p>
        </div>
      </div>
    </div>
  );
};
