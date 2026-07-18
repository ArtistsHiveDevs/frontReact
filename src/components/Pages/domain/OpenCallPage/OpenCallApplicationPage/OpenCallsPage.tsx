import { Stack } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { AttributeConfiguration } from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  attributeToDynamicField,
  getFieldNamesFromPageSection,
} from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { useOpenCallApplicationsSlice } from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { OPEN_CALL_PAGE_CONFIG, OPEN_CALL_STEP_META } from './config-open-call';
import './index.scss';

const OpenCallApplicationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const urlParameters = useParams();
  const openCallId = urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID];
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const loggedUser = useSelector(selectCurrentUser);
  const { actions: applicationActions } = useOpenCallApplicationsSlice();

  const isArtistProfile = !!loggedUser && loggedUser.currentProfileInfo?.entity === 'ArtistModel';
  const currentArtistId = isArtistProfile ? loggedUser?.currentProfileInfo?.identifier : undefined;
  const currentArtistProfilePic = isArtistProfile ? loggedUser?.currentProfileInfo?.profile_pic : undefined;

  const formMethods = useForm({ mode: 'onTouched' });
  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = formMethods;

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

  if (!isArtistProfile) {
    return (
      <div className="open-call-page">
        <div className="open-call-header">
          <h1 className="open-call-title">No tienes un perfil de artista activo</h1>
          <p className="open-call-subtitle">
            Solo se puede aplicar a una convocatoria desde un perfil de Artista. Verifica que hayas ingresado con el
            perfil correcto.
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="open-call-page">
        <div className="submission-success">
          <div className="success-icon">&#10003;</div>
          <h2 className="success-title">Aplicación enviada</h2>
          <p className="success-message">
            Tu aplicación ha sido recibida correctamente. Revisaremos tu propuesta y nos pondremos en contacto contigo a
            través del correo electrónico proporcionado.
          </p>
          <button className="success-btn" onClick={() => navigate(`/${PATHS.HOME}`)}>
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="open-call-page">
      {/* Header */}
      <div className="open-call-header">
        <h1 className="open-call-title">Convocatoria Abierta</h1>
        <p className="open-call-subtitle">
          Completa el formulario para aplicar como artista. Toda la información nos ayuda a evaluar tu propuesta y
          coordinar la logística del evento.
        </p>
      </div>

      {/* Stepper progress */}
      <div className="stepper-progress">
        <div className="stepper-info">
          <span className="step-counter">
            Paso {currentStep + 1} de {totalSteps}
          </span>
          <span className="step-percentage">{progress}% completado</span>
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
            <p className="required-notice">Los campos marcados con * son obligatorios</p>

            {(step.sections || []).map((section) => (
              <Stack key={section.name} spacing={2} sx={{ mb: 3 }}>
                {(section.components || []).map((component) =>
                  (component.data?.attributes || []).map((attr: AttributeConfiguration, attrIdx: number) => (
                    <div key={`${section.name}-${attr.name}-${attrIdx}`}>
                      <DynamicControl
                        fieldData={attributeToDynamicField(attr)}
                        errors={errors}
                        handlers={{}}
                      />
                    </div>
                  ))
                )}
              </Stack>
            ))}
          </div>

          {/* Navigation */}
          <div className="step-navigation">
            <button type="button" className="nav-btn btn-prev" onClick={handlePrev} disabled={currentStep === 0}>
              Anterior
            </button>

            {currentStep < totalSteps - 1 ? (
              <button type="button" className="nav-btn btn-next" onClick={handleNext}>
                Siguiente
              </button>
            ) : (
              <button type="submit" className="nav-btn btn-submit">
                Enviar aplicación
              </button>
            )}
          </div>

          <p className="save-notice">Puedes guardar y continuar más tarde</p>
        </form>
      </FormProvider>
    </div>
  );
};

export default OpenCallApplicationPage;
