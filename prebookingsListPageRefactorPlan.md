# Plan de Refactorización - PrebookingsListPage

## Objetivo
Eliminar código repetido y hardcodeado mediante el uso de configuraciones basadas en arrays de objetos, mejorando la mantenibilidad, escalabilidad y reduciendo errores.

---

## 1. CONFIGURACIÓN DE FILTROS DEL HEADER

### Problema Actual
Los tres `FormControl` + `Select` en el header (líneas ~641-720) tienen código casi idéntico repetido 3 veces:
- Status filter
- My approval filter
- Sort by filter

### Solución Propuesta
```typescript
// Crear configuración de filtros
const headerFilterConfig = [
  {
    id: 'status',
    value: selectedStatus,
    onChange: setSelectedStatus,
    icon: 'fa FaCalendarCheck',
    options: statusFilters.map(status => ({ value: status, label: status })),
    ariaLabel: 'filtrar por estado'
  },
  {
    id: 'myApproval',
    value: myApprovalFilter,
    onChange: setMyApprovalFilter,
    icon: 'fa FaUserCheck',
    options: myApprovalFilters,
    ariaLabel: 'filtrar por mi respuesta'
  },
  {
    id: 'sortBy',
    value: sortBy,
    onChange: setSortBy,
    icon: 'tb TbArrowsSort',
    options: sortOptions,
    ariaLabel: 'ordenar por'
  }
];

// Componente reutilizable
const renderHeaderSelect = (config) => (
  <FormControl size="small" key={config.id}>
    <Select
      value={config.value}
      onChange={(e) => config.onChange(e.target.value)}
      displayEmpty
      renderValue={(value) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingRight: '1rem' }}>
          <DynamicIcons iconName={config.icon} size={20} />
        </div>
      )}
      sx={{
        '& .MuiSelect-select': { padding: '6px 12px' },
        '& fieldset': { border: 'none' }
      }}
      aria-label={config.ariaLabel}
    >
      {config.options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);
```

**Beneficios:**
- De ~80 líneas a ~20 líneas
- Agregar nuevos filtros solo requiere un objeto de configuración
- Fácil mantener estilos consistentes

---

## 2. CONFIGURACIÓN DE BOTONES DE ACCIÓN DEL HEADER

### Problema Actual
Los `IconButton` del header (search, date filter, view mode) tienen lógica repetida.

### Solución Propuesta
```typescript
const headerActionButtons = [
  {
    id: 'dateFilter',
    onClick: showHideDateFilter,
    icon: openDateFilter ? 'FaRegCalendarTimes' : 'FaRegCalendarAlt',
    ariaLabel: openDateFilter ? 'cerrar filtro de fecha' : 'abrir filtro de fecha',
    showBadge: hasActiveDateFilter,
    className: hasActiveDateFilter ? 'active-filter' : ''
  },
  {
    id: 'search',
    onClick: showHideSearchField,
    icon: openStatusSearchInputText ? 'MdSearchOff' : 'AiOutlineSearch',
    ariaLabel: openStatusSearchInputText ? 'cerrar búsqueda' : 'abrir búsqueda',
    showBadge: hasActiveSearch,
    className: hasActiveSearch ? 'active-filter' : ''
  },
  {
    id: 'viewMode',
    onClick: () => setViewMode(viewMode === 'cards' ? 'table' : 'cards'),
    icon: viewMode === 'cards' ? 'FaList' : 'BsFillGrid3X3GapFill',
    ariaLabel: viewMode === 'cards' ? 'cambiar a vista de tabla' : 'cambiar a vista de tarjetas',
    showBadge: false
  }
];

const renderActionButton = (config) => (
  <IconButton
    key={config.id}
    onClick={config.onClick}
    size="small"
    aria-label={config.ariaLabel}
    className={config.className}
    sx={{ position: 'relative' }}
  >
    <DynamicIcons iconName={config.icon} size={20} />
    {config.showBadge && <span className="pb-search-badge" />}
  </IconButton>
);
```

---

## 3. OPCIONES DE MENÚ DE APROBACIÓN (PARTICIPANT STATUS)

### Problema Actual
Los 3 `MenuItem` con estados de aprobación se repiten 6 veces en el archivo:
- 3 veces en la vista de tabla
- 3 veces en la vista de tarjetas

### Solución Propuesta
```typescript
// Configuración de opciones de aprobación
const approvalStatusOptions = [
  {
    value: ParticipantStatus.ACCEPTED,
    label: 'Accepted',
    getIcon: () => getApprovalIcon(ParticipantStatus.ACCEPTED)
  },
  {
    value: ParticipantStatus.PENDING,
    label: 'Pending',
    getIcon: () => getApprovalIcon(ParticipantStatus.PENDING)
  },
  {
    value: ParticipantStatus.REJECTED,
    label: 'Rejected',
    getIcon: () => getApprovalIcon(ParticipantStatus.REJECTED)
  }
];

// Componente reutilizable
const ApprovalMenuItem = ({ status }) => {
  const icon = status.getIcon();
  return (
    <MenuItem value={status.value}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <DynamicIcons
          iconName={icon.icon}
          color={icon.color}
          size={20}
          background="white"
        />
        <span>{status.label}</span>
      </div>
    </MenuItem>
  );
};

// Uso
{approvalStatusOptions.map(status => (
  <ApprovalMenuItem key={status.value} status={status} />
))}
```

**Beneficios:**
- Elimina ~60 líneas de código duplicado
- Si se agrega un nuevo estado, solo se modifica el array
- Mantiene consistencia visual

---

## 4. COMPONENTE SELECT DE APROBACIÓN REUTILIZABLE

### Problema Actual
El `Select` de aprobación se repite 2 veces (tabla y tarjetas) con ~50 líneas cada uno.

### Solución Propuesta
```typescript
interface ApprovalSelectProps {
  prebooking: PreBookingRequestModel;
  myApprovalStatus: string;
  isDisabled: boolean;
  onStatusChange: (status: string) => void;
  iconSize?: number;
}

const ApprovalSelect: React.FC<ApprovalSelectProps> = ({
  prebooking,
  myApprovalStatus,
  isDisabled,
  onStatusChange,
  iconSize = 20
}) => {
  const icon = getApprovalIcon(myApprovalStatus);

  return (
    <FormControl size="small">
      <Select
        value={myApprovalStatus || ParticipantStatus.PENDING}
        onChange={(e) => onStatusChange(e.target.value)}
        disabled={isDisabled}
        renderValue={(value) => {
          const icon = getApprovalIcon(value);
          return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              {icon && (
                <DynamicIcons
                  iconName={icon.icon}
                  color={icon.color}
                  size={iconSize}
                  background="white"
                />
              )}
            </div>
          );
        }}
        sx={{
          '& .MuiSelect-select': { padding: '4px 8px' },
          '& fieldset': { borderColor: '#ddd', borderRadius: '20px' }
        }}
      >
        {approvalStatusOptions.map(status => (
          <ApprovalMenuItem key={status.value} status={status} />
        ))}
      </Select>
    </FormControl>
  );
};

// Uso en tabla
<ApprovalSelect
  prebooking={prebooking}
  myApprovalStatus={myApprovalStatus}
  isDisabled={isUpdatingStatus && updatingPrebookingId === prebooking.identifier}
  onStatusChange={(status) => handleStatusChange(prebooking, status)}
  iconSize={20}
/>

// Uso en tarjetas
<ApprovalSelect
  prebooking={prebooking}
  myApprovalStatus={myApprovalStatus}
  isDisabled={isUpdatingStatus && updatingPrebookingId === prebooking.identifier}
  onStatusChange={(status) => handleStatusChange(prebooking, status)}
  iconSize={30}
/>
```

---

## 5. AVATAR GROUP CON BADGES REUTILIZABLE

### Problema Actual
El `AvatarGroup` con badges de aprobación se repite 2 veces (tabla y tarjetas) con ~40 líneas cada uno.

### Solución Propuesta
```typescript
interface ParticipantAvatarsProps {
  participants: CurrentProfileInfoModel[];
  prebooking: PreBookingRequestModel;
  maxAvatars?: number;
  avatarSize?: number;
  badgeIconSize?: number;
  onAvatarClick?: (participant: CurrentProfileInfoModel) => void;
  onMoreClick?: (prebooking: PreBookingRequestModel) => void;
}

const ParticipantAvatars: React.FC<ParticipantAvatarsProps> = ({
  participants,
  prebooking,
  maxAvatars = 3,
  avatarSize = 32,
  badgeIconSize = 20,
  onAvatarClick,
  onMoreClick
}) => {
  const sortedParticipants = sortParticipants(participants);

  return (
    <AvatarGroup
      max={maxAvatars}
      spacing={-6}
      componentsProps={{
        additionalAvatar: {
          sx: {
            fontSize: '1rem',
            color: 'white',
            border: 'none !important',
          },
          onClick: (event) => {
            event.stopPropagation();
            onMoreClick?.(prebooking);
          },
        },
      }}
    >
      {sortedParticipants.map((participant, index) => {
        const approvalInfo = getParticipantApprovalStatus(prebooking, participant.id);

        return (
          <Badge
            key={`participant_${participant.id}_${index}`}
            overlap="circular"
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            badgeContent={
              approvalInfo ? (
                <DynamicIcons
                  iconName={approvalInfo.icon}
                  color={approvalInfo.color}
                  size={badgeIconSize}
                  background="white"
                />
              ) : null
            }
            onClick={() => onAvatarClick?.(participant)}
          >
            <S3Avatar
              alt={participant.name}
              src={participant.profile_pic}
              sx={{
                width: avatarSize,
                height: avatarSize,
                color: 'white',
                border: (approvalInfo ? `2px solid ${approvalInfo.color}` : 'none') + ' !important',
              }}
            />
          </Badge>
        );
      })}
    </AvatarGroup>
  );
};

// Uso en tabla
<ParticipantAvatars
  participants={prebooking.recipients}
  prebooking={prebooking}
  maxAvatars={3}
  avatarSize={28}
  badgeIconSize={14}
  onAvatarClick={setSelectedParticipantDetails}
  onMoreClick={setSelectedPrebookingDetails}
/>

// Uso en tarjetas
<ParticipantAvatars
  participants={prebooking.recipients}
  prebooking={prebooking}
  maxAvatars={4}
  avatarSize={40}
  badgeIconSize={25}
  onAvatarClick={setSelectedParticipantDetails}
  onMoreClick={setSelectedPrebookingDetails}
/>
```

---

## 6. CONFIGURACIÓN DE COLUMNAS DE TABLA

### Problema Actual
Las columnas de la tabla están hardcodeadas en el JSX.

### Solución Propuesta
```typescript
const tableColumns = [
  { id: 'event', label: 'Evento', className: 'pb-table-event-name' },
  { id: 'date', label: 'Fecha', className: 'pb-table-date' },
  { id: 'venue', label: 'Lugar', className: 'pb-table-venue' },
  { id: 'status', label: 'Estado', className: 'pb-table-status' },
  { id: 'myResponse', label: 'Mi respuesta', className: 'pb-table-my-response' },
  { id: 'actions', label: '', className: 'pb-table-actions' }
];

// Renderizado
<thead>
  <tr>
    {tableColumns.map(col => (
      <th key={col.id} className={col.className}>
        {col.label}
      </th>
    ))}
  </tr>
</thead>
```

---

## 7. COMPONENTES DE FILA DE TABLA Y TARJETA

### Problema Actual
La lógica de renderizado de filas de tabla y tarjetas está mezclada en el componente principal.

### Solución Propuesta
```typescript
// components/PrebookingTableRow.tsx
interface PrebookingTableRowProps {
  prebooking: PreBookingRequestModel;
  loggedUser: any;
  isUpdating: boolean;
  onStatusChange: (prebookingId: string, status: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, prebookingId: string) => void;
  onParticipantClick: (participant: CurrentProfileInfoModel) => void;
  onPrebookingClick: (prebooking: PreBookingRequestModel) => void;
}

const PrebookingTableRow: React.FC<PrebookingTableRowProps> = ({ ... }) => {
  // Lógica específica de la fila
};

// components/PrebookingCard.tsx
interface PrebookingCardProps {
  prebooking: PreBookingRequestModel;
  loggedUser: any;
  isUpdating: boolean;
  onStatusChange: (prebookingId: string, status: string) => void;
  onMenuOpen: (event: React.MouseEvent<HTMLElement>, prebookingId: string) => void;
  onParticipantClick: (participant: CurrentProfileInfoModel) => void;
  onPrebookingClick: (prebooking: PreBookingRequestModel) => void;
}

const PrebookingCard: React.FC<PrebookingCardProps> = ({ ... }) => {
  // Lógica específica de la tarjeta
};
```

---

## 8. HANDLER FUNCTIONS CENTRALIZADAS

### Problema Actual
Los handlers de cambio de estado están repetidos inline.

### Solución Propuesta
```typescript
// Hook personalizado para manejar lógica de prebookings
const usePrebookingActions = () => {
  const dispatch = useDispatch();
  const { actions: prebookingActions } = usePreBookingRequestsSlice();

  const handleStatusChange = useCallback((prebooking: PreBookingRequestModel, status: string) => {
    setIsUpdatingStatus(true);
    setUpdatingPrebookingId(prebooking.identifier);

    dispatch(
      prebookingActions.postActionItem({
        id: prebooking.id,
        action: 'setStatus',
        newItem: {},
        params: { status },
      })
    );
  }, [dispatch, prebookingActions]);

  const handleMenuOpen = useCallback((event: React.MouseEvent<HTMLElement>, prebookingId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPrebookingId(prebookingId);
  }, []);

  const handleMenuClose = useCallback(() => {
    setAnchorEl(null);
    setSelectedPrebookingId(null);
  }, []);

  return {
    handleStatusChange,
    handleMenuOpen,
    handleMenuClose
  };
};
```

---

## 9. CONFIGURACIÓN DE OPCIONES DE PAGINACIÓN

### Problema Actual
`itemsPerPageOptions` no está visible en el código mostrado, pero debería estar configurado.

### Solución Propuesta
```typescript
const paginationConfig = {
  defaultItemsPerPage: 3,
  options: [3, 6, 10, 20, 50],
  showFirstButton: true,
  showLastButton: true
};
```

---

## 10. MENÚ DE ACCIONES CONTEXTUAL

### Problema Actual
El menú de acciones (Edit, Delete) podría estar configurado dinámicamente.

### Solución Propuesta
```typescript
const menuActions = [
  {
    id: 'edit',
    label: 'Editar',
    icon: 'MdEdit',
    onClick: handleEdit,
    disabled: false
  },
  {
    id: 'delete',
    label: 'Eliminar',
    icon: 'MdDelete',
    onClick: handleDelete,
    disabled: false,
    requiresConfirmation: true
  }
];

<Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
  {menuActions.map(action => (
    <MenuItem
      key={action.id}
      onClick={action.onClick}
      disabled={action.disabled}
    >
      {action.icon && <DynamicIcons iconName={action.icon} size={18} />}
      {action.label}
    </MenuItem>
  ))}
</Menu>
```

---

## RESUMEN DE MEJORAS

### Métricas Estimadas

| Área | Líneas Antes | Líneas Después | Reducción |
|------|--------------|----------------|-----------|
| Filtros del header | ~80 | ~25 | 69% |
| Botones de acción | ~45 | ~20 | 56% |
| Selects de aprobación | ~100 | ~30 | 70% |
| Avatar groups | ~80 | ~25 | 69% |
| Columnas de tabla | ~15 | ~8 | 47% |
| MenuItems de estado | ~60 | ~15 | 75% |
| **TOTAL ESTIMADO** | **~380** | **~123** | **68%** |

### Beneficios Principales

1. **Mantenibilidad**: Cambios en un solo lugar
2. **Escalabilidad**: Agregar funcionalidades es más fácil
3. **Consistencia**: Comportamiento uniforme
4. **Testabilidad**: Componentes aislados más fáciles de probar
5. **Legibilidad**: Código más limpio y declarativo
6. **Reutilización**: Componentes pueden usarse en otras páginas

---

## PLAN DE IMPLEMENTACIÓN SUGERIDO

### Fase 1 - Configuraciones simples (2-3 horas)
1. Configuración de filtros del header
2. Configuración de botones de acción
3. Configuración de opciones de aprobación
4. Configuración de columnas de tabla

### Fase 2 - Componentes reutilizables (3-4 horas)
5. Componente ApprovalSelect
6. Componente ApprovalMenuItem
7. Componente ParticipantAvatars

### Fase 3 - Separación de componentes grandes (4-5 horas)
8. Componente PrebookingTableRow
9. Componente PrebookingCard
10. Hook personalizado usePrebookingActions

### Fase 4 - Testing y refinamiento (2-3 horas)
11. Pruebas de los componentes refactorizados
12. Ajustes de tipos TypeScript
13. Documentación

**Tiempo total estimado**: 11-15 horas

---

## CONSIDERACIONES ADICIONALES

### TypeScript
- Crear interfaces/types en un archivo separado `types.ts`
- Usar tipos genéricos cuando sea apropiado
- Aprovechar type inference

### Testing
- Cada componente nuevo debe tener tests unitarios
- Tests de integración para los flujos principales

### Accesibilidad
- Mantener aria-labels en todas las configuraciones
- Asegurar navegación por teclado

### Performance
- Usar `React.memo` en componentes reutilizables
- `useCallback` para handlers que se pasan como props
- `useMemo` para arrays de configuración si son computacionalmente costosos
