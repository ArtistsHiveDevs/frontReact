import { Stack } from '@mui/material';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';
import { PATHS } from '~/constants';
import { OPEN_CALL_STEPS, OpenCallStep } from './steps-config';
import './index.scss';

const STEP_DESCRIPTIONS: Record<string, string> = {
  general: 'Cuéntanos sobre tu proyecto artístico y cómo contactarte.',
  multimedia: 'Comparte enlaces a tu música, videos y redes sociales.',
  show: 'Describe tu propuesta de show en vivo.',
  technical: 'Detalla tus necesidades técnicas para la presentación.',
  logistics: 'Información sobre costos, transporte y hospedaje.',
};

const OpenCallApplicationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const formMethods = useForm({ mode: 'onTouched' });
  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = formMethods;

  const totalSteps = OPEN_CALL_STEPS.length;
  const step: OpenCallStep = OPEN_CALL_STEPS[currentStep];
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const getStepFieldNames = (stepIndex: number): string[] => {
    return OPEN_CALL_STEPS[stepIndex].fields.map((f) => f.fieldName);
  };

  const handleNext = async () => {
    const fieldNames = getStepFieldNames(currentStep);
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
    // Going forward: validate all intermediate steps
    for (let i = currentStep; i < targetStep; i++) {
      const fieldNames = getStepFieldNames(i);
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
    // TODO: dispatch to redux slice or API call
    console.log('Open Call Application submitted:', data);
    setSubmitted(true);
    window.scrollTo(0, 0);
  };

  const onError = () => {
    window.scrollTo(0, 0);
  };

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

  const data = new OpenCallModel({});
  
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
          {OPEN_CALL_STEPS.map((s, index) => (
            <span
              key={s.name}
              className={[
                'step-label',
                index === currentStep ? 'active' : '',
                index < currentStep ? 'completed' : '',
              ].join(' ')}
              onClick={() => goToStep(index)}
            >
              {s.name.charAt(0).toUpperCase() + s.name.slice(1)}
            </span>
          ))}
        </div>
      </div>

      {/* Form */}
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
          <div className="step-content">
            <h3 className="step-title">{step.name.charAt(0).toUpperCase() + step.name.slice(1)}</h3>
            <p className="step-description">{STEP_DESCRIPTIONS[step.name]}</p>
            <p className="required-notice">Los campos marcados con * son obligatorios</p>

            <Stack spacing={2}>
              {step.fields.map((fieldData: DynamicFieldData, index: number) => (
                <div key={`${step.name}-${fieldData.fieldName}-${index}`}>
                  <DynamicControl fieldData={fieldData} errors={errors} handlers={{}} />
                </div>
              ))}
            </Stack>
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
