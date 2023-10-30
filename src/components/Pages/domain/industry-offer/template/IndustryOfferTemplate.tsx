import { useEffect } from "react";
import { Button } from "react-bootstrap";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import remarkGfm from "remark-gfm";
import { useIndustryOfferSlice } from "~/common/slices/app-base/IndustryOffer";
import { selectIndustryOffer } from "~/common/slices/app-base/IndustryOffer/selectors";
import { useI18n } from "~/common/utils";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import { useNavigation } from "~/common/utils/hooks/navigation/navigation";
import { PATHS } from "~/constants";
import { IndustryOfferModel } from "~/models/domain/industryOffer/IndustryOffer.model";
import "./IndustryOfferTemplate.scss";

const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS_ACCOUNTS =
  "app.global_dictionary.actions.accounts";
const TRANSLATION_BASE_INDUSTRY_OFFER_PAGE =
  "app.pages.domain.IndustryOfferPage";

const IndustryOfferTemplate = () => {
  const urlParameters = useParams();

  const { loggedUser, setLoggedUser } = useAuth();
  const { translateText } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const { role } = urlParameters;

  const { actions: industryOfferActions } = useIndustryOfferSlice();

  const offer: IndustryOfferModel = useSelector(selectIndustryOffer);

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    dispatch(industryOfferActions.loadIndustryOffer({ role }));
  }, []);

  useEffect(() => {
    dispatch(industryOfferActions.loadIndustryOffer({ role }));
  }, [urlParameters]);

  const bannerCreateAccount = () => {
    return (
      (loggedUser && <></>) ||
      (!loggedUser && (
        <div className="banner-create-account">
          <div className="banner-create-account-text">
            {translateText(
              `${TRANSLATION_BASE_INDUSTRY_OFFER_PAGE}.create_account_banner`
            )}
          </div>
          <Button
            className="button-styles"
            onClick={() => navigateToInnerPath({ path: PATHS.SIGN_UP })}
          >
            {translateText(
              `${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS_ACCOUNTS}.create_account`
            )}
          </Button>
        </div>
      ))
    );
  };

  return (
    offer && (
      <>
        {bannerCreateAccount()}

        <ReactMarkdown
          children={offer.offer}
          remarkPlugins={[remarkGfm]}
          className="md-render"
        />

        {bannerCreateAccount()}
      </>
    )
  );
};
export default IndustryOfferTemplate;
