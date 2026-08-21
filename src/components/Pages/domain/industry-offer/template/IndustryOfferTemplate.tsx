import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import './IndustryOfferTemplate.scss';

import {
  selectorIndustryOffer,
  useIndustryOfferSlice,
} from '~/common/slices/app-base/IndustryOffer/industry-offer.redux';
import MDReader from '~/components/shared/organisms/gui/MDReader/mdreader';
import { MDDocumentModel } from '~/models/app/md-model/md-model';

const IndustryOfferTemplate = () => {
  const urlParameters = useParams();
  const { role } = urlParameters;
  const { actions: industryOfferActions } = useIndustryOfferSlice();
  const offer: MDDocumentModel[] = useSelector(selectorIndustryOffer.selectItems);
  const dispatch = useDispatch();

  useEffect(() => {
    if (role) {
      dispatch(industryOfferActions.loadItems({ queryParams: { role } }));
    }
  }, [role, dispatch, industryOfferActions]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [offer]);

  return (
    !!offer?.length && (
      <div className="offer-container">
        <MDReader
          mdDocument={offer[0]}
          options={{ showLogoAtEnd: true, renderPlainMD: true, showTableOfContent: false }}
        />
      </div>
    )
  );
};

export default IndustryOfferTemplate;
