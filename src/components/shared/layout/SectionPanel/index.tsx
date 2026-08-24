import { useState } from 'react';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import './index.scss';

export const SectionsPanel = (props: any) => {
  const { id, sectionName, sectionContent, isCollapsible = true, variant, titleTag: TitleTag = 'h2', initialExpanded = true } = props;
  const [isExpanded, setIsExpanded] = useState(initialExpanded);

  const toggleExpanded = () => {
    if (isCollapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div id={id} className={`section-panel${variant ? ` section-panel--${variant}` : ''}`}>
      {sectionContent && sectionName && (
        <div className="section-header" onClick={toggleExpanded} style={{ cursor: isCollapsible ? 'pointer' : 'default' }}>
          <TitleTag className="section-title">{sectionName}</TitleTag>
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
