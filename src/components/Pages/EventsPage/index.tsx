import { useI18n } from "../../../common/utils";

const BASE_TRANSLATIONS = "app.pages.EventsPage";

const EventsPage = () => {
  const { getMessage } = useI18n();

  return <h1>{getMessage(`${BASE_TRANSLATIONS}.title`)}</h1>;
};

export default EventsPage;
