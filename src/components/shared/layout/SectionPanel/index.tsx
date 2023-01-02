import "./index.scss";

const SectionsPanel = (props: any) => {
  const { sectionName, sectionContent } = props;

  return (
    <>
      <h2 className="section-title">{sectionName}</h2>
      {sectionContent && sectionContent()}
    </>
  );
};

export default SectionsPanel;
