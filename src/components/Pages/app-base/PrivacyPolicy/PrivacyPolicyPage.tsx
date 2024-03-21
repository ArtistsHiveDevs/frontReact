import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import remarkGfm from 'remark-gfm';
import { usePrivacyPolicySlice } from '~/common/slices/app-base/policies/PrivacyPolicy';
import { selectPrivacyPolicy } from '~/common/slices/app-base/policies/PrivacyPolicy/selectors';
import { PrivacyPolicyModel } from '~/models/app/policies/privacy/PrivacyPolicy.model';

const PrivacyPoliticsPage = () => {
  const policy: PrivacyPolicyModel = useSelector(selectPrivacyPolicy);

  const { actions: privacyActions } = usePrivacyPolicySlice();

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    if (!policy) {
      dispatch(privacyActions.loadPrivacyPolicy({ version: '2.0' }));
    }
  }, []);

  return (
    <>
      <h1>Política de privacidad</h1>
      {policy && <ReactMarkdown children={policy.policy} remarkPlugins={[remarkGfm]} />}
    </>
  );
};

export default PrivacyPoliticsPage;
