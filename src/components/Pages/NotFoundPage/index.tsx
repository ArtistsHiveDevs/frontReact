import { useI18n } from "~/common/utils";

const TRANSLATION_BASE_SEARCH = "app.general.not_found_page";

const NotFoundPage = () => {
  const { translateText, locale } = useI18n();

  function translate(text: string) {
    return translateText(`${TRANSLATION_BASE_SEARCH}.${text}`);
  }
  return (
    <>
      <h1>{translate("title")}</h1>
      <p></p>
    </>
  );
};

export default NotFoundPage;
