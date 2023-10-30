// vendor
import { Suspense, useContext } from "react";
import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";

// translations
import { appMessages } from "./translations";

// routes
import { AuthProvider, HvAppContext, HvAppContextProvider } from "./common";
import SideNav from "./components/shared/sidenav";
import { RoutesApp } from "./routes";

const App = () => {
  let { lang, messages, setLang } = useContext(HvAppContext);
  const onError = (error: any) => console.log(`Error Messages: ${error}`);

  return (
    <HelmetProvider>
      <HvAppContextProvider appMessages={appMessages}>
        <Router>
          <AuthProvider>
            <IntlProvider
              defaultLocale={navigator.language || "en"}
              locale={lang}
              messages={messages}
              onError={onError}
            >
              <div className="wrapper">
                <SideNav />

                <Suspense fallback={<div>Loading...</div>}>
                  <div className="content">
                    <RoutesApp />
                  </div>
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
