export const ReportClaimReason = {
  DUPLICATE: 'DUPLICADO',
  FAKE: 'FALSO',
  WRONG_INFO: 'INFORMACION_ERRONEA',
  BELONGS_TO_ME: 'ME_PERTENECE_PERO_ASIGNADO_A_OTRO',
  INAPPROPRIATE_CONTENT: 'CONTENIDO_INAPROPIADO',
  OTHER: 'OTRO',
} as const;

export type ReportClaimReason = typeof ReportClaimReason[keyof typeof ReportClaimReason];

export const REPORT_CLAIM_REASON_OPTIONS: { value: ReportClaimReason; i18nKey: string }[] = [
  { value: ReportClaimReason.DUPLICATE, i18nKey: 'DUPLICATE' },
  { value: ReportClaimReason.FAKE, i18nKey: 'FAKE' },
  { value: ReportClaimReason.WRONG_INFO, i18nKey: 'WRONG_INFO' },
  { value: ReportClaimReason.BELONGS_TO_ME, i18nKey: 'BELONGS_TO_ME' },
  { value: ReportClaimReason.INAPPROPRIATE_CONTENT, i18nKey: 'INAPPROPRIATE_CONTENT' },
  { value: ReportClaimReason.OTHER, i18nKey: 'OTHER' },
];
