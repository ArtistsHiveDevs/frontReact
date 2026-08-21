import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import './TermsAndConditionsPage.scss';

import {
  selectorTermsAndConditions,
  useTermsAndConditionsSlice,
} from '~/common/slices/app-base/policies/TermsAndConditions/terms.redux';
import MDReader from '~/components/shared/organisms/gui/MDReader/mdreader';
import { MDDocumentModel } from '~/models/app/md-model/md-model';

const TermsOfServicePage = () => {
  const urlParameters = useParams();
  const { role } = urlParameters;
  const terms_of_service_policies: MDDocumentModel[] = useSelector(selectorTermsAndConditions.selectItems);
  const { actions: termsOfServiceActions } = useTermsAndConditionsSlice();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(termsOfServiceActions.loadItems({ queryParams: { v: 'latest' } }));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [terms_of_service_policies]);

  return (
    !!terms_of_service_policies?.length && (
      <div className="offer-container">
        <MDReader mdDocument={terms_of_service_policies[0]} options={{ showLogoAtEnd: true }} />
      </div>
    )
  );
};

export default TermsOfServicePage;
