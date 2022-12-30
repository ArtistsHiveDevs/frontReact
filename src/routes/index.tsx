import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";

// Lazy loading
const HomePage = lazy(() => import("~/components/Pages/HomePage/MainHome"));
const NotFoundPage = lazy(() => import("~/components/Pages/NotFoundPage"));
const SearchPage = lazy(() => import("~/components/Pages/SearchPage"));

// Load rider pages
const RiderListPage = lazy(
  () => import("~/components/Pages/RidersPage/RiderList")
);

const RiderDetailPage = lazy(
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
      <Route path={PATHS.RIDERS}>
        <Route element={<RiderListPage />} path="" />
        <Route
          element={<RiderDetailPage />}
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
      <Route element={<HomePage />} path={PATHS.HOME} />
      <Route element={<Navigate to={PATHS.HOME} />} path={PATHS.MAIN} />
      <Route element={<SearchPage />} path={PATHS.SEARCH} />

      <Route element={<NotFoundPage />} path={PATHS.NOT_FOUND} />
    </Routes>
  );
};
