import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  ReportClaimErrorType,
  selectReportClaimError,
  selectReportClaimLoading,
  selectReportClaimSuccess,
  useReportClaimSlice,
} from '~/common/slices/domain/reportClaim.redux';
import { useI18n } from '~/common/utils';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DynamicControl, DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms';
import { REPORT_CLAIM_REASON_OPTIONS } from '~/constants/domain/reportClaim.constants';
import { getModelInfoFromInstance } from '~/models/base/modelHelpers';
import { ReportClaimEntityType } from '~/models/domain/reportClaim/reportClaim.model';

import './ReportProfileForm.scss';

const I18N_PATH = 'app.appbase.reportProfileForm';

interface ReportProfileFormProps {
  open: boolean;
  onClose: () => void;
  entity: any;
}

export const ReportProfileForm = ({ open, onClose, entity }: ReportProfileFormProps) => {
  const { translateText, translateGlobalDict } = useI18n();
  const dispatch = useDispatch();

  const { actions: reportClaimActions } = useReportClaimSlice();
  const loading = useSelector(selectReportClaimLoading);
  const success = useSelector(selectReportClaimSuccess);
  const reportClaimError = useSelector(selectReportClaimError);
  const errorType = reportClaimError?.errorType;

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const formMethods = useForm();
  const {
    handleSubmit,
    formState: { errors },
    reset,
  } = formMethods;

  const entityType = getModelInfoFromInstance(entity)?.entityName as ReportClaimEntityType;
  const entityId = entity?._id || entity?.id;
  const identifier = entity?.identifier;

  useEffect(() => {
    if (!loading && hasSubmitted) {
      setHasSubmitted(false);
      if (success) {
        setShowSuccessDialog(true);
      }
    }
  }, [loading]);

  const resetForm = () => {
    reset();
    dispatch(reportClaimActions.resetReportClaimState());
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onSubmit = (data: { reason: string; description?: string }) => {
    dispatch(
      reportClaimActions.submitReportClaim({
        entityType,
        entityId,
        identifier,
        reason: data.reason as any,
        description: data.description,
      })
    );
    setHasSubmitted(true);
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    resetForm();
    onClose();
  };

  const reasonField: DynamicFieldData = {
    inputType: 'select',
    fieldName: 'reason',
    label: translateText(`${I18N_PATH}.reason_label`),
    options: REPORT_CLAIM_REASON_OPTIONS.map((option) => ({
      value: option.value,
      label: translateText(`${I18N_PATH}.reasons.${option.i18nKey}`),
    })),
    config: { required: true },
  };

  const descriptionField: DynamicFieldData = {
    inputType: 'textarea',
    fieldName: 'description',
    label: translateText(`${I18N_PATH}.description_label`),
    placeholder: translateText(`${I18N_PATH}.description_placeholder`),
  };

  const errorMessage =
    errorType === ReportClaimErrorType.DUPLICATE_PENDING_REPORT
      ? translateText(`${I18N_PATH}.duplicate_pending_error`)
      : translateText(`${I18N_PATH}.error_message`);

  return (
    <>
      <AppDialog
        isOpenDialog={open}
        onClose={handleClose}
        title={translateText(`${I18N_PATH}.title`)}
        content={
          <FormProvider {...formMethods}>
            <form noValidate className="report-profile-form">
              <DynamicControl fieldData={reasonField} errors={errors} handlers={{}} />
              <div className="report-profile-form-description">
                <DynamicControl fieldData={descriptionField} errors={errors} handlers={{}} />
              </div>
              {!!errorType && <div className="report-profile-form-error">{errorMessage}</div>}
            </form>
          </FormProvider>
        }
        actions={[
          { label: translateGlobalDict('actions.cancel'), handler: handleClose },
          { label: translateText(`${I18N_PATH}.submit_button`), handler: handleSubmit(onSubmit) },
        ]}
      />

      <AppDialog
        isOpenDialog={showSuccessDialog}
        onClose={handleSuccessDialogClose}
        title={translateText(`${I18N_PATH}.title`)}
        content={<div style={{ margin: '1rem' }}>{translateText(`${I18N_PATH}.success_message`)}</div>}
        actions={[{ label: 'OK', handler: handleSuccessDialogClose }]}
      />
    </>
  );
};
