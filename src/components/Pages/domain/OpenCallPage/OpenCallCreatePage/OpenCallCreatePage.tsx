import { Alert, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { selectorOpenCalls, useOpenCallsSlice } from '~/common/slices/domain/open-calls/open-calls.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import { AttributeConfiguration } from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  attributeToDynamicField,
  getFieldNamesFromPageSection,
} from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { PATHS } from '~/constants';
import '../OpenCallApplicationPage/index.scss';
import { CREATE_OPEN_CALL_STEP_META, OPEN_CALL_CREATE_CONFIG } from './config-open-call-create';

const OpenCallCreatePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const [placeId, setPlaceId] = useState(undefined);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [canCreateOpenCall, setCanCreateOpenCall] = useState(true);

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
    <RequireAuthComponent requiredSession={true}>
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
                    Anterior
                  </button>

                  {currentStep < totalSteps - 1 ? (
                    <button type="button" className="nav-btn btn-next" onClick={handleNext}>
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
          </>
        )}
      </div>
    </RequireAuthComponent>
  );
};

export default OpenCallCreatePage;
