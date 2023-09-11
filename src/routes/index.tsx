import { lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from "~/constants";

// Lazy loading
const HomePage = lazy(() => import("~/components/Pages/HomePage/MainHome"));
const NotFoundPage = lazy(() => import("~/components/Pages/NotFoundPage"));
const LoginPage = lazy(
  () => import("~/components/Pages/app-base/users/login/LoginPage")
);
const SignUpPage = lazy(
  () => import("~/components/Pages/app-base/users/sign-up/SignUpPage")
);
const ContactUsPage = lazy(
  () => import("~/components/Pages/app-base/ContactUs/ContactUsPage")
);
const TermsAndConditionsPage = lazy(
  () =>
    import(
      "~/components/Pages/app-base/TermsAndConditions/TermsAndConditionsPage"
    )
);
const PrivacyPolicyPage = lazy(
  () => import("~/components/Pages/app-base/PrivacyPolicy/PrivacyPolicyPage")
);

const AppSettingsPage = lazy(
  () => import("~/components/Pages/app-base/SettingsPage")
);

const SearchPage = lazy(() => import("~/components/Pages/SearchPage"));

// Load rider pages
const UserDetailsPage = lazy(
  () => import("~/components/Pages/app-base/UsersPage/UserDetails")
);

const IndustryOfferPage = lazy(
  () =>
    import(
      "~/components/Pages/domain/industry-offer/template/IndustryOfferTemplate"
    )
);

// Load rider pages
const RiderListPage = lazy(
  () => import("~/components/Pages/domain/RidersPage/RidersList")
);

const RiderDetailsPage = lazy(
  () =>
    import(
      "~/components/Pages/domain/RidersPage/RiderDetails/rider-details-page"
    )
);

// Load events/shows pages
const EventsListPage = lazy(
  () => import("~/components/Pages/EventsPage/EventsListPage")
);

const EventDetailsPage = lazy(
  () => import("~/components/Pages/EventsPage/EventDetailsPage")
);

// Load Academies pages
const AcademiesListPage = lazy(
  () => import("~/components/Pages/domain/AcademiesPage/AcademiesListPage")
);
const AcademyDetailsPage = lazy(
  () => import("~/components/Pages/domain/AcademiesPage/AcademyDetailsPage")
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

// Load Favourites page
const TourPreplanningListPage = lazy(
  () =>
    import(
      "~/components/Pages/domain/FavouritesPages/TourPlanningListPage/TourPreplanningListPage"
    )
);
const SavedListPage = lazy(
  () =>
    import(
      "~/components/Pages/domain/FavouritesPages/SavedListPage/SavedListPage"
    )
);

export const RoutesApp: React.FC = () => {
  return (
    <Routes>
      <Route path={PATHS.ACADEMIES}>
        <Route element={<AcademiesListPage />} path="" />
        <Route
          element={<AcademyDetailsPage />}
          path={
            SUB_PATHS.ELEMENT_DETAILS + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`
          }
        />
      </Route>
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
      <Route element={<LoginPage />} path={PATHS.LOGIN} />
      <Route element={<SignUpPage />} path={PATHS.SIGN_UP} />
      <Route element={<Navigate to={PATHS.HOME} />} path={PATHS.MAIN} />
      <Route element={<SearchPage />} path={PATHS.SEARCH} />
      <Route element={<PrivacyPolicyPage />} path={PATHS.PRIVACY_POLICY} />
      <Route element={<ContactUsPage />} path={PATHS.CONTACT_US} />
      <Route
        element={<TermsAndConditionsPage />}
        path={PATHS.TERMS_AND_CONDITIONS}
      />

      <Route element={<NotFoundPage />} path={PATHS.NOT_FOUND} />
      <Route path={PATHS.SETTINGS}>
        <Route element={<AppSettingsPage />} path="" />
      </Route>
      <Route path={PATHS.INDUSTRY_OFFER}>
        <Route
          element={<IndustryOfferPage />}
          path={`:${URL_PARAMETER_NAMES.ROLE}`}
        />
      </Route>
      <Route path={PATHS.MY_FAVOURITES}>
        <Route element={<SavedListPage />} path="" />
      </Route>
      <Route path={PATHS.TOURS_OUTLINE}>
        <Route element={<TourPreplanningListPage />} path="" />
        <Route
          element={<PlaceDetailsPage />}
          path={
            SUB_PATHS.ELEMENT_DETAILS + `/:${URL_PARAMETER_NAMES.ELEMENT_ID}`
          }
        />
      </Route>
    </Routes>
  );
};
