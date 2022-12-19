import { lazy } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";

// Lazy loading
const HomePage = lazy(() => import("~/components/Pages/HomePage"));
const EventPage = lazy(() => import("~/components/Pages/EventsPage"));
const NotFoundPage = lazy(() => import("~/components/Pages/NotFoundPage"));

// Load rider pages
const RiderListPage = lazy(
  () => import("~/components/Pages/RidersPage/RiderList")
);

const RiderDetailPage = lazy(
  () => import("~/components/Pages/RidersPage/RiderDetail")
);

// Load events/shows pages
const ShowListPage = lazy(
  () => import("~/components/Pages/ShowsPage/ShowsList")
);

const ShowDetailPage = lazy(
  () => import("~/components/Pages/ShowsPage/ShowDetail")
);

// Load Artists pages
const ArtistsListPage = lazy(
  () => import("~/components/Pages/ArtistsPage/ArtistsList")
);
const ArtistDetailPage = lazy(
  () => import("~/components/Pages/ArtistsPage/ArtistDetail")
);

export const RoutesApp: React.FC = () => {
  return (
    <Routes>
      <Route path={PATHS.ARTIST}>
        <Route element={<ArtistsListPage />} path="" />
        <Route
          element={<ArtistDetailPage />}
          path={SUB_PATHS.DETAIL + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`}
        />
      </Route>
      <Route path={PATHS.RIDERS}>
        <Route element={<RiderListPage />} path="" />
        <Route
          element={<RiderDetailPage />}
          path={SUB_PATHS.DETAIL + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`}
        />
      </Route>
      <Route path={PATHS.SHOWS}>
        <Route element={<ShowListPage />} path="" />
        <Route
          element={<ShowDetailPage />}
          path={SUB_PATHS.DETAIL + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`}
        />
      </Route>
      <Route element={<HomePage />} path={PATHS.HOME} />
      <Route element={<EventPage />} path={PATHS.EVENTS} />
      <Route element={<NotFoundPage />} path={PATHS.NOT_FOUND} />
      <Route element={<Navigate to={PATHS.HOME} />} path={PATHS.MAIN} />
    </Routes>
  );
};
