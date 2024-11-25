import { useI18n } from '~/common/utils';
import { AVAILABLE_ENTITY_MEMBERSHIPS } from '~/constants/app.constants';
import { AppUserModel, CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { AvatarWithIcon } from '../atoms/gui/avatar-with-icon/Avatar-with-icon';
import { DynamicIcons } from '../DynamicIcons';

interface MembershipsListParams {
  loggedUser: AppUserModel;
  profilePicturesURLs: any;
  handlers: {
    switchProfile: Function;
    handleResultOnClick: Function;
    createAgent: Function;
    createNewEntityInstance: Function;
    [handlerName: string]: Function;
  };
}

export const MembershipsList = (params: MembershipsListParams) => {
  const { translateText, translateGlobalDict } = useI18n();
  const { loggedUser, handlers, profilePicturesURLs } = params || {};
  const { switchProfile, handleResultOnClick, createNewEntityInstance, createAgent } = handlers || {};
  return (
    <>
      <div>
        <section className="general-sec">
          <div className="entity-row-container">
            <h5 className="label">Membresías</h5>
            <div className="icon" onClick={() => createAgent()}>
              <DynamicIcons iconName="FaPlus" size={17} color="white" />
            </div>
          </div>
        </section>
        <hr />
      </div>

      {AVAILABLE_ENTITY_MEMBERSHIPS.map((entityMembershipName: string, index: number) => {
        return (
          <div key={`${entityMembershipName}_${index}`}>
            <section className="general-sec">
              {/* ----------  Row header  ------------ */}
              <div className="entity-row-container">
                <h5 className="label">{translateGlobalDict(`entities.${entityMembershipName}.plural`)}</h5>
                {/* <div className="icon" onClick={() => createNewEntityInstance(entityMembershipName)}>
                  <DynamicIcons iconName="FaPlus" size={17} color="white" />
                </div> */}
              </div>

              {/* ----------  Entity Instances List  ------------ */}
              <div className="option-menu-list">
                {loggedUser
                  ?.getMembershipsByEntity(entityMembershipName)
                  .filter(
                    (profileInfo: CurrentProfileInfoModel) =>
                      profileInfo.identifier !== loggedUser.currentProfileInfo.identifier
                  )
                  .map((profileInfo: CurrentProfileInfoModel, index: number) => {
                    return (
                      <div
                        className={[
                          'menu-option',
                          'menu-option-membership',
                          loggedUser?.checkPermissions(profileInfo.identifier).isInProfile ? 'current-profile' : '',
                        ].join(' ')}
                        key={`artist-${index}`}
                      >
                        <AvatarWithIcon
                          name=""
                          image={profilePicturesURLs[profileInfo.identifier]}
                          avatarSize={'3rem'}
                          buttonIcon={
                            !loggedUser?.checkPermissions(profileInfo.identifier).isInProfile && 'PiUserSwitch'
                          }
                          onClick={() => handleResultOnClick(profileInfo)}
                          onBadgeClick={() => switchProfile(profileInfo)}
                        />
                        <div onClick={() => handleResultOnClick(profileInfo)}>
                          <p className="menu-option-label">{profileInfo.name}</p>
                          {profileInfo.username && (
                            <p className="menu-option-membership-label ">@{profileInfo.username}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                {loggedUser
                  ?.getMembershipsByEntity(entityMembershipName)
                  .filter(
                    (profileInfo: CurrentProfileInfoModel) =>
                      profileInfo.identifier !== loggedUser.currentProfileInfo.identifier
                  ).length === 0 &&
                  `No se encontraron más ${translateGlobalDict(
                    `entities.${entityMembershipName}.plural`
                  ).toLowerCase()}`}
              </div>
            </section>
            <hr />
          </div>
        );
      })}
    </>
  );
};
