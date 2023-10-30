// vendor
import { Suspense, useContext } from "react";
import { HelmetProvider } from "react-helmet-async";
import { IntlProvider } from "react-intl";
import { BrowserRouter as Router } from "react-router-dom";

// translations
import { appMessages } from "./translations";

// routes
import { AuthProvider, HvAppContext, HvAppContextProvider } from "./common";
import { FooterColumnTemplate } from "./components/shared/Footer/columns-menu";

import FooterColumns from "./components/shared/Footer/columns-menu/ColumnsMenu";
import FooterCopywrite from "./components/shared/Footer/footer-copywrite/FooterCopywrite";
import SideNav from "./components/shared/sidenav";
import { RoutesApp } from "./routes";

const App = () => {
  let { lang, messages, setLang } = useContext(HvAppContext);
  const onError = (error: any) => console.log(`Error Messages: ${error}`);

  // Footer
  const footerColumns: FooterColumnTemplate[] = [
    {
      columnTitle: "¿Qué hacemos?",
      options: [
        { text: "Agenda cultural", link: "#" },
        { text: "Para artistas", link: "#" },
        { text: "Para sitios", link: "#" },
        { text: "Para promotores", link: "#" },
        { text: "Para festivales", link: "#" },
      ],
    },
    {
      columnTitle: "Nosotros",
      options: [
        { text: "Historia", link: "#" },
        { text: "Prensa", link: "#" },
        { text: "Carrera", link: "#" },
        { text: "Descarga", link: "#" },
        { text: "Política de datos", link: "#" },
      ],
    },
    // {
    //   columnTitle: "Proyectos",
    //   options: [{ text: "Conoce tu país", link: "#" }],
    // },
    {
      columnTitle: "¿Ayuda?",
      options: [
        { text: "Centro de ayuda", link: "#" },
        { text: "Contáctanos", link: "#" },
        { text: "Reporta", link: "#" },
      ],
    },
  ];

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

                  <FooterColumns footerColumns={footerColumns}></FooterColumns>
                  <FooterCopywrite />
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
