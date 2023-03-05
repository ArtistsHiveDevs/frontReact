import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";

// Lazy loading
const HomePage = lazy(() => import("~/components/Pages/HomePage/MainHome"));
const NotFoundPage = lazy(() => import("~/components/Pages/NotFoundPage"));
const ContactUsPage = lazy(
  () => import("~/components/Pages/app-base/ContactUs/ContactUsPage")
);
const TermsAndConditionsPage = lazy(
  () =>
    import(
      "~/components/Pages/app-base/TermsAndConditions/TermsAndConditionsPage"
    )
);

const AppSettingsPage = lazy(
  () => import("~/components/Pages/app-base/SettingsPage")
);

const SearchPage = lazy(() => import("~/components/Pages/SearchPage"));

// Load rider pages
const UserDetailsPage = lazy(
  () => import("~/components/Pages/app-base/UsersPage/UserDetails")
);

// Load rider pages
const RiderListPage = lazy(
  () => import("~/components/Pages/RidersPage/RiderList")
);

const RiderDetailsPage = lazy(
  () => import("~/components/Pages/RidersPage/RiderDetail")
);

// Load events/shows pages
const EventsListPage = lazy(
  () => import("~/components/Pages/EventsPage/EventsListPage")
);

const EventDetailsPage = lazy(
  () => import("~/components/Pages/EventsPage/EventDetailsPage")
);

// Load Artists pages
const ArtistsListPage = lazy(
  () => import("~/components/Pages/ArtistsPage/ArtistsList")
);
const ArtistDetailsPage = lazy(
  () => import("~/components/Pages/ArtistsPage/ArtistDetails")
);

// Load Places pages
const PlacesListPage = lazy(
  () => import("~/components/Pages/PlacesPage/PlacesListPage")
);

const PlaceDetailsPage = lazy(
  () => import("~/components/Pages/PlacesPage/PlaceDetailsPage")
);

// Load CulturalAgenda page
const CulturalAgendaPage = lazy(
  () =>
    import("~/components/Pages/domain/CulturalAgenda/home/cultural-agenda-page")
);

export const RoutesApp: React.FC = () => {
  return (
    <Routes>
      <Route path={PATHS.ARTISTS}>
        <Route element={<ArtistsListPage />} path="" />
        <Route
          element={<ArtistDetailsPage />}
          path={
            SUB_PATHS.ELEMENT_DETAILS + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`
          }
        />
      </Route>
      <Route path={PATHS.CULTURAL_AGENDA}>
        <Route element={<CulturalAgendaPage />} path="" />
      </Route>
      <Route path={PATHS.RIDERS}>
        <Route element={<RiderListPage />} path="" />
        <Route
          element={<RiderDetailsPage />}
          path={
            SUB_PATHS.ELEMENT_DETAILS + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`
          }
        />
      </Route>
      <Route path={PATHS.EVENTS}>
        <Route element={<EventsListPage />} path="" />
        <Route
          element={<EventDetailsPage />}
          path={
            SUB_PATHS.ELEMENT_DETAILS + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`
          }
        />
      </Route>
      <Route path={PATHS.PLACES}>
        <Route element={<PlacesListPage />} path="" />
        <Route
          element={<PlaceDetailsPage />}
          path={
            SUB_PATHS.ELEMENT_DETAILS + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`
          }
        />
      </Route>
      <Route path={PATHS.PROFILE}>
        <Route element={<UserDetailsPage />} path="" />
      </Route>
      <Route element={<HomePage />} path={PATHS.HOME} />
      <Route element={<Navigate to={PATHS.HOME} />} path={PATHS.MAIN} />
      <Route element={<SearchPage />} path={PATHS.SEARCH} />
      <Route element={<ContactUsPage />} path={PATHS.CONTACT_US} />
      <Route
        element={<TermsAndConditionsPage />}
        path={PATHS.TERMS_AND_CONDITIONS}
      />

      <Route element={<NotFoundPage />} path={PATHS.NOT_FOUND} />
      <Route path={PATHS.SETTINGS}>
        <Route element={<AppSettingsPage />} path="" />
      </Route>
    </Routes>
  );
};
