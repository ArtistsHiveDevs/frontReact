import { Alert } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectorOpenCalls, useOpenCallsSlice } from '~/common/slices/domain/open-calls/open-calls.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { getEventTypeOptions, getStageTypeOptions } from '~/common/utils/form-options';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import {
  getFieldNamesFromPageSection,
  pageSectionToDynamicFields,
} from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { registerAllBuilders } from '~/components/shared/organisms/gui/builders/componentBuilders';
import { DynamicForm, SelectOption } from '~/components/shared/organisms/gui/dynamicForms';
import { PATHS } from '~/constants';
import '../OpenCallApplicationPage/index.scss';
import {
  CREATE_OPEN_CALL_STEP_META,
  getOpenCallCreateConfig,
  TRANSLATION_BASE_OPEN_CALL_CREATE_PAGE,
} from './config-open-call-create';

const OpenCallCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { translateGlobalDict } = useI18n();
  const [placeId, setPlaceId] = useState(undefined);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [canCreateOpenCall, setCanCreateOpenCall] = useState(true);
  const [eventTypeOptions, setEventTypeOptions] = useState<SelectOption[]>([]);
  const [stageTypeOptions, setStageTypeOptions] = useState<SelectOption[]>([]);
  const isNavigatingRef = useRef(false);

  // Registrar builders de componentes
  useEffect(() => {
    registerAllBuilders();
  }, []);

  const loggedUser = useSelector(selectCurrentUser);
  const { actions: openCallActions } = useOpenCallsSlice();
  const createdItem = useSelector(selectorOpenCalls.selectCreatedItem);
  const loading = useSelector(selectorOpenCalls.selectLoading);
  const submitError = useSelector(selectorOpenCalls.selectError);

  // Solo el dueño o un administrador del Place indicado en `placeId` puede crear la convocatoria.
  // El backend ya rechaza esto server-side; esta validación evita mostrar el formulario completo
  // a un usuario que de todas formas no podrá enviarlo.

  useEffect(() => {
    
    setPlaceId(loggedUser?.currentProfileInfo?.id);
    console.log('Actualizando el effect', loggedUser, placeId, loggedUser?.currentProfileInfo?.id);
    // setCanCreateOpenCall(!!loggedUser && !!placeId && loggedUser.checkPermissions(placeId).canEdit);
  }, [loggedUser, placeId]);

  // Generar opciones traducidas
  useEffect(() => {
    setEventTypeOptions(getEventTypeOptions({ translateFn: translateGlobalDict }));
    setStageTypeOptions(getStageTypeOptions({ translateFn: translateGlobalDict }));
  }, [translateGlobalDict]);

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

  // Derivado (no state propio): solo se muestra tras un intento de submit que terminó en error real.
  const showSubmitError = submitted && !loading && !createdItem && !!submitError;
  const submitErrorMessage = showSubmitError
    ? submitError?.status === 403
      ? 'No tienes permisos para crear una convocatoria para este lugar.'
      : 'No se pudo crear la convocatoria. Intenta nuevamente más tarde.'
    : null;

  // Generar configuración con opciones traducidas
  const steps = getOpenCallCreateConfig({ eventTypeOptions, stageTypeOptions });
  const totalSteps = steps.length;
  const step = steps[currentStep];
  const stepMeta = step ? CREATE_OPEN_CALL_STEP_META[step.name] : null;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);

  const handleNext = async () => {
    if (isNavigatingRef.current) {
      console.log('⏸️ Already navigating, ignoring');
      return;
    }

    console.log('📍 handleNext called', { currentStep, totalSteps, stepsLength: steps.length });
    isNavigatingRef.current = true;

    try {
      const fieldNames = getFieldNamesFromPageSection(steps[currentStep]);
      const isValid = await trigger(fieldNames);
      console.log('✅ Validation result:', isValid);

      if (isValid && currentStep < totalSteps - 1) {
        console.log('➡️ Moving to next step');
        setCurrentStep((prev) => prev + 1);
        window.scrollTo(0, 0);
      } else {
        console.log('⚠️ Not moving:', { isValid, condition: currentStep < totalSteps - 1 });
      }
    } finally {
      // Esperar un momento antes de permitir otra navegación
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 300);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToStep = async (targetStep: number) => {
    console.log('🎯 goToStep called', { currentStep, targetStep });

    if (isNavigatingRef.current) {
      console.log('⏸️ goToStep: Already navigating, ignoring');
      return;
    }

    isNavigatingRef.current = true;

    try {
      if (targetStep < currentStep + 1) {
        console.log('⬅️ Going backwards to', targetStep);
        setCurrentStep(targetStep);
        window.scrollTo(0, 0);
        return;
      }

      console.log('➡️ Validating steps from', currentStep, 'to', targetStep);
      for (let i = currentStep; i < targetStep + 1; i++) {
        const fieldNames = getFieldNamesFromPageSection(steps[i]);
        const isValid = await trigger(fieldNames);
        console.log(`Step ${i} validation:`, isValid);
        if (!isValid) {
          console.log('❌ Validation failed at step', i);
          setCurrentStep(i);
          window.scrollTo(0, 0);
          return;
        }
      }
      console.log('✅ All validations passed, moving to step', targetStep);
      setCurrentStep(targetStep);
      window.scrollTo(0, 0);
    } finally {
      setTimeout(() => {
        isNavigatingRef.current = false;
      }, 300);
    }
  };

  const onSubmit = (data: any) => {
    console.log('🚀 onSubmit called', { currentStep, totalSteps, data });
    console.trace('Submit stack trace');
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

  // Prevenir submit al presionar Enter en campos de texto
  const handleKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;

    // Solo procesar si la tecla es Enter
    if (event.key === 'Enter') {
      // Si es un textarea, permitir el comportamiento normal (salto de línea)
      if (target.tagName === 'TEXTAREA') {
        return;
      }

      // Si es el botón de submit en el último paso, permitir el submit
      if (target.tagName === 'BUTTON' && (target as HTMLButtonElement).type === 'submit') {
        return;
      }

      // En cualquier otro caso, prevenir el submit por defecto
      event.preventDefault();
      event.stopPropagation();

      // Si no estamos en el último paso, avanzar al siguiente
      if (currentStep < totalSteps - 1) {
        handleNext();
      }
    }
  };

  return (
    <RequireAuthComponent resourceEntity={createdItem} requiredSession={true}>
      <div className="open-call-page">
        {!canCreateOpenCall ? (
          <div className="open-call-header">
            <h1 className="open-call-title">No tienes permisos para crear esta convocatoria</h1>
            <p className="open-call-subtitle">
              Solo el dueño o un administrador del lugar puede crear una convocatoria para él. Verifica que hayas
              ingresado con el perfil correcto o que el enlace sea válido.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="open-call-header">
              <h1 className="open-call-title">Crear Convocatoria</h1>
              <p className="open-call-subtitle">
                Completa la información del evento y las fechas de la convocatoria. Los artistas podrán aplicar durante
                el periodo que definas.
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
            {eventTypeOptions.length === 0 || stageTypeOptions.length === 0 ? (
              <p>Cargando opciones...</p>
            ) : (
              <FormProvider {...formMethods}>
                <form onSubmit={handleSubmit(onSubmit, onError)} onKeyDown={handleKeyDown} noValidate>
                  <div className="step-content">
                    <h3 className="step-title">{stepMeta?.title || step?.title || step?.name}</h3>
                    <p className="step-description">{stepMeta?.description}</p>
                    <p className="required-notice">Los campos marcados con * son obligatorios</p>

                    <DynamicForm
                      key={`step-${currentStep}-${step.name}`}
                      fields={pageSectionToDynamicFields(step)}
                      handlers={{}}
                      translationBasePath={TRANSLATION_BASE_OPEN_CALL_CREATE_PAGE}
                      formMethods={formMethods}
                      hideSubmitButton={true}
                      useExternalForm={true}
                    />
                  </div>

                  {submitErrorMessage && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {submitErrorMessage}
                    </Alert>
                  )}

                  {/* Navigation */}
                  <div className="step-navigation">
                    <button
                      type="button"
                      className="nav-btn btn-prev"
                      onClick={handlePrev}
                      disabled={currentStep === 0}
                    >
                      Anterior
                    </button>

                    {currentStep < totalSteps - 1 ? (
                      <button
                        type="button"
                        className="nav-btn btn-next"
                        onClick={(e) => {
                          console.log('🖱️ Next button clicked', { currentStep, totalSteps });
                          e.preventDefault();
                          e.stopPropagation();
                          handleNext();
                        }}
                      >
                        Siguiente
                      </button>
                    ) : (
                      <button type="submit" className="nav-btn btn-submit" disabled={loading}>
                        Crear Convocatoria
                      </button>
                    )}
                  </div>

                  <p className="save-notice">Puedes guardar y continuar más tarde</p>
                </form>
              </FormProvider>
            )}
          </>
        )}
      </div>
    </RequireAuthComponent>
  );
};

export default OpenCallCreatePage;
