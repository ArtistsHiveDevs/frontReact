import { Button } from '@mui/material';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { PATHS } from '~/constants';
import { DynamicIcons } from '../../DynamicIcons';
import './IndustrySignUpBanner.scss';

const TRANSLATION_BASE_USER_DETAIL_PAGE = 'app.pages.app_base.UsersPages';

export const IndustrySignUpBanner = () => {
  const loggedUser = useSelector(selectCurrentUser);
  const { translateText } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const clickHandler = () => {
    navigateToInnerPath({ path: PATHS.INDUSTRY });
  };
  return (
    !!loggedUser &&
    loggedUser.hasFilledProfile &&
    !loggedUser?.isIndustryMember && (
      <div className="industry-signup-banner">
        <div>
          <DynamicIcons iconName="HiUserGroup" size={40} color={'white'} />
        </div>
        <div style={{ textAlign: 'center' }}>
          <div>{translateText(`${TRANSLATION_BASE_USER_DETAIL_PAGE}.activate_industry_banner.banner`)}</div>
          <div className="button">
            <Button variant="contained" onClick={() => clickHandler()}>
              {translateText(`${TRANSLATION_BASE_USER_DETAIL_PAGE}.activate_industry_banner.button`)}
            </Button>
          </div>
        </div>
        {/* <div></div> */}
      </div>
    )
  );
};
