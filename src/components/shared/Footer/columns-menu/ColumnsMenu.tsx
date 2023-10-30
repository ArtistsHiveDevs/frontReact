import { useI18n } from "~/common/utils";
import { useNavigation } from "~/common/utils/hooks/navigation/navigation";
import "./ColumnsMenu.scss";

export interface FooterColumnOption {
  name: string;
  link?: string;
  icon?: string;
  image?: string;
  isTitle?: string;
  isLiteralTitle?: boolean;
}
export interface FooterColumnTemplate {
  columnName: string;
  isLiteralTitle?: boolean;
  options?: FooterColumnOption[];
}

const TRANSLATION_BASE_FOOTER_COLUMNS = "app.appbase.footer.columns";

const FooterColumns = (props: any) => {
  const { footerColumns } = props;
  const { translateText } = useI18n();

  const { navigateToInnerPath } = useNavigation();

  const handleClick = (option: FooterColumnOption) => {
    if (option.link) {
      navigateToInnerPath({ path: option.link });
    }
  };

  return (
    <>
      <div className="footer-columns">
        {footerColumns?.map((footerColumn: FooterColumnTemplate, idx: any) => {
          const columnTitle = footerColumn.isLiteralTitle
            ? footerColumn.columnName
            : translateText(
                `${TRANSLATION_BASE_FOOTER_COLUMNS}.${footerColumn.columnName}.name`
              );
          return (
            <div key={footerColumn.columnName} className="footer-column">
              <h2 className="column-title">{columnTitle}</h2>
              <ul>
                {footerColumn.options?.map((option: FooterColumnOption) => {
                  const optionTitle = option.isLiteralTitle
                    ? option.name
                    : translateText(
                        `${TRANSLATION_BASE_FOOTER_COLUMNS}.${footerColumn.columnName}.options.${option.name}`
                      );
                  const classNames = !!option.link
                    ? "option-active"
                    : "option-disabled";
                  return (
                    <li
                      key={option.name}
                      onClick={() => handleClick(option)}
                      className={classNames}
                    >
                      {optionTitle}
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default FooterColumns;
