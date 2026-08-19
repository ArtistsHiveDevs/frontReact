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
  Pagination,
  Select,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
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
import { itemsPerPageOptions, sortOptions, tableColumns } from './config';
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
  const [dateFrom, setDateFrom] = useState<Dayjs | null>(null);
  const [dateTo, setDateTo] = useState<Dayjs | null>(null);

  // Nuevos estados para filtros y vistas
  const [myApprovalFilter, setMyApprovalFilter] = useState<string>(''); // '', pending, accepted, rejected
  const [sortBy, setSortBy] = useState<string>('event_date_asc'); // event_date, created_at, status, creator, my_status, event_name
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);
  const [activeTab, setActiveTab] = useState<'proposals' | 'dialogs'>('proposals');

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

  // Debug: Log para ver los datos de los participantes
  useEffect(() => {
    if (displayedPrebookings.length > 0) {
      const firstPrebooking = displayedPrebookings[0];
    }
  }, [displayedPrebookings]);

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
    fromDate: Dayjs | null,
    toDate: Dayjs | null,
    myApproval: string
  ): PreBookingRequestModel[] => {
    let filtered = [...prebookings];

    // // Filtrar por estado general del prebooking
    // if (status !== 'all') {
    //   filtered = filtered.filter((prebooking) => {
    //     if (status === PrebookingParticipantStatus.PENDING) {
    //       return prebooking.participant_approvals.some(
    //         (approval) =>
    //           approval.participant_profile_id === loggedUser?.currentProfileInfo.id &&
    //           approval.status === PrebookingParticipantStatus.PENDING
    //       );
    //     }
    //     return prebooking.status === status;
    //   });
    // }

    // Filtrar por mi estado de aprobación personal
    if (myApproval !== '') {
      filtered = filtered.filter((prebooking) => {
        const myApprovalStatus = prebooking.participant_approvals.find(
          (approval) => approval.participant_profile_id === loggedUser?.currentProfileInfo.id
        )?.status;

        if (myApproval === PrebookingParticipantStatus.PENDING) {
          return myApprovalStatus === PrebookingParticipantStatus.PENDING;
        } else if (myApproval === PrebookingParticipantStatus.INTERESTED) {
          return myApprovalStatus === PrebookingParticipantStatus.INTERESTED;
        } else if (myApproval === PrebookingParticipantStatus.NOT_INTERESTED) {
          return myApprovalStatus === PrebookingParticipantStatus.NOT_INTERESTED;
        }
        return true;
      });
    }

    // Filtrar por rango de fechas
    if (fromDate || toDate) {
      filtered = filtered.filter((prebooking) => {
        const eventDate = prebooking.requested_date_start;

        if (fromDate && toDate) {
          // Ambas fechas proporcionadas: verificar que esté en el rango
          const from = fromDate.startOf('day');
          const to = toDate.endOf('day');
          return (
            (eventDate.isAfter(from) || eventDate.isSame(from, 'day')) &&
            (eventDate.isBefore(to) || eventDate.isSame(to, 'day'))
          );
        } else if (fromDate) {
          // Solo fecha desde: verificar que sea igual o posterior
          const from = fromDate.startOf('day');
          return eventDate.isAfter(from) || eventDate.isSame(from, 'day');
        } else if (toDate) {
          // Solo fecha hasta: verificar que sea igual o anterior
          const to = toDate.endOf('day');
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

  // Función para ordenar prebookings
  const sortPrebookings = (prebookings: PreBookingRequestModel[], sortByValue: string): PreBookingRequestModel[] => {
    const sorted = [...prebookings];

    switch (sortByValue) {
      case 'event_date_asc':
        return sorted.sort((a, b) => a.requested_date_start.valueOf() - b.requested_date_start.valueOf());
      case 'event_date_desc':
        return sorted.sort((a, b) => b.requested_date_start.valueOf() - a.requested_date_start.valueOf());
      case 'created_at_asc':
        return sorted.sort((a, b) => a.created_at.valueOf() - b.created_at.valueOf());
      case 'created_at_desc':
        return sorted.sort((a, b) => b.created_at.valueOf() - a.created_at.valueOf());
      case 'event_name_asc':
        return sorted.sort((a, b) => (a.event_name || '').localeCompare(b.event_name || ''));
      case 'event_name_desc':
        return sorted.sort((a, b) => (b.event_name || '').localeCompare(a.event_name || ''));
      // case 'status':
      //   return sorted.sort((a, b) => (a.status || '').localeCompare(b.status || ''));
      case 'creator':
        return sorted.sort((a, b) => (a.requester?.name || '').localeCompare(b.requester?.name || ''));
      default:
        return sorted;
    }
  };

  // Función para paginar prebookings
  const paginatePrebookings = (
    prebookings: PreBookingRequestModel[],
    page: number,
    perPage: number
  ): PreBookingRequestModel[] => {
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    return prebookings.slice(startIndex, endIndex);
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

    // Aplicar filtros, ordenamiento y paginación
    let processed = filterPrebookings(
      allPreBookingRequests,
      selectedStatus,
      searchText,
      dateFrom,
      dateTo,
      myApprovalFilter
    );
    processed = sortPrebookings(processed, sortBy);

    // Reiniciar a la primera página si cambian los filtros o el ordenamiento
    setDisplayedPrebookings(processed);
  }, [
    allPreBookingRequests,
    isUpdatingStatus,
    updatingPrebookingId,
    selectedStatus,
    searchText,
    dateFrom,
    dateTo,
    myApprovalFilter,
    sortBy,
    loggedUser,
  ]);

  // Calcular el total de páginas y los prebookings a mostrar
  const totalItems = displayedPrebookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedPrebookings = paginatePrebookings(displayedPrebookings, currentPage, itemsPerPage);

  // Resetear a la primera página cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedStatus, searchText, dateFrom, dateTo, myApprovalFilter, sortBy]);

  // Efecto para manejar el scroll y mostrar/ocultar el header fijo
  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerRect = headerRef.current.getBoundingClientRect();
        // Mostrar header fijo cuando el header principal está fuera de la vista
        setShowFixedHeader(headerRect.bottom < 0);
      }
    };

    document.title = `Prebookings  ◃⬡▹  Artist Hive`;
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
    setDateFrom(null);
    setDateTo(null);
  };

  const hasActiveSearch = searchText.trim() !== '';
  const hasActiveDateFilter = dateFrom !== null || dateTo !== null;
  const hasActiveStatusFilter = selectedStatus !== 'all';
  const hasActiveMyApprovalFilter = myApprovalFilter !== '';

  const getHeaderTitle = () => {
    return (
      <>
        <h3>Prebookings</h3>
        <div className="pb-step-title">
          <div
            className={`pb-step-tab${activeTab === 'proposals' ? ' pb-step-tab--active' : ''}`}
            onClick={() => setActiveTab('proposals')}
          >
            <DynamicIcons iconName="fa FaCalendarPlus" size={18} />
            <span>Propuestas</span>
          </div>
          <div
            className={`pb-step-tab${activeTab === 'dialogs' ? ' pb-step-tab--active' : ''}`}
            onClick={() => setActiveTab('dialogs')}
          >
            <DynamicIcons iconName="io5 IoChatbubbles" size={18} />
            <span>Diálogos</span>
          </div>
        </div>
      </>
    );
  };

  // Función helper para crear filtros de aprobación personal con opción "all"
  const createMyApprovalFilters = (
    getApprovalIcon: (status: string) => { icon: string; color: string } | undefined
  ) => [
    {
      value: '',
      label: 'Todas',
      getIcon: () => ({ icon: 'go GoTasklist', color: '#202020' }),
    },
    ...createApprovalStatusOptions(getApprovalIcon),
  ];

  // Función helper para crear opciones de estado de aprobación
  const createApprovalStatusOptions = (
    getApprovalIcon: (status: string) => { icon: string; color: string } | undefined
  ) => [
    {
      value: PrebookingParticipantStatus.INTERESTED,
      label: translateGlobalDict(`prebooking.participant_status.${PrebookingParticipantStatus.INTERESTED}`),
      getIcon: () => getApprovalIcon(PrebookingParticipantStatus.INTERESTED),
    },
    {
      value: PrebookingParticipantStatus.PENDING,
      label: translateGlobalDict(`prebooking.participant_status.${PrebookingParticipantStatus.PENDING}`),
      getIcon: () => getApprovalIcon(PrebookingParticipantStatus.PENDING),
    },
    {
      value: PrebookingParticipantStatus.NOT_INTERESTED,
      label: translateGlobalDict(`prebooking.participant_status.${PrebookingParticipantStatus.NOT_INTERESTED}`),
      getIcon: () => getApprovalIcon(PrebookingParticipantStatus.NOT_INTERESTED),
    },
  ];
  // Crear filtros de aprobación con íconos
  const myApprovalFilters = createMyApprovalFilters(getApprovalIcon);

  const hasAnyActiveFilter =
    hasActiveSearch || hasActiveDateFilter || hasActiveStatusFilter || hasActiveMyApprovalFilter;

  const getEmptyStateContent = () => {
    if (hasAnyActiveFilter) {
      return {
        icon: 'TbCalendarSearch',
        title: 'No hay resultados',
        description: 'No se encontraron prebookings con los filtros aplicados',
      };
    }
    return {
      icon: 'TbCalendarQuestion',
      title: 'No hay prebookings aún',
      description: 'Cuando tengas prebookings, aparecerán aquí',
    };
  };

  const handleStatusChange = (prebookingId: string, status: string) => {
    const prebooking = paginatedPrebookings.find((pb) => pb.identifier === prebookingId);
    if (prebooking) {
      setIsUpdatingStatus(true);
      setUpdatingPrebookingId(prebookingId);
      dispatch(
        prebookingActions.postActionItem({
          id: prebooking.id,
          action: 'setStatus',
          newItem: {},
          params: { status },
        })
      );
    }
  };

  const renderPagination = ({
    showPageInfo = true,
    showItemsPerPage = true,
  }: {
    showPageInfo?: boolean;
    showItemsPerPage?: boolean;
  }) => {
    const isSinglePage = totalPages <= 1;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    // No renderizar nada si no hay elementos que mostrar
    const shouldShowPageInfo = !isSinglePage && showPageInfo;
    const shouldShowPagination = !isSinglePage;
    const shouldShowItemsPerPage = showItemsPerPage;

    // Si ninguno de los elementos se va a mostrar, no renderizar el contenedor
    if (!shouldShowPageInfo && !shouldShowPagination && !shouldShowItemsPerPage) {
      return null;
    }

    return (
      <div className="pb-pagination-container">
        {shouldShowPageInfo && (
          <div className="pb-pagination-info">
            [ {startItem}-{endItem} ] / {totalItems}
          </div>
        )}
        {shouldShowPagination && (
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={(e, page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            color="primary"
            showFirstButton
            showLastButton
          />
        )}
        {shouldShowItemsPerPage && (
          <FormControl size="small" sx={{ minWidth: 100 }}>
            <Select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              displayEmpty
            >
              {itemsPerPageOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option} por página
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>
    );
  };

  const renderTableView = () => {
    return (
      <div className="pb-table-container">
        <table className="pb-table">
          <thead>
            <tr>
              {tableColumns.map((col) => (
                <th key={col.id} className={col.className}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedPrebookings.map((prebooking: PreBookingRequestModel, index: number) => {
              const myApprovalStatus = prebooking.participant_approvals.find(
                (approval) => approval.participant_profile_id === loggedUser?.currentProfileInfo.id
              )?.status;
              const myApprovalIcon = getApprovalIcon(myApprovalStatus);

              return (
                <tr key={`prebook_table_${index}`} className="pb-table-row">
                  <td className="pb-table-event-name">
                    <strong>{prebooking.event_name}</strong>
                    {prebooking.description && <div className="pb-table-description">{prebooking.description}</div>}
                    <AvatarGroup
                      max={3}
                      spacing={-6}
                      componentsProps={{
                        additionalAvatar: {
                          sx: {
                            fontSize: '1rem',
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
                                    size={14}
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
                                  width: 28,
                                  height: 28,
                                  color: 'white',
                                  border: (approvalInfo ? `2px solid ${approvalInfo.color}` : 'none') + ' !important',
                                }}
                              />
                            </Badge>
                          );
                        }
                      )}
                    </AvatarGroup>
                  </td>
                  <td className="pb-table-date">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div>
                        {prebooking.requested_date_start?.format('DD/MM/YY')}
                        {prebooking.flexible_dates && <div style={{ fontSize: '0.7rem' }}>(Flex.)</div>}
                      </div>
                    </div>
                  </td>
                  <td className="pb-table-venue">
                    {prebooking.venues.map((venue: CurrentProfileInfoModel, idx: number) => (
                      <div key={`venue_${idx}`}>
                        {venue.name}
                        {venue.location && Array.isArray(venue.location) && venue.location.length > 0 && (
                          <div style={{ fontSize: '0.75rem', color: '#999' }}>
                            {venue.location[0]?.city}, {venue.location[0]?.country_name}
                          </div>
                        )}
                      </div>
                    ))}
                  </td>
                  {/* <td className="pb-table-status">
                    <Chip label={prebooking.status} size="small" />
                  </td> */}
                  <td className="pb-table-my-response">
                    {isUpdatingStatus && prebooking.identifier === updatingPrebookingId ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          minHeight: '40px',
                          width: '100%',
                        }}
                      >
                        <AppLoader fullHeight={false} height="2rem" padding="0" iconSize="2rem" />
                      </div>
                    ) : (
                      loggedUser?.currentProfileIdentifier && (
                        <FormControl size="small">
                          <Select
                            value={myApprovalStatus || PrebookingParticipantStatus.PENDING}
                            onChange={(e) => {
                              setIsUpdatingStatus(true);
                              setUpdatingPrebookingId(prebooking.identifier);
                              dispatch(
                                prebookingActions.postActionItem({
                                  id: prebooking.id,
                                  action: 'setStatus',
                                  newItem: {},
                                  params: { status: e.target.value },
                                })
                              );
                            }}
                            renderValue={(value) => {
                              const icon = getApprovalIcon(value);
                              return (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                  {icon && (
                                    <DynamicIcons
                                      iconName={icon.icon}
                                      color={icon.color}
                                      size={20}
                                      background="white"
                                    />
                                  )}
                                </div>
                              );
                            }}
                            sx={{
                              '& .MuiSelect-select': { padding: '4px 8px' },
                              '& fieldset': { borderColor: '#ddd', borderRadius: '20px' },
                            }}
                          >
                            <MenuItem value={PrebookingParticipantStatus.INTERESTED}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <DynamicIcons
                                  iconName={getApprovalIcon(PrebookingParticipantStatus.INTERESTED).icon}
                                  color={getApprovalIcon(PrebookingParticipantStatus.INTERESTED).color}
                                  size={20}
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
                      )
                    )}
                  </td>
                  <td className="pb-table-actions">
                    {loggedUser?.currentProfileIdentifier === prebooking?.requester?.identifier && (
                      <IconButton size="small" onClick={(e: any) => handleMenuOpen(e, prebooking.id)}>
                        <DynamicIcons iconName="HiDotsVertical" size={16} />
                      </IconButton>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const getHeaderFilters = () => {
    return (
      <>
        <div className="pb-header-filters">
          {/* <FormControl size="small">
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              displayEmpty
              renderValue={(value) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingRight: '1rem',
                    position: 'relative',
                  }}
                >
                  <DynamicIcons iconName="fa FaCalendarCheck" size={20} />
                  {hasActiveStatusFilter && <span className="pb-search-badge" />}
                </div>
              )}
              sx={{
                '& .MuiSelect-select': {
                  padding: '6px 12px',
                },
                '& fieldset': {
                  border: 'none',
                },
              }}
            >
              {statusFilters.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          <FormControl size="small">
            <Select
              value={myApprovalFilter}
              onChange={(e) => {
                setMyApprovalFilter(e.target.value);
              }}
              displayEmpty
              renderValue={(value) => (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    paddingRight: '1rem',
                    position: 'relative',
                  }}
                >
                  <DynamicIcons iconName="fa FaUserCheck" size={20} />
                  {hasActiveMyApprovalFilter && <span className="pb-search-badge" />}
                </div>
              )}
              sx={{
                '& .MuiSelect-select': {
                  padding: '6px 12px',
                },
                '& fieldset': {
                  border: 'none',
                },
              }}
            >
              {myApprovalFilters.map((filter) => {
                const icon = filter.getIcon();
                return (
                  <MenuItem key={filter.value} value={filter.value}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {icon && <DynamicIcons iconName={icon.icon} color={icon.color} size={20} background="white" />}
                      <span>{filter.label}</span>
                    </div>
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>

          <FormControl size="small">
            <Select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
              }}
              displayEmpty
              renderValue={(value) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '1rem' }}>
                  <DynamicIcons iconName="tb TbArrowsSort" size={20} />
                </div>
              )}
              sx={{
                '& .MuiSelect-select': {
                  padding: '6px 12px',
                },
                '& fieldset': {
                  border: 'none',
                },
              }}
            >
              {sortOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <IconButton
            onClick={showHideDateFilter}
            size="small"
            aria-label={openDateFilter ? 'cerrar filtro de fecha' : 'abrir filtro de fecha'}
            className={hasActiveDateFilter ? 'active-filter' : ''}
            sx={{ position: 'relative' }}
          >
            {openDateFilter ? (
              <DynamicIcons iconName="FaRegCalendarTimes" size={20} />
            ) : (
              <DynamicIcons iconName="FaRegCalendarAlt" size={20} />
            )}
            {hasActiveDateFilter && <span className="pb-search-badge" />}
          </IconButton>

          <IconButton
            onClick={showHideSearchField}
            size="small"
            aria-label={openStatusSearchInputText ? 'cerrar búsqueda' : 'abrir búsqueda'}
            className={hasActiveSearch ? 'active-filter' : ''}
            sx={{ position: 'relative' }}
          >
            {openStatusSearchInputText ? (
              <DynamicIcons iconName="MdSearchOff" size={20} />
            ) : (
              <DynamicIcons iconName="AiOutlineSearch" size={20} />
            )}
            {hasActiveSearch && <span className="pb-search-badge" />}
          </IconButton>

          <IconButton
            onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
            size="small"
            aria-label={viewMode === 'cards' ? 'cambiar a vista de tabla' : 'cambiar a vista de tarjetas'}
          >
            {viewMode === 'cards' ? (
              <DynamicIcons iconName="FaList" size={20} />
            ) : (
              <DynamicIcons iconName="BsFillGrid3X3GapFill" size={20} />
            )}
          </IconButton>
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
              <DatePicker
                className="pb-date-field"
                label="Desde"
                value={dateFrom}
                onChange={(date) => setDateFrom(date)}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
                }}
              />
              <DatePicker
                className="pb-date-field"
                label="Hasta"
                value={dateTo}
                onChange={(date) => setDateTo(date)}
                minDate={dateFrom || undefined}
                slotProps={{
                  textField: {
                    size: 'small',
                  },
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

  const getProposalsView = () => {
    return (
      <>
        {renderPagination({ showItemsPerPage: false, showPageInfo: false })}
        <div style={{ display: viewMode === 'table' ? 'contents' : 'none' }}>{renderTableView()}</div>
        <div style={{ display: viewMode === 'cards' ? 'contents' : 'none' }}>
          {paginatedPrebookings.map((prebooking: PreBookingRequestModel, index: number) => {
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
                                <AppLoader fullHeight={false} height="1rem" />
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
          })}
        </div>
        {renderPagination({ showPageInfo: true })}
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
          (() => {
            const emptyState = getEmptyStateContent();
            return (
              <div className="pb-empty-state">
                <DynamicIcons iconName={emptyState.icon} size={60} />
                <h3>{emptyState.title}</h3>
                <p>{emptyState.description}</p>
              </div>
            );
          })()
        ) : (
          <>{getProposalsView()}</>
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
