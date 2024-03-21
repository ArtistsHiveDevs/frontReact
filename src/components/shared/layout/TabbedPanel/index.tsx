import { useEffect, useState } from 'react';
import { AllowedEntityRole, RequireAuthComponent } from '~/components/shared/atoms/app/auth/RequiredAuth';
import './index.scss';

export interface TabbedPage {
  name: string;
  tabContent: any;
  requireSession?: boolean;
  allowedRoles?: AllowedEntityRole[];
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
      const classNames = ['subpage-tab'];
      if (activeSectionIndex === idx) {
        classNames.push('active-tab-title');
      }
      return (
        <RequireAuthComponent
          key={`subpage-section-${idx}`}
          allowedRoles={subpage.allowedRoles}
          requiredSession={subpage.requireSession}
        >
          <div className={classNames.join(' ')} onClick={() => changeSection(idx)}>
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
