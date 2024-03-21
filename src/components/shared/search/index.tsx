import { useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { useI18n } from '~/common/utils';

import { ResultsList } from './results-list';
import './search.scss';

const TRANSLATION_BASE_SEARCH = 'app.appbase.search';

export const SearchComponent = (props: any) => {
  const { translateText, locale } = useI18n();

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  }

  const { openedStatus, onClick } = props;
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);

  const wrapperRef = useRef<HTMLHeadingElement>(null);

  const handleOnBlur = () => {
    if (!focused) {
      setFocused(!focused);
    }
  };

  const handleOnClickOut = useCallback(
    (e: any) => {
      if (wrapperRef?.current && !wrapperRef.current.contains(e.target) && focused) {
        setFocused(!focused);
      }
    },
    [focused]
  );

  useImperativeHandle(props?.parentReference, () => ({
    restartQueryValue() {
      setText('');
    },
  }));

  useEffect(() => {
    window.addEventListener('click', (e) => handleOnClickOut(e));

    return window.removeEventListener('click', (e) => handleOnClickOut(e));
  }, [handleOnClickOut]);

  const handleText = (event: any) => {
    setText(event.target.value || '');
  };

  let stylesSearchField = ['line-width-hide-an'];
  if (openedStatus) {
    stylesSearchField = ['ah-nav-search line-width-an'];
  }

  function handleClickOnResult(event: any) {
    if (onClick) {
      onClick(event);
      setText('');
    }
  }
  return (
    <>
      <div ref={wrapperRef} className={stylesSearchField.join(' ')}>
        <InputGroup>
          <Form.Control
            aria-describedby="basic-addon2"
            aria-label={translate('search_placeholder')}
            autoComplete="off"
            className="ah-nav-search__input"
            name="search"
            placeholder={translate('search_placeholder')}
            value={text}
            onChange={handleText}
            onClick={() => handleOnBlur()}
          />
        </InputGroup>
        {focused && (
          <div className="ah-combobox-search">
            <ResultsList
              q={text}
              onClick={handleClickOnResult}
              typeOfSearch={props?.typeOfSearch}
              hideResultHeader={props.hideResultHeader}
            />
          </div>
        )}
      </div>
    </>
  );
};
