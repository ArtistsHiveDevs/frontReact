import { useI18n } from "~/common/utils";

const BASE_TRANSLATIONS_APP_NAME = "app.name";

const HomePage = () => {
  const { translateText } = useI18n();

  return (
    <>
      <h1>HomePage: {translateText(`${BASE_TRANSLATIONS_APP_NAME}`)}</h1>
    </>
  );
};

export default HomePage;
