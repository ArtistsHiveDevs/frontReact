import FooterColumns, {
  FooterColumnTemplate,
} from "~/components/shared/Footer/columns-menu";
import FooterCopywrite from "~/components/shared/Footer/footer-copywrite";
import FooterSocialNetworks from "~/components/shared/Footer/footer-social-networks/FooterSocialNetworks";
import "./AppFooter.scss";

export const AppFooter = () => {
  // Footer
  const footerColumns: FooterColumnTemplate[] = [
    {
      columnName: "what_we_do",
      options: [
        { name: "cultural_agenda", link: "#" },
        { name: "for_artists", link: "#" },
        { name: "for_places", link: "#" },
        { name: "for_promoters", link: "#" },
        { name: "for_festivals", link: "#" },
      ],
    },
    {
      columnName: "about_us",
      options: [
        { name: "history", link: "#" },
        { name: "press", link: "#" },
        { name: "career", link: "#" },
        { name: "download", link: "#" },
        { name: "data_policy", link: "#" },
      ],
    },
    // {
    //   columnTitle: "Proyectos",
    //   options: [{ text: "Conoce tu país", link: "#"}],
    // },
    {
      columnName: "help",
      options: [
        { name: "help_center", link: "#" },
        { name: "contact_us", link: "#" },
        { name: "report", link: "#" },
      ],
    },
  ];
  return (
    <>
      <FooterColumns footerColumns={footerColumns} />
      <FooterSocialNetworks />
      <FooterCopywrite />
    </>
  );
};
