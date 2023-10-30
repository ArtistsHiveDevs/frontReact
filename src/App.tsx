// vendor

import { Suspense, useContext, useState } from "react";
import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";

// translations
import { appMessages } from "./translations";

// routes
import { AuthProvider, HvAppContext, HvAppContextProvider } from "./common";

import { AppFooter } from "~/components/shared/organisms/app/Footer/AppFooter";
import SideNav from "./components/shared/sidenav";
import { RoutesApp } from "./routes";

const App = () => {
  let { lang, messages, setLocale: setLang } = useContext(HvAppContext);

  const [appLang, setAppLang] = useState<{ lang: string; messages: any }>({
    lang,
    messages,
  });
  const onError = (error: any) => console.log(`Error Messages: ${error}`);

  return (
    <HelmetProvider>
      <HvAppContextProvider
        appMessages={appMessages}
        lang={appLang}
        setLang={setAppLang}
      >
        <Router>
          <AuthProvider>
            <IntlProvider
              defaultLocale={appLang.lang || "en"}
              locale={appLang.lang}
              messages={appLang.messages}
              onError={onError}
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
            </IntlProvider>
          </AuthProvider>
        </Router>
      </HvAppContextProvider>
    </HelmetProvider>
  );
};

export default App;
