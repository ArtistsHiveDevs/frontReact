import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useDispatch, useSelector } from 'react-redux';
import remarkGfm from 'remark-gfm';
import { useTermsAndConditionsSlice } from '~/common/slices/app-base/policies/TermsAndConditions';
import { selectTermsAndConditions } from '~/common/slices/app-base/policies/TermsAndConditions/selectors';
import { TermsAndConditionsModel } from '~/models/app/policies/termsAndConditions/TermsAndConditions.model';

const TermsAndConditionsPage = () => {
  const terms: TermsAndConditionsModel = useSelector(selectTermsAndConditions);

  const { actions: termsAndConditionsActions } = useTermsAndConditionsSlice();

  // Hooks
  const dispatch = useDispatch();

  // Effects
  useEffect(() => {
    if (!terms) {
      dispatch(termsAndConditionsActions.loadTermsAndConditions({ version: '2.0' }));
    }
  }, []);

  return terms && <ReactMarkdown children={terms.terms} remarkPlugins={[remarkGfm]} />;
};

export default TermsAndConditionsPage;
