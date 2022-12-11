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
  let { lang, messages } = useContext(HvAppContext);
  const onError = (error: any) => console.log(`Error Messages: ${error}`);
  console.log(lang, messages);
  return (
    <HelmetProvider>
      <HvAppContextProvider appMessages={appMessages}>
        <Router>
          <IntlProvider
            defaultLocale={navigator.language || "en"}
            locale={lang}
            messages={messages}
            onError={onError}
          >
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
