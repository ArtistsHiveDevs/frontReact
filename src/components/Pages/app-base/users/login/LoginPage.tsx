import { useAuthenticator } from '@aws-amplify/ui-react';
import { getCurrentUser } from 'aws-amplify/auth';
import { Grid, Paper, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApiKeySlice } from '~/common/slices/app-base/APIKey';
import { selectError } from '~/common/slices/app-base/APIKey/selectors';
import { useUsersSlice } from '~/common/slices/users';
import { selectUsernameValidation, selectUsers } from '~/common/slices/users/selectors';
import { I18nPaths, useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { DynamicFieldData, DynamicForm } from '~/components/shared/organisms/gui/dynamicForms';
import { PATHS } from '~/constants';
import { SocialNetworkTemplate, SocialNetworks } from '~/constants/social-networks.const';
import { AppUserModel } from '~/models/app/user/user.model';
import './LoginPage.scss';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AuthUser } from 'aws-amplify/auth';
import { UsernameAvailabilityStatus } from '~/constants/app.constants';

const TRANSLATION_BASE_LOGIN_PAGE = 'app.pages.app_base.LoginPage';

const LIMITE_CLICKS = 3;

export const LoginPage = () => {
  const [clicksEnLogo, setClicksEnLogo] = useState(0);
  const [defaultUserValue, setDefaultUser] = useState('');

  const { translateText } = useI18n();

  const usersList: AppUserModel[] = useSelector(selectUsers);
  const usernameValidationResult: UsernameAvailabilityStatus = useSelector(selectUsernameValidation);
  const { actions: usersActions } = useUsersSlice();

  const fields: DynamicFieldData[] = [
    {
      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.username_or_email`),
      inputType: 'text',
      fieldName: 'email',
      placeholder: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.username_or_email`),
      config: { required: true },
      defaultValue: defaultUserValue,
    },
    {
      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password`),
      inputType: 'password',
      fieldName: 'password',
      placeholder: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password`),
      config: { required: true },
      defaultValue: '1234556768',
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

  const errores = useSelector(selectError);

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
      navigateToInnerPath({ path: PATHS.SIGN_UP });
    },
  };

  const loggableSocialNetworks = Object.keys(SocialNetworks)
    .filter((socialNetworkName) => !!SocialNetworks[socialNetworkName].loginWidget)
    .map((socialNetworkName) => SocialNetworks[socialNetworkName]);

  const loginWithSocialNetwork = (selectedSocialNetwork: SocialNetworkTemplate) => {
    console.log('Iniciar sesión con ', selectedSocialNetwork.title);
  };

  const setCurrentUser = (user: AppUserModel) => {
    setDefaultUser(user.username);
  };

  useEffect(() => {
    if (clicksEnLogo === LIMITE_CLICKS - 1) {
      dispatch(usersActions.loadUsers());
    }
  }, [clicksEnLogo]);

  // const { user } = useAuthenticator();

  // useEffect(() => {
  //   console.log('AWS USER ', user);
  // }, [user]);

  const [user, setUser] = useState<AuthUser>();

  useEffect(() => {
    if (user) {
      // Aquí puedes ejecutar cualquier lógica una vez que el usuario esté cargado
      console.log('Usuario cargado:', user);
      dispatch(usersActions.checkUsernameAvailability( user.username));
      // navigateToInnerPath({ path: PATHS.HOME });
    }
  }, [user]);
  
  
  useEffect(()=>{
    console.log('AWS USer ', user, ' validation', usernameValidationResult)
    if(user && usernameValidationResult){
      if(usernameValidationResult === UsernameAvailabilityStatus.AVAILABLE){
        dispatch(usersActions.createUser({username: user.username, sub:user.userId}));
      }
      else{
        console.log('Ya existía el usuario ', user.username);
        dispatch(apiKeyActions.loadApiKey({username: user.username, sub:user.userId}));
      }
    }
  }, [usernameValidationResult, user])
  return (
    <>
      {/* <h1>Artist Hive</h1> */}
      {/* <div className="login-content">
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph1`)}</p>
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph2`)}</p>
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph3`)}</p>
      </div>

      <Button className="button-styles" onClick={() => navigateToInnerPath({ path: PATHS.SIGN_UP })}>
        {translate(`${TRANSLATION_BASE_LOGIN_PAGE}.button`)}
      </Button>

      <div className="login-footer">
        <Image fluid={true} src="https://c1.wallpaperflare.com/preview/516/564/13/band-music-performance-perform.jpg" />
      </div> */}
      {/* <Typography variant="h3" gutterBottom padding={'1rem'}>
        Iniciar Sesión
      </Typography> */}
      <Grid alignItems="center" justifyContent="center" spacing={10} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item justifyContent="center">
          <img
            alt="Artist Hive"
            className="img-logotipo"
            src={import.meta.env.VITE_LOGO_URL}
            width="200"
            onClick={() => setClicksEnLogo(clicksEnLogo + 1)}
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }} className={'login-form-container'}>
            <Typography variant="h4" gutterBottom padding={'1rem'}>
              Continuar con:
            </Typography>
            <Grid container spacing={2} justifyContent="center" alignItems={'center'} height={'70%'}>
              {loggableSocialNetworks.map((socialNetwork, index) => (
                <Grid item key={index} xs={6} sm={4} md={3} lg={2} textAlign="center">
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <div onClick={() => loginWithSocialNetwork(socialNetwork)}>
                      <DynamicIcons iconName={socialNetwork.icon} size={40} color={'white'} />
                    </div>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid> */}
        {/* { <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }} className={'login-form-container'}>
            <Typography variant="h4" gutterBottom padding={'1rem'}>
              {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.username_or_email`)}:
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
        </Grid> } */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ padding: 2 }} className={'login-form-container'}>
            {/* <Typography variant="h4" gutterBottom padding={'1rem'}>
              Usuario o email:
            </Typography> */}
            <Authenticator
              // socialProviders={['amazon', 'apple', 'facebook', 'google']}
              signUpAttributes={[
                'email',
                // 'address',
                // 'birthdate',
                // 'family_name',
                // 'given_name',
                // 'gender',
                // 'locale',
                // 'middle_name',
                // 'name',
                // 'nickname',
                // 'phone_number',
                // 'picture',
                // 'preferred_username',
                // 'profile',
                // 'updated_at',
                // 'website',
                // 'zoneinfo',
              ]}
              components={{
                SignUp: {
                  FormFields() {
                    const { validationErrors } = useAuthenticator();

                    return (
                      <>
                        {/* Re-use default `Authenticator.SignUp.FormFields` */}
                        <Authenticator.SignUp.FormFields />
                        {/* 
                {/* Append & require Terms and Conditions field to sign up  *}
                <CheckboxField
                  errorMessage={validationErrors.acknowledgement as string}
                  hasError={!!validationErrors.acknowledgement}
                  name="acknowledgement"
                  value="yes"
                  label="I agree with the Terms and Conditions"
                /> */}
                      </>
                    );
                  },
                },
              }}
            >
              {({ signOut, user }) => {
                setUser(user);

                console.log('usuario logggeado aws  ', user);
                return (
                  // <main>
                  //   <h1>Hello {user?.username}</h1>
                  //   <button onClick={signOut}>Sign out</button>
                  // </main>
                  <></>
                );
              }}
            </Authenticator>
            {/* <Button onClick={() => crearAlgo()}> POR FIN </Button> */}
          </Paper>
        </Grid>
        {clicksEnLogo > 3 && (
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ padding: 2 }} className={'login-form-container'}>
              <h3>
                <DynamicIcons iconName="FaUserAstronaut" size={20} />
                USERS{' '}
              </h3>
              <p>
                {usersList.map((user) => {
                  const styles: string[] = [];

                  const artistMemberships: any[] = user['artistMemberships'] || [];
                  const placeMemberships: any[] = user['placeMemberships'] || [];
                  return (
                    <span key={`user_${user.id}`}>
                      <span className={styles.join(' ')} onClick={() => setCurrentUser(user)}>
                        {user.name} {'\t ('}Artistas: {artistMemberships.length} - Lugares: {placeMemberships.length}
                        {')  |  '} {user.user_language}
                      </span>
                      <br />
                      <br />
                    </span>
                  );
                })}
              </p>
            </Paper>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default LoginPage;
