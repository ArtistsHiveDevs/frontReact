import { useContext } from "react";
import { HvAppContext } from "~/common";
import { useI18n } from "~/common/utils";
import DynamicIcons from "~/components/shared/DynamicIcons";
import { AVAILABLE_I18N_LANGUAGES } from "~/translations";
import "./index.scss";

const TRANSLATION_BASE_COPYWRITE = "app.appbase.footer.copywrite";

const FooterCopywrite = (props: any) => {
  let { lang, messages, setLocale } = useContext(HvAppContext);
  const { translateText } = useI18n();
  return (
    <>
      <div className="copyright">
        <p>Artists Hive ©</p>
        <p>
          {translateText(`${TRANSLATION_BASE_COPYWRITE}.allRightsReserved`)}
        </p>
        <p>2022</p>
        <p>
          <DynamicIcons
            iconName="FaGlobeAmericas"
            size={20}
            className="i18n-icon"
          />{" "}
          {AVAILABLE_I18N_LANGUAGES.map((newLang, index, newLangArr) => {
            const styles = [];
            if (newLang === lang) {
              styles.push("active-lang");
            }
            return (
              <span key={`lang-${index}`}>
                <span
                  className={styles.join(" ")}
                  onClick={() => setLocale(newLang)}
                >
                  {newLang}
                </span>
                {index < newLangArr.length - 1 && "  |  "}
              </span>
            );
          })}
        </p>
      </div>
    </>
  );
};

export default FooterCopywrite;
