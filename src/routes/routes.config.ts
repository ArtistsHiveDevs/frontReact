import { lazy } from 'react';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { PathConfigMap } from '.';

const detailsPagePath = `${SUB_PATHS.ELEMENT_DETAILS}/:${URL_PARAMETER_NAMES.ELEMENT_ID}`;
const usernamePagePath = `:${URL_PARAMETER_NAMES.ELEMENT_ID}`;

export const ROUTES_CONFIG: PathConfigMap = {
  app: {
    Main: {
      component: lazy(() => import('~/components/Pages/HomePage/MainHome')),
      path: PATHS.MAIN,
    },
    HomePage: {
      component: lazy(() => import('~/components/Pages/HomePage/MainHome')),
      path: PATHS.HOME,
    },
    NotFoundPage: {
      component: lazy(() => import('~/components/Pages/NotFoundPage')),
      path: PATHS.NOT_FOUND,
    },
    LoginPage: {
      component: lazy(() => import('~/components/Pages/app-base/users/login/LoginPage')),
      path: PATHS.LOGIN,
      redirectToIfLoggedUser: PATHS.HOME,
    },
    SignUpPage: {
      component: lazy(() => import('~/components/Pages/app-base/users/sign-up/SignUpPage')),
      path: PATHS.SIGN_UP,
      redirectToIfLoggedUser: PATHS.HOME,
    },
    ContactUsPage: {
      component: lazy(() => import('~/components/Pages/app-base/ContactUs/ContactUsPage')),
      path: PATHS.CONTACT_US,
    },
    TermsAndConditionsPage: {
      component: lazy(() => import('~/components/Pages/app-base/TermsAndConditions/TermsAndConditionsPage')),
      path: PATHS.TERMS_OF_SERVICE,
    },
    PrivacyPolicyPage: {
      component: lazy(() => import('~/components/Pages/app-base/PrivacyPolicy/PrivacyPolicyPage')),
      path: PATHS.PRIVACY_POLICY,
    },
    FAQPage: {
      component: lazy(() => import('~/components/Pages/app-base/faq/faq')),
      path: PATHS.FAQ,
    },

    AppSettingsPage: {
      component: lazy(() => import('~/components/Pages/app-base/SettingsPage')),
      path: PATHS.SETTINGS,
      redirectToIfNotLoggedUser: PATHS.LOGIN,
    },
    PlansPage: {
      component: lazy(() => import('~/components/shared/organisms/app/PlansOffer/PlansOfferPage/PlansOfferPage')),
      path: PATHS.PLANS,
    },
  },
  domain: {
    sections: {
      CulturalAgendaPage: {
        component: lazy(() => import('~/components/Pages/domain/CulturalAgenda/home/cultural-agenda-page')),
        path: PATHS.CULTURAL_AGENDA,
      },
      SavedListPage: {
        component: lazy(() => import('~/components/Pages/domain/FavouritesPages/SavedListPage/SavedListPage')),
        path: PATHS.MY_FAVOURITES,
        redirectToIfNotLoggedUser: PATHS.LOGIN,
      },
      SearchPage: { component: lazy(() => import('~/components/Pages/SearchPage')), path: PATHS.SEARCH },
      offer: {
        IndustryOfferPage: {
          component: lazy(() => import('~/components/Pages/domain/industry-offer/template/IndustryOfferTemplate')),
          path: `${PATHS.INDUSTRY_OFFER}/:${URL_PARAMETER_NAMES.ROLE}`,
        },
      },
      Industry: {
        createIndustryEntityPage: {
          component: lazy(() => import('~/components/Pages/domain/IndustryPages/CreateIndustryEntityPage')),
          path: PATHS.INDUSTRY,
          redirectToIfNotLoggedUser: PATHS.LOGIN,
        },
      },
    },
    entities: {
      academy: {
        path: PATHS.ACADEMIES,
        subpaths: {
          AcademiesListPage: {
            component: lazy(() => import('~/components/Pages/domain/AcademiesPage/AcademiesListPage')),
          },
          AcademyDetailsPage: {
            component: lazy(() => import('~/components/Pages/domain/AcademiesPage/AcademyDetailsPage')),
            path: detailsPagePath,
          },
        },
      },
      artist: {
        path: PATHS.ARTISTS,
        subpaths: {
          ArtistsListPage: { component: lazy(() => import('~/components/Pages/ArtistsPage/ArtistsList')) },
          ArtistDetailsPage: {
            component: lazy(() => import('~/components/Pages/ArtistsPage/ArtistDetails')),
            path: detailsPagePath,
          },
          ArtistCreatePage: {
            component: lazy(() => import('~/components/Pages/ArtistsPage/ArtistCreatePage/ArtistCreatePage')),
            path: `${SUB_PATHS.CREATE}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          ArtistEditPage: {
            component: lazy(() => import('~/components/Pages/ArtistsPage/ArtistCreatePage/ArtistCreatePage')),
            path: `${SUB_PATHS.EDIT}/:${URL_PARAMETER_NAMES.ELEMENT_ID}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
      event: {
        path: PATHS.EVENTS,
        subpaths: {
          EventsListPage: { component: lazy(() => import('~/components/Pages/EventsPage/EventsListPage')) },
          EventDetailsPage: {
            component: lazy(() => import('~/components/Pages/EventsPage/EventDetailsPage')),
            path: detailsPagePath,
          },
          EventCreatePage: {
            component: lazy(() => import('~/components/Pages/EventsPage/EventCreatePage/EventCreatePage')),
            path: `${SUB_PATHS.CREATE}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
      place: {
        path: PATHS.PLACES,
        subpaths: {
          PlacesListPage: { component: lazy(() => import('~/components/Pages/PlacesPage/PlacesListPage')) },

          PlaceDetailsPage: {
            component: lazy(() => import('~/components/Pages/PlacesPage/PlaceDetailsPage')),
            path: detailsPagePath,
          },

          PlaceCreatePage: {
            component: lazy(() => import('~/components/Pages/PlacesPage/PlacesCreatePage/PlacesCreatePage')),
            path: `${SUB_PATHS.CREATE}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          PlaceEditPage: {
            component: lazy(() => import('~/components/Pages/PlacesPage/PlacesCreatePage/PlacesCreatePage')),
            path: `${SUB_PATHS.EDIT}/:${URL_PARAMETER_NAMES.ELEMENT_ID}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
      rider: {
        path: PATHS.RIDERS,
        subpaths: {
          RiderListPage: {
            component: lazy(() => import('~/components/Pages/domain/RidersPage/RidersList')),
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          RiderDetailsPage: {
            component: lazy(() => import('~/components/Pages/domain/RidersPage/RiderDetails/rider-details-page')),
            redirectToIfNotLoggedUser: PATHS.LOGIN,
            path: detailsPagePath,
          },
        },
      },
      stagePlot: {
        path: PATHS.STAGE_PLOT,
        subpaths: {
          creator: {
            component: lazy(() => import('~/components/Pages/domain/RidersPage/StagePlot/StagePlotEditor')),
            path: `${SUB_PATHS.EDITOR}/:${URL_PARAMETER_NAMES.ELEMENT_ID}`,
            // redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
      tour: {
        path: PATHS.TOURS_OUTLINE,
        subpaths: {
          TourPreplanningListPage: {
            component: lazy(
              () => import('~/components/Pages/domain/FavouritesPages/TourPlanningListPage/TourPreplanningListPage')
            ),
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          TourDetailsPage: {
            component: lazy(() => import('~/components/Pages/domain/FavouritesPages/TourDetailsPage/TourDetailsPage')),
            redirectToIfNotLoggedUser: PATHS.LOGIN,
            path: detailsPagePath,
          },
        },
      },
      user: {
        path: PATHS.PROFILE,
        subpaths: {
          UserDetailsPage: {
            component: lazy(() => import('~/components/Pages/app-base/UsersPage/UserDetails')),
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
          UserCreatePage: {
            component: lazy(() => import('~/components/Pages/app-base/UsersPage/UserCreatePage/UserCreatePage')),
            path: `${SUB_PATHS.CREATE}`,
            redirectToIfLoggedUser: PATHS.HOME,
          },
          UserEditPage: {
            component: lazy(() => import('~/components/Pages/app-base/UsersPage/UserCreatePage/UserCreatePage')),
            path: `${SUB_PATHS.EDIT}`,
            redirectToIfNotLoggedUser: PATHS.LOGIN,
          },
        },
      },
    },
  },
  utils: {
    PaymentsPage: {
      component: lazy(() => import('~/components/Pages/utils/payments/Payment.page')),
      path: PATHS.PAYMENTS,
    },
  },
};
