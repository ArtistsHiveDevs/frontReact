import "./index.scss";
import { useEffect, useState } from "react";
import RequireAuthComponent from "../../atoms/IconField/app/auth/RequiredAuth";

export interface TabbedPage {
  name: string;
  tabContent: any;
  requireSession?: boolean;
}

export const TabbedPanel = (props: any) => {
  const { tabs, allowedSections } = props;

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
        <RequireAuthComponent requiredSession={subpage.requireSession}>
          <div
            className={classNames.join(" ")}
            key={`subpage-section-${idx}`}
            onClick={() => changeSection(idx)}
          >
            <h5>{subpage.name}</h5>
          </div>
        </RequireAuthComponent>
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