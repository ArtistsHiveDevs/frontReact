/**
 * Prebookings List Configuration
 *
 * Configuration for GenericFilterableList to display prebookings
 */

import React from 'react';
import { GenericFilterableListConfig } from '@/components/shared/organisms/lists/GenericFilterableList';
import {
  PreBookingRequestModel,
  PrebookingParticipantStatus,
  PreBookingRequestStatus,
} from '~/models/domain/prebooking';
import { PrebookingCard } from '../components/PrebookingCard';

/**
 * Helper: Get user's approval status for a prebooking
 */
export const getUserApprovalStatus = (
  prebooking: PreBookingRequestModel,
  currentUserId: string,
  currentProfileId: string
): PrebookingParticipantStatus | null => {
  const approval = prebooking.participant_approvals?.find(
    (a) =>
      a.participant_user_id === currentUserId ||
      a.participant_profile_id === currentProfileId
  );
  return approval?.status || null;
};

/**
 * Prebookings List Configuration
 */
export const prebookingsListConfig: GenericFilterableListConfig<PreBookingRequestModel> = {
  // ========== DATA SOURCE ==========
  dataSource: {
    type: 'redux',
    redux: {
      selector: (state: any) => state.prebookingRequests?.items || [],
      loadingSelector: (state: any) => state.prebookingRequests?.loading || false,
      errorSelector: (state: any) => state.prebookingRequests?.error || null,
      totalSelector: (state: any) => state.prebookingRequests?.items?.length || 0,
      fetchAction: 'prebookingRequests/loadItems',
    },
  },

  // ========== FILTERS ==========
  filters: [
    // Search filter
    {
      key: 'search',
      type: 'text',
      label: 'Search',
      placeholder: 'Search by event name, description, venues...',
      searchFields: [
        'event_name',
        'description',
        'venues[].name',
        'venues[].username',
        'venues[].location[0].city',
        'venues[].location[0].country_name',
        'recipients[].name',
        'recipients[].username',
      ],
    },

    // My Approval Status filter
    {
      key: 'myApproval',
      type: 'select',
      label: 'My Response',
      placeholder: 'All responses',
      options: [
        {
          value: '',
          label: 'All',
          icon: '📋',
        },
        {
          value: PrebookingParticipantStatus.INTERESTED,
          label: 'Interested',
          icon: '✓',
          color: '#22c55e',
        },
        {
          value: PrebookingParticipantStatus.PENDING,
          label: 'Pending',
          icon: '⏱',
          color: '#f59e0b',
        },
        {
          value: PrebookingParticipantStatus.NOT_INTERESTED,
          label: 'Not Interested',
          icon: '✗',
          color: '#b70707',
        },
      ],
      // Custom filter function
      filterFunction: (item, value, currentUser) => {
        if (!value || !currentUser) return true;

        const userStatus = getUserApprovalStatus(
          item,
          currentUser.id,
          currentUser.currentProfile?.id
        );

        return userStatus === value;
      },
    },

    // General Status filter
    {
      key: 'status',
      type: 'select',
      label: 'Status',
      placeholder: 'All statuses',
      options: [
        { value: 'all', label: 'All' },
        { value: PrebookingParticipantStatus.PENDING, label: 'Pending' },
        { value: PreBookingRequestStatus.CONVERTED, label: 'Converted' },
        { value: PreBookingRequestStatus.EXPIRED, label: 'Expired' },
      ],
      filterFunction: (item, value) => {
        if (value === 'all') return true;
        return item.status === value;
      },
    },

    // Date Range filter
    {
      key: 'dateRange',
      type: 'dateRange',
      label: 'Event Date Range',
      description: 'Filter by event date',
      filterFunction: (item, value) => {
        if (!value) return true;

        const { from, to } = value;
        const eventDate = item.requested_date_start;

        if (!eventDate) return false;

        const itemDate = new Date(eventDate.toString());

        if (from && to) {
          return itemDate >= new Date(from) && itemDate <= new Date(to);
        } else if (from) {
          return itemDate >= new Date(from);
        } else if (to) {
          return itemDate <= new Date(to);
        }

        return true;
      },
    },
  ],

  // ========== SORTING ==========
  sorting: {
    options: [
      {
        key: 'event_date_asc',
        label: 'Event Date (Upcoming)',
        field: 'requested_date_start',
        dataType: 'date',
      },
      {
        key: 'event_date_desc',
        label: 'Event Date (Latest)',
        field: 'requested_date_start',
        dataType: 'date',
      },
      {
        key: 'event_name_asc',
        label: 'Event Name (A-Z)',
        field: 'event_name',
      },
      {
        key: 'event_name_desc',
        label: 'Event Name (Z-A)',
        field: 'event_name',
      },
      {
        key: 'creator',
        label: 'Creator',
        field: 'requester.name',
      },
    ],
    defaultSort: 'event_date_asc',
    defaultDirection: 'asc',
  },

  // ========== PAGINATION ==========
  pagination: {
    mode: 'client',
    defaultItemsPerPage: 20,
    itemsPerPageOptions: [5, 10, 20, 50],
    showItemsPerPageSelector: true,
  },

  // ========== VIEWS ==========
  views: {
    default: 'cards',

    // Cards view with custom component
    cards: {
      cardComponent: PrebookingCard,
      cardsPerRow: {
        mobile: 1,
        tablet: 2,
        desktop: 3,
      },
      emptyMessage: 'No prebookings found',
    },

    // Table view (to be implemented)
    table: {
      columns: [
        {
          key: 'event_name',
          label: 'Event',
          sortable: true,
          width: '300px',
          render: (item) => (
            <div>
              <strong>{item.event_name}</strong>
              {item.description && (
                <div style={{ fontSize: '0.875rem', color: '#666' }}>
                  {item.description.substring(0, 100)}
                  {item.description.length > 100 && '...'}
                </div>
              )}
            </div>
          ),
        },
        {
          key: 'requested_date_start',
          label: 'Date',
          sortable: true,
          width: '180px',
          formatter: (value) => {
            if (!value) return '-';
            return new Date(value.toString()).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            });
          },
        },
        {
          key: 'venues',
          label: 'Venues',
          width: '250px',
          render: (item) => {
            if (!item.venues || item.venues.length === 0) return '-';
            return (
              <div>
                {item.venues.map((venue, idx) => (
                  <div key={idx} style={{ fontSize: '0.875rem' }}>
                    {venue.name}
                  </div>
                ))}
              </div>
            );
          },
        },
        {
          key: 'myApproval',
          label: 'My Response',
          width: '150px',
          render: (item) => {
            // This will be populated by the actual component
            return <div>TODO: Status selector</div>;
          },
        },
      ],
      striped: true,
      emptyMessage: 'No prebookings to display',
    },
  },

  // ========== UI ==========
  ui: {
    title: 'Prebookings',
    subtitle: 'Manage your event proposals',
    icon: '📅',

    emptyState: {
      icon: '📭',
      title: 'No prebookings yet',
      description: 'When you have prebookings, they will appear here',
    },

    noResultsState: {
      icon: '🔍',
      title: 'No results found',
      description: 'No prebookings found with the current filters',
    },

    loadingState: {
      message: 'Loading prebookings...',
      useSkeleton: false,
    },
  },

  // ========== GENERAL ==========
  className: 'prebookings-list',
  testId: 'prebookings-list',
};

/**
 * Usage in PrebookingsListPage:
 *
 * import { GenericFilterableList } from '@/components/shared/organisms/lists/GenericFilterableList';
 * import { prebookingsListConfig } from './configs/prebookings.list.config';
 *
 * function PrebookingsListPage() {
 *   const currentUser = useSelector(selectCurrentUser);
 *
 *   const handlePrebookingClick = (prebooking: PreBookingRequestModel) => {
 *     // Handle click - navigate to detail or open modal
 *   };
 *
 *   return (
 *     <GenericFilterableList
 *       config={prebookingsListConfig}
 *       currentUser={currentUser}
 *       onItemClick={handlePrebookingClick}
 *     />
 *   );
 * }
 */
