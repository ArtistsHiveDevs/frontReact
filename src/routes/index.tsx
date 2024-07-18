import React, { lazy, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import AppLoader from '~/components/shared/organisms/app/loader/loader';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';
import ScrollToTop from '../components/shared/atoms/app/ScrollToTop';
import { ROUTES_CONFIG } from './routes.config';

export interface PathConfig {
  object?: string;
  componentPath?: string;
  path?: string;
  redirectToIfLoggedUser?: string;
  redirectToIfNotLoggedUser?: string;
  subpaths?: PathConfigMap;
}

export interface PathConfigMap {
  [key: string]: PathConfig | PathConfigMap;
}

const flattenPaths = (paths: PathConfigMap, parentPath = '', parentObject = ''): PathConfig[] => {
  return Object.entries(paths).reduce<PathConfig[]>((acc, [key, value]) => {
    const currentObject = parentObject ? `${parentObject}.${key}` : key;
    const config = value as PathConfig;
    const currentPath = `${parentPath}${config.path || ''}`;

    if (config.componentPath || config.path || config.redirectToIfLoggedUser || config.redirectToIfNotLoggedUser) {
      acc.push({
        object: currentObject,
        componentPath: config.componentPath,
        path: currentPath,
        redirectToIfLoggedUser: config.redirectToIfLoggedUser,
        redirectToIfNotLoggedUser: config.redirectToIfNotLoggedUser,
      });
    } else {
      acc.push({ object: currentObject });
      acc = acc.concat(flattenPaths(value as PathConfigMap, currentPath, currentObject));
    }

    if (config.subpaths) {
      acc = acc.concat(flattenPaths(config.subpaths as PathConfigMap, `${currentPath}/`, currentObject));
    }

    return acc;
  }, []);
};

const loadComponent = (componentPath: string) => {
  // Usa la función import sin plantilla de cadena
  return lazy(() => import(/* @vite-ignore */ `${componentPath}`));
};

const generateRoutes = (userIsLoggedIn: boolean, possibleForcedNextPath: string, location: any) => {
  const routes: JSX.Element[] = [];

  const flatPaths = flattenPaths(ROUTES_CONFIG as unknown as PathConfigMap);
  const finalRoutes = flatPaths.filter((possiblePath) => !!possiblePath.componentPath);

  finalRoutes.forEach((route) => {
    const Component = loadComponent(route.componentPath as string);

    const loggedForbidenNextPaths = [`${PATHS.LOGIN}`, `${PATHS.SIGN_UP}`];
    const notLoggedForbidenNextPaths = [`${PATHS.HOME}`];
    const forbiddenRedirect = [`${PATHS.HOME}`];

    const currentPath = location.pathname;

    let redirectPath = undefined;
    let next = undefined;
    let forcedNextPath = undefined;

    if (route.redirectToIfLoggedUser && userIsLoggedIn) {
      if (!forbiddenRedirect.includes(possibleForcedNextPath)) {
        forcedNextPath = possibleForcedNextPath;
      }

      redirectPath = forcedNextPath || route.redirectToIfLoggedUser;

      if (!loggedForbidenNextPaths.includes(route.path)) {
        next = route.path;
      }
    } else if (route.redirectToIfNotLoggedUser && !userIsLoggedIn) {
      if (!forbiddenRedirect.includes(possibleForcedNextPath)) {
        forcedNextPath = possibleForcedNextPath;
      }

      redirectPath = forcedNextPath || route.redirectToIfNotLoggedUser;

      if (!notLoggedForbidenNextPaths.includes(route.path)) {
        next = route.path;
      }
    } else {
      routes.push(<Route key={route.path} path={route.path} element={<Component />} />);
    }

    if (redirectPath) {
      // No debe incluir parámetros en la URL y se debe codificar
      const nextPathParam = !!next && !next.includes('/:') ? `?next=${encodeURIComponent(next)}` : '';

      routes.push(
        <Route key={route.path} path={route.path} element={<Navigate to={`${redirectPath}${nextPathParam}`} />} />
      );
    }
  });

  return routes;
};

export const RoutesApp: React.FC = () => {
  const [generatedRoutes, setGeneratedRoutes] = useState<JSX.Element[] | null>(null);

  const { loggedUser } = useAuth();

  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [nextPath, setNextPath] = useState<string | null>(null);

  useEffect(() => {
    setNextPath(searchParams.get(URL_PARAMETER_NAMES.NEXT) || PATHS.HOME);
  }, [searchParams]);

  // Cargar el componente y obtener el token
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
    generate();
  }, []);

  useEffect(() => {
    generate();
  }, [loggedUser]);

  const generate = () => {
    const userID = getStoredUserIdToken();
    const datosCompletos = !!userID === !!loggedUser;

    if (datosCompletos) {
      setGeneratedRoutes(generateRoutes(!!userID, nextPath, location) || []);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<AppLoader />}>
        <Routes>{generatedRoutes}</Routes>
      </Suspense>
    </>
  );
};
