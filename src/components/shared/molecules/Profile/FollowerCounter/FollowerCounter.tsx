import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './FollowerCounter.scss';

export const FollowerCounter = (props: any) => {
  const { element, handlers: parentHandlers, showBackArrow = false, showCommonFollowers = false, selected } = props;

  const { translateGlobalDict } = useI18n();

  const fields = [
    { name: 'followed_by', show: true, label: 'follows.followers' },
    { name: 'followed_profiles', show: true, label: 'follows.following' },
    { name: 'common_followers', show: showCommonFollowers, label: 'follows.in_common' },
  ];

  return (
    element && (
      <div className="follower-counter">
        {showBackArrow && (
          <div
            className="follower-counter__back-arrow"
            onClick={() => parentHandlers?.['onClickBackButtonFollowers']?.()}
          >
            <DynamicIcons iconName="FaChevronLeft" color={'white'} size={20} />
          </div>
        )}
        {fields.map((field, index) => {
          const classNames = ['follower-counter__item'];
          if (selected === field.name) {
            classNames.push('follower-counter__item--active');
          }

          return (
            field.show && (
              <div
                key={`follower-counter-tab-${index}`}
                className={classNames.join(' ')}
                onClick={() => parentHandlers?.['onClickSeeFollowers']?.(field.name)}
              >
                <span className="follower-counter__number">{element?.[`${field.name}_count`] || 0}</span>
                <br />
                <span className="follower-counter__label">{translateGlobalDict(field.label)}</span>
              </div>
            )
          );
        })}
        {/* <div onClick={() => parentHandlers?.['onClickSeeFollowers']?.('followed_by')}>
          <span className="follow-number">{element.followed_by_count}</span>
          <br />
          {translateGlobalDict(`follows.followers`)}
        </div>
        <div onClick={() => parentHandlers?.['onClickSeeFollowers']?.('followed_profiles')}>
          <span className="follow-number">{element.followed_profiles_count}</span>
          <br />
          {translateGlobalDict(`follows.following`)}
        </div>
        {showCommonFollowers && (
          <div onClick={() => parentHandlers?.['onClickSeeFollowers']?.('common_followers')}>
            <span className="follow-number">{element.followed_profiles_count}</span>
            <br />
            {translateGlobalDict(`follows.following`)}
          </div>
        )} */}
      </div>
    )
  );
};
