export type EnvType = 'prod' | 'uat' | 'sit' | 'dev';

export function getEnvironment(): string {
  return import.meta.env.VITE_AMP_ENV || 'dev';
}
