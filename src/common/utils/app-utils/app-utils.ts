import { PATHS } from "~/constants/routes.constants";

export type EnvironmentType = 'prod' | 'uat' | 'sit' | 'dev';

export function getEnvironment(): EnvironmentType {
  return import.meta.env.VITE_AMP_ENV || 'uat';
}

export function isProdEnvironment(): boolean {
  return ['prod'].includes(getEnvironment());
}

export function fullyHiddenSectionsByEnvironment (forbiddenEnvironments: string[] | undefined) :boolean{
  return forbiddenEnvironments?.includes(getEnvironment());
}

export function buildSharedUrl (username: string) {
    const currentSplitPath = window.location.pathname.split('/');
    const currentDomain = window.location.hostname;
    currentSplitPath[currentSplitPath.length -1] = `${PATHS.USERNAME}${currentSplitPath[currentSplitPath.length -1]}`;
    
    const buildCustomPath = currentSplitPath?.reduce((acum, current) => acum + (current.length > 0 ? '/' + current : ''), '');
    const buildCustomDomain = `shared.${currentDomain}`;
    
    return buildCustomDomain+buildCustomPath;
};
