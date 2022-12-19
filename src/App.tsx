// vendor
import { BrowserRouter as Router } from "react-router-dom";
import { Suspense, useContext } from "react";
import { IntlProvider } from "react-intl";
import { HelmetProvider } from "react-helmet-async";

// translations
import { appMessages } from "./translations";

// routes
import { RoutesApp } from "./routes";
import { HvAppContext, HvAppContextProvider } from "./common";
import SideNav from "./components/shared/sidenav";
import { PATHS } from "./constants";

const App = () => {
  let { lang, messages, setLang } = useContext(HvAppContext);
  const onError = (error: any) => console.log(`Error Messages: ${error}`);

  return (
    <HelmetProvider>
      <HvAppContextProvider appMessages={appMessages}>
        <Router basename={PATHS.BASENAME}>
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
                  <div className="content">
                    <RoutesApp />
                  </div>
                </div>
              </Suspense>
            </div>
          </IntlProvider>
        </Router>
      </HvAppContextProvider>
    </HelmetProvider>
  );
};

export default App;
