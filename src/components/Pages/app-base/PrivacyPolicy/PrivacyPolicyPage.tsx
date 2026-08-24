import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import './PrivacyPolicyPage.scss';

import {
  selectorPrivacyPolicy,
  usePrivacyPolicySlice,
} from '~/common/slices/app-base/policies/PrivacyPolicy/privacy-policy.redux';
import MDReader from '~/components/shared/organisms/gui/MDReader/mdreader';
import { MDDocumentModel } from '~/models/app/md-model/md-model';

const PrivacyPolicyTemplate = () => {
  const urlParameters = useParams();
  const { role } = urlParameters;
  const privacy_policies: MDDocumentModel[] = useSelector(selectorPrivacyPolicy.selectItems);
  const { actions: privacyPolicies } = usePrivacyPolicySlice();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(privacyPolicies.loadItems({ queryParams: { v: 'latest' } }));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [privacy_policies]);

  return (
    !!privacy_policies?.length && (
      <div>
        <MDReader mdDocument={privacy_policies[0]} options={{ showLogoAtEnd: true }} />
      </div>
    )
  );
};

export default PrivacyPolicyTemplate;
