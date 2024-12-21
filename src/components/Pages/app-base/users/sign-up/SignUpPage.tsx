import { Button, Card, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { PATHS, SUB_PATHS } from '~/constants';
import './SignUpPage.scss';

const FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeojAvL-eNV4BcpptuZuMwN8rwVWUsMedV_EoeRnxCddhez0Q/viewform?embedded=true';

export const SignUpPage = () => {
  // const [sesionVerificada, setSesionVerificada] = useState(false);
  const [componentIsLoaded, setComponentIsLoaded] = useState(false);

  // const { currentUserProfile, loggedUser } = useAuth();
  const { navigateToInnerPath } = useNavigation();

  const handleSignUp = (type: string) => {
    console.log(' TO = ', `${PATHS.PROFILE}/${SUB_PATHS.CREATE}?type=${type}`);
    // navigateToInnerPath();
  };

  // useEffect(() => {
  //   setComponentIsLoaded(true);
  // }, []);

  // useEffect(() => {
  //   if (componentIsLoaded) {
  //     console.log('COMPNENTE CARGADO   ', componentIsLoaded);
  //     if (loggedUser) {
  //       navigateToInnerPath({ path: PATHS.HOME });
  //     } else {
  //       console.log('todo bien por ahora');
  //     }
  //   }
  // }, [componentIsLoaded, loggedUser]);

  return (
    <>
      {!componentIsLoaded && (
        <Container>
          <Typography variant="h3" gutterBottom>
            Registrarse
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://npcarlos.co/artistsHive_mocks/IndustryOffer/artists_live_events.jpg"
                  alt="Registro como Persona"
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Registro como Persona
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Únete como individuo y disfruta de todos los beneficios de nuestra plataforma.
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => handleSignUp('person')}>
                    Registrarse como Persona
                  </Button>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image="https://npcarlos.co/artistsHive_mocks/IndustryOffer/artists_live_events.jpg"
                  alt="Registro como Artista o Miembro de la Industria"
                />
                <CardContent
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                  }}
                >
                  <Typography variant="h5" gutterBottom>
                    Registro como Artista o Miembro de la Industria
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    Primero debes crear un perfil de persona. Una vez creado, podrás gestionar artistas, venues,
                    festivales, y más.
                  </Typography>
                  <Button variant="contained" color="primary" onClick={() => handleSignUp('industry')}>
                    Registrarse como Artista o Miembro de la Industria
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
      {componentIsLoaded && <h1>Crear cuenta</h1>}
    </>
  );
};

export default SignUpPage;
