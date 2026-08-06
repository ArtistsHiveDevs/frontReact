import { Alert, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
  selectorOpenCallApplications,
  useOpenCallApplicationsSlice,
} from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { GenericCrudErrorCode, RepoErrorPayload } from '~/common/utils/redux-injectors/types';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { AttributeConfiguration } from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  attributeToDynamicField,
  getFieldNamesFromPageSection,
} from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { OpenCallApplicationModel } from '~/models/domain/open-call/open-call-application.model';
import { OPEN_CALL_PAGE_CONFIG, OPEN_CALL_STEP_META, TRANSLATION_BASE_OPEN_CALL_PAGE } from './config-open-call';
import './index.scss';

const OpenCallApplicationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { translateText, getFormattedMessage } = useI18n();
  const urlParameters = useParams();
  const [openCallId, setOpenCallId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [previousApplicationsRequested, setPreviousApplicationsRequested] = useState(false);

  const loggedUser = useSelector(selectCurrentUser);

  const selectArtistById = selectorArtists.makeSelectItemById();

  const currentArtist = useSelector((state: RootState) => {
    if (loggedUser?.currentProfileInfo?.identifier) {
      return selectArtistById(state, loggedUser?.currentProfileInfo?.identifier);
    } else {
      return undefined;
    }
  });

  const selectOpenCallById = selectorOpenCalls.makeSelectItemById();

  const currentOpenCall = useSelector((state: RootState) => {
    if (openCallId) {
      return selectOpenCallById(state, openCallId);
    } else {
      return undefined;
    }
  });

  const { actions: openCallActions } = useOpenCallsSlice();
  const { actions: applicationActions } = useOpenCallApplicationsSlice();
  const applications: OpenCallApplicationModel[] = useSelector(selectorOpenCallApplications.selectItems);
  const createdApplication: OpenCallApplicationModel = useSelector(selectorOpenCallApplications.selectCreatedItem);
  const loading = useSelector(selectorOpenCallApplications.selectLoading);
  const submitError: RepoErrorPayload = useSelector(selectorOpenCallApplications.selectError);

  const translate = (key: string) => translateText(`${TRANSLATION_BASE_OPEN_CALL_PAGE}.${key}`);

  // `.id` en vez de `.entity`/`.identifier`: este último depende del username cacheado en
  // roles[].entityRoleMap[], que puede quedar desincronizado con la entidad viva.
  const isArtistProfile = !!loggedUser?.isArtistProfile;
  const currentArtistId = isArtistProfile ? loggedUser?.currentProfileInfo?.id : undefined;
  const currentArtistProfilePic = isArtistProfile ? loggedUser?.currentProfileInfo?.profile_pic : undefined;

  useEffect(() => {
    setIsArtistProfile(!!loggedUser?.isArtistProfile);
    setCurrentArtistId(isArtistProfile ? loggedUser?.currentProfileInfo?.id : undefined);
    setCurrentArtistProfilePic(isArtistProfile ? loggedUser?.currentProfileInfo?.profile_pic : undefined);
    if (!!loggedUser?.currentProfileInfo?.identifier) {
      dispatch(artistActions.getItemById({ id: loggedUser?.currentProfileInfo?.identifier }));
    }
  }, [loggedUser]);

  // Función para obtener el valor inicial de un campo desde currentArtist
  const getInitialValue = (fieldName: string) => {
    if (!currentArtist) return undefined;

    console.log(currentArtist);
    const fieldMapping: { [key: string]: any } = {
      // Step 1
      artist_name: currentArtist.name,
      country: currentArtist.country?.name,
      city: currentArtist.city,
      email: currentArtist.email,
      phone: currentArtist.phone || currentArtist.whatsapp,
      genre: currentArtist.genre,
      synopsis: currentArtist.synopsis,
      social_instagram: currentArtist.instagram,
      social_facebook: currentArtist.facebook,
      social_tiktok: currentArtist.tiktok,
      website: currentArtist.website,

      // Step 2
      music_link: currentArtist.spotify,
      video_link: currentArtist.youtube,
    };

    return fieldMapping[fieldName];
  };

  const formMethods = useForm({ mode: 'onTouched' });
  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (openCallId && isArtistProfile) {
      // La ruta /open-call-applications no filtra por query params server-side hoy; el filtro real ocurre abajo.
      dispatch(applicationActions.loadItems({ queryParams: { open_call_id: openCallId } }));
      setPreviousApplicationsRequested(true);
    }
  }, [openCallId, isArtistProfile]);

  const belongsToThisOpenCallAndArtist = (application?: OpenCallApplicationModel) =>
    !!application && application.openCallId === openCallId && application.artistId === currentArtistId;

  const previousApplication = currentArtistId ? applications.find(belongsToThisOpenCallAndArtist) : undefined;

  // `createdItem` sobrevive a envíos anteriores dentro de la misma sesión: el éxito solo se da por
  // válido si además hubo un submit desde esta pantalla y la aplicación creada es la de esta convocatoria.
  const submissionSucceeded = submitted && belongsToThisOpenCallAndArtist(createdApplication);
  const submissionFailed = submitted && !loading && !createdApplication && !!submitError;
  const isSubmitting = submitted && loading;
  const isCheckingPreviousApplications = !submitted && (!previousApplicationsRequested || loading);

  const buildSubmitErrorMessage = (error: RepoErrorPayload) => {
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

  const submitErrorMessage = submissionFailed ? buildSubmitErrorMessage(submitError) : undefined;

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
    dispatch(applicationActions.createItem({ data: applicationData }));
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const onError = () => {
    window.scrollTo(0, 0);
  };

  const goToOpenCallDetails = () => navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}/${openCallId}`);

  if (!isArtistProfile) {
    return (
      <div className="open-call-page">
        <div className="open-call-header">
          <h1 className="open-call-title">{translate('no_artist_profile.title')}</h1>
          <p className="open-call-subtitle">{translate('no_artist_profile.message')}</p>
        </div>
      </div>
    );
  }

  if (submissionSucceeded) {
    return (
      <div className="open-call-page">
        <div className="submission-success">
          <div className="success-icon">&#10003;</div>
          <h2 className="success-title">{translate('success.title')}</h2>
          <p className="success-message">{translate('success.message')}</p>
          <button className="success-btn" onClick={() => navigate(`/${PATHS.HOME}`)}>
            {translate('success.back_button')}
          </button>
        </div>
      </div>
    );
  }

  if (isCheckingPreviousApplications) {
    return <AppLoader />;
  }

  if (previousApplication) {
    return (
      <div className="open-call-page">
        <div className="submission-success">
          <div className="success-icon">&#10003;</div>
          <h2 className="success-title">{translate('already_applied.title')}</h2>
          <p className="success-message">
            {translate('already_applied.message')}
            <br />
            {translate('already_applied.status_label')}{' '}
            {translate(`application_status.${previousApplication.status}`)}
          </p>
          <button className="success-btn" onClick={goToOpenCallDetails}>
            {translate('already_applied.details_button')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="open-call-page">
      {/* Header */}
      <div className="open-call-header">
        <h1 className="open-call-title">{translate('title')}</h1>
        <p className="open-call-subtitle">{translate('subtitle')}</p>
      </div>

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
                  (component.data?.attributes || []).map((attr: AttributeConfiguration, attrIdx: number) => {
                    const fieldData = attributeToDynamicField(attr);
                    const initialValue = getInitialValue(attr.name);

                    // Si hay un valor inicial del artista, usarlo
                    if (initialValue !== undefined) {
                      fieldData.defaultValue = initialValue;
                    }

                    return (
                      <div key={`${section.name}-${attr.name}-${attrIdx}`}>
                        <DynamicControl fieldData={fieldData} errors={errors} handlers={{}} />
                      </div>
                    );
                  })
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

export default OpenCallApplicationPage;
