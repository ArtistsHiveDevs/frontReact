import { Button } from '@mui/material';
import { useEffect } from 'react';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import remarkGfm from 'remark-gfm';
import { useIndustryOfferSlice } from '~/common/slices/app-base/IndustryOffer';
import { selectIndustryOffer } from '~/common/slices/app-base/IndustryOffer/selectors';
import { useI18n } from '~/common/utils';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { PATHS } from '~/constants';
import { IndustryOfferModel } from '~/models/domain/industryOffer/IndustryOffer.model';
import './IndustryOfferTemplate.scss';

const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS_ACCOUNTS = 'app.global_dictionary.actions.accounts';
const TRANSLATION_BASE_INDUSTRY_OFFER_PAGE = 'app.pages.domain.IndustryOfferPage';

const IndustryOfferTemplate = () => {
  const urlParameters = useParams();

  const { loggedUser, setLoggedUser } = useAuth();
  const { translateText, translateGlobalDict } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const { role } = urlParameters;

  const { actions: industryOfferActions } = useIndustryOfferSlice();

  const offer: IndustryOfferModel = useSelector(selectIndustryOffer);

  // Hooks
  const dispatch = useDispatch();

  // Effects

  useEffect(() => {
    if (urlParameters?.role) {
      dispatch(industryOfferActions.loadIndustryOffer({ role: urlParameters.role }));
    }
  }, [urlParameters]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [offer]);

  const bannerCreateAccount = () => {
    return (
      (loggedUser && <></>) ||
      (!loggedUser && (
        <div className="banner-create-account">
          <div className="banner-create-account-text">
            {translateText(`${TRANSLATION_BASE_INDUSTRY_OFFER_PAGE}.create_account_banner`)}
          </div>
          <Button className="button-styles" onClick={() => navigateToInnerPath({ path: PATHS.SIGN_UP })}>
            {translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS_ACCOUNTS}.create_account`)}
          </Button>
        </div>
      ))
    );
  };

  const goToHome = () => navigateToInnerPath({ path: PATHS.HOME });

  return (
    offer && (
      <div className="offer-container">
        {offer && <ReactMarkdown children={offer.offer} remarkPlugins={[remarkGfm]} className="md-render" />}
        <div className="logo-end">
          <a onClick={goToHome}>
            <img alt="Artist Hive" className="img-logotipo" src={import.meta.env.VITE_LOGO_URL} width="80%" />
            <h2>{translateGlobalDict('artists_hive.slogan')}</h2>
          </a>
        </div>
      </div>
    )
  );
};
export default IndustryOfferTemplate;
