// App

// Development phases for feature flagging
const Phase = {
  MVP: 'MVP',
  Phase2: 'Phase2',
  Phase3: 'Phase3',
  Phase4: 'Phase4',
  Phase5: 'Phase5',
  Phase6: 'Phase6',
  Phase7: 'Phase7',
  Phase8: 'Phase8',
} as const;

export const PHASES = Object.values(Phase);

export type Phase = typeof Phase[keyof typeof Phase];

export { Phase };

// Plan levels for subscription management
const PLANS_OFFER = {
  // Libre
  FREE: 'FREE',
  // Validación ($5/month)
  VALIDATION: 'VALIDATION',
  // Clave de fa ($59/month)
  STARTER: 'STARTER',
  // Clave de Do ($119/month)
  PROFESSIONAL: 'PROFESSIONAL',
  // Clave de Sol ($189/month)
  EXPERT: 'EXPERT',
  // Alta Frecuencia (custom pricing)
  PREMIUM: 'PREMIUM',
} as const;

export const PLANS_OFFER_VALUES = Object.values(PLANS_OFFER);

export type PLANS_OFFER = typeof PLANS_OFFER[keyof typeof PLANS_OFFER];

export { PLANS_OFFER };

// Enums

export const Target_Audience = {
  CHILDRENS: 'CHILDRENS',
  TEEN: 'TEEN',
  ADULTS_18: 'ADULTS_18',
  ADULTS_21: 'ADULTS_21',
  SENIOR: 'SENIOR',
  FAMILY: 'FAMILY',
  ALL_AGES: 'ALL_AGES',
} as const;

export const TARGET_AUDIENCE_VALUES = Object.values(Target_Audience);

export type Target_Audience = typeof Target_Audience[keyof typeof Target_Audience];

// Experience ranges for artists
export const ExperienceRange = {
  ENTRY: '0-5',
  INTERMEDIATE: '5-10',
  ADVANCED: '10-20',
  EXPERT: '20+',
} as const;

export const EXPERIENCE_RANGE_VALUES = Object.values(ExperienceRange);

export type ExperienceRange = typeof ExperienceRange[keyof typeof ExperienceRange];
