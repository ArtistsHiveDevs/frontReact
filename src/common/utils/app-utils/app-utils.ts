export type EnvironmentType = 'prod' | 'uat' | 'sit' | 'dev';

export function getEnvironment(): EnvironmentType {
  return import.meta.env.VITE_AMP_ENV || 'uat';
}

export function isProdEnvironment(): boolean {
  return ['prod'].includes(getEnvironment());
}
