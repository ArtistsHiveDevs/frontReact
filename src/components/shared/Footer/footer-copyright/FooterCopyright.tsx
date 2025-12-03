import { useContext } from 'react';
import { useDispatch } from 'react-redux';
import { appName, foundationYear, trademarkSymbol } from '~/app.config.json';
import { HvAppContext } from '~/common';
import { useUsersSlice } from '~/common/slices/users';
import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AVAILABLE_I18N_LANGUAGES } from '~/translations';
import './FooterCopyright.scss';

const TRANSLATION_BASE_COPYWRITE = 'app.appbase.footer.copyright';

const FooterCopyright = (props: any) => {
  let { lang, messages, setLocale } = useContext(HvAppContext);
  const dispatch = useDispatch();
  const { actions: usersActions } = useUsersSlice();
  const { translateText } = useI18n();
  return (
    <>
      <div className="copyright">
        <p>
          {appName} {trademarkSymbol}
        </p>
        <p>{translateText(`${TRANSLATION_BASE_COPYWRITE}.allRightsReserved`)}</p>
        <p>
          {foundationYear} - {new Date().getFullYear()}
        </p>
        <p>
          <DynamicIcons iconName="FaGlobeAmericas" size={20} />{' '}
          {AVAILABLE_I18N_LANGUAGES.map((newLang, index, newLangArr) => {
            const styles = [];
            if (newLang === lang) {
              styles.push('active-lang');
            }
            return (
              <span key={`lang-${index}`}>
                <span
                  className={`translate-opt ${styles.join(' ')}`}
                  onClick={() => {
                    setLocale(newLang);
                    dispatch(usersActions.switchLang({ newLang }));
                  }}
                >
                  {newLang}
                </span>
                {index < newLangArr.length - 1 && '  |  '}
              </span>
            );
          })}
        </p>
      </div>
    </>
  );
};

export default FooterCopyright;
