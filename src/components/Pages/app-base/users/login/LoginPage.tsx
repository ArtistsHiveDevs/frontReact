import { Grid, Paper } from '@mui/material';
import { fetchUserAttributes, FetchUserAttributesOutput, signIn } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useApiKeySlice } from '~/common/slices/app-base/APIKey';
import { selectError } from '~/common/slices/app-base/APIKey/selectors';
import { useUsersSlice } from '~/common/slices/users';
import { CidUserData, getEmailByUsername } from '~/common/slices/users/saga';
import { selectUsers } from '~/common/slices/users/selectors';
import { I18nPaths, useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { generatePreAuthHeaders } from '~/common/utils/request';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { DynamicFieldData } from '~/components/shared/organisms/gui/dynamicForms';
import { PATHS } from '~/constants';
import { SocialNetworks, SocialNetworkTemplate } from '~/constants/social-networks.const';
import { AppUserModel } from '~/models/app/user/user.model';
import './LoginPage.scss';

import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import { AuthUser } from 'aws-amplify/auth';
import { AppLoader } from '~/components/shared/organisms/app/loader/loader';

const TRANSLATION_BASE_LOGIN_PAGE = 'app.pages.app_base.LoginPage';

const LoginAuthTabs = () => {
  const { route, toSignIn, toSignUp } = useAuthenticator(({ route, toSignIn, toSignUp }) => [
    route,
    toSignIn,
    toSignUp,
  ]);
  const isSignUp = route === 'signUp';
  const { translateText } = useI18n();

  return (
    <div className="login-auth-tabs">
      <div
        className={`amplify-tabs__list amplify-tabs__list--top amplify-tabs__list--equal${
          isSignUp ? ' amplify-tabs__list--signup' : ''
        }`}
        role="tablist"
      >
        <span className="amplify-tabs__thumb" aria-hidden="true" />
        <button
          type="button"
          role="tab"
          aria-selected={route === 'signIn'}
          className={`amplify-tabs__item${route === 'signIn' ? ' amplify-tabs__item--active' : ''}`}
          onClick={toSignIn}
        >
          {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.login`)}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={route === 'signUp'}
          className={`amplify-tabs__item${route === 'signUp' ? ' amplify-tabs__item--active' : ''}`}
          onClick={toSignUp}
        >
          {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.create_account`)}
        </button>
      </div>
    </div>
  );
};

const SIGN_IN_OPTIONS =
  import.meta.env.VITE_USE_LOCAL_COGNITO === 'true' ? { options: { authFlowType: 'USER_PASSWORD_AUTH' as const } } : {};

const LIMITE_CLICKS = 3;

// Helper function to check if input is email or username
const isEmail = (input: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

// Helper function to validate password according to Cognito rules
const validatePassword = (
  password: string,
  translateText: (messageId: string) => string
): { valid: boolean; message?: string } => {
  if (!password || password.length < 8) {
    return {
      valid: false,
      message: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.VALIDATION_PASSWORD_MIN_LENGTH`),
    };
  }
  if (!/[0-9]/.test(password)) {
    return {
      valid: false,
      message: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.VALIDATION_PASSWORD_NEEDS_NUMBER`),
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      valid: false,
      message: translateText(
        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.VALIDATION_PASSWORD_NEEDS_LOWERCASE`
      ),
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      message: translateText(
        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.VALIDATION_PASSWORD_NEEDS_UPPERCASE`
      ),
    };
  }
  if (!/[^a-zA-Z0-9]/.test(password)) {
    return {
      valid: false,
      message: translateText(
        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.VALIDATION_PASSWORD_NEEDS_SPECIAL_CHAR`
      ),
    };
  }
  return { valid: true };
};

export const LoginPage = () => {
  const [clicksEnLogo, setClicksEnLogo] = useState(0);
  const [defaultUserValue, setDefaultUser] = useState('');

  const { translateText, locale } = useI18n();

  const usersList: AppUserModel[] = useSelector(selectUsers);
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
  // Arranca en true: cubre el caso de sesión ya autenticada al cargar la página
  // (Amplify resuelve la sesión existente sin disparar el evento 'signedIn' del
  // Hub, así que nunca pasaría por el listener que lo pondría en true). Solo se
  // pone en false explícitamente cuando justSignedUpRef marca un signup fresco.
  const [userReadyInBackend, setUserReadyInBackend] = useState(true);
  const justSignedUpRef = useRef(false);
  const loginUserDataRef = useRef<CidUserData | null>(null);
  const latestAuthUserRef = useRef<AuthUser>();
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
        // Solo un signup recién confirmado necesita esperar a que el backend
        // termine de crear el usuario en Mongo antes de pedir la API key.
        const isFreshSignUp = justSignedUpRef.current;
        justSignedUpRef.current = false;

        if (isFreshSignUp) {
          setUserReadyInBackend(false);
        }

        try {
          // No depender del render prop del <Authenticator> para saber que hay un
          // usuario logueado: cuando el signup local confirma y hace signIn() de
          // forma manual (ver handleSignUp), Cognito sí queda autenticado pero la
          // máquina de estados del Authenticator no siempre lo refleja y se queda
          // mostrando el formulario de Sign In. El evento del Hub es la fuente de
          // verdad real, así que seteamos cognitoUser directamente acá.
          const { getCurrentUser } = await import('aws-amplify/auth');
          const currentAuthUser = await getCurrentUser();
          setCognitoUser(currentAuthUser);

          const attributes = await fetchUserAttributes();

          // Si tenemos datos del login previo (handleSignIn), usarlos
          if (loginUserDataRef.current) {
            setMongoUsername(loginUserDataRef.current.username);
            loginUserDataRef.current = null; // Limpiar ref
            if (isFreshSignUp) {
              setUserReadyInBackend(true);
            }
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
            }
          } else {
            // Usuario existe, guardar el username de MongoDB
            setMongoUsername(checkData?.data?.username || null);
          }

          // El usuario ya existe (o se acaba de crear) en MongoDB: recién ahora
          // es seguro pedir la API key sin correr contra la creación en el backend.
          if (isFreshSignUp) {
            setUserReadyInBackend(true);
          }
        } catch (error) {
          console.error('Error in signedIn handler:', error);
          if (isFreshSignUp) {
            setUserReadyInBackend(true);
          }
        }
      }
    });

    return () => {
      hubListenerCancelToken();
    };
  }, []);

  // El Authenticator invoca su render prop durante el render de AuthenticatorInternal;
  // llamar a setCognitoUser ahí mismo es un setState-durante-render de otro componente
  // (React lo advierte en consola) y puede dejar la UI colgada. Este efecto, sin
  // dependencias, corre después de cada render y aplica el valor de forma segura.
  useEffect(() => {
    if (latestAuthUserRef.current && latestAuthUserRef.current !== cognitoUser) {
      setCognitoUser(latestAuthUserRef.current);
    }
  });

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
    } catch (error) {
      console.error('Error fetching user attributes:', error);
    }
  };

  useEffect(() => {
    // Espera a que el listener del Hub confirme que el usuario ya existe (o fue
    // creado) en MongoDB; si se pide la API key antes, /api/generate-key responde
    // 404 porque todavía no encuentra el usuario por sub, y el login nunca se
    // completa (ni redirige a home) tras un signup recién confirmado.
    if (cognitoUser && userAttributes && userReadyInBackend) {
      // Usar el username de MongoDB si existe, sino usar preferred_username o email
      const username = mongoUsername || userAttributes.preferred_username || userAttributes.email || cognitoUser.userId;

      dispatch(
        apiKeyActions.loadApiKey({
          username,
          sub: cognitoUser.userId,
        })
      );
    }
  }, [cognitoUser, userAttributes, mongoUsername, userReadyInBackend]);

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
          <Paper elevation={0} sx={{ padding: 0, backgroundColor: 'transparent', boxShadow: 'none' }} className={'login-form-container'}>
            {/* <Typography variant="h4" gutterBottom padding={'1rem'}>
              Usuario o email:
            </Typography> */}
            <Authenticator.Provider>
              <LoginAuthTabs />
              <Authenticator
                loginMechanisms={['email']}
                // socialProviders={['amazon', 'apple', 'facebook', 'google']}
                signUpAttributes={['email', 'given_name', 'family_name', 'phone_number']}
                services={{
                  async handleSignUp(formData) {
                    const { username, password, options } = formData;
                    const { signUp } = await import('aws-amplify/auth');
                    const currentLocale = localeRef.current;

                    // Marca que el próximo evento 'signedIn' viene de una cuenta
                    // recién creada (autoSignIn tras confirmar), para que el listener
                    // del Hub espere a que el usuario exista en Mongo antes de pedir
                    // la API key.
                    justSignedUpRef.current = true;

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
                    const passwordValidation = validatePassword(password, translateText);
                    if (!passwordValidation.valid) {
                      throw new Error(passwordValidation.message);
                    }

                    // Detectar si es email o username
                    let emailToUse = username;

                    if (!isEmail(username)) {
                      // Es un username, buscar el email y guardar datos
                      const userData = await getEmailByUsername(username);

                      if (!userData) {
                        throw new Error(
                          translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ERROR_CODES}.AUTH_USER_NOT_FOUND`)
                        );
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
                      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.username_or_email`),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.username_or_email_placeholder`
                      ),
                      isRequired: true,
                      type: 'text',
                    },
                    password: {
                      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password`),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password_placeholder`
                      ),
                      isRequired: true,
                    },
                  },
                  signUp: {
                    given_name: {
                      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.first_name`),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.first_name_placeholder`
                      ),
                      isRequired: true,
                      order: 1,
                    },
                    family_name: {
                      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.last_name`),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.last_name_placeholder`
                      ),
                      isRequired: true,
                      order: 2,
                    },
                    email: {
                      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.email`),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.email_placeholder`
                      ),
                      isRequired: true,
                      order: 3,
                    },
                    password: {
                      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password`),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.password_placeholder`
                      ),
                      isRequired: true,
                      order: 4,
                    },
                    confirm_password: {
                      label: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.confirm_password`
                      ),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.confirm_password_placeholder`
                      ),
                      isRequired: true,
                      order: 5,
                    },
                    phone_number: {
                      label: translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.phone_number`),
                      placeholder: translateText(
                        `${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.accounts.phone_number_placeholder`
                      ),
                      isRequired: false,
                      order: 6,
                    },
                  },
                }}
                components={{}}
              >
                {({ signOut, user }) => {
                  latestAuthUserRef.current = user;
                  return <AppLoader height="100%" />;
                }}
              </Authenticator>
            </Authenticator.Provider>
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
