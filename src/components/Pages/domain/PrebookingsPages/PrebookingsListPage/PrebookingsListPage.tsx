import {
  AvatarGroup,
  Badge,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  IconButton,
  InputAdornment,
  Menu,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Flag from 'react-world-flags';
import {
  selectorPreBookingRequests,
  usePreBookingRequestsSlice,
} from '~/common/slices/domain/prebooking/prebooking-requests.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { S3Avatar } from '~/components/shared/molecules/general/S3Avatar/S3Avatar';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { CurrentProfileInfoModel } from '~/models/app/user/user.model';
import {
  ParticipantApprovalStatus,
  PrebookingParticipantStatus,
  PreBookingRequestModel,
  PreBookingRequestStatus,
} from '~/models/domain/prebooking';
import './PrebookingsListPage.scss';

const PrebookingsListPage = () => {
  const [displayedPrebookings, setDisplayedPrebookings] = useState<PreBookingRequestModel[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPrebookingId, setSelectedPrebookingId] = useState<string | null>(null);
  const [selectedParticipantDetails, setSelectedParticipantDetails] = useState<CurrentProfileInfoModel | null>(null);
  const [selectedParticipantAvatarURL, setSelectedParticipantAvatarURL] = useState<string>('');
  const [selectedPrebookingDetails, setSelectedPrebookingDetails] = useState<PreBookingRequestModel | null>(null);
  const [openStatusSearchInputText, setOpenStatusSearchInputText] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [openDateFilter, setOpenDateFilter] = useState(false);
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const loggedUser = useSelector(selectCurrentUser);
  const allPreBookingRequests: PreBookingRequestModel[] = useSelector(selectorPreBookingRequests.selectItems);

  const isLoading = useSelector(selectorPreBookingRequests.selectLoading);

  const { actions: prebookingActions } = usePreBookingRequestsSlice();

  // Estado y ref para el header fijo
  const [showFixedHeader, setShowFixedHeader] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  // Estados para el loading local del Select
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [updatingPrebookingId, setUpdatingPrebookingId] = useState<string | null>(null);

  const statusFilters = [
    'all',
    PrebookingParticipantStatus.PENDING,
    PreBookingRequestStatus.CONVERTED,
    PreBookingRequestStatus.EXPIRED,
  ];

  const dispatch = useDispatch();

  const { translateGlobalDict } = useI18n();

  useEffect(() => {
    if (loggedUser) {
      setDisplayedPrebookings([]);
      dispatch(prebookingActions.loadItems({}));
    }
  }, [loggedUser]);

  useEffect(() => {
    const loadParticipantAvatar = async () => {
      if (selectedParticipantDetails) {
        const url = await selectedParticipantDetails.avatarURL();
        setSelectedParticipantAvatarURL(url);
      } else {
        setSelectedParticipantAvatarURL('');
      }
    };

    loadParticipantAvatar();
  }, [selectedParticipantDetails]);

  // Función para filtrar prebookings
  const filterPrebookings = (
    prebookings: PreBookingRequestModel[],
    status: string,
    searchQuery: string,
    fromDate: string,
    toDate: string
  ): PreBookingRequestModel[] => {
    let filtered = [...prebookings];

    // Filtrar por estado
    if (status !== 'all') {
      filtered = filtered.filter((prebooking) => {
        if (status === ParticipantStatus.PENDING) {
          return prebooking.participant_approvals.some(
            (approval) =>
              approval.participant_profile_id === loggedUser?.currentProfileInfo.id &&
              approval.status === ParticipantStatus.PENDING
          );
        }
        return prebooking.status === status;
      });
    }

    // Filtrar por rango de fechas
    if (fromDate || toDate) {
      filtered = filtered.filter((prebooking) => {
        const eventDate = prebooking.requested_date_start;

        if (fromDate && toDate) {
          // Ambas fechas proporcionadas: verificar que esté en el rango
          const from = dayjs(fromDate).startOf('day');
          const to = dayjs(toDate).endOf('day');
          return (
            (eventDate.isAfter(from) || eventDate.isSame(from, 'day')) &&
            (eventDate.isBefore(to) || eventDate.isSame(to, 'day'))
          );
        } else if (fromDate) {
          // Solo fecha desde: verificar que sea igual o posterior
          const from = dayjs(fromDate).startOf('day');
          return eventDate.isAfter(from) || eventDate.isSame(from, 'day');
        } else if (toDate) {
          // Solo fecha hasta: verificar que sea igual o anterior
          const to = dayjs(toDate).endOf('day');
          return eventDate.isBefore(to) || eventDate.isSame(to, 'day');
        }

        return true;
      });
    }

    // Filtrar por texto de búsqueda
    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((prebooking) => {
        // Buscar en nombre del evento
        if (prebooking.event_name?.toLowerCase().includes(searchLower)) return true;

        // Buscar en descripción
        if (prebooking.description?.toLowerCase().includes(searchLower)) return true;

        // Buscar en venues (nombre, username, ubicación, país)
        const venueMatch = prebooking.venues.some((venue: CurrentProfileInfoModel) => {
          // Verificar nombre y username
          if (venue.name?.toLowerCase().includes(searchLower)) return true;
          if (venue.username?.toLowerCase().includes(searchLower)) return true;

          // Buscar en ubicación solo si existe
          if (Array.isArray(venue.location) && venue.location.length > 0) {
            const locationObj = venue.location[0];
            if (locationObj) {
              // Buscar en país
              if (locationObj.country_name?.toLowerCase().includes(searchLower)) return true;
              // Buscar en ciudad
              if (locationObj.city?.toLowerCase().includes(searchLower)) return true;
              // Buscar en estado
              if (locationObj.state?.toLowerCase().includes(searchLower)) return true;
            }
          }

          return false;
        });
        if (venueMatch) return true;

        // Buscar en participantes (nombre, username, ubicación, país)
        const participantMatch = prebooking.recipients.some((participant: CurrentProfileInfoModel) => {
          // Verificar nombre y username
          if (participant.name?.toLowerCase().includes(searchLower)) return true;
          if (participant.username?.toLowerCase().includes(searchLower)) return true;

          // Buscar en ubicación solo si existe
          if (Array.isArray(participant.location) && participant.location.length > 0) {
            const locationObj = participant.location[0];
            if (locationObj) {
              // Buscar en país
              if (locationObj.country_name?.toLowerCase().includes(searchLower)) return true;
              // Buscar en ciudad
              if (locationObj.city?.toLowerCase().includes(searchLower)) return true;
              // Buscar en estado
              if (locationObj.state?.toLowerCase().includes(searchLower)) return true;
            }
          }

          return false;
        });
        if (participantMatch) return true;

        return false;
      });
    }

    return filtered;
  };

  useEffect(() => {
    // Limpiar estados de loading solo cuando se confirme que el prebooking se actualizó
    if (isUpdatingStatus && updatingPrebookingId) {
      const oldPrebooking = displayedPrebookings.find((pb) => pb.identifier === updatingPrebookingId);
      const newPrebooking = allPreBookingRequests.find((pb) => pb.identifier === updatingPrebookingId);

      // Verificar que el estado realmente cambió comparando los participant_approvals
      if (oldPrebooking && newPrebooking) {
        const oldApprovalStatus = oldPrebooking.participant_approvals.find(
          (approval) => approval.participant_profile_id === loggedUser?.currentProfileInfo.id
        )?.status;
        const newApprovalStatus = newPrebooking.participant_approvals.find(
          (approval) => approval.participant_profile_id === loggedUser?.currentProfileInfo.id
        )?.status;

        // Solo limpiar si el estado realmente cambió
        if (oldApprovalStatus !== newApprovalStatus) {
          setIsUpdatingStatus(false);
          setUpdatingPrebookingId(null);
        }
      }
    }

    // Aplicar filtros
    const filtered = filterPrebookings(allPreBookingRequests, selectedStatus, searchText, dateFrom, dateTo);
    setDisplayedPrebookings(filtered);
  }, [
    allPreBookingRequests,
    isUpdatingStatus,
    updatingPrebookingId,
    selectedStatus,
    searchText,
    dateFrom,
    dateTo,
    loggedUser,
  ]);

  // Efecto para manejar el scroll y mostrar/ocultar el header fijo
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        // Mostrar header fijo cuando el header principal está fuera de la vista
        setShowFixedHeader(headerRect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // useEffect(() => {
  //   console.log('Updated.....', updatedPrebooking);
  // }, [updatedPrebooking]);

  const getParticipantApprovalStatus = (prebooking: PreBookingRequestModel, idParticipant: string) => {
    const approval = prebooking.participant_approvals.find(
      (approval: ParticipantApprovalStatus) => approval.participant_profile_id === idParticipant
    );
    return getApprovalIcon(approval?.status);
  };

  const getApprovalIcon = (status: string) => {
    let approvalGUI = undefined;

    switch (status) {
      case PrebookingParticipantStatus.INTERESTED:
        approvalGUI = { icon: 'FaCheckCircle', color: 'green' };
        break;
      case PrebookingParticipantStatus.PENDING:
        approvalGUI = { icon: 'TbClockHour2Filled', color: 'orange' };
        break;
      case PrebookingParticipantStatus.NOT_INTERESTED:
        approvalGUI = { icon: 'FaTimesCircle', color: '#b70707' };
        break;
      default:
        approvalGUI = undefined;
    }
    return approvalGUI;
  };

  const sortParticipants = (participants: CurrentProfileInfoModel[]) => {
    const entityOrder = ['Artist', 'Place'];

    return [...participants].sort((a, b) => {
      const indexA = entityOrder.indexOf(a.entity);
      const indexB = entityOrder.indexOf(b.entity);

      // Si ambos están en el array de orden, ordenar por posición
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }

      // Si solo uno está en el array, el que está va primero
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;

      // Si ninguno está en el array, mantener orden original
      return 0;
    });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, prebookingId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPrebookingId(prebookingId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPrebookingId(null);
  };

  const handleEdit = () => {
    console.log('Editar prebooking:', selectedPrebookingId);
    // TODO: Implementar lógica de edición
    handleMenuClose();
  };

  const handleDelete = () => {
    dispatch(prebookingActions.deleteItem({ id: selectedPrebookingId }));
    handleMenuClose();
  };

  const showHideSearchField = () => {
    if (!openStatusSearchInputText) {
      // Si se va a abrir la búsqueda, cerrar el filtro de fecha
      setOpenDateFilter(false);
    }
    setOpenStatusSearchInputText(!openStatusSearchInputText);
  };

  const showHideDateFilter = () => {
    if (!openDateFilter) {
      // Si se va a abrir el filtro de fecha, cerrar la búsqueda
      setOpenStatusSearchInputText(false);
    }
    setOpenDateFilter(!openDateFilter);
  };

  const clearSearch = () => {
    setSearchText('');
  };

  const clearDateFilter = () => {
    setDateFrom('');
    setDateTo('');
  };

  const hasActiveSearch = searchText.trim() !== '';
  const hasActiveDateFilter = dateFrom !== '' || dateTo !== '';

  const getHeaderTitle = () => {
    return <h3>Prebookings</h3>;
  };

  const getHeaderFilters = () => {
    return (
      <>
        <div className="pb-header-filters">
          <FormControl>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              displayEmpty
              IconComponent={() => null}
              renderValue={(value) => (
                <Chip
                  label={value}
                  className="chip-filter"
                  deleteIcon={<DynamicIcons iconName="FaChevronDown" size={14} />}
                  onDelete={() => {}}
                />
              )}
              sx={{
                '& .MuiSelect-select': {
                  padding: 0,
                  paddingRight: '0 !important',
                },
                '& fieldset': { border: 'none' },
              }}
            >
              {statusFilters.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <span onClick={showHideDateFilter} className={`pb-search-icon ${hasActiveDateFilter ? 'active' : ''}`}>
            {openDateFilter && (
              <>
                <DynamicIcons iconName={'FaRegCalendarTimes'} size={25} />
                {hasActiveDateFilter && <span className="pb-search-badge" />}
              </>
            )}
            {!openDateFilter && (
              <>
                <DynamicIcons iconName={'FaRegCalendarAlt'} size={25} />
                {hasActiveDateFilter && <span className="pb-search-badge" />}
              </>
            )}
          </span>

          <span onClick={showHideSearchField} className={`pb-search-icon ${hasActiveSearch ? 'active' : ''}`}>
            {openStatusSearchInputText && (
              <>
                <DynamicIcons iconName={'MdSearchOff'} size={25} />
                {hasActiveSearch && <span className="pb-search-badge" />}
              </>
            )}
            {!openStatusSearchInputText && (
              <>
                <DynamicIcons iconName={'AiOutlineSearch'} size={25} />
                {hasActiveSearch && <span className="pb-search-badge" />}
              </>
            )}
          </span>
        </div>
        <div className={'pb-header-filter-params'}>
          {openStatusSearchInputText && (
            <TextField
              className="pb-search-field"
              placeholder="Buscar..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              size="small"
              autoFocus
              InputProps={{
                endAdornment: searchText && (
                  <InputAdornment position="end">
                    <IconButton onClick={clearSearch} edge="end" size="small">
                      <DynamicIcons iconName="MdClose" size={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          )}

          {openDateFilter && (
            <div className="pb-date-filter-container">
              <TextField
                className="pb-date-field"
                label="Desde"
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                className="pb-date-field"
                label="Hasta"
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                size="small"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              {hasActiveDateFilter && (
                <IconButton onClick={clearDateFilter} size="small">
                  <DynamicIcons iconName="MdClose" size={20} />
                </IconButton>
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <>
      <div ref={headerRef} className="pb-list-top-header">
        {getHeaderTitle()}
        {getHeaderFilters()}
      </div>
      <div className="pb-container">
        {isLoading && displayedPrebookings.length === 0 ? (
          <AppLoader />
        ) : displayedPrebookings.length === 0 ? (
          <div className="pb-empty-state">
            <DynamicIcons iconName="TbCalendarQuestion" size={60} />
            <h3>No hay prebookings aún</h3>
            <p>Cuando tengas prebookings, aparecerán aquí</p>
          </div>
        ) : (
          displayedPrebookings.map((prebooking: PreBookingRequestModel, index: number) => {
            return (
              <div key={`prebook_${index}`} className="pb-card-container">
                <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                  <CardHeader
                    title={prebooking.event_name}
                    action={
                      loggedUser?.currentProfileIdentifier === prebooking?.requester?.identifier && (
                        <IconButton onClick={(e: any) => handleMenuOpen(e, prebooking.id)}>
                          <DynamicIcons iconName="HiDotsVertical" size={20} />
                        </IconButton>
                      )
                    }
                  ></CardHeader>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', flex: 1, padding: 0 }}>
                    <div className="pb-card-content-container">
                      <p className="pb-card-description">{prebooking.description}</p>
                      <div className="pb-card-date">
                        <DynamicIcons
                          iconName={prebooking.flexible_dates ? 'TbCalendarQuestion' : 'LuCalendarDays'}
                          size={25}
                        />
                        <div>
                          {prebooking.requested_date_start?.format('LL')}
                          {prebooking.flexible_dates ? ' - (Flexibles)' : ''}
                        </div>
                      </div>
                      <div className="pb-card-location">
                        <DynamicIcons iconName="fa6 FaLocationDot" size={25} />
                        <ul className="pb-card-location-list">
                          {prebooking.venues.map((venue: CurrentProfileInfoModel, indexVenue: number) => (
                            <li key={`pb_card_venue_${indexVenue}`} className="pb-card-location-element-list">
                              {venue.name} - (
                              {venue.location && Array.isArray(venue.location) && `${venue.cityWithCountry}`})
                              {
                                <Flag
                                  code={'CO'}
                                  height="15"
                                  style={{ border: '1px solid #999', marginLeft: '0.6rem' }}
                                />
                              }
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <Divider />
                    <div className="pb-card-participants-container">
                      <p>Participantes:</p>
                      <div className="pb-card-participants-box">
                        <AvatarGroup
                          max={4}
                          spacing={-6}
                          componentsProps={{
                            additionalAvatar: {
                              sx: {
                                color: 'white',
                                border: 'none !important',
                              },
                              onClick: (event) => {
                                event.stopPropagation(); // optional
                                setSelectedPrebookingDetails(prebooking);
                              },
                            },
                          }}
                        >
                          {sortParticipants(prebooking.recipients).map(
                            (participant: CurrentProfileInfoModel, participant_index: number) => {
                              const approvalInfo = getParticipantApprovalStatus(prebooking, participant.id);

                              return (
                                <Badge
                                  key={`participant_${participant.id}_${participant_index}`}
                                  overlap="circular"
                                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                  badgeContent={
                                    approvalInfo ? (
                                      <DynamicIcons
                                        iconName={approvalInfo.icon}
                                        color={approvalInfo.color}
                                        size={25}
                                        background="white"
                                      />
                                    ) : null
                                  }
                                  onClick={() => setSelectedParticipantDetails(participant)}
                                >
                                  <S3Avatar
                                    alt={participant.name}
                                    src={participant.profile_pic}
                                    sx={{
                                      color: 'white',
                                      border:
                                        (approvalInfo ? `2px solid ${approvalInfo.color}` : 'none') + ' !important',
                                    }}
                                  />
                                </Badge>
                              );
                            }
                          )}
                        </AvatarGroup>
                        {loggedUser?.currentProfileIdentifier && (
                          <>
                            <Divider orientation="vertical" flexItem />
                            <div className="pb-card-response-box">
                              {(!isUpdatingStatus || prebooking.identifier !== updatingPrebookingId) && (
                                <FormControl>
                                  <Select
                                    value={
                                      prebooking.participant_approvals.find(
                                        (approval) =>
                                          approval.participant_profile_id === loggedUser?.currentProfileInfo.id
                                      )?.status || PrebookingParticipantStatus.PENDING
                                    }
                                    onChange={(e) => {
                                      // Activar el loading local
                                      setIsUpdatingStatus(true);
                                      setUpdatingPrebookingId(prebooking.identifier);

                                      // TODO: Aquí deberías actualizar el estado del participante
                                      dispatch(
                                        prebookingActions.postActionItem({
                                          id: prebooking.id,
                                          action: 'setStatus',
                                          newItem: {},
                                          params: { status: e.target.value },
                                        })
                                      );
                                    }}
                                    disabled={isUpdatingStatus && updatingPrebookingId === prebooking.identifier}
                                    displayEmpty
                                    renderValue={(value) => {
                                      const icon = getApprovalIcon(value);
                                      return (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                          {icon && (
                                            <DynamicIcons
                                              iconName={icon.icon}
                                              color={icon.color}
                                              size={30}
                                              background="white"
                                            />
                                          )}
                                        </div>
                                      );
                                    }}
                                    sx={{
                                      '& .MuiSelect-select': {
                                        padding: '4px 8px',
                                      },
                                      '& fieldset': {
                                        borderColor: '#ddd',
                                        borderRadius: '20px',
                                      },
                                    }}
                                  >
                                    <MenuItem value={PrebookingParticipantStatus.INTERESTED}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <DynamicIcons
                                          iconName={getApprovalIcon(PrebookingParticipantStatus.INTERESTED).icon}
                                          color={getApprovalIcon(PrebookingParticipantStatus.INTERESTED).color}
                                          size={20}
                                          background="white"
                                        />
                                        <span>
                                          {translateGlobalDict(
                                            `prebooking.participant_status.${PrebookingParticipantStatus.INTERESTED}`
                                          )}
                                        </span>
                                      </div>
                                    </MenuItem>
                                    <MenuItem value={PrebookingParticipantStatus.PENDING}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <DynamicIcons
                                          iconName={getApprovalIcon(PrebookingParticipantStatus.PENDING).icon}
                                          color={getApprovalIcon(PrebookingParticipantStatus.PENDING).color}
                                          size={20}
                                          background="white"
                                        />
                                        <span>
                                          {translateGlobalDict(
                                            `prebooking.participant_status.${PrebookingParticipantStatus.PENDING}`
                                          )}
                                        </span>
                                      </div>
                                    </MenuItem>
                                    <MenuItem value={PrebookingParticipantStatus.NOT_INTERESTED}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <DynamicIcons
                                          iconName={getApprovalIcon(PrebookingParticipantStatus.NOT_INTERESTED).icon}
                                          color={getApprovalIcon(PrebookingParticipantStatus.NOT_INTERESTED).color}
                                          size={20}
                                          background="white"
                                        />
                                        <span>
                                          {translateGlobalDict(
                                            `prebooking.participant_status.${PrebookingParticipantStatus.NOT_INTERESTED}`
                                          )}
                                        </span>
                                      </div>
                                    </MenuItem>
                                  </Select>
                                </FormControl>
                              )}
                              {isUpdatingStatus && prebooking.identifier === updatingPrebookingId && (
                                <AppLoader fullHeight={false} />
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <DynamicIcons iconName="FaEdit" size={16} />
          Editar
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <DynamicIcons iconName="FaRegTrashAlt" size={16} />
          Eliminar
        </MenuItem>
      </Menu>
      <div className={['pb-lp-fixed-header', showFixedHeader ? 'visible' : ''].join(' ')}>
        <div className="pb-fixed-header-content">
          {getHeaderTitle()}
          {getHeaderFilters()}
        </div>
      </div>
      {selectedParticipantDetails && (
        <AppDialog
          title={selectedParticipantDetails.name}
          isOpenDialog={!!selectedParticipantDetails}
          onClose={() => setSelectedParticipantDetails(null)}
          content={
            <div>
              <S3Avatar
                alt={selectedParticipantDetails.name}
                src={selectedParticipantAvatarURL}
                sx={{
                  color: 'white',
                  width: '8rem',
                  height: '8rem',
                }}
              />
            </div>
          }
          // icon={'FaInfoCircle'}
        />
      )}
      {selectedPrebookingDetails && (
        <AppDialog
          title={selectedPrebookingDetails.event_name}
          isOpenDialog={!!selectedPrebookingDetails}
          onClose={() => setSelectedPrebookingDetails(null)}
          content={
            <div className="pb-card-container">
              <div className="pb-card-content-container">
                <p className="pb-card-description">{selectedPrebookingDetails.description}</p>
                <div className="pb-card-date">
                  <DynamicIcons
                    iconName={selectedPrebookingDetails.flexible_dates ? 'TbCalendarQuestion' : 'LuCalendarDays'}
                    size={25}
                  />
                  <div>
                    {selectedPrebookingDetails.requested_date_start?.format('LL')}
                    {selectedPrebookingDetails.flexible_dates ? ' - (Flexibles)' : ''}
                  </div>
                </div>
                <div className="pb-card-location">
                  <DynamicIcons iconName="fa6 FaLocationDot" size={25} />
                  <ul className="pb-card-location-list">
                    {selectedPrebookingDetails.venues.map((venue: CurrentProfileInfoModel, indexVenue: number) => (
                      <li key={`pb_card_venue_${indexVenue}`} className="pb-card-location-element-list">
                        {venue.name} - ({venue.location && Array.isArray(venue.location) && `${venue.cityWithCountry}`})
                        {<Flag code={'CO'} height="15" style={{ border: '1px solid #999', marginLeft: '0.6rem' }} />}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Divider />
              <div className="pb-card-participants-container">
                <p>Participantes:</p>
                <div className="pb-card-participants-box">
                  <AvatarGroup
                    max={4}
                    spacing={-6}
                    componentsProps={{
                      additionalAvatar: {
                        sx: {
                          color: 'white',
                          border: 'none !important',
                        },
                        onClick: (event) => {
                          event.stopPropagation(); // optional
                          setSelectedPrebookingDetails(selectedPrebookingDetails);
                        },
                      },
                    }}
                  >
                    {sortParticipants(selectedPrebookingDetails.recipients).map(
                      (participant: CurrentProfileInfoModel, participant_index: number) => {
                        const approvalInfo = getParticipantApprovalStatus(selectedPrebookingDetails, participant.id);

                        return (
                          <Badge
                            key={`participant_${participant.id}_${participant_index}`}
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              approvalInfo ? (
                                <DynamicIcons
                                  iconName={approvalInfo.icon}
                                  color={approvalInfo.color}
                                  size={25}
                                  background="white"
                                />
                              ) : null
                            }
                            onClick={() => setSelectedParticipantDetails(participant)}
                          >
                            <S3Avatar
                              alt={participant.name}
                              src={participant.profile_pic}
                              sx={{
                                color: 'white',
                                border: (approvalInfo ? `2px solid ${approvalInfo.color}` : 'none') + ' !important',
                              }}
                            />
                          </Badge>
                        );
                      }
                    )}
                  </AvatarGroup>
                  {loggedUser?.currentProfileIdentifier && (
                    <>
                      <Divider orientation="vertical" flexItem />
                      <div className="pb-card-response-box">
                        <FormControl>
                          <Select
                            value={
                              selectedPrebookingDetails.participant_approvals.find(
                                (approval) => approval.participant_profile_id === loggedUser?.currentProfileInfo.id
                              )?.status || PrebookingParticipantStatus.PENDING
                            }
                            onChange={(e) => {
                              // TODO: Aquí deberías actualizar el estado del participante
                              console.log('Cambiar respuesta a:', e.target.value);
                              dispatch(
                                prebookingActions.postActionItem({
                                  id: selectedPrebookingDetails.id,
                                  action: 'setStatus',
                                  newItem: {},
                                  params: { status: e.target.value },
                                })
                              );
                            }}
                            displayEmpty
                            renderValue={(value) => {
                              const icon = getApprovalIcon(value);
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                  {icon && (
                                    <DynamicIcons
                                      iconName={icon.icon}
                                      color={icon.color}
                                      size={30}
                                      background="white"
                                    />
                                  )}
                                </div>
                              );
                            }}
                            sx={{
                              '& .MuiSelect-select': {
                                padding: '4px 8px',
                              },
                              '& fieldset': {
                                borderColor: '#ddd',
                                borderRadius: '20px',
                              },
                            }}
                          >
                            <MenuItem value={PrebookingParticipantStatus.INTERESTED}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DynamicIcons
                                  iconName={getApprovalIcon(PrebookingParticipantStatus.INTERESTED).icon}
                                  color={getApprovalIcon(PrebookingParticipantStatus.INTERESTED).color}
                                  size={20}
                                  background="white"
                                />
                                <span>
                                  {translateGlobalDict(
                                    `prebooking.participant_status.${PrebookingParticipantStatus.INTERESTED}`
                                  )}
                                </span>
                              </div>
                            </MenuItem>
                            <MenuItem value={PrebookingParticipantStatus.PENDING}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DynamicIcons
                                  iconName={getApprovalIcon(PrebookingParticipantStatus.PENDING).icon}
                                  color={getApprovalIcon(PrebookingParticipantStatus.PENDING).color}
                                  size={20}
                                  background="white"
                                />
                                <span>
                                  {translateGlobalDict(
                                    `prebooking.participant_status.${PrebookingParticipantStatus.PENDING}`
                                  )}
                                </span>
                              </div>
                            </MenuItem>
                            <MenuItem value={PrebookingParticipantStatus.NOT_INTERESTED}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DynamicIcons
                                  iconName={getApprovalIcon(PrebookingParticipantStatus.NOT_INTERESTED).icon}
                                  color={getApprovalIcon(PrebookingParticipantStatus.NOT_INTERESTED).color}
                                  size={20}
                                  background="white"
                                />
                                <span>
                                  {translateGlobalDict(
                                    `prebooking.participant_status.${PrebookingParticipantStatus.NOT_INTERESTED}`
                                  )}
                                </span>
                              </div>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          }
        />
      )}
    </>
  );
};

export default PrebookingsListPage;
