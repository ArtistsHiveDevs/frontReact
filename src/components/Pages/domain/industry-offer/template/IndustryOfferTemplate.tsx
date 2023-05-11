import { useEffect } from "react";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import remarkGfm from "remark-gfm";
import { useIndustryOfferSlice } from "~/common/slices/app-base/IndustryOffer";
import { selectIndustryOffer } from "~/common/slices/app-base/IndustryOffer/selectors";
import { IndustryOfferModel } from "~/models/domain/industryOffer/IndustryOffer.model";
import "./IndustryOfferTemplate.scss";

const IndustryOfferTemplate = () => {
  const urlParameters = useParams();
  const { role } = urlParameters;

  const { actions: industryOfferActions } = useIndustryOfferSlice();

  const offer: IndustryOfferModel = useSelector(selectIndustryOffer);

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    dispatch(industryOfferActions.loadIndustryOffer({ role }));
  }, []);

  return (
    offer && (
      <ReactMarkdown
        children={offer.offer}
        remarkPlugins={[remarkGfm]}
        className="md-render"
      />
    )
  );
};
export default IndustryOfferTemplate;
