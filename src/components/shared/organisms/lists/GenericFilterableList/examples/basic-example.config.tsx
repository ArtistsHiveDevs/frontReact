/**
 * Basic Example Configuration
 *
 * This example shows how to configure GenericFilterableList
 * for a simple user list with filtering, sorting, and pagination.
 */

import React from 'react';
import { GenericFilterableListConfig } from '../types';

// Example data type
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
  status: 'active' | 'inactive';
  createdAt: string;
  department: string;
}

// Example: Custom card component
const UserCard: React.FC<{ item: User; loading?: boolean }> = ({ item, loading }) => {
  if (loading) {
    return <div className="user-card loading">Loading...</div>;
  }

  return (
    <div className="user-card">
      <div className="user-card__header">
        <h3>{item.name}</h3>
        <span className={`badge badge--${item.status}`}>
          {item.status}
        </span>
      </div>
      <div className="user-card__body">
        <p><strong>Email:</strong> {item.email}</p>
        <p><strong>Role:</strong> {item.role}</p>
        <p><strong>Department:</strong> {item.department}</p>
      </div>
      <div className="user-card__footer">
        <small>Created: {new Date(item.createdAt).toLocaleDateString()}</small>
      </div>
    </div>
  );
};

// Configuration
export const usersListConfig: GenericFilterableListConfig<User> = {
  // ========== DATA SOURCE ==========
  dataSource: {
    type: 'static',
    data: [
      {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'admin',
        status: 'active',
        createdAt: '2024-01-15',
        department: 'Engineering',
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane@example.com',
        role: 'user',
        status: 'active',
        createdAt: '2024-02-20',
        department: 'Marketing',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        email: 'bob@example.com',
        role: 'user',
        status: 'inactive',
        createdAt: '2024-01-10',
        department: 'Sales',
      },
      // Add more users...
    ],
  },

  // ========== FILTERS ==========
  filters: [
    {
      key: 'search',
      type: 'text',
      label: 'Search',
      placeholder: 'Search by name or email...',
      searchFields: ['name', 'email'],
    },
    {
      key: 'role',
      type: 'select',
      label: 'Role',
      placeholder: 'All roles',
      options: [
        { value: 'admin', label: 'Admin', icon: '👑' },
        { value: 'user', label: 'User', icon: '👤' },
        { value: 'guest', label: 'Guest', icon: '👥' },
      ],
    },
    {
      key: 'status',
      type: 'select',
      label: 'Status',
      placeholder: 'All statuses',
      options: [
        { value: 'active', label: 'Active', color: '#22c55e' },
        { value: 'inactive', label: 'Inactive', color: '#ef4444' },
      ],
    },
    {
      key: 'createdDate',
      type: 'dateRange',
      label: 'Created Date',
      description: 'Filter by creation date range',
    },
  ],

  // ========== SORTING ==========
  sorting: {
    options: [
      {
        key: 'name',
        label: 'Name',
        field: 'name',
      },
      {
        key: 'email',
        label: 'Email',
        field: 'email',
      },
      {
        key: 'createdAt',
        label: 'Created Date',
        field: 'createdAt',
        dataType: 'date',
      },
    ],
    defaultSort: 'name',
    defaultDirection: 'asc',
  },

  // ========== PAGINATION ==========
  pagination: {
    mode: 'client',
    defaultItemsPerPage: 10,
    itemsPerPageOptions: [5, 10, 20, 50],
    showItemsPerPageSelector: true,
  },

  // ========== VIEWS ==========
  views: {
    default: 'cards',

    // Cards view
    cards: {
      cardComponent: UserCard,
      cardsPerRow: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      emptyMessage: 'No users found',
    },

    // Table view
    table: {
      columns: [
        {
          key: 'name',
          label: 'Name',
          sortable: true,
          width: '200px',
        },
        {
          key: 'email',
          label: 'Email',
          sortable: true,
        },
        {
          key: 'role',
          label: 'Role',
          sortable: true,
          width: '120px',
          formatter: (value) => {
            const icons = { admin: '👑', user: '👤', guest: '👥' };
            return `${icons[value as keyof typeof icons] || ''} ${value}`;
          },
        },
        {
          key: 'status',
          label: 'Status',
          sortable: true,
          width: '120px',
          render: (user) => (
            <span className={`badge badge--${user.status}`}>
              {user.status}
            </span>
          ),
        },
        {
          key: 'department',
          label: 'Department',
          sortable: true,
        },
        {
          key: 'createdAt',
          label: 'Created',
          sortable: true,
          width: '150px',
          formatter: (value) => new Date(value).toLocaleDateString(),
        },
      ],
      striped: true,
      emptyMessage: 'No users to display',
    },
  },

  // ========== UI ==========
  ui: {
    title: 'Users',
    subtitle: 'Manage your team members',
    icon: '👥',

    emptyState: {
      icon: '👥',
      title: 'No users yet',
      description: 'Get started by inviting your first team member',
      action: {
        label: 'Invite User',
        handler: () => console.log('Invite user clicked'),
        icon: '➕',
        variant: 'primary',
      },
    },

    noResultsState: {
      icon: '🔍',
      title: 'No users found',
      description: 'Try adjusting your filters or search query',
    },

    loadingState: {
      message: 'Loading users...',
      useSkeleton: false,
    },
  },

  // ========== GENERAL ==========
  className: 'users-list',
  testId: 'users-list',
};

/**
 * Usage Example:
 *
 * import { GenericFilterableList } from '@/components/shared/organisms/lists/GenericFilterableList';
 * import { usersListConfig } from './basic-example.config';
 *
 * function UsersPage() {
 *   const handleUserClick = (user: User) => {
 *     console.log('User clicked:', user);
 *     // Navigate to user detail page
 *   };
 *
 *   return (
 *     <div className="users-page">
 *       <GenericFilterableList
 *         config={usersListConfig}
 *         onItemClick={handleUserClick}
 *       />
 *     </div>
 *   );
 * }
 */
