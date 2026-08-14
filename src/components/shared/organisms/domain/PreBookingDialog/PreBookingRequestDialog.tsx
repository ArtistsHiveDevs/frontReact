import { Avatar, FormLabel } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { usePreBookingRequestsSlice } from '~/common/slices/domain/prebooking/prebooking-requests.redux';
import { useSearchSlice } from '~/common/slices/search';
import { selectEntitySearch, selectEntitySearchLoading } from '~/common/slices/search/selectors';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { createTextField, DynamicForm } from '~/components/shared/organisms/gui/dynamicForms';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import { ProfileModel, ProfileTemplate } from '~/models/base';
import { getModelInfoFromClassName } from '~/models/base/modelHelpers';
import { ArtistModel } from '~/models/domain/artist/artist.model';
import { PlaceModel } from '~/models/domain/place/place.model';
import { ApprovalStatus, PreBookingRequestModel, PreBookingRequestStatus } from '~/models/domain/prebooking';
import { SearchModel } from '~/models/domain/search/search.model';
import './PreBookingRequestDialog.scss';

interface PreBookingFormData<T extends ProfileTemplate = ProfileTemplate> {
  mainRecipient: ProfileModel<T>;
  requested_date_start: Dayjs;
  requested_date_end: Dayjs;
  recipient_ids: string[];
  additional_participant_ids?: string[];
  event_type?: string;
  venue?: string;
  notes?: string;
  date: Dayjs;
  name: string;
  description: string;
  flexible_dates: boolean;
}

interface PreBookingRequestDialogProps<T extends ProfileTemplate = ProfileTemplate> {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PreBookingFormData<T>) => void;
  // availableParticipants: Array<{ value: string; label: string }>;
  mainRecipient: ProfileModel<T>;
}

export const PreBookingRequestDialog = <T extends ProfileTemplate = ProfileTemplate>({
  open,
  onClose,
  onSubmit,
  // availableParticipants,
  mainRecipient,
}: PreBookingRequestDialogProps<T>) => {
  const entities = [ArtistModel.name, PlaceModel.name];

  const { translateGlobalDict } = useI18n();
  const loggedUser = useSelector(selectCurrentUser);
  const [participants, setParticipants] = useState<CurrentProfileInfoModel[]>([]);
  const [searchEntity, setSearchEntity] = useState<string>(undefined);
  const [searchValue, setSearchValue] = useState<string>('');

  const [availableArtists, updateAvailableArtists] = useState<CurrentProfileInfoModel[]>([]);
  const [availablePlaces, updateAvailablePlaces] = useState<CurrentProfileInfoModel[]>([]);
  const [showSearchLoader, setShowSearchLoader] = useState<boolean>(false);

  const dispatch = useDispatch();

  const queriedSearchList: SearchModel = useSelector(selectEntitySearch);
  const querySearchLoading: boolean = useSelector(selectEntitySearchLoading);
  const { actions: searchActions } = useSearchSlice();

  const { actions: prebookingRequestActions } = usePreBookingRequestsSlice();

  useEffect(() => {
    setShowSearchLoader(querySearchLoading);
  }, [querySearchLoading]);

  // Función helper para actualizar profile_pic de URLs S3
  const updateProfilePics = useCallback(async (profiles: any[]) => {
    await Promise.all(
      profiles.map(async (profile) => {
        if (profile.profile_pic?.startsWith('s3://') && profile.avatarURL) {
          profile.profile_pic = await profile.avatarURL();
        }
      })
    );
    return profiles;
  }, []);

  useEffect(() => {
    const loadProfiles = async () => {
      const artists = (queriedSearchList?.artists || []).map((e: ProfileModel<any>) => e.profileInfo);
      const places = (queriedSearchList?.places || []).map((e: ProfileModel<any>) => e.profileInfo);

      const [updatedArtists, updatedPlaces] = await Promise.all([
        updateProfilePics(artists),
        updateProfilePics(places),
      ]);

      updateAvailableArtists(updatedArtists);
      updateAvailablePlaces(updatedPlaces);
    };

    loadProfiles();
  }, [queriedSearchList, updateProfilePics]);

  const methods = useForm<PreBookingFormData>({
    defaultValues: {
      requested_date_start: dayjs(),
      requested_date_end: dayjs().add(2, 'hours'),
      recipient_ids: [],
      event_type: '',
      venue: '',
      notes: '',
      date: dayjs(),
      name: 'Evento',
      description: 'Evento de prueba',
      flexible_dates: false,
    },
  });

  const handleSubmit = methods.handleSubmit((data) => {
    onSubmit(data);
    methods.reset();
    onClose();
  });

  const handleCancel = () => {
    methods.reset();
    onClose();
  };

  useEffect(() => {
    if (!searchEntity) {
      setSearchValue('');
      updateAvailableArtists([]);
      updateAvailablePlaces([]);
    }
  }, [searchEntity]);

  const search_text = createTextField({
    fieldData: {
      fieldName: 'search',
      label: 'search',
      inputType: 'text',
      defaultValue: searchValue || '',
    },
    errors: {},
    handlers: {
      onsearchChange: (value: any) => {
        setSearchValue(value);
        if (searchEntity) {
          dispatch(
            searchActions.entityQuerySearch({ term: value, entity: getModelInfoFromClassName(searchEntity).entityName })
          );
        }
      },
    },
    register: undefined,
  });

  // const endDateField: DynamicFieldData = {
  //   fieldName: 'requested_date_end',
  //   label: translateText('prebooking.fields.requested_date_end'),
  //   inputType: 'date',
  //   config: { required: translateText('prebooking.validation.end_date_required') },
  //   componentParams: {
  //     disablePast: true,
  //   },
  // };

  // const eventTypeField: DynamicFieldData = {
  //   fieldName: 'event_type',
  //   label: translateText('prebooking.fields.event_type'),
  //   inputType: 'text',
  //   placeholder: translateText('prebooking.placeholders.event_type'),
  // };

  // Helper para agregar participante único basado en identifier
  const addUniqueParticipant = (newParticipant: CurrentProfileInfoModel): void => {
    setParticipants((prevParticipants) => {
      // Si ya existe, no agregarlo
      if (prevParticipants.some((p) => p.identifier === newParticipant.identifier)) {
        return prevParticipants;
      }
      // Agregar el nuevo participante
      return [...prevParticipants, newParticipant];
    });
    setSearchValue('');
    updateAvailableArtists([]);
    updateAvailablePlaces([]);
  };

  const deleteParticipant = (deleteIdentifier: string) => {
    setParticipants((prevParticipants) => {
      return [...prevParticipants.filter((participant) => participant.identifier !== deleteIdentifier)];
    });
  };

  useEffect(() => {
    const loadParticipants = async () => {
      let initialParticipants: CurrentProfileInfoModel[] = [];

      // Siempre agregar primero loggedUser.currentProfileInfo
      if (loggedUser?.currentProfileInfo) {
        initialParticipants.push(loggedUser.currentProfileInfo);
      }

      // Siempre agregar segundo mainRecipient.currentProfileInfo (si es diferente)
      if (mainRecipient && mainRecipient.identifier !== loggedUser?.currentProfileInfo?.identifier) {
        initialParticipants.push(mainRecipient.profileInfo);
      }

      // Cargar las URLs de los avatares de forma asíncrona
      initialParticipants = await updateProfilePics(initialParticipants);
      setParticipants(initialParticipants);
    };

    loadParticipants();
  }, [loggedUser, mainRecipient]);

  // Validar que haya al menos un participante de cada entidad
  const validateParticipants = (): boolean => {
    return entities.every((entityName) => {
      return participants.some((p) => p.entity === entityName);
    });
  };

  // Función helper para verificar si falta un participante de una entidad específica
  const isMissingParticipantForEntity = (entityName: string): boolean => {
    return !participants.some((p) => p.entity === entityName);
  };

  const handlers = {
    onSubmit: (data: any) => {
      // Validar participantes antes de enviar
      if (!validateParticipants()) {
        return; // No enviar si falta algún participante
      }

      // Agregar los IDs de participantes al data antes de enviarlo
      const formDataWithParticipants = {
        ...data,
        recipient_ids: participants.map((p: CurrentProfileInfoModel) => p.identifier),
        // mainRecipient,
      };

      const typedData: PreBookingRequestModel = new PreBookingRequestModel({
        // requester: loggedUser.currentProfileInfo,
        // requester_user_id: loggedUser.identifier,
        // requester_profile_id: loggedUser.currentProfileIdentifier,

        recipients: participants,
        recipient_ids: participants.map((p) => p.identifier),
        participant_approvals: [],

        requested_date_start: formDataWithParticipants.date,
        requested_date_end: formDataWithParticipants.date,
        request_type: 'single_date',
        flexible_dates: formDataWithParticipants.flexible_dates,
        // alternative_dates?: DateRange[]; // Rangos alternativos si flexible (también con hora)

        // ===== DETALLES BÁSICOS =====
        event_name: formDataWithParticipants.name,
        description: formDataWithParticipants.description,
        // expected_attendance?: number;   // Asistencia esperada

        // ===== PRESUPUESTO (V2 - Removido por complejidad) =====
        // estimated_cost?: CostRange;   // Postponed - Muy complejo
        // currency?: string;             // Postponed

        // ===== ESTADO =====
        status: PreBookingRequestStatus.DRAFT,
        overall_approval_status: ApprovalStatus.ALL_PENDING, // ALL_PENDING, PARTIAL, ALL_APPROVED, REJECTED

        // Notas por participante
        notes: !!formDataWithParticipants.notes
          ? [
              {
                author_user_id: loggedUser.identifier,
                author_profile_id: loggedUser.currentProfileIdentifier,
                author_name: loggedUser.nameKnownAs,
                note: formDataWithParticipants.notes,
                created_at: dayjs(),
                is_private: false,
              },
            ]
          : [], // Cada uno puede agregar notas

        // ===== METADATA =====
        created_by: loggedUser.identifier, // user_id del creador
        // event_id?: string; // Si se convierte en evento
        response_deadline: '90', // Plazo para responder (DEFAULT: +90 días)
        // created_at: dayjs(),
        // updated_at: dayjs(),
        // last_viewed_by?: Record<string, Dayjs | string>;
      });

      delete typedData.recipients;

      dispatch(prebookingRequestActions.createItem({ data: typedData }));
      onSubmit(formDataWithParticipants);
      methods.reset();
      onClose();
    },
    onflexible_datesChange: (newValue: any) => {},
  };

  const ProfileIconWithName = (params: {
    element: CurrentProfileInfoModel;
    styles?: { avatarSize?: number; topRightIcon?: string };
    handlers?: { [name: string]: Function };
  }) => {
    const { element, styles, handlers } = params;
    const avatarSizeREM = `${styles?.avatarSize || 4}rem`;
    return (
      <>
        <div key={element.identifier} className="prebooking-participant-avatar-name">
          {![mainRecipient?.identifier || '', loggedUser?.currentProfileInfo?.identifier || ''].includes(
            element.identifier
          ) && (
            <div className="prebooking-delete-icon">
              <DynamicIcons
                iconName={styles?.topRightIcon || 'IoMdRemoveCircleOutline'}
                size={30}
                color="white"
                onClick={() => {
                  if (handlers && handlers['onTopRightClick']) {
                    handlers['onTopRightClick'](element);
                  }
                }}
              />
            </div>
          )}
          <Avatar
            src={element.profile_pic}
            alt={element.name}
            sx={{
              width: avatarSizeREM,
              height: avatarSizeREM,
              flexShrink: 0,
            }}
            variant={'circular'}
          />
          <span className="prebooking-participant-name">{element.name}</span>
        </div>
      </>
    );
  };

  return (
    <>
      <AppDialog
        title="Solicitar evento"
        isOpenDialog={open}
        onClose={onClose}
        content={
          <DynamicForm
            formMethods={methods}
            fields={[
              {
                fieldName: 'name',
                inputType: 'text',
                label: 'Name',
                config: { required: true },
              },
              {
                fieldName: 'description',
                inputType: 'textarea',
                label: 'Description',
                config: { required: true },
              },
              {
                fieldName: 'flexible_dates',
                inputType: 'switch',
                label: 'Flexible dates',
                handlersNames: ['onClick'],
              },
              {
                fieldName: 'date',
                inputType: 'date',
                label: 'date',
                config: { required: true },
                componentParams: {
                  disablePast: true,
                },
              },
              {
                fieldName: 'recipients',
                inputType: 'hidden',
                label: 'Artists',
                componentParams: {
                  render: (
                    <div>
                      {entities.map((entityName: string) => {
                        const missingParticipant = isMissingParticipantForEntity(entityName);
                        return (
                          <div key={entityName}>
                            <div className="prebooking-entity-type-participants">
                              <FormLabel
                                required={true}
                                error={missingParticipant}
                                className="prebooking-entity-type-participants"
                              >
                                {getModelInfoFromClassName(entityName).plural &&
                                  translateGlobalDict(
                                    `entities.${getModelInfoFromClassName(entityName).plural}.plural`
                                  )}
                              </FormLabel>
                              <DynamicIcons
                                iconName="fa6 FaCirclePlus"
                                size={20}
                                color="white"
                                onClick={() => setSearchEntity(entityName)}
                              />
                            </div>
                            <div className="prebooking-participants-box">
                              {participants
                                .filter((p: CurrentProfileInfoModel) => p.entity === entityName)
                                .map((participant: CurrentProfileInfoModel) => (
                                  <div key={participant.identifier}>
                                    {ProfileIconWithName({
                                      element: participant,
                                      handlers: {
                                        onTopRightClick: (element: any) => {
                                          deleteParticipant(element.identifier);
                                        },
                                      },
                                    })}
                                  </div>
                                ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ),
                },
              },
              {
                fieldName: 'notes',
                inputType: 'textarea',
                label: 'Notes',
              },
            ]}
            handlers={handlers}
            translationBasePath=""
            submitLabel="create"
          />
        }
      />
      <AppDialog
        isOpenDialog={!!searchEntity}
        onClose={() => {
          setSearchEntity(undefined);
        }}
        title={`Agregar ${
          getModelInfoFromClassName(searchEntity).plural &&
          translateGlobalDict(`entities.${getModelInfoFromClassName(searchEntity).plural}.singular`)
        }`}
        content={
          <>
            <div>{search_text}</div>
            {showSearchLoader && searchValue && <AppLoader height="8rem" />}
            {!showSearchLoader && (
              <div className="prebooking-participants-box prebooking-result-box">
                {(searchEntity === ArtistModel.name ? availableArtists : availablePlaces).map((a: any) => (
                  <div key={a.identifier}>
                    {ProfileIconWithName({
                      element: a,
                      styles: { avatarSize: 3.5, topRightIcon: 'LuCirclePlus' },
                      handlers: {
                        onTopRightClick: (element: any) => {
                          addUniqueParticipant(element);
                          setSearchEntity(undefined);
                        },
                      },
                    })}
                  </div>
                ))}
              </div>
            )}
          </>
        }
      />
    </>
  );
};
