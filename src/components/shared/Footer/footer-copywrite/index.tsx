import DynamicIcons from "~/components/shared/DynamicIcons";
import "./index.scss";

const FooterCopywrite = (props: any) => {
  return (
    <>
      <div className="copyright">
        <p>Artists Hive ©</p>
        <p>Todos los derechos reservados</p>
        <p>2022</p>
        <p>
          <DynamicIcons
            iconName="FaGlobeAmericas"
            size={20}
            className="i18n-icon"
          />{" "}
        </p>
      </div>
    </>
  );
};

export default FooterCopywrite;