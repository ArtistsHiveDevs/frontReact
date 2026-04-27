import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useUsersSlice } from '~/common/slices/users';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { PATHS } from '~/constants';
import { AppDialog } from '../../molecules/general/Modals/Dialog/AppDialog';
import './IndustrySignUpBanner.scss';
import { Box } from '@mui/material';

const TRANSLATION_BASE_USER_DETAIL_PAGE = 'app.pages.app_base.UsersPages';

export const IndustrySignUpBanner = () => {
  const dispatch = useDispatch();
  const { navigateToInnerPath } = useNavigation();

  const loggedUser = useSelector(selectCurrentUser);

  const [isOpenDialog, setOpenDialog] = useState(true);
  const { translateText } = useI18n();
  const { actions: userActions } = useUsersSlice();

  const clickHandlerMember = () => {
    dispatch(
      userActions.updateUser({
        id: loggedUser.identifier,
        newItem: { show_industry_member_banner: true, roles: [{ entityName: 'Artist', entityRoleMap: [] }] },
      })
    );
    navigateToInnerPath({ path: PATHS.INDUSTRY });
    setOpenDialog(false);
  };
  const clickHandlerNonMember = () => {
    dispatch(
      userActions.updateUser({
        id: loggedUser.identifier,
        newItem: { show_industry_member_banner: true },
      })
    );
    // navigateToInnerPath({ path: PATHS.INDUSTRY });
    setOpenDialog(false);
  };

  return (
    !!loggedUser &&
    !loggedUser?.show_industry_member_banner &&
    loggedUser?.hasFilledProfile &&
    !loggedUser?.isIndustryMember && (
      <AppDialog
        isOpenDialog={isOpenDialog}
        onClose={() => console.log('close')}
        title={translateText(`${TRANSLATION_BASE_USER_DETAIL_PAGE}.activate_industry_banner.banner.title`)}
        content={
          <>
            {translateText(`${TRANSLATION_BASE_USER_DETAIL_PAGE}.activate_industry_banner.banner.content`)}

            <h5 style={{ marginTop: '1rem' }}>TIP:</h5>
            <span style={{ margin: '1rem', fontSize: 22, textAlign: 'center' }}>
              {' '}
              <strong>Una</strong> cuenta personal <strong>Muchos</strong> roles
            </span>
            <Box
              component="img"
              sx={{
                height: 'auto',
                width: '90%',
                maxWidth: { xs: '90%', md: '600px' },
                display: 'block', // Necesario para que el margen funcione
                mx: 'auto', // Centra horizontalmente
                padding: '1rem',
              }}
              alt="Description"
              src="/img/InfoPerfiles.png"
            />
          </>
        }
        actions={[
          { label: 'Soy miembro', handler: () => clickHandlerMember() },
          { label: 'Omitir', handler: () => clickHandlerNonMember() },
        ]}
      />
    )
  );
};
