import { useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './index.scss';

export const SectionsPanel = (props: any) => {
  const { sectionName, sectionContent, isCollapsible = true } = props;
  const [isExpanded, setIsExpanded] = useState(true);

  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div className="section-panel">
      {sectionContent && sectionName && (
        <div className="section-header" onClick={toggleExpanded} style={{ cursor: isCollapsible ? 'pointer' : 'default' }}>
          <h2 className="section-title">{sectionName}</h2>
          {isCollapsible && (
            <div className={`accordion-icon ${isExpanded ? '' : 'expanded'}`}>
              <DynamicIcons iconName="io5 IoChevronDownOutline" size="1.5rem" customStyle={{ padding: '0rem' }} />
            </div>
          )}
        </div>
      )}
      {sectionContent && (
        <div className={`section-content ${isExpanded ? 'expanded' : 'collapsed'}`}>
          {sectionContent()}
        </div>
      )}
    </div>
  );
};
