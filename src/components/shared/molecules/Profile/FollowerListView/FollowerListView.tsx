import { useEffect, useState } from 'react';
import { useI18n } from '~/common/utils';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { FollowerProfileTemplate } from '~/models/base';
import { FollowerCounter } from '../FollowerCounter/FollowerCounter';
import { ProfileThumbnailCard } from '../ProfileThumbnailCard';
import './FollowerListView.scss';

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
        {followersList.map((follower: FollowerProfileTemplate, index: number) => (
          <ProfileThumbnailCard
            key={`follower-${currentShownList}-${index}`}
            elementData={follower}
            avatarSize="3rem"
            callbacks={{
              onClickCard: (elementData: any) => {
                parentHandlers?.['onClickOnFollower']?.(elementData);
              },
            }}
          />
        ))}
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
      {/* <ProfileThumbnailCard
                      key={`full-${selectedValue.name}-${selectedValue.id}`}
                      elementData={selectedValue}
                      footer={() => (
                        <div style={{ textAlign: 'right' }}>
                          <div onClick={() => deletedSelectedValue(selectedValue)}>
                            <DynamicIcons iconName="MdDeleteOutline" size={'1.4rem'} />
                          </div>
                        </div>
                      )}
                    /> */}
    </div>
  );
};
