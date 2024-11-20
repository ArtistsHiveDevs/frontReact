import { Skeleton } from '@mui/material';
import { useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getStoredUserIdToken } from '~/common/slices/app-base/APIKey/saga';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import VerifiedArtist from '~/components/shared/VerifiedArtist';
import { AvatarWithIcon } from '~/components/shared/atoms/gui/avatar-with-icon/Avatar-with-icon';
import GenericModal from '~/components/shared/molecules/general/Modals/ModalCardInfo/GenericModal';
import './NewEntityCard.scss';

const NewEntityCard = (props: any) => {
  const { data, idx, params, callbacks, printDayOfWeek } = props;
  const [photoURL, setPhotoURL] = useState();
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

  useEffect(() => {
    if (data) {
      getProfilePicURL();
    }
  }, [data]);

  const getProfilePicURL = async () => {
    const photoURL = data && !!data?.avatarURL ? await data.avatarURL() : data?.profile_pic || data?.photo;

    setPhotoURL(photoURL);
  };

  const switchProfile = () => {
    dispatch(userActions.switchProfile({ id: data.identifier }));
  };

  return (
    <>
      {!data && (
        <>
          <Skeleton className="thumbnail-empty-entity-card" variant="rounded" />
        </>
      )}
      {!!data && (
        <>
          <Card key={idx} className="thumbnail-new-entity-card">
            {!params?.hidePhoto && (
              <>
                {
                  <>
                    <div className="thumbnail-container-img-card">
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
                      {/* <Card.Img className="thumbnail-img-card" src={photoURL} variant="top"></Card.Img> */}
                      <Card.ImgOverlay onClick={() => onClickCardHandler()}>
                        {data.timetable__initial_date && (
                          <div className="thumbnail-card-date-section">
                            <p className="thumbnail-card-date-number">{data.timetable__initial_date.format('DD')}</p>
                            <p className="thumbnail-card-date-label">
                              {data.timetable__initial_date.format(!!printDayOfWeek ? 'ddd' : 'MMM')}
                            </p>
                          </div>
                        )}
                        <div className="thumbnail-card-name-section">
                          {data?.username && (
                            <span className="thumbnail-username">
                              @{data?.username} <VerifiedArtist verifiedStatus={data?.verified_status} />
                            </span>
                          )}
                          <p className="thumbnail-card-title-label">
                            <span className="thumbnail-title-card-span">
                              {elementCardInfo?.title || data?.name}{' '}
                              {!data?.username && <VerifiedArtist verifiedStatus={data?.verified_status} />}
                            </span>
                          </p>
                        </div>
                      </Card.ImgOverlay>
                      {data.place && (
                        <div className="thumbnail-card-footer-place">
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
