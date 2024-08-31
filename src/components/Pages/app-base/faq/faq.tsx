import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './faq.scss';

import { selectorFAQ, useFAQSlice } from '~/common/slices/app-base/faq/faq.redux';
import MDReader from '~/components/shared/organisms/gui/MDReader/mdreader';
import { MDDocumentModel } from '~/models/app/md-model/md-model';

const FAQComponent = () => {
  const { actions: faqActions } = useFAQSlice();
  const faqDocument: MDDocumentModel[] = useSelector(selectorFAQ.selectItems);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(faqActions.loadItems({}));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [faqDocument]);

  return (
    !!faqDocument?.length && (
      <div>
        <MDReader mdDocument={faqDocument[0]} options={{ showIndex: false, showLogoAtEnd: true }} />
      </div>
    )
  );
};

export default FAQComponent;
