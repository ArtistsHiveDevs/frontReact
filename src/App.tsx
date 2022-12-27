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
import FooterColumns, {
  FooterColumnTemplate,
} from "./components/shared/Footer/columns-menu";
import FooterCopywrite from "./components/shared/Footer/footer-copywrite";
import { PATHS } from "./constants";

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
                <FooterColumns footerColumns={footerColumns}></FooterColumns>
                <FooterCopywrite></FooterCopywrite>
              </Suspense>
            </div>
          </IntlProvider>
        </Router>
      </HvAppContextProvider>
    </HelmetProvider>
  );
};

export default App;
