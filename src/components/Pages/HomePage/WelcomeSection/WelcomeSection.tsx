import { useI18n } from '~/common/utils';
import './WelcomeSection.scss';

const TRANSLATION_BASE_HOME_PAGE = 'app.pages.HomePage';

const WelcomeSection = (props: any) => {
  const { translateText } = useI18n();

  return (
    <section className="welcome-section">
      <>
        <h1 className="welcome-title">{translateText(`${TRANSLATION_BASE_HOME_PAGE}.welcome`)} a Artists Hive!</h1>
        <p>
          La comunidad más grande que conecta artistas independientes con los sitios. Encuentra tu lugar favorito.
          Disfruta de las mejores expresiones artísticas en tu lugar.
        </p>
        <p>Planifica tus eventos, programa tus giras, crea la información profesional de tu grupo artístico</p>
      </>
    </section>
  );
};

export default WelcomeSection;
