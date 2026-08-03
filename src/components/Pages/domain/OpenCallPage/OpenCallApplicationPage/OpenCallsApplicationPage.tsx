import { Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { selectorArtists, useArtistsSlice } from '~/common/slices/domain/artists/artist.redux';
import { useOpenCallApplicationsSlice } from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { selectorOpenCalls, useOpenCallsSlice } from '~/common/slices/domain/open-calls/open-calls.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { RootState } from '~/common/utils/redux-injectors/types';
import { AttributeConfiguration } from '~/components/shared/organisms/gui/builders/component-types.def';
import {
  attributeToDynamicField,
  getFieldNamesFromPageSection,
} from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { OPEN_CALL_PAGE_CONFIG, OPEN_CALL_STEP_META } from './config-open-call';
import './index.scss';

const OpenCallApplicationPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const urlParameters = useParams();
  const [openCallId, setOpenCallId] = useState(urlParameters[URL_PARAMETER_NAMES.ELEMENT_ID]);
  const [currentStep, setCurrentStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [isArtistProfile, setIsArtistProfile] = useState(false);
  const [currentArtistId, setCurrentArtistId] = useState<string>();
  const [currentArtistProfilePic, setCurrentArtistProfilePic] = useState<string>();

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
  const { actions: artistActions } = useArtistsSlice();

  useEffect(() => {
    if (!!openCallId) {
      dispatch(openCallActions.getItemById({ id: openCallId }));
    }
  }, [openCallId]);

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

  // Esperar a que currentArtist se cargue antes de mostrar el formulario
  if (!currentArtist) {
    return (
      <div className="open-call-page">
        <div className="open-call-header">
          <h1 className="open-call-title">Cargando...</h1>
          <p className="open-call-subtitle">Estamos preparando tu información</p>
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
          <button className="success-btn" onClick={() => navigate(`/${PATHS.OPEN_CALLS}`)}>
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
        {currentOpenCall && (
          <>
            <h1 className="open-call-title">{currentOpenCall.event_name}</h1>
            <p className="open-call-subtitle">{currentOpenCall.description}</p>
          </>
        )}
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
