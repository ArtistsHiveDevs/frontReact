import { useEffect, useMemo, useState } from 'react';
import { useI18n } from '~/common/utils';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import {
  ProfilePictureList,
  ProfilePictureListConstants,
} from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureList';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { FollowerProfileTemplate } from '~/models/base';
import { getClassFromModelName } from '~/models/base/modelHelpers';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { FollowerCounter } from '../FollowerCounter/FollowerCounter';
import './FollowerListView.scss';

const LISTED_ENTITIES = [ArtistModel.name, PlaceModel.name];

export const FollowerListView = (props: any) => {
  let { element, handlers: parentHandlers, showSpecificFollowerType } = props;

  const { translateGlobalDict } = useI18n();
  const { loggedUser } = useAuth();

  const [currentShownList, setCurrentShownList] = useState(showSpecificFollowerType || 'followed_by');

  const [followersList, setFollowersList] = useState([]);

  parentHandlers = {
    ...parentHandlers,
    onClickSeeFollowers: (value: any) => {
      setCurrentShownList(value);
    },
  };

  useEffect(() => {
    setFollowersList(element?.[currentShownList] || []);
  }, [element, currentShownList]);

  // Los followers llegan con `entityType` ('Artist'), pero ProfilePictureList agrupa
  // por `entity`, que es el nombre de la clase del modelo ('ArtistModel').
  const profiles = useMemo(
    () =>
      (followersList || [])
        .map((follower: FollowerProfileTemplate) => {
          const modelName = getClassFromModelName(follower?.entityType)?.name;
          return modelName ? new CurrentProfileInfoModel({ ...follower, entity: modelName } as any) : undefined;
        })
        .filter(Boolean),
    [followersList]
  );

  return (
    <div className="follower-list-view">
      <FollowerCounter
        element={element}
        handlers={parentHandlers}
        showBackArrow={true}
        showCommonFollowers={true}
        selected={currentShownList}
      />

      <div className="followers-list">
        <ProfilePictureList
          key={currentShownList}
          entities={LISTED_ENTITIES}
          elements={profiles}
          styles={{ avatarSize: 4 }}
          displayDirection={ProfilePictureListConstants.DISPLAY_VERTICAL}
          onProfileClick={(profile) => parentHandlers?.['onClickOnFollower']?.(profile)}
        />
        {!followersList.length && !!loggedUser && (
          <div className="followers-error">
            {currentShownList === 'followed_by' && translateGlobalDict('follows.errors.NO_FOLLOWERS')}
            {currentShownList === 'followed_profiles' && translateGlobalDict('follows.errors.NO_FOLLOWING')}
            {currentShownList === 'common_followers' && translateGlobalDict('follows.errors.NO_COMMON_FOLLOWERS')}
          </div>
        )}
        {!followersList.length && !loggedUser && (
          <div className="followers-error">{translateGlobalDict('errors.AUTH_LOGIN_REQUIRED')}</div>
        )}
      </div>
    </div>
  );
};
