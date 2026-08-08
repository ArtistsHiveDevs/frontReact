import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

import { Alert, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { usePendingProfilesSlice } from '~/common/slices/domain/admin/pendingProfiles';
import {
  selectPendingArtists,
  selectPendingPlaces,
  selectPendingProfilesError,
  selectPendingProfilesLoading,
  selectPendingProfilesReviewingId,
} from '~/common/slices/domain/admin/pendingProfiles/selectors';
import { PendingProfileItem, ReviewProfileStatus } from '~/common/slices/domain/admin/pendingProfiles/types';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { S3Avatar } from '~/components/shared/molecules/general/S3Avatar/S3Avatar';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { PATHS } from '~/constants';

import './index.scss';

const TRANSLATION_BASE = 'app.pages.app_base.AdminPendingProfilesPage';

interface PendingProfilesTableProps {
  items: PendingProfileItem[];
  reviewingId?: string;
  onReview: (item: PendingProfileItem, status: ReviewProfileStatus) => void;
  translate: (key: string) => string;
}

const PendingProfilesTable = ({ items, reviewingId, onReview, translate }: PendingProfilesTableProps) => {
  if (!items.length) {
    return <p className="admin-pending-profiles__empty">{translate('empty_state')}</p>;
  }

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>{translate('table.name')}</TableCell>
            <TableCell>{translate('table.username')}</TableCell>
            <TableCell>{translate('table.location')}</TableCell>
            <TableCell>{translate('table.created_at')}</TableCell>
            <TableCell align="right">{translate('table.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item._id}>
              <TableCell>
                <S3Avatar alt={item.name} src={item.profile_pic} sx={{ width: 32, height: 32 }} />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.username ? `@${item.username}` : '-'}</TableCell>
              <TableCell>{[item.city, item.country_alpha2].filter(Boolean).join(', ') || '-'}</TableCell>
              <TableCell>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-'}</TableCell>
              <TableCell align="right">
                <Button
                  size="small"
                  color="success"
                  variant="outlined"
                  disabled={reviewingId === item._id}
                  onClick={() => onReview(item, 'approved')}
                >
                  {translate('actions.approve')}
                </Button>
                <Button
                  size="small"
                  color="error"
                  variant="outlined"
                  disabled={reviewingId === item._id}
                  onClick={() => onReview(item, 'rejected')}
                  sx={{ marginLeft: '0.5rem' }}
                >
                  {translate('actions.reject')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const PendingProfilesPage = () => {
  const dispatch = useDispatch();
  const { translateText } = useI18n();
  const { actions } = usePendingProfilesSlice();

  const loggedUser = useSelector(selectCurrentUser);
  const artists = useSelector(selectPendingArtists);
  const places = useSelector(selectPendingPlaces);
  const loading = useSelector(selectPendingProfilesLoading);
  const reviewingId = useSelector(selectPendingProfilesReviewingId);
  const errorInfo = useSelector(selectPendingProfilesError);

  const isAdmin = !!loggedUser?.is_platform_admin;

  useEffect(() => {
    if (isAdmin) {
      dispatch(actions.loadPendingProfiles());
    }
  }, [isAdmin]);

  const translate = (key: string) => translateText(`${TRANSLATION_BASE}.${key}`);

  // Sesión aún resolviéndose (ver RoutesApp): loggedUser llega undefined hasta que /me responde.
  if (!loggedUser) {
    return <AppLoader />;
  }

  if (!isAdmin) {
    return <Navigate to={`/${PATHS.HOME}`} replace />;
  }

  const handleReview = (item: PendingProfileItem, status: ReviewProfileStatus) => {
    dispatch(actions.reviewProfile({ entityType: item.entityType, id: item._id, status }));
  };

  return (
    <div className="admin-pending-profiles">
      <h1>{translate('title')}</h1>

      {errorInfo.error && <Alert severity="error">{translate('error')}</Alert>}

      {loading ? (
        <AppLoader />
      ) : (
        <>
          <section className="admin-pending-profiles__section">
            <h2>{translate('sections.artists.title')}</h2>
            <PendingProfilesTable items={artists} reviewingId={reviewingId} onReview={handleReview} translate={translate} />
          </section>

          <section className="admin-pending-profiles__section">
            <h2>{translate('sections.places.title')}</h2>
            <PendingProfilesTable items={places} reviewingId={reviewingId} onReview={handleReview} translate={translate} />
          </section>
        </>
      )}
    </div>
  );
};

export default PendingProfilesPage;
