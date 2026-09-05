/**
 * OpenCallsListPage - Nueva implementación con diseño flexible
 *
 * Implementación inline (sin modularizar) que luego se extraerá a componentes genéricos.
 * Soporta múltiples vistas (cards/table), filtros parametrizados, y diseño responsive.
 */

import { FormControl, MenuItem, Pagination, Select, Stack } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  selectorOpenCallApplications,
  useOpenCallApplicationsSlice,
} from '~/common/slices/domain/open-calls/open-call-applications.redux';
import { selectorOpenCalls, useOpenCallsSlice } from '~/common/slices/domain/open-calls/open-calls.redux';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { FixedHeader } from '~/components/shared/molecules/FixedHeader/FixedHeader';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms/dynamic-control-types';
import { OpenCallApplicationModel } from '~/models/domain/open-call/v1';
import { OpenCallStatus } from '~/models/domain/open-call/open-call.model';
// import { DefaultTransformerContext, TabbedPanel } from '~/components/shared/layout/TabbedPanel';
import { PATHS, SUB_PATHS } from '~/constants';
import { TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE } from '../OpenCallDetailsPage/config-open-call-details';
import './OpenCallsListPage.scss';

const OpenCallsListPage = () => {
  const { translateText } = useI18n();
  const translate = (key: string) => translateText(`${TRANSLATION_BASE_OPEN_CALL_DETAILS_PAGE}.${key}`);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loggedUser = useSelector(selectCurrentUser);

  const { actions: openCallActions } = useOpenCallsSlice();
  const openCalls = useSelector(selectorOpenCalls.selectItems);
  const openCallsLoading = useSelector(selectorOpenCalls.selectLoading);

  const { actions: openCallApplicationActions } = useOpenCallApplicationsSlice();
  const applications: OpenCallApplicationModel[] = useSelector(selectorOpenCallApplications.selectItems);
  const applicationsLoading = useSelector(selectorOpenCallApplications.selectLoading);

  const [isArtistProfile, setIsArtistProfile] = useState(false);
  const [isPlaceProfile, setIsPlaceProfile] = useState(false);
  const [currentProfileId, setCurrentProfileId] = useState<string>(undefined);

  const mainHeaderRef = useRef<HTMLDivElement>(null);

  // ========== UI STATE ==========
  const [activeTab, setActiveTab] = useState<'active' | 'past' | 'available' | 'applications'>('active');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // ========== DIALOG STATE ==========
  const [isSortDialogOpen, setIsSortDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);

  // ========== FILTER STATE ==========
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [genreFilter, setGenreFilter] = useState<string>('');
  const [cityFilter, setCityFilter] = useState<string>('');

  // ========== FORM METHODS FOR DIALOGS ==========
  const filterFormMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      status: statusFilter,
      genre: genreFilter,
      city: cityFilter,
    },
  });

  const sortFormMethods = useForm({
    mode: 'onChange',
    defaultValues: {
      sortField: '',
    },
  });

  // ========== SORT STATE ==========
  const [sortBy, setSortBy] = useState<{ field: string; direction: 'asc' | 'desc' }[]>([
    { field: 'event_date', direction: 'asc' },
  ]);

  // ========== PAGINATION STATE ==========
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20);

  // ========== DATA STATE ==========
  const [activeCalls, setActiveCalls] = useState([]);
  const [pastCalls, setPastCalls] = useState([]);
  const [myApplications, setMyApplications] = useState([]);

  // Load data on mount
  // Update data when openCalls or applications change
  useEffect(() => {
    if (!openCallsLoading) {
      // console.log('llegaron los openCall', openCalls);
      // console.log('currentProfileId', currentProfileId);
      // console.log('isPlaceProfile', isPlaceProfile);

      if (openCalls.length > 0) {
        // console.log('Primer openCall placeId:', openCalls[0].placeId);
        // console.log('Comparación:', openCalls[0].placeId, '===', currentProfileId);
      }

      const myOpenCalls =
        currentProfileId && isPlaceProfile
          ? [
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
              ...openCalls,
            ].filter((oc) => oc.placeId === currentProfileId)
          : [...openCalls];

      console.log('myOpenCalls', myOpenCalls);
      const active = myOpenCalls.filter((oc) => oc.status === 'OPEN');
      const past = myOpenCalls.filter((oc) => oc.status !== 'OPEN');
      console.log('activeCalls', active);
      console.log('pastCalls', past);
      setActiveCalls(active);
      setPastCalls(past);
    }
  }, [openCalls, openCallsLoading, currentProfileId, isPlaceProfile]);

  useEffect(() => {
    if (!applicationsLoading && currentProfileId) {
      const myApps = applications.filter((app) => app.artistId === currentProfileId);
      console.log('myApplications', myApps);
      setMyApplications(myApps);
    }
  }, [applications, applicationsLoading, currentProfileId]);

  useEffect(() => {
    dispatch(openCallActions.loadItems({}));
  }, [dispatch]);

  useEffect(() => {
    if (currentProfileId) {
      dispatch(openCallApplicationActions.loadItems({ queryParams: { artist_id: currentProfileId } }));
    }
  }, [currentProfileId, dispatch]);

  useEffect(() => {
    if (!!loggedUser) {
      // Determinar el tipo de perfil actual
      const currentProfileEntity = loggedUser?.currentProfileInfo?.entity;
      const isPlace = currentProfileEntity === 'Place';
      const isArtist = currentProfileEntity === 'Artist';

      setIsPlaceProfile(isPlace);
      setIsArtistProfile(isArtist);
      setCurrentProfileId(loggedUser?.currentProfileInfo?.id);

      // Set default tab based on profile
      if (isPlace) {
        setActiveTab('active');
      } else if (isArtist) {
        setActiveTab('available');
      }
    }
  }, [loggedUser]);

  // Get data based on active tab
  const getDataForCurrentTab = () => {
    switch (activeTab) {
      case 'active':
        return activeCalls;
      case 'past':
        return pastCalls;
      case 'available':
        return activeCalls; // For artists: all active open calls
      case 'applications':
        return myApplications;
      default:
        return [];
    }
  };

  const currentData = getDataForCurrentTab();

  // ========== FILTERING ==========
  const filteredData = currentData.filter((item: any) => {
    // Search filter
    if (searchText.trim() !== '') {
      const searchLower = searchText.toLowerCase();
      const matchesSearch =
        item.event_name?.toLowerCase().includes(searchLower) ||
        item.city?.toLowerCase().includes(searchLower) ||
        item.openCallSummary?.event_name?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Status filter
    if (statusFilter && item.status !== statusFilter) {
      return false;
    }

    // Genre filter (for open calls)
    if (genreFilter && item.genres) {
      const genresArray = Array.isArray(item.genres)
        ? item.genres
        : item.genres.split(',').map((g: string) => g.trim());
      if (!genresArray.includes(genreFilter)) {
        return false;
      }
    }

    // City filter
    if (cityFilter && item.city !== cityFilter) {
      return false;
    }

    return true;
  });

  // ========== SORTING ==========
  const sortedData = [...filteredData].sort((a: any, b: any) => {
    // Aplicar ordenamiento multi-nivel
    for (const sort of sortBy) {
      const { field, direction } = sort;
      let aVal = a[field];
      let bVal = b[field];

      // Handle dates
      if (field.includes('date')) {
        aVal = aVal ? new Date(aVal).getTime() : 0;
        bVal = bVal ? new Date(bVal).getTime() : 0;
      }

      // Handle numbers
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        const result = direction === 'asc' ? aVal - bVal : bVal - aVal;
        if (result !== 0) return result;
        continue; // Si son iguales, pasar al siguiente nivel de ordenamiento
      }

      // Handle strings
      const aStr = String(aVal || '');
      const bStr = String(bVal || '');
      const result = direction === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      if (result !== 0) return result;
    }
    return 0;
  });

  // ========== PAGINATION ==========
  const totalItems = sortedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedData = sortedData.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchText, statusFilter, genreFilter, cityFilter, JSON.stringify(sortBy), activeTab]);

  // ========== HANDLERS ==========
  const handleItemClick = (item: any) => {
    if (activeTab === 'applications') {
      if (item.openCallId || item.open_call_id) {
        navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}/${item.openCallId || item.open_call_id}`);
      }
    } else {
      const itemId = item.identifier || item.id;
      navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.ELEMENT_DETAILS}/${itemId}`);
      // if (isPlaceProfile) {
      // } else {
      //   navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.APPLY}/${itemId}`);
      // }
    }
  };

  const hasActiveFilters = searchText.trim() !== '' || statusFilter !== '' || genreFilter !== '' || cityFilter !== '';

  const loading = openCallsLoading || (isArtistProfile && applicationsLoading);

  // ========== RENDER HELPERS ==========
  const renderTabNavigation = () => {
    const tabs = isPlaceProfile
      ? [
          { key: 'active' as const, label: 'Activas' },
          { key: 'past' as const, label: 'Pasadas' },
        ]
      : [
          { key: 'available' as const, label: 'Disponibles' },
          { key: 'applications' as const, label: 'Mis Aplicaciones' },
        ];

    return (
      <div className="oc-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            className={`oc-tab ${activeTab === tab.key ? 'oc-tab--active' : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  const renderFilters = () => (
    <div className="oc-filters">
      <div className="oc-filter-row">
        {/* Search */}
        <input
          type="text"
          className="oc-search-input"
          placeholder="Buscar por nombre o ciudad..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <div className="oc-action-buttons">
          {/* Sort Button */}
          <button
            className="oc-icon-btn"
            onClick={() => setIsSortDialogOpen(true)}
            title="Ordenar"
            aria-label="Ordenar"
          >
            <DynamicIcons iconName="MdSort" size={20} />
          </button>

          {/* Filter Button */}
          <button
            className="oc-icon-btn"
            onClick={() => setIsFilterDialogOpen(true)}
            title="Filtrar"
            aria-label="Filtrar"
          >
            <DynamicIcons iconName="MdFilterList" size={20} />
          </button>

          {/* View Mode Toggle */}
          <button
            className="oc-icon-btn"
            onClick={() => setViewMode((prev) => (prev === 'cards' ? 'table' : 'cards'))}
            title={viewMode === 'cards' ? 'Cambiar a vista de tabla' : 'Cambiar a vista de tarjetas'}
            aria-label={viewMode === 'cards' ? 'Vista de tabla' : 'Vista de tarjetas'}
          >
            <DynamicIcons iconName={viewMode === 'cards' ? 'MdViewList' : 'MdViewModule'} size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderSortDialog = () => {
    const {
      formState: { errors: sortErrors },
      watch,
    } = sortFormMethods;

    const sortableFields = [
      { field: 'event_name', label: 'Nombre del evento' },
      { field: 'event_date', label: 'Fecha del evento' },
      { field: 'end_date', label: 'Fecha fin de convocatoria' },
      { field: 'city', label: 'Ciudad' },
      ...(isPlaceProfile && activeTab === 'active'
        ? [{ field: 'applications_count', label: 'Cantidad de aplicaciones' }]
        : []),
    ];

    const handleAddSort = (field: string) => {
      if (!sortBy.find((s) => s.field === field)) {
        setSortBy([...sortBy, { field, direction: 'asc' }]);
        sortFormMethods.reset({ sortField: '' });
      }
    };

    // Watch para auto-agregar criterio cuando cambia el select
    const selectedField = watch('sortField');
    useEffect(() => {
      if (selectedField && selectedField !== '') {
        handleAddSort(selectedField);
      }
    }, [selectedField]);

    const handleRemoveSort = (index: number) => {
      setSortBy(sortBy.filter((_, i) => i !== index));
    };

    const handleToggleDirection = (index: number) => {
      setSortBy(sortBy.map((s, i) => (i === index ? { ...s, direction: s.direction === 'asc' ? 'desc' : 'asc' } : s)));
    };

    const handleMoveUp = (index: number) => {
      if (index === 0) return;
      const newSortBy = [...sortBy];
      [newSortBy[index - 1], newSortBy[index]] = [newSortBy[index], newSortBy[index - 1]];
      setSortBy(newSortBy);
    };

    const handleMoveDown = (index: number) => {
      if (index === sortBy.length - 1) return;
      const newSortBy = [...sortBy];
      [newSortBy[index], newSortBy[index + 1]] = [newSortBy[index + 1], newSortBy[index]];
      setSortBy(newSortBy);
    };

    // Filtrar campos ya usados
    const availableFields = sortableFields.filter((f) => !sortBy.find((s) => s.field === f.field));

    // Configuración del campo de select con onChange automático
    const sortFieldData: DynamicFieldData = {
      inputType: 'select',
      fieldName: 'sortField',
      label: 'Agregar criterio',
      options: [
        { label: 'Seleccionar campo...', value: '' },
        ...availableFields.map((f) => ({ label: f.label, value: f.field })),
      ],
      defaultValue: '',
      componentParams: {
        className: 'oc-sort-add-field',
        onChange: (e: any) => {
          const field = e.target.value;
          if (field) {
            handleAddSort(field);
          }
        },
      },
    };

    const sortDialogContent = (
      <FormProvider {...sortFormMethods}>
        <div className="oc-sort-dialog-content">
          {/* Current sorts */}
          {sortBy.length > 0 && (
            <div className="oc-sort-list">
              {sortBy.map((sort, index) => {
                const fieldLabel = sortableFields.find((f) => f.field === sort.field)?.label || sort.field;
                return (
                  <div key={sort.field} className="oc-sort-item">
                    <div className="oc-sort-item-header">
                      <span className="oc-sort-priority">{index + 1}.</span>
                    </div>
                    <div className="oc-sort-item-content">
                      {sortBy.length > 1 && (
                        <>
                          {/* Delete button */}
                          <span
                            className="oc-sort-icon oc-sort-icon--danger"
                            onClick={() => handleRemoveSort(index)}
                            title="Eliminar"
                          >
                            <DynamicIcons iconName="MdClose" size={20} color={'red'} />
                          </span>
                          {/* Move up button or empty space */}
                          {index === 0 ? (
                            <span
                              className="oc-sort-icon oc-sort-icon--placeholder"
                              style={{ opacity: 0, pointerEvents: 'none' }}
                            >
                              <DynamicIcons iconName="MdKeyboardArrowUp" size={20} />
                            </span>
                          ) : (
                            <span className="oc-sort-icon" onClick={() => handleMoveUp(index)} title="Subir prioridad">
                              <DynamicIcons iconName="MdKeyboardArrowUp" size={20} />
                            </span>
                          )}
                          {/* Move down button or empty space */}
                          {index === sortBy.length - 1 ? (
                            <span
                              className="oc-sort-icon oc-sort-icon--placeholder"
                              style={{ opacity: 0, pointerEvents: 'none' }}
                            >
                              <DynamicIcons iconName="MdKeyboardArrowDown" size={20} />
                            </span>
                          ) : (
                            <span
                              className="oc-sort-icon"
                              onClick={() => handleMoveDown(index)}
                              title="Bajar prioridad"
                            >
                              <DynamicIcons iconName="MdKeyboardArrowDown" size={20} />
                            </span>
                          )}
                        </>
                      )}
                      <span className="oc-sort-field">{fieldLabel}</span>
                      <span className="oc-sort-direction" onClick={() => handleToggleDirection(index)}>
                        <DynamicIcons
                          iconName={sort.direction === 'asc' ? 'fa FaSortAmountDownAlt' : 'fa FaSortAmountDown'}
                          size={20}
                        />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add new sort */}
          {availableFields.length > 0 && (
            <div className="oc-sort-add">
              <DynamicControl fieldData={sortFieldData} errors={sortErrors} handlers={{}} />
            </div>
          )}

          {/* Clear all */}
          {sortBy.length > 0 && (
            <button className="oc-sort-clear" onClick={() => setSortBy([{ field: 'event_date', direction: 'asc' }])}>
              <DynamicIcons iconName="MdClear" size={16} />
              <span>Limpiar todo</span>
            </button>
          )}
        </div>
      </FormProvider>
    );

    return (
      <AppDialog
        isOpenDialog={isSortDialogOpen}
        onClose={() => setIsSortDialogOpen(false)}
        title="Ordenar por"
        content={sortDialogContent}
      />
    );
  };

  const renderFilterDialog = () => {
    const {
      formState: { errors: filterErrors },
    } = filterFormMethods;

    // Definir campos del formulario de filtros
    const filterFields: DynamicFieldData[] = [
      {
        inputType: 'select',
        fieldName: 'status',
        label: 'Estado',
        options: [
          { label: 'Todos', value: '' },
          { label: 'Abierta', value: 'OPEN' },
          { label: 'Cerrada', value: 'CLOSED' },
          { label: 'Borrador', value: 'DRAFT' },
        ],
        defaultValue: statusFilter,
      },
    ];

    if (activeTab !== 'applications') {
      filterFields.push({
        inputType: 'text',
        fieldName: 'genre',
        label: 'Género',
        componentParams: { placeholder: 'Filtrar por género...' },
        defaultValue: genreFilter,
      });
    }

    filterFields.push({
      inputType: 'text',
      fieldName: 'city',
      label: 'Ciudad',
      componentParams: { placeholder: 'Filtrar por ciudad...' },
      defaultValue: cityFilter,
    });

    const handleApplyFilters = (data: any) => {
      setStatusFilter(data.status || '');
      setGenreFilter(data.genre || '');
      setCityFilter(data.city || '');
      setIsFilterDialogOpen(false);
    };

    const handleClearFilters = () => {
      filterFormMethods.reset({ status: '', genre: '', city: '' });
      setStatusFilter('');
      setGenreFilter('');
      setCityFilter('');
    };

    const filterDialogContent = (
      <FormProvider {...filterFormMethods}>
        <div className="oc-filter-dialog-content">
          <Stack spacing={2}>
            {filterFields.map((fieldData, index) => (
              <DynamicControl key={fieldData.fieldName} fieldData={fieldData} errors={filterErrors} handlers={{}} />
            ))}
          </Stack>

          <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
            {hasActiveFilters && (
              <button className="oc-filter-clear" onClick={handleClearFilters} type="button">
                <DynamicIcons iconName="MdClear" size={16} />
                <span>Limpiar filtros</span>
              </button>
            )}
            <button
              className="oc-filter-apply"
              onClick={filterFormMethods.handleSubmit(handleApplyFilters)}
              type="button"
            >
              <DynamicIcons iconName="MdCheck" size={16} />
              <span>Aplicar</span>
            </button>
          </div>
        </div>
      </FormProvider>
    );

    return (
      <AppDialog
        isOpenDialog={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        title="Filtros"
        content={filterDialogContent}
      />
    );
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="oc-pagination">
        <div className="oc-pagination-info">
          [{startIndex + 1}-{endIndex}] / {totalItems}
        </div>
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
        <FormControl size="small" sx={{ minWidth: 100 }}>
          <Select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            displayEmpty
          >
            {[10, 20, 50, 100].map((option) => (
              <MenuItem key={option} value={option}>
                {option} por página
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  };

  // Función para resolver el badge similar a OpenCallPresentation
  const resolveBadge = (item: any) => {
    if (item.status !== OpenCallStatus.OPEN) {
      return {
        label: translate(`open_call_status.${item.status}`),
        modifier: item.status === OpenCallStatus.DRAFT ? 'status' : 'expired',
      };
    }

    return item.isExpired
      ? { label: translate('presentation.expired_badge'), modifier: 'expired' }
      : { label: translate('presentation.open_badge'), modifier: 'open' };
  };

  const renderCardView = () => (
    <div className="oc-cards-grid">
      {paginatedData.map((item: any) => {
        const badge = resolveBadge(item);
        return (
          <div key={item.identifier || item.id} className="oc-card" onClick={() => handleItemClick(item)}>
            <div className="oc-card-header">
              <h3 className="oc-card-title">{item.event_name || item.openCallSummary?.event_name}</h3>
              {item.status && (
                <span className={`oc-card-status oc-card-status--${badge.modifier}`}>{badge.label}</span>
              )}
            </div>
          <div className="oc-card-body">
            {item.event_date && (
              <div className="oc-card-field">
                <strong>Fecha del evento:</strong> {new Date(item.event_date).toLocaleDateString()}
              </div>
            )}
            {item.city && (
              <div className="oc-card-field">
                <strong>Ciudad:</strong> {item.city}
              </div>
            )}
            {item.genres && (
              <div className="oc-card-field">
                <strong>Géneros:</strong> {Array.isArray(item.genres) ? item.genres.join(', ') : item.genres}
              </div>
            )}
            {item.applications_count !== undefined && (
              <div className="oc-card-field">
                <strong>Aplicaciones:</strong> {item.applications_count}
              </div>
            )}
            {item.application_status && (
              <div className="oc-card-field">
                <strong>Estado:</strong> {item.application_status}
              </div>
            )}
          </div>
          </div>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <div className="oc-table-wrapper">
      <table className="oc-table">
        <thead>
          <tr>
            <th>Evento</th>
            {activeTab !== 'applications' && <th>Fecha del evento</th>}
            {activeTab === 'active' && isPlaceProfile && (
              <>
                <th>Fecha inicio</th>
                <th>Fecha fin</th>
                <th>Aplicaciones</th>
              </>
            )}
            {activeTab === 'available' && (
              <>
                <th>Ciudad</th>
                <th>Géneros</th>
                <th>Fecha fin convocatoria</th>
              </>
            )}
            {activeTab === 'applications' && (
              <>
                <th>Fecha del evento</th>
                <th>Ciudad</th>
                <th>Estado</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((item: any) => (
            <tr key={item.identifier || item.id} onClick={() => handleItemClick(item)} className="oc-table-row">
              <td>{item.event_name || item.openCallSummary?.event_name}</td>
              {activeTab !== 'applications' && (
                <td>{item.event_date ? new Date(item.event_date).toLocaleDateString() : '-'}</td>
              )}
              {activeTab === 'active' && isPlaceProfile && (
                <>
                  <td>{item.start_date ? new Date(item.start_date).toLocaleDateString() : '-'}</td>
                  <td>{item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'}</td>
                  <td>{item.applications_count || 0}</td>
                </>
              )}
              {activeTab === 'available' && (
                <>
                  <td>{item.city || '-'}</td>
                  <td>{Array.isArray(item.genres) ? item.genres.join(', ') : item.genres || '-'}</td>
                  <td>{item.end_date ? new Date(item.end_date).toLocaleDateString() : '-'}</td>
                </>
              )}
              {activeTab === 'applications' && (
                <>
                  <td>
                    {item.openCallSummary?.event_date
                      ? new Date(item.openCallSummary.event_date).toLocaleDateString()
                      : '-'}
                  </td>
                  <td>{item.openCallSummary?.city || '-'}</td>
                  <td>{item.application_status || item.status}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderEmptyState = () => {
    if (hasActiveFilters) {
      return (
        <div className="oc-empty-state">
          <h3>No se encontraron resultados</h3>
          <p>Intenta ajustar los filtros de búsqueda</p>
        </div>
      );
    }

    const emptyMessages = {
      active: { title: 'No hay convocatorias activas', description: 'Crea tu primera convocatoria para comenzar' },
      past: { title: 'No hay convocatorias pasadas', description: 'Las convocatorias cerradas aparecerán aquí' },
      available: {
        title: 'No hay convocatorias disponibles',
        description: 'Por el momento no hay convocatorias abiertas',
      },
      applications: {
        title: 'No has aplicado a ninguna convocatoria',
        description: 'Explora las convocatorias disponibles y aplica',
      },
    };

    const message = emptyMessages[activeTab];

    return (
      <div className="oc-empty-state">
        <h3>{message.title}</h3>
        <p>{message.description}</p>
      </div>
    );
  };

  // ========== MAIN RENDER ==========
  return (
    <div className="open-calls-list-page">
      {/* Fixed Header */}
      <FixedHeader mainHeaderRef={mainHeaderRef}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          <h2 style={{ margin: 0, fontSize: '1.1rem' }}>
            {isPlaceProfile ? 'Mis Convocatorias' : 'Convocatorias'}
          </h2>
          {isPlaceProfile && (
            <button
              className="oc-create-btn"
              onClick={() => navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.CREATE}`)}
              style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
            >
              + Crear
            </button>
          )}
        </div>
      </FixedHeader>

      {/* Header */}
      <div ref={mainHeaderRef} className="oc-header">
        <h2>{isPlaceProfile ? 'Mis Convocatorias' : 'Convocatorias'}</h2>
        {isPlaceProfile && (
          <button className="oc-create-btn" onClick={() => navigate(`/${PATHS.OPEN_CALLS}/${SUB_PATHS.CREATE}`)}>
            + Crear Convocatoria
          </button>
        )}
      </div>
      {/* Tab Navigation */}
      {renderTabNavigation()}
      {/* Loading State */}
      {loading ? (
        <div className="oc-loading">
          <p>Cargando...</p>
        </div>
      ) : (
        <>
          {/* Filters */}
          {renderFilters()}

          {/* Content */}
          {paginatedData.length === 0 ? (
            renderEmptyState()
          ) : (
            <>
              {viewMode === 'cards' ? renderCardView() : renderTableView()}
              {renderPagination()}
            </>
          )}
        </>
      )}
      {/* Sort Dialog */}
      {renderSortDialog()}
      {/* Filter Dialog */}
      {renderFilterDialog()}
      {/* OLD IMPLEMENTATION - COMMENTED OUT FOR REFERENCE */}
      {/*
      <TabbedPanel rawConfig={config} defaultTransformerContext={defaultTransformerContext} />
      */}
    </div>
  );
};

export default OpenCallsListPage;
