import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router";
import { useI18n } from "~/common/utils";
import useAuth from "~/common/utils/hooks/auth/useAuth";
import { PATHS } from "~/constants";
import "./LoginPage.scss";

const TRANSLATION_BASE_LOGIN_PAGE = "app.pages.app_base.LoginPage";

export const LoginPage = () => {
  const { loggedUser, setLoggedUser } = useAuth();
  const navigate = useNavigate();
  const { translateText } = useI18n();
  const translate = (text: string) => {
    return translateText(text);
  };

  return (
    <>
      <h1>Artists Hive</h1>
      <div className="login-content">
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph1`)}</p>
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph2`)}</p>
        <p>{translate(`${TRANSLATION_BASE_LOGIN_PAGE}.paragraph3`)}</p>
      </div>

      <Button className="button-styles" onClick={() => navigate(PATHS.SIGN_UP)}>
        {translate(`${TRANSLATION_BASE_LOGIN_PAGE}.button`)}
      </Button>

      <div className="login-footer">
        <Image
          fluid={true}
          src="https://c1.wallpaperflare.com/preview/516/564/13/band-music-performance-perform.jpg"
        />
      </div>
    </>
  );
};

export default LoginPage;
