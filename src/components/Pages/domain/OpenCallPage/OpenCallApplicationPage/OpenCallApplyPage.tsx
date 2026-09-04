import { Alert, Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useI18n } from '~/common/utils';
import {
  buildOpenCallSubmitErrorMessage,
  NoArtistProfileView,
  SuccessView,
  useOpenCallApplications,
  useProfileInfo,
} from '~/components/Pages/domain/OpenCallPage/common';
import { ProfilePictureWithName } from '~/components/shared/atoms/gui/ProfilePictureList/ProfilePictureWithName';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { AttributeConfiguration } from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  attributeToDynamicField,
  getFieldNamesFromPageSection,
} from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { OPEN_CALL_PAGE_CONFIG, OPEN_CALL_STEP_META, TRANSLATION_BASE_OPEN_CALL_PAGE } from './config-open-call';
import './index.scss';

const OpenCallApplyPage = () => {
  const navigate = useNavigate();
  const { translateText, getFormattedMessage } = useI18n();
  const urlParameters = useParams();
  const openCallId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];

  // ========== CUSTOM HOOKS ==========
  const {
    loggedUser,
    isArtistProfile,
    currentProfileId: currentArtistId,
    currentProfilePic: currentArtistProfilePic,
  } = useProfileInfo();

  const {
    createdApplication,
    loading,
    error: submitError,
    previousApplication,
    requestedLoad: previousApplicationsRequested,
    belongsToThisOpenCallAndArtist,
    createApplication,
  } = useOpenCallApplications({
    openCallId,
    artistId: currentArtistId,
    autoLoad: true,
  });

  // ========== ESTADOS LOCALES ==========
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const formMethods = useForm({ mode: 'onTouched' });
  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = formMethods;

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_OPEN_CALL_PAGE}.${key}`);

  // ========== VALORES DERIVADOS ==========
  const submissionSucceeded = submitted && belongsToThisOpenCallAndArtist(createdApplication);
  const submissionFailed = submitted && !loading && !createdApplication && !!submitError;
  const isSubmitting = submitted && loading;
  const isCheckingPreviousApplications = isArtistProfile && (!previousApplicationsRequested || (loading && !submitted));

  // ========== HANDLERS ==========
  const submitErrorMessage = submissionFailed ? buildOpenCallSubmitErrorMessage(submitError, translate) : undefined;

  const steps = OPEN_CALL_PAGE_CONFIG;
  const totalSteps = steps.length;
  const step = steps[currentStep];
  const stepMeta = OPEN_CALL_STEP_META[step.name];
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleNext = async () => {
    const fieldNames = getFieldNamesFromPageSection(steps[currentStep]);
    const isValid = await trigger(fieldNames);
    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = async (targetStep: number) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      window.scrollTo(0, 0);
      return;
    }
    for (let i = currentStep; i < targetStep; i++) {
      const fieldNames = getFieldNamesFromPageSection(steps[i]);
      const isValid = await trigger(fieldNames);
      if (!isValid) {
        setCurrentStep(i);
        window.scrollTo(0, 0);
        return;
      }
    }
    setCurrentStep(targetStep);
    window.scrollTo(0, 0);
  };

  const onSubmit = (data: any) => {
    const applicationData = {
      open_call_id: openCallId,
      artist_id: currentArtistId,
      artist_name: data.artist_name,
      artist_city: data.city,
      artist_profile_pic: currentArtistProfilePic,
      survey_responses: data,
    };
    createApplication(applicationData);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const onError = () => {
    window.scrollTo(0, 0);
  };

  const goToOpenCallDetails = () => navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}/${openCallId}`);

  // ========== RENDERIZADO CONDICIONAL ==========

  // 1. Esperar a que loggedUser esté cargado
  if (!loggedUser) {
    return <AppLoader />;
  }

  // 2. Si no es perfil de artista
  if (!isArtistProfile) {
    return (
      <NoArtistProfileView
        title={translate('no_artist_profile.title')}
        message={translate('no_artist_profile.message')}
      />
    );
  }

  // 3. Si el submit fue exitoso
  if (submissionSucceeded) {
    return (
      <SuccessView
        title={translate('success.title')}
        message={translate('success.message')}
        buttonText={translate('success.back_button')}
        onButtonClick={() => navigate(`/${PATHS.HOME}`)}
      />
    );
  }

  // 4. Si está checkeando aplicaciones previas
  if (isCheckingPreviousApplications) {
    return <AppLoader />;
  }

  // 5. Si ya aplicó antes
  if (previousApplication) {
    return (
      <SuccessView
        title={translate('already_applied.title')}
        message={
          <>
            {translate('already_applied.message')}
            <br />
            {translate('already_applied.status_label')} {translate(`application_status.${previousApplication.status}`)}
          </>
        }
        buttonText={translate('already_applied.details_button')}
        onButtonClick={goToOpenCallDetails}
      />
    );
  }

  // 6. Mostrar formulario
  return (
    <div className="open-call-page">
      {/* Header */}
      <div className="open-call-header">
        <h1 className="open-call-title">{translate('title')}</h1>
        <p className="open-call-subtitle">{translate('subtitle')}</p>
      </div>

      {/* Applicant */ loggedUser && <ProfilePictureWithName element={loggedUser.currentProfileInfo} />}

      {/* Stepper progress */}
      <div className="stepper-progress">
        <div className="stepper-info">
          <span className="step-counter">
            {getFormattedMessage(`${TRANSLATION_BASE_OPEN_CALL_PAGE}.step_counter`, {
              current: currentStep + 1,
              total: totalSteps,
            })}
          </span>
          <span className="step-percentage">
            {getFormattedMessage(`${TRANSLATION_BASE_OPEN_CALL_PAGE}.step_progress`, { progress })}
          </span>
        </div>
        <div className="stepper-bar">
          <div className="stepper-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="stepper-labels">
          {steps.map((s, index) => (
            <span
              key={s.name}
              className={[
                'step-label',
                index === currentStep ? 'active' : '',
                index < currentStep ? 'completed' : '',
              ].join(' ')}
              onClick={() => goToStep(index)}
            >
              {s.title || s.name}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="step-content">
            <h3 className="step-title">{stepMeta?.title || step.title || step.name}</h3>
            <p className="step-description">{stepMeta?.description}</p>
            <p className="required-notice">{translate('required_notice')}</p>

            {(step.sections || []).map((section) => (
              <Stack key={section.name} spacing={2} sx={{ mb: 3 }}>
                {(section.components || []).map((component) =>
                  (component.data?.attributes || []).map((attr: AttributeConfiguration, attrIdx: number) => (
                    <div key={`${section.name}-${attr.name}-${attrIdx}`}>
                      <DynamicControl fieldData={attributeToDynamicField(attr)} errors={errors} handlers={{}} />
                    </div>
                  ))
                )}
              </Stack>
            ))}
          </div>

          {submitErrorMessage && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitErrorMessage}
            </Alert>
          )}

          {/* Navigation */}
          <div className="step-navigation">
            <button type="button" className="nav-btn btn-prev" onClick={handlePrev} disabled={currentStep === 0}>
              {translate('prev_button')}
            </button>

            {currentStep < totalSteps - 1 ? (
              <button type="button" className="nav-btn btn-next" onClick={handleNext}>
                {translate('next_button')}
              </button>
            ) : (
              <button type="submit" className="nav-btn btn-submit" disabled={isSubmitting}>
                {isSubmitting ? translate('submitting_button') : translate('submit_button')}
              </button>
            )}
          </div>

          <p className="save-notice">{translate('save_notice')}</p>
        </form>
      </FormProvider>
    </div>
  );
};

export default OpenCallApplyPage;
