import { GenericCrudErrorCode, RepoErrorPayload } from '~/common/utils/redux-injectors/types';

/**
 * Construye mensajes de error específicos para open call applications
 */
export const buildOpenCallSubmitErrorMessage = (
  error: RepoErrorPayload,
  translate: (key: string) => string
): string => {
  if (error.status === 409 || error.errorCode === GenericCrudErrorCode.VALIDATION_DUPLICATE_KEY) {
    return translate('submit_errors.duplicate');
  }
  if (error.status === 400) {
    return translate('submit_errors.not_accepting_applications');
  }
  if (error.status === 404) {
    return translate('submit_errors.open_call_not_found');
  }
  return translate('submit_errors.generic');
};
