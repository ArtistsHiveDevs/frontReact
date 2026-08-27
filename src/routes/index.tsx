import React, { ReactElement, Suspense, useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useSearchParams } from 'react-router-dom';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { ROUTES_CONFIG } from './routes.config';

export interface PathConfig {
  object?: string;
  component?: any;
  path?: string;
  pathSeparator?: string;
  redirectToIfLoggedUser?: string;
  redirectToIfNotLoggedUser?: string;
  subpaths?: PathConfigMap;
}

export interface PathConfigMap {
  [key: string]: PathConfig | PathConfigMap;
}

const flattenPaths = (paths: PathConfigMap, parentPath = '/', parentObject = ''): PathConfig[] => {
  return Object.entries(paths).reduce<PathConfig[]>((acc, [key, value]) => {
    const currentObject = parentObject ? `${parentObject}.${key}` : key;
    const config = value as PathConfig;

    // Construir el path actual
    let currentPath = parentPath;
    if (config.path !== undefined && config.path !== '') {
      // Si tiene path definido, lo agrega al parentPath
      currentPath = `${parentPath}${config.path}`;
    }

    // Si tiene component o redirects, es una ruta final
    if (config.component || config.redirectToIfLoggedUser || config.redirectToIfNotLoggedUser) {
      acc.push({
        ...config,
        object: currentObject,
        path: currentPath,
      });
    } else if (!config.subpaths && !config.path) {
      // Si no tiene component, subpaths ni path, es un contenedor de rutas
      acc = acc.concat(flattenPaths(value as PathConfigMap, currentPath, currentObject));
    }

    // Procesar subpaths si existen
    if (config.subpaths) {
      const separator = config.pathSeparator ?? '/';
      acc = acc.concat(flattenPaths(config.subpaths as PathConfigMap, `${currentPath}${separator}`, currentObject));
    }

    return acc;
  }, []);
};

const generateRoutes = (userIsLoggedIn: boolean, possibleForcedNextPath: string) => {
  const routes: ReactElement[] = [];

  const flatPaths = flattenPaths(ROUTES_CONFIG);
  const finalRoutes = flatPaths.filter((possiblePath) => !!possiblePath.component);

  finalRoutes.forEach((route) => {
    let redirectPath = undefined;
    let next = undefined;
    let forcedNextPath = undefined;

    if (route.redirectToIfLoggedUser && userIsLoggedIn) {
      forcedNextPath = possibleForcedNextPath;
      redirectPath = forcedNextPath || route.redirectToIfLoggedUser;
      next = route.path;
    } else if (route.redirectToIfNotLoggedUser && !userIsLoggedIn) {
      forcedNextPath = possibleForcedNextPath;
      redirectPath = forcedNextPath || route.redirectToIfNotLoggedUser;
      next = route.path;
    } else {
      const Component = route.component;
      routes.push(<Route key={route.path} path={route.path} element={<Component />} />);
    }

    if (redirectPath) {
      const nextPathParam = !!next && !next.includes('/:') ? `?next=${encodeURIComponent(next)}` : '';
      // Sin la barra inicial el destino se resuelve relativo a la ruta actual (/profile/edit + login).
      const absoluteRedirectPath = redirectPath.startsWith('/') ? redirectPath : `/${redirectPath}`;
      routes.push(
        <Route
          key={route.path}
          path={route.path}
          element={<Navigate to={`${absoluteRedirectPath}${nextPathParam}`} />}
        />
      );
    }
  });

  return routes;
};

export const RoutesApp: React.FC = () => {
  const [generatedRoutes, setGeneratedRoutes] = useState([]);
  const { loggedUser } = useAuth();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const [nextPath, setNextPath] = useState(null);
  const [componentIsLoaded, setComponentIsLoaded] = useState(false);

  useEffect(() => {
    setNextPath(searchParams.get(URL_PARAMETER_NAMES.NEXT) || `/${PATHS.HOME}`);
  }, [searchParams]);

  useEffect(() => {
    setComponentIsLoaded(true);
    generate();
  }, []);

  useEffect(() => {
    generate();
  }, [loggedUser]);

  const generate = () => {
    const userID = getStoredUserIdToken();
    const datosCompletos = !!userID === !!loggedUser;

    if (datosCompletos) {
      setGeneratedRoutes(generateRoutes(!!userID, nextPath) || []);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      {/* <ScrollToTop /> */}
      <Suspense fallback={<AppLoader />}>
        {componentIsLoaded && !!generatedRoutes && <Routes>{generatedRoutes}</Routes>}
      </Suspense>
    </>
  );
};

// export default RoutesApp;
