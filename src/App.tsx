// vendor

import { Suspense, useContext, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';

// translations
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/de';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import 'dayjs/locale/fr';
import 'dayjs/locale/it';
import 'dayjs/locale/pt';
import { appMessages } from './translations';

// routes
import { AuthProvider, HvAppContext, HvAppContextProvider } from './common';

import { deDE, enUS, esES, frFR, itIT, ptBR } from '@mui/x-date-pickers';

import { AppFooter } from '~/components/shared/organisms/app/Footer/AppFooter';
import SideNav from '~/components/shared/sidenav';
import { RoutesApp } from '~/routes';

const App = () => {
  let { lang, messages, setLocale: setLang } = useContext(HvAppContext);

  const [appLang, setAppLang] = useState<{ lang: string; messages: any }>({
    lang,
    messages,
  });
  const onError = (error: any) => console.log(`Error Messages: ${error}`);

  const guii18nData = geti18nGUILanguage(appLang.lang);

  return (
    <HelmetProvider>
      <HvAppContextProvider appMessages={appMessages} lang={appLang} setLang={setAppLang}>
        <Router>
          <AuthProvider>
            <IntlProvider
              defaultLocale={appLang.lang || 'en'}
              locale={appLang.lang}
              messages={appLang.messages}
              onError={onError}
            >
              <LocalizationProvider
                dateAdapter={AdapterDayjs}
                adapterLocale={appLang.lang || 'en'}
                localeText={guii18nData.components.MuiLocalizationProvider.defaultProps.localeText}
              >
                <div className="wrapper">
                  <SideNav />

                  <Suspense fallback={<div>Loading...</div>}>
                    <div className="content">
                      <RoutesApp />
                    </div>
                    <AppFooter />
                  </Suspense>
                </div>
              </LocalizationProvider>
            </IntlProvider>
          </AuthProvider>
        </Router>
      </HvAppContextProvider>
    </HelmetProvider>
  );
};

const geti18nGUILanguage = (currentLang: string) => {
  let language = enUS;
  switch (currentLang) {
    case 'de':
      language = deDE;
      break;
    case 'es':
      language = esES;
      break;
    case 'fr':
      language = frFR;
      break;
    case 'it':
      language = itIT;
      break;
    case 'pt':
      language = ptBR;
      break;
  }
  return language;
};

export default App;
