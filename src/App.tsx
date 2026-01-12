// vendor

import { Suspense, useContext, useEffect, useState } from 'react';
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
import { appMessages, AVAILABLE_I18N_LANGUAGES } from './translations';

// routes
import { AuthProvider, HvAppContext, HvAppContextProvider } from './common';

import { deDE, elGR, enUS, esES, frFR, itIT, ptBR } from '@mui/x-date-pickers';

import { createTheme, ThemeProvider } from '@mui/material';
import { FetchUserAttributesOutput, getCurrentUser } from 'aws-amplify/auth';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { AppFooter } from '~/components/shared/organisms/app/Footer/AppFooter';
import SideNav from '~/components/shared/sidenav';
import { RoutesApp } from '~/routes';
import { useApiKeySlice } from './common/slices/app-base/APIKey';
import { selectApiKey } from './common/slices/app-base/APIKey/selectors';
import { initGA } from './common/utils/analytics/analytics';
import { isProdEnvironment } from './common/utils/app-utils/app-utils';
import { AppLoader } from './components/shared/organisms/app/loader/loader';

// import { secret } from '@aws-amplify/backend';

const App = () => {
  let { lang, messages, setLocale: setLang } = useContext(HvAppContext);

  const [appLang, setAppLang] = useState<{ lang: string; messages: any }>({
    lang,
    messages,
  });

  const [userAWSAttributes, setUserAWSAttributes] = useState<FetchUserAttributesOutput>();

  const onError = (error: any) => console.log(`Error Messages: ${error}`);

  const guii18nData = geti18nGUILanguage(appLang.lang);
  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  if (isProdEnvironment()) {
    const trackingID = import.meta.env.VITE_GA_CODE; // Reemplaza con tu ID de seguimiento de Google Analytics
    initGA(trackingID);
  }

  const dispatch = useDispatch();
  const { actions: apiKeyActions } = useApiKeySlice();

  const apiKeyInfo = useSelector(selectApiKey);

  useEffect(() => {
    verifyUserSession();
  }, []);

  const verifyUserSession = async () => {
    const { username, userId, signInDetails } = await getCurrentUser();
    if (username && userId) {
      dispatch(apiKeyActions.loadApiKey({ username: username, sub: userId }));
    }
  };

  useEffect(() => {
    if (appLang.lang && AVAILABLE_I18N_LANGUAGES.includes(appLang.lang)) {
      dayjs.locale(appLang.lang);
    }
  }, [appLang]);

  return (
    <ThemeProvider theme={darkTheme}>
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
                  <div>
                    <SideNav />

                    <Suspense fallback={<AppLoader />}>
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
    </ThemeProvider>
  );
};

const geti18nGUILanguage = (currentLang: string) => {
  let language = enUS;
  switch (currentLang) {
    case 'de':
      language = deDE;
      break;
    case 'el':
      language = elGR;
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
