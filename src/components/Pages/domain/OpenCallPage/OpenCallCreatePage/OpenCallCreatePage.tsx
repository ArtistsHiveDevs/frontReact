import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormProvider, useForm } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { AttributeConfiguration } from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  attributeToDynamicField,
  getFieldNamesFromPageSection,
} from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { PATHS } from '~/constants';
import { useOpenCallsSlice, selectorOpenCalls } from '~/common/slices/domain/open-calls/open-calls.redux';
import { OPEN_CALL_CREATE_CONFIG, CREATE_OPEN_CALL_STEP_META } from './config-open-call-create';
import '../OpenCallApplicationPage/index.scss';

const OpenCallCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const placeId = searchParams.get('placeId');
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const { actions: openCallActions } = useOpenCallsSlice();
  const createdItem = useSelector(selectorOpenCalls.selectCreatedItem);
  const loading = useSelector(selectorOpenCalls.selectLoading);

  const formMethods = useForm({ mode: 'onTouched' });
  const {
    handleSubmit,
    trigger,
    formState: { errors },
  } = formMethods;

  useEffect(() => {
    if (submitted && createdItem) {
      navigate(`/${PATHS.OPEN_CALLS}`);
    }
  }, [submitted, createdItem]);

  const steps = OPEN_CALL_CREATE_CONFIG;
  const totalSteps = steps.length;
  const step = steps[currentStep];
  const stepMeta = CREATE_OPEN_CALL_STEP_META[step.name];
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
    const openCallData = {
      ...data,
      place_id: placeId,
      status: 'OPEN',
    };
    dispatch(openCallActions.createItem({ data: openCallData }));
    setSubmitted(true);
  };

  const onError = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className="open-call-page">
      {/* Header */}
      <div className="open-call-header">
        <h1 className="open-call-title">Crear Convocatoria</h1>
        <p className="open-call-subtitle">
          Completa la información del evento y las fechas de la convocatoria. Los artistas podrán aplicar durante el
          periodo que definas.
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
                Crear Convocatoria
              </button>
            )}
          </div>

          <p className="save-notice">Puedes guardar y continuar más tarde</p>
        </form>
      </FormProvider>
    </div>
  );
};

export default OpenCallCreatePage;
