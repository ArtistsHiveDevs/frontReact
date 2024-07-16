import { Box, Button, Grid, Paper, Typography } from '@mui/material';

import { useEffect } from 'react';
import { Image } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useApiKeySlice } from '~/common/slices/app-base/APIKey';
import { selectError } from '~/common/slices/app-base/APIKey/selectors';
import { selectCurrentUser } from '~/common/slices/users/selectors';
import { I18nPaths, useI18n } from '~/common/utils';
import useAuth from '~/common/utils/hooks/auth/useAuth';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { DynamicFieldData, DynamicForm } from '~/components/shared/organisms/gui/dynamicForms';
import { PATHS } from '~/constants';
import { SocialNetworkTemplate, SocialNetworks } from '~/constants/social-networks.const';
import { AppUserModel } from '~/models/app/user/user.model';
import './LoginPage.scss';

const TRANSLATION_BASE_LOGIN_PAGE = 'app.pages.app_base.LoginPage';

export const LoginPage = () => {
  const { loggedUser, setLoggedUser } = useAuth();
  const navigate = useNavigate();
  const { translateText } = useI18n();
  const translate = (text: string) => {
    return translateText(text);
  };

  const fields: DynamicFieldData[] = [
    {
      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.username_or_email`),
      inputType: 'text',
      fieldName: 'email',
      placeholder: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.username_or_email`),
      config: { required: true },
      defaultValue: 'dmejia',
    },
    {
      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password`),
      inputType: 'password',
      fieldName: 'password',
      placeholder: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password`),
      config: { required: true },
      defaultValue: '1234',
    },
    {
      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.remember_me`),
      inputType: 'checkbox',
      fieldName: 'rememberMe',
    },
    // {
    //   label: 'login.captcha',
    //   inputType: 'text', // Asumiendo que 'captcha' es un campo de texto, ajusta según sea necesario
    //   fieldName: 'captcha',
    //   placeholder: 'login.captcha_placeholder',
    // },
  ];

  const dispatch = useDispatch();
  const { navigateToInnerPath } = useNavigation();
  const { actions: apiKeyActions } = useApiKeySlice();

  const currentUser: AppUserModel = useSelector(selectCurrentUser);
  const errores = useSelector(selectError);

  useEffect(() => {
    if (currentUser) {
      setLoggedUser(currentUser);
      navigateToInnerPath({ path: PATHS.HOME });
    }
  }, [currentUser]);

  const handlers = {
    onSubmit: (data: any) => {
      dispatch(
        apiKeyActions.loadApiKey({ userId: data.email, password: data.password, remember_me: data.remember_me })
      );
      console.log('Form Submitted:', data);
    },
    onForgotPassword: () => {
      console.log('Forgot Password Clicked');
    },
    onCreateAccount: () => {
      console.log('Create Account Clicked');
    },
  };

  const loggableSocialNetworks = Object.keys(SocialNetworks)
    .filter((socialNetworkName) => !!SocialNetworks[socialNetworkName].loginWidget)
    .map((socialNetworkName) => SocialNetworks[socialNetworkName]);

  const loginWithSocialNetwork = (selectedSocialNetwork: SocialNetworkTemplate) => {
    console.log('Iniciar sesión con ', selectedSocialNetwork.title);
  };

  return (
    <>
      <h1>Artist Hive</h1>
      <div className="login-content">
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph1`)}</p>
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph2`)}</p>
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph3`)}</p>
      </div>

      <Button className="button-styles" onClick={() => navigate(PATHS.SIGN_UP)}>
        {translate(`${TRANSLATION_BASE_LOGIN_PAGE}.button`)}
      </Button>

      <div className="login-footer">
        <Image fluid={true} src="https://c1.wallpaperflare.com/preview/516/564/13/band-music-performance-perform.jpg" />
      </div>
      <Typography variant="h2" gutterBottom padding={'1rem'}>
        Iniciar Sesión
      </Typography>
      <Grid container justifyContent="center" spacing={6}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }} className={'login-form-container'}>
            <Typography variant="h4" gutterBottom padding={'1rem'}>
              Continuar con:
            </Typography>
            <Grid container spacing={2} justifyContent="center" alignItems={'center'} height={'70%'}>
              {loggableSocialNetworks.map((socialNetwork, index) => (
                <Grid item key={index} xs={6} sm={4} md={3} lg={2} textAlign="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <div onClick={() => loginWithSocialNetwork(socialNetwork)}>
                      <DynamicIcons iconName={socialNetwork.icon} size={40} />
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }} className={'login-form-container'}>
            <Typography variant="h4" gutterBottom padding={'1rem'}>
              Usuario o email:
            </Typography>
            <DynamicForm
              fields={fields}
              handlers={handlers}
              translationBasePath="login"
              entityType="login"
              submitLabel="accounts.login"
              errors={errores}
            />

            <div className="login-form-footer">
              <button onClick={handlers.onForgotPassword}>
                {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.forgot_password`)}
              </button>
              <button onClick={handlers.onCreateAccount}>
                {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.create_account`)}
              </button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default LoginPage;
