import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import GenericModal from '~/components/shared/molecules/general/Modals/ModalCardInfo/GenericModal';
import { formatDateInMomentType } from '~/constants';
import AvatarWithIcon from '../../atoms/gui/avatar-with-icon/Avatar-with-icon';
import './NewEntityCard.scss';

const NewEntityCard = (props: any) => {
  const { data, idx, params, callbacks, printDayOfWeek } = props;
  const [modalDetailShow, setModalDetailShow] = useState(false);
  const [currentUserCanEdit, setCurrentUserCanEdit] = useState(false);
  const [currentUserIsInProfile, setCurrentUserIsInProfile] = useState(false);

  const currentUser = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const { actions: userActions } = useUsersSlice();

  function onClickCardHandler() {
    if (callbacks?.onClickCard) {
      callbacks.onClickCard(data);
    } else {
      showModalDetail();
    }
  }
  const showModalDetail = () => setModalDetailShow(true);

  const captureCloseValue = (value: any) => {
    setModalDetailShow(false);
  };

  const links = [{ label: 'LINK' }, { label: 'ANOTHER LINK' }];

  const elementCardInfo = data?.cardInfo;

  const photoURL = data?.profile_pic || data?.photo;

  useEffect(() => {
    if (currentUser) {
      const userID = getStoredUserIdToken();
      let permissions = { canEdit: false, isInProfile: false };
      if (userID && data) {
        const userPermissions = currentUser.checkPermissions(data.identifier);
        permissions = userPermissions;
      }
      setCurrentUserCanEdit(permissions.canEdit);
      setCurrentUserIsInProfile(permissions.isInProfile);
    }
  }, [currentUser]);

  const switchProfile = () => {
    dispatch(userActions.switchProfile({ id: data.identifier }));
  };

  return (
    <>
      {!data && (
        <>
          <Skeleton className="empty-entity-card" variant="rounded" />
        </>
      )}
      {!!data && (
        <>
          <Card key={idx} className="new-entity-card">
            {!params?.hidePhoto && (
              <>
                {
                  <>
                    <div className="container-img-card">
                      <AvatarWithIcon
                        name=""
                        image={photoURL}
                        variant={'rounded'}
                        avatarSize={'11.5rem'}
                        bottomBadgeSize={'2.5rem'}
                        buttonIcon={currentUserCanEdit && !currentUserIsInProfile && 'PiUserSwitch'}
                        onClick={() => onClickCardHandler()}
                        onBadgeClick={() => switchProfile()}
                      />
                      {/* <Card.Img className="img-card" src={photoURL} variant="top"></Card.Img> */}
                      <Card.ImgOverlay onClick={() => onClickCardHandler()}>
                        {data.timetable__initial_date && (
                          <div className="card-date-section">
                            <p className="card-date-number">
                              {formatDateInMomentType(data.timetable__initial_date, 'DD')}
                            </p>
                            <p className="card-date-label">
                              {formatDateInMomentType(data.timetable__initial_date, !!printDayOfWeek ? 'ddd' : 'MMM')}
                            </p>
                          </div>
                        )}
                        <div className="card-name-section">
                          {data?.username && (
                            <span className="username">
                              @{data?.username} <VerifiedArtist verifiedStatus={data?.verified_status} />
                            </span>
                          )}
                          <p className="card-title-label">
                            <span className="title-card-span">
                              {elementCardInfo?.title || data?.name}{' '}
                              {!data?.username && <VerifiedArtist verifiedStatus={data?.verified_status} />}
                            </span>
                          </p>
                        </div>
                      </Card.ImgOverlay>
                      {data.place && (
                        <div className="card-footer-place">
                          <p>
                            <span>
                              <DynamicIcons iconName="FaMapMarkerAlt" size={20} />
                            </span>
                            <span>
                              <>
                                {data.place.name} <br /> {data.place.address}
                                <br /> {data.place.city}
                              </>
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                }
              </>
            )}
          </Card>
          <GenericModal
            title={data.name}
            body={data.description}
            links={links}
            show={modalDetailShow}
            onHide={(event: any) => captureCloseValue(event)}
          />
        </>
      )}
    </>
  );
};

export default NewEntityCard;
