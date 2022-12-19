import { useI18n } from "../../../common/utils";

const BASE_TRANSLATIONS_APP_NAME = "app.name";

const HomePage = () => {
  const { getMessage } = useI18n();

  return (
    <>
      <h1>HomePage: {getMessage(`${BASE_TRANSLATIONS_APP_NAME}`)}</h1>
    </>
  );
};

export default HomePage;
