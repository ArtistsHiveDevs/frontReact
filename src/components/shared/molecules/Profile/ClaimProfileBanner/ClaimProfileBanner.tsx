import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectLoading } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { PATHS } from '~/constants';
import './ClaimProfileBanner.scss';

const I18N_PATH = 'app.appbase.claimProfileBanner';

export const ClaimProfileBanner = (props: any) => {
  const { entityName, entityData } = props;

  const { translateText, translateGlobalDict } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const dispatch = useDispatch();

  const { actions: usersActions } = useUsersSlice();
  const requestIsLoading = useSelector(selectLoading);
  const [hasSendClaimRQ, setHasSendClaimRQ] = useState(false);

  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isOpenConfirmDialog, setIsOpenConfirmDialog] = useState(false);

  const { loggedUser } = useAuth();

  const clickHandler = () => {
    if (!!loggedUser) {
      setIsOpenDialog(!isOpenDialog);
    } else {
      navigateToInnerPath({ path: PATHS.LOGIN });
    }
  };

  const claimProfileRequest = () => {
    dispatch(usersActions.claimProfileUser({ profile: entityData }));
    setHasSendClaimRQ(true);
  };

  useEffect(() => {
    if (!requestIsLoading && hasSendClaimRQ) {
      setIsOpenConfirmDialog(true);
    }
  }, [requestIsLoading]);

  // <b>{entityData?.name}</b> {!!entityData?.username ? ` @${entityData.username}` : ''}

  return (
    <>
      {!entityData?.isClaimedProfile && (
        <>
          <div className="claim-box">
            {translateText(`${I18N_PATH}.PROFILE_AUTO_GENERATED_CAPTION`)}
            <Button
              endIcon={<DynamicIcons iconName="fa6 FaRegHandPointUp" size={25} />}
              size="large"
              onClick={() => clickHandler()}
            >
              {translateText(`${I18N_PATH}.CLAIM_BUTTON`)}
            </Button>
          </div>

          <AppDialog
            isOpenDialog={isOpenDialog}
            onClose={() => setIsOpenDialog(false)}
            title={translateText(`${I18N_PATH}.CLAIM_BUTTON`)}
            content={
              <div
                style={{ margin: '1rem' }}
                dangerouslySetInnerHTML={{ __html: translateText(`${I18N_PATH}.PROFILE_CONFIRMATION_MESSAGE`) }}
              />
            }
            actions={[
              { label: translateGlobalDict('actions.cancel'), handler: () => setIsOpenDialog(false) },
              { label: translateText(`${I18N_PATH}.CLAIM_BUTTON`), handler: () => claimProfileRequest() },
            ]}
          />

          <AppDialog
            isOpenDialog={isOpenConfirmDialog}
            onClose={() => {
              setIsOpenConfirmDialog(false);
            }}
            title={translateText(`${I18N_PATH}.CLAIM_BUTTON`)}
            content={
              <div
                style={{ margin: '1rem' }}
                dangerouslySetInnerHTML={{ __html: translateText(`${I18N_PATH}.CLAIM_REQUEST_CONFIRMATION`) }}
              />
            }
            actions={[
              {
                label: 'OK',
                handler: () => {
                  setIsOpenConfirmDialog(false);
                },
              },
            ]}
          />
        </>
      )}
    </>
  );
};
