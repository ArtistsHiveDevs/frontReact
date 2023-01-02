import "./index.scss";
import { useEffect, useState } from "react";

export interface TabbedPage {
  name: string;
  tabContent: any;
}

export const TabbedPanel = (props: any) => {
  const { tabs } = props;

  const [activeSectionIndex, setSection] = useState(0);

  useEffect(() => {
    setSection(0);
  }, []);

  const changeSection = (activeSection: number) => {
    setSection(activeSection);
  };

  const tabTitles = () => {
    return tabs.map((subpage: TabbedPage, idx: number) => {
      const classNames = ["subpage-tab"];
      if (activeSectionIndex === idx) {
        classNames.push("active-tab-title");
      }
      return (
        <div
          className={classNames.join(" ")}
          key={`subpage-section-${idx}`}
          onClick={() => changeSection(idx)}
        >
          <h5>{subpage.name}</h5>
        </div>
      );
    });
  };

  const tabContents = () => {
    const subpage = tabs[activeSectionIndex]?.tabContent;

    return subpage && <div className="full-content">{subpage()}</div>;
  };

  return (
    <>
      <div className="subpages-tabs">{tabTitles()}</div>
      <div>{tabContents()}</div>
    </>
  );
};
