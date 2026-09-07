export type EnvironmentType = 'prod' | 'uat' | 'sit' | 'dev';

export function getEnvironment(): EnvironmentType {
  return import.meta.env.VITE_AMP_ENV || 'uat';
}

const PROD_ENV: EnvironmentType = 'prod';
const PROD_REPLICA_ENVS: EnvironmentType[] = [
  'dev',
  'uat',
  ];

export function isActualProdEnvironment(): boolean {
  return getEnvironment() === PROD_ENV;
}

export function isProdEnvironment(): boolean {
  return replyEnvs([PROD_ENV]).includes(getEnvironment());
}

export function replyEnvs(envs?: string[]): string[] | undefined {
  if (!envs || !envs.includes(PROD_ENV)) {
    return envs;
  }
  PROD_REPLICA_ENVS.forEach((env) => {
    if (!envs.includes(env)) {
      envs.push(env);
    }
  });
  return envs;
}

export function fullyHiddenSectionsByEnvironment(forbiddenEnvironments: string[] | string | undefined): boolean {
  const envs = Array.isArray(forbiddenEnvironments) ? forbiddenEnvironments : [forbiddenEnvironments];
  replyEnvs(envs);
  return envs.includes(getEnvironment());
}
