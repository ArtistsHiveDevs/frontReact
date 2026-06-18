# GenericFilterableList

Sistema completo de listas genéricas, filtrables, ordenables y paginables para React con TypeScript.

## 🎯 Características

- ✅ **Configuración por objeto** - Sin hardcodear componentes
- ✅ **TypeScript genérico** - Type-safe con `<T>`
- ✅ **Múltiples vistas** - Cards, Table (Grid y Kanban próximamente)
- ✅ **Filtros dinámicos** - Text, Select, DateRange (más próximamente)
- ✅ **Ordenamiento** - Con toggle de dirección ascendente/descendente
- ✅ **Paginación** - Modos: Client, Server, None
- ✅ **Estados completos** - Loading, Empty, Error, No Results
- ✅ **Accesibilidad** - ARIA attributes, keyboard navigation
- ✅ **Responsive** - Grid adaptable a móvil/tablet/desktop
- ✅ **Redux agnostic** - Soporta Redux, fetch custom, o datos estáticos

## 📦 Instalación

El componente ya está en el proyecto:

```typescript
import { GenericFilterableList } from '@/components/shared/organisms/lists/GenericFilterableList';
import type { GenericFilterableListConfig } from '@/components/shared/organisms/lists/GenericFilterableList';
```

## 🚀 Uso Básico

### 1. Define tu tipo de datos

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive';
}
```

### 2. Crea la configuración

```typescript
const usersConfig: GenericFilterableListConfig<User> = {
  dataSource: {
    type: 'static',
    data: users, // Tu array de datos
  },

  filters: [
    {
      key: 'search',
      type: 'text',
      label: 'Search',
      searchFields: ['name', 'email'],
    },
  ],

  sorting: {
    options: [
      { key: 'name', label: 'Name', field: 'name' },
    ],
    defaultSort: 'name',
  },

  pagination: {
    mode: 'client',
    defaultItemsPerPage: 10,
  },

  views: {
    default: 'cards',
    cards: {
      cardComponent: UserCard,
      cardsPerRow: { mobile: 1, tablet: 2, desktop: 3 },
    },
  },

  ui: {
    title: 'Users',
    icon: '👥',
  },
};
```

### 3. Renderiza el componente

```typescript
function UsersPage() {
  return (
    <GenericFilterableList<User>
      config={usersConfig}
      onItemClick={(user) => console.log(user)}
    />
  );
}
```

## 📖 Configuración Completa

### Data Source

Tres modos soportados:

#### Static Data
```typescript
dataSource: {
  type: 'static',
  data: myData,
}
```

#### Redux
```typescript
dataSource: {
  type: 'redux',
  redux: {
    selector: (state) => state.users.list,
    loadingSelector: (state) => state.users.loading,
    errorSelector: (state) => state.users.error,
    totalSelector: (state) => state.users.total,
    fetchAction: fetchUsers,
  },
}
```

#### Custom Fetch
```typescript
dataSource: {
  type: 'fetch',
  fetch: {
    fetchFunction: async (params) => {
      const response = await api.getUsers(params);
      return {
        data: response.data,
        total: response.total,
      };
    },
    autoFetch: true,
  },
}
```

### Filters

10 tipos de filtros soportados:

```typescript
filters: [
  // Text search
  {
    key: 'search',
    type: 'text',
    label: 'Search',
    searchFields: ['name', 'email', 'description'],
    placeholder: 'Search...',
  },

  // Select dropdown
  {
    key: 'status',
    type: 'select',
    label: 'Status',
    options: [
      { value: 'active', label: 'Active', icon: '✓', color: '#22c55e' },
      { value: 'inactive', label: 'Inactive', icon: '✗', color: '#ef4444' },
    ],
  },

  // Date range
  {
    key: 'dateRange',
    type: 'dateRange',
    label: 'Date Range',
    description: 'Filter by date',
  },

  // Number
  {
    key: 'age',
    type: 'number',
    label: 'Age',
    min: 0,
    max: 120,
  },

  // Conditional visibility
  {
    key: 'advanced',
    type: 'text',
    label: 'Advanced',
    showIf: (value) => someCondition,
  },
]
```

Tipos disponibles: `text`, `select`, `multiSelect`, `dateRange`, `date`, `boolean`, `number`, `numberRange`, `chips`, `autocomplete`

*Nota: Actualmente implementados: text, select, dateRange, number. Los demás en Sprint 7.*

### Sorting

```typescript
sorting: {
  options: [
    {
      key: 'name',
      label: 'Name',
      field: 'name',
    },
    {
      key: 'date',
      label: 'Date',
      field: 'createdAt',
      dataType: 'date', // 'string' | 'number' | 'date' | 'boolean'
    },
    {
      key: 'custom',
      label: 'Custom',
      comparator: (a, b) => {
        // Custom comparison logic
        return a.value - b.value;
      },
    },
  ],
  defaultSort: 'name',
  defaultDirection: 'asc',
}
```

### Pagination

```typescript
pagination: {
  mode: 'client', // 'client' | 'server' | 'none'
  defaultItemsPerPage: 20,
  itemsPerPageOptions: [10, 20, 50, 100],
  showItemsPerPageSelector: true,
}
```

### Views

#### Cards View

```typescript
views: {
  default: 'cards',
  cards: {
    // Option 1: Custom component
    cardComponent: MyCustomCard,

    // Option 2: Standard card with sections (próximamente)
    // sections: { header: {...}, body: {...}, footer: {...} },

    cardsPerRow: {
      mobile: 1,
      tablet: 2,
      desktop: 3,
    },
    emptyMessage: 'No items',
  },
}
```

Custom card component:
```typescript
const MyCard: React.FC<{ item: T; loading?: boolean }> = ({ item, loading }) => {
  return (
    <div className="my-card">
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </div>
  );
};
```

#### Table View

```typescript
views: {
  table: {
    columns: [
      {
        key: 'name',
        label: 'Name',
        sortable: true,
        width: '200px',
        align: 'left', // 'left' | 'center' | 'right'
      },
      {
        key: 'email',
        label: 'Email',
        // Custom formatter
        formatter: (value, item) => value.toLowerCase(),
      },
      {
        key: 'status',
        label: 'Status',
        // Custom render
        render: (item) => (
          <span className={`badge ${item.status}`}>
            {item.status}
          </span>
        ),
      },
    ],
    striped: true,
    stickyHeader: false,
    emptyMessage: 'No data',
  },
}
```

### UI Configuration

```typescript
ui: {
  // Header
  title: 'My List',
  subtitle: 'Manage your items',
  icon: '📋',

  // Custom header component (replaces default)
  headerComponent: MyCustomHeader,

  // Empty state
  emptyState: {
    icon: '📭',
    title: 'No items yet',
    description: 'Get started by creating your first item',
    action: {
      label: 'Create Item',
      handler: () => console.log('Create'),
      icon: '➕',
      variant: 'primary',
    },
    // Or custom component
    component: MyEmptyState,
  },

  // No results state (when filters active)
  noResultsState: {
    icon: '🔍',
    title: 'No results found',
    description: 'Try adjusting your filters',
  },

  // Loading state
  loadingState: {
    message: 'Loading...',
    useSkeleton: true,
    skeletonCount: 5,
    overlay: false,
    // Or custom component
    component: MyLoader,
  },
}
```

## 🎨 Nested Fields

Accede a campos anidados con dot notation:

```typescript
// Data
const user = {
  profile: {
    contact: {
      email: 'user@example.com'
    }
  },
  tags: ['admin', 'vip']
};

// Sorting
{ field: 'profile.contact.email' }

// Table columns
{ key: 'profile.contact.email', label: 'Email' }

// Filters (search fields)
searchFields: ['profile.contact.email', 'tags']
```

## 🔧 Hooks Disponibles

Para uso avanzado, todos los hooks están exportados:

```typescript
import {
  useListFilters,
  useListSorting,
  useListPagination,
  useListDataSource,
  useListSearch,
} from '@/components/shared/organisms/lists/GenericFilterableList';
```

## 📚 Ejemplos Completos

Ver [examples/basic-example.config.tsx](./examples/basic-example.config.tsx) para un ejemplo completo.

## 🎯 Próximas Características

- [ ] Acciones por item (Sprint 5)
- [ ] Bulk actions (Sprint 6)
- [ ] Filtros avanzados: multiSelect, chips, autocomplete (Sprint 7)
- [ ] Vista Grid y Kanban (Sprint 9)
- [ ] Tabs con filtros automáticos
- [ ] Sticky header
- [ ] Export (CSV, Excel, PDF)
- [ ] URL sync (filtros en query params)

## 📝 Licencia

Interno del proyecto.
