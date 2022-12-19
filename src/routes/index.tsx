import { lazy } from "react";
import { Routes, Route } from "react-router-dom";

import { PATHS } from "~/constants";

// Lazy loading
const HomePage = lazy(() => import("~/components/Pages/HomePage"));
const EventPage = lazy(() => import("~/components/Pages/EventsPage"));
const NotFoundPage = lazy(() => import("~/components/Pages/NotFoundPage"));

export const RoutesApp: React.FC = () => {
  return (
    <Routes>
      <Route element={<HomePage />} path={PATHS.HOME} />
      <Route element={<EventPage />} path={PATHS.EVENTS} />
      <Route element={<NotFoundPage />} path={PATHS.NOT_FOUND} />
    </Routes>
  );
};
