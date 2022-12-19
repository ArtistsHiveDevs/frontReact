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

const App = () => {
  const { lang, messages } = useContext(HvAppContext);

  return (
    <HelmetProvider>
      <HvAppContextProvider appMessages={appMessages}>
        <Router>
          <IntlProvider defaultLocale="en" locale={lang} messages={messages}>
            <div className="wrapper">
              <Suspense fallback={<div>Loading...</div>}>
                <RoutesApp />
              </Suspense>
            </div>
          </IntlProvider>
        </Router>
      </HvAppContextProvider>
    </HelmetProvider>
  );
};

export default App;
