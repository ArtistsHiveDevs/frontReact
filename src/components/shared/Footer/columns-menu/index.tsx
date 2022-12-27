import "./index.scss";

export interface FooterColumnOption {
  text: string;
  link?: string;
  icon?: string;
  image?: string;
  isTitle?: string;
}
export interface FooterColumnTemplate {
  columnTitle: string;
  options?: FooterColumnOption[];
}

const FooterColumns = (props: any) => {
  const { footerColumns } = props;

  return (
    <>
      <div className="footer-columns">
        {footerColumns?.map((footerColumn: FooterColumnTemplate, idx: any) => {
          return (
            <div key={footerColumn.columnTitle} className="footer-column">
              <h2>{footerColumn.columnTitle}</h2>
              <ul>
                {footerColumn.options?.map((option: FooterColumnOption) => {
                  return <li key={option.text}>{option.text}</li>;
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
