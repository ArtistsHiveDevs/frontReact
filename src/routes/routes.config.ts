import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { PathConfigMap } from '.';

const detailsPagePath = `${SUB_PATHS.ELEMENT_DETAILS}/:${URL_PARAMETER_NAMES.ELEMENT_ID}`;

export const ROUTES_CONFIG: PathConfigMap = {
  app: {
    Main: { componentPath: '../components/Pages/HomePage/MainHome', path: PATHS.MAIN },
    HomePage: { componentPath: '../components/Pages/HomePage/MainHome', path: PATHS.HOME },
    NotFoundPage: { componentPath: '../components/Pages/NotFoundPage', path: PATHS.NOT_FOUND },
    LoginPage: {
      componentPath: '../components/Pages/app-base/users/login/LoginPage',
      path: PATHS.LOGIN,
      redirectToIfLoggedUser: PATHS.HOME,
    },
    SignUpPage: {
      componentPath: '../components/Pages/app-base/users/sign-up/SignUpPage',
      path: PATHS.SIGN_UP,
      redirectToIfLoggedUser: PATHS.HOME,
    },
    ContactUsPage: { componentPath: '../components/Pages/app-base/ContactUs/ContactUsPage', path: PATHS.CONTACT_US },
    TermsAndConditionsPage: {
      componentPath: '../components/Pages/app-base/TermsAndConditions/TermsAndConditionsPage',
      path: PATHS.TERMS_AND_CONDITIONS,
    },
    PrivacyPolicyPage: {
      componentPath: '../components/Pages/app-base/PrivacyPolicy/PrivacyPolicyPage',
      path: PATHS.PRIVACY_POLICY,
    },

    AppSettingsPage: {
      componentPath: '../components/Pages/app-base/SettingsPage',
      path: PATHS.SETTINGS,
      redirectToIfNotLoggedUser: PATHS.LOGIN,
    },
  },
  domain: {
    sections: {
      CulturalAgendaPage: {
        componentPath: '../components/Pages/domain/CulturalAgenda/home/cultural-agenda-page',
        path: PATHS.CULTURAL_AGENDA,
      },
      SavedListPage: {
        componentPath: '../components/Pages/domain/FavouritesPages/SavedListPage/SavedListPage',
        path: PATHS.MY_FAVOURITES,
        redirectToIfNotLoggedUser: PATHS.LOGIN,
      },
      SearchPage: { componentPath: '../components/Pages/SearchPage', path: PATHS.SEARCH },
      offer: {
        IndustryOfferPage: {
          componentPath: '../components/Pages/domain/industry-offer/template/IndustryOfferTemplate',
          path: `${PATHS.INDUSTRY_OFFER}/:${URL_PARAMETER_NAMES.ROLE}`,
        },
      },
    },
    entities: {
      academy: {
        path: PATHS.ACADEMIES,
        subpaths: {
          AcademiesListPage: { componentPath: '../components/Pages/domain/AcademiesPage/AcademiesListPage' },
          AcademyDetailsPage: {
            componentPath: '../components/Pages/domain/AcademiesPage/AcademyDetailsPage',
            path: detailsPagePath,
          },
        },
      },
      artist: {
        path: PATHS.ARTISTS,
        subpaths: {
          ArtistsListPage: { componentPath: '../components/Pages/ArtistsPage/ArtistsList' },
          ArtistDetailsPage: {
            componentPath: '../components/Pages/ArtistsPage/ArtistDetails',
            path: detailsPagePath,
          },
          ArtistCreatePage: {
            componentPath: '../components/Pages/ArtistsPage/ArtistCreatePage/ArtistCreatePage',
            path: `${SUB_PATHS.CREATE}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
      event: {
        path: PATHS.EVENTS,
        subpaths: {
          EventsListPage: { componentPath: '../components/Pages/EventsPage/EventsListPage' },
          EventDetailsPage: { componentPath: '../components/Pages/EventsPage/EventDetailsPage', path: detailsPagePath },
          EventCreatePage: {
            componentPath: '../components/Pages/EventsPage/EventCreatePage/EventCreatePage',
            path: `${SUB_PATHS.CREATE}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
      place: {
        path: PATHS.PLACES,
        subpaths: {
          PlacesListPage: { componentPath: '../components/Pages/PlacesPage/PlacesListPage' },

          PlaceDetailsPage: { componentPath: '../components/Pages/PlacesPage/PlaceDetailsPage', path: detailsPagePath },

          PlaceCreatePage: {
            componentPath: '../components/Pages/PlacesPage/PlacesCreatePage/PlacesCreatePage',
            path: `${SUB_PATHS.CREATE}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
      rider: {
        path: PATHS.RIDERS,
        subpaths: {
          RiderListPage: {
            componentPath: '../components/Pages/domain/RidersPage/RidersList',
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          RiderDetailsPage: {
            componentPath: '../components/Pages/domain/RidersPage/RiderDetails/rider-details-page',
            redirectToIfNotLoggedUser: PATHS.LOGIN,
            path: detailsPagePath,
          },
        },
      },
      tour: {
        path: PATHS.TOURS_OUTLINE,
        subpaths: {
          TourPreplanningListPage: {
            componentPath: '../components/Pages/domain/FavouritesPages/TourPlanningListPage/TourPreplanningListPage',
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          TourDetailsPage: {
            componentPath: '../components/Pages/domain/FavouritesPages/TourDetailsPage/TourDetailsPage',
            redirectToIfNotLoggedUser: PATHS.LOGIN,
            path: detailsPagePath,
          },
        },
      },
      user: {
        path: PATHS.PROFILE,
        subpaths: {
          UserDetailsPage: {
            componentPath: '../components/Pages/app-base/UsersPage/UserDetails',
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          UserCreatePage: {
            componentPath: '../components/Pages/app-base/UsersPage/UserCreatePage/UserCreatePage',
            path: `${SUB_PATHS.CREATE}`,
          },
        },
      },
    },
  },
};
