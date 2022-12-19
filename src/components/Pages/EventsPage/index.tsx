import { useI18n } from "~/common/utils";

const BASE_TRANSLATIONS = "app.pages.EventsPage";

const EventsPage = () => {
  const { translateText } = useI18n();

  return <h1>{translateText(`${BASE_TRANSLATIONS}.title`)}</h1>;
};

export default EventsPage;
