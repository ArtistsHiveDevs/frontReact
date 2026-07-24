export const ProfileActiveStatus = {
  ACTIVE: 'ACTIVE',
  TEMPORARLY_INACTIVE: 'TEMPORARLY_INACTIVE',
  PERMANENT_INACTIVE: 'PERMANENT_INACTIVE',
  UNDEFINED: 'UNDEFINED',
} as const;

export const PROFILE_ACTIVE_STATUS_VALUES = Object.values(ProfileActiveStatus);

export type ProfileActiveStatus = typeof ProfileActiveStatus[keyof typeof ProfileActiveStatus];

export const ProfileNature = {
  PUBLIC: 'PUBLIC',
  PRIVATE: 'PRIVATE',
  MIXED: 'MIXED',
} as const;

export const PROFILE_NATURE_VALUES = Object.values(ProfileNature);

export type ProfileNature = typeof ProfileNature[keyof typeof ProfileNature];

// Estado de revisión del perfil por parte del equipo de Artist Hive; hoy es solo informativo, no bloquea acciones.
export const ProfileApprovalStatus = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
} as const;

export const PROFILE_APPROVAL_STATUS_VALUES = Object.values(ProfileApprovalStatus);

export type ProfileApprovalStatus = typeof ProfileApprovalStatus[keyof typeof ProfileApprovalStatus];
