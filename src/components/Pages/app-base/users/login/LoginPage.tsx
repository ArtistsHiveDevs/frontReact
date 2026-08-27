import { Grid, Paper } from '@mui/material';
import { fetchUserAttributes, FetchUserAttributesOutput, signIn } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApiKeySlice } from '~/common/slices/app-base/APIKey';
import { selectApiKey, selectError } from '~/common/slices/app-base/APIKey/selectors';
import { useUsersSlice } from '~/common/slices/users';
import { CidUserData, getEmailByUsername } from '~/common/slices/users/saga';
import { selectUsernameValidation, selectUsers } from '~/common/slices/users/selectors';
import { I18nPaths, useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { generatePreAuthHeaders } from '~/common/utils/request';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms';
import { PATHS, SUB_PATHS, URL_PARAMETER_NAMES } from '~/constants';
import { SocialNetworks, SocialNetworkTemplate } from '~/constants/social-networks.const';
import { AppUserModel } from '~/models/app/user/user.model';
import './LoginPage.scss';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AuthUser } from 'aws-amplify/auth';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';
import { UsernameAvailabilityStatus } from '~/constants/app.constants';

const TRANSLATION_BASE_LOGIN_PAGE = 'app.pages.app_base.LoginPage';

const SIGN_IN_OPTIONS =
  import.meta.env.VITE_USE_LOCAL_COGNITO === 'true' ? { options: { authFlowType: 'USER_PASSWORD_AUTH' as const } } : {};

const LIMITE_CLICKS = 3;

// Helper function to check if input is email or username
const isEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

// Helper function to validate password according to Cognito rules
const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true };
};

export const LoginPage = () => {
  const [clicksEnLogo, setClicksEnLogo] = useState(0);
  const [defaultUserValue, setDefaultUser] = useState('');

  const { translateText, locale } = useI18n();

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
  const { apiKey } = useSelector(selectApiKey);

  const handlers = {
    onSubmit: (data: any) => {
      dispatch(
        apiKeyActions.loadApiKey({ userId: data.email, password: data.password, remember_me: data.remember_me })
      );
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

  const [cognitoUser, setCognitoUser] = useState<AuthUser>();
  const [userAttributes, setUserAttributes] = useState<FetchUserAttributesOutput>();
  const [mongoUsername, setMongoUsername] = useState<string | null>(null);
  const [signedInIdentity, setSignedInIdentity] = useState<{ username: string; sub: string } | null>(null);
  const loginUserDataRef = useRef<CidUserData | null>(null);
  const localeRef = useRef(locale);

  // Mantener el ref actualizado con el locale actual
  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  // Hub listener para eventos de autenticación
  useEffect(() => {
    const hubListenerCancelToken = Hub.listen('auth', async ({ payload }) => {
      const { event } = payload;

      // Evento que se dispara después de hacer login (manual o automático después de verificar email)
      if (event === 'signedIn') {
        try {
          const attributes = await fetchUserAttributes();

          // Si tenemos datos del login previo (handleSignIn), usarlos
          if (loginUserDataRef.current) {
            setMongoUsername(loginUserDataRef.current.username);
            setSignedInIdentity({ username: loginUserDataRef.current.username || attributes.email, sub: attributes.sub });
            loginUserDataRef.current = null; // Limpiar ref
            return;
          }

          // Si no (ej: signup nuevo o login con email), verificar si el usuario ya existe en MongoDB
          // Intentar con preferred_username primero, si no con email
          const cidParam = attributes.preferred_username || attributes.email;
          const checkResponse = await fetch(`${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users/cid/${cidParam}`, {
            headers: {
              'Content-Type': 'application/json',
              ...generatePreAuthHeaders('username_signin'),
            },
          });

          const checkData = await checkResponse.json();

          // Si no existe, crear el usuario en MongoDB
          if (checkData?.data?.status === 'AVAILABLE') {
            const createResponse = await fetch(`${import.meta.env.VITE_ARTISTS_HIVE_SERVER_URL}/users`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...generatePreAuthHeaders('user_signup'),
              },
              body: JSON.stringify({
                username: attributes.preferred_username || null,
                sub: attributes.sub,
                email: attributes.email,
                given_names: attributes.given_name,
                surnames: attributes.family_name,
                phone_number: attributes.phone_number || null,
              }),
            });

            if (!createResponse.ok) {
              console.error('Failed to create user in MongoDB:', await createResponse.text());
            } else {
              // generate-key busca al usuario por sub, asi que solo sirve pedir el token una vez creado en Mongo.
              const createdData = await createResponse.json();
              // El router redirige /login -> next en cuanto la sesion queda resuelta (ver routes/index.tsx).
              navigateToInnerPath({
                path: `${PATHS.LOGIN}?${URL_PARAMETER_NAMES.NEXT}=${encodeURIComponent(`/${PATHS.PROFILE}/${SUB_PATHS.EDIT}`)}`,
                options: { replace: true },
              });
              setMongoUsername(createdData?.data?.username || null);
              // Recien aca existe el usuario en Mongo, que es lo que generate-key busca por sub.
              setSignedInIdentity({ username: createdData?.data?.username || attributes.email, sub: attributes.sub });
            }
          } else {
            // Usuario existe, guardar el username de MongoDB
            setMongoUsername(checkData?.data?.username || null);
            setSignedInIdentity({ username: checkData?.data?.username || attributes.email, sub: attributes.sub });
          }
        } catch (error) {
          console.error('Error in signedIn handler:', error);
        }
      }
    });

    return () => {
      hubListenerCancelToken();
    };
  }, []);

  useEffect(() => {
    if (cognitoUser) {
      // Aquí puedes ejecutar cualquier lógica una vez que el usuario esté cargado
      loadAWSInfo();

      // navigateToInnerPath({ path: PATHS.HOME });
    }
  }, [cognitoUser]);

  const loadAWSInfo = async () => {
    try {
      const info = await fetchUserAttributes();
      setUserAttributes(info);

      // Solo verificar disponibilidad si no tenemos ya el username de MongoDB
      if (cognitoUser && info.email && !mongoUsername && !loginUserDataRef.current) {
        dispatch(usersActions.checkUsernameAvailability(info.preferred_username || info.email));
      }
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    }
  };

  useEffect(() => {
    // El Authenticator no siempre renderiza sus children tras el signup, asi que la identidad
    // resuelta en el listener de Hub es la fuente principal y cognitoUser solo el respaldo.
    const identity =
      signedInIdentity ||
      (cognitoUser && userAttributes
        ? {
            username:
              mongoUsername || userAttributes.preferred_username || userAttributes.email || cognitoUser.userId,
            sub: cognitoUser.userId,
          }
        : null);

    // Con token vigente no se vuelve a pedir: loadApiKey lo limpia del store y romperia las peticiones en curso.
    if (!identity || apiKey) {
      return;
    }

    dispatch(apiKeyActions.loadApiKey(identity));
  }, [signedInIdentity, cognitoUser, userAttributes, mongoUsername]);

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
        {/* <Grid item justifyContent="center">
          <img
            alt="Artist Hive"
            className="img-logotipo"
            src={import.meta.env.VITE_LOGO_URL}
            width="200"
            onClick={() => setClicksEnLogo(clicksEnLogo + 1)}
          />
        </Grid> */}
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
              loginMechanisms={['email']}
              // socialProviders={['amazon', 'apple', 'facebook', 'google']}
              signUpAttributes={['email', 'given_name', 'family_name', 'phone_number']}
              services={{
                async handleSignUp(formData) {
                  const { username, password, options } = formData;
                  const { signUp } = await import('aws-amplify/auth');
                  const currentLocale = localeRef.current;

                  const result = await signUp({
                    username,
                    password,
                    options: {
                      ...options,
                      clientMetadata: {
                        locale: currentLocale,
                      },
                    },
                  });

                  if (
                    import.meta.env.VITE_USE_LOCAL_COGNITO === 'true' &&
                    result.nextStep.signUpStep === 'CONFIRM_SIGN_UP'
                  ) {
                    const adminUrl = import.meta.env.VITE_COGNITO_ADMIN_URL;

                    await fetch(`${adminUrl}/confirm`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ username }),
                    });

                    await signIn({ username, password, ...SIGN_IN_OPTIONS });

                    return { ...result, isSignUpComplete: true, nextStep: { signUpStep: 'DONE' as const } };
                  }

                  return result;
                },
                async handleSignIn(formData) {
                  const { username, password } = formData;

                  // Validar password
                  const passwordValidation = validatePassword(password);
                  if (!passwordValidation.valid) {
                    throw new Error(passwordValidation.message);
                  }

                  // Detectar si es email o username
                  let emailToUse = username;

                  if (!isEmail(username)) {
                    // Es un username, buscar el email y guardar datos
                    const userData = await getEmailByUsername(username);

                    if (!userData) {
                      throw new Error('Username not found');
                    }

                    // Guardar datos para usarlos después del login
                    loginUserDataRef.current = userData;
                    emailToUse = userData.email;
                  }

                  // Hacer login con Cognito usando el email
                  return signIn({ username: emailToUse, password, ...SIGN_IN_OPTIONS });
                },
                async handleConfirmSignUp(formData) {
                  const { username, confirmationCode } = formData;

                  // Confirmar el email en Cognito
                  const { confirmSignUp } = await import('aws-amplify/auth');

                  // Cognito hace autoSignIn después de confirmar
                  // El evento se manejará en el Hub listener
                  return confirmSignUp({ username, confirmationCode });
                },
              }}
              formFields={{
                signIn: {
                  username: {
                    label: 'Email o Username',
                    placeholder: 'Ingresa tu email o username',
                    isRequired: true,
                    type: 'text',
                  },
                  password: {
                    label: 'Password',
                    placeholder: 'Ingresa tu password',
                    isRequired: true,
                  },
                },
                signUp: {
                  given_name: {
                    label: 'First Name',
                    placeholder: 'Enter your first name',
                    isRequired: true,
                    order: 1,
                  },
                  family_name: {
                    label: 'Last Name',
                    placeholder: 'Enter your last name',
                    isRequired: true,
                    order: 2,
                  },
                  email: {
                    label: 'Email',
                    placeholder: 'Enter your Email',
                    isRequired: true,
                    order: 3,
                  },
                  password: {
                    label: 'Password',
                    placeholder: 'Enter your Password',
                    isRequired: true,
                    order: 4,
                  },
                  confirm_password: {
                    label: 'Confirm Password',
                    placeholder: 'Please confirm your Password',
                    isRequired: true,
                    order: 5,
                  },
                  phone_number: {
                    label: 'Phone Number',
                    placeholder: '1234567890',
                    isRequired: false,
                    order: 6,
                  },
                },
              }}
              components={{}}
            >
              {({ signOut, user }) => {
                setCognitoUser(user);
                return <AppLoader height="100%" />;
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
