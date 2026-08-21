import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { SectionsPanel } from '~/components/shared/layout/SectionPanel';
import { FixedHeader, FixedHeaderRef } from '~/components/shared/molecules/FixedHeader';
import { PATHS } from '~/constants';
import { MDDocumentModel } from '~/models/app/md-model/md-model';
import './mdreader.scss';

interface MDReaderProps {
  mdDocument: MDDocumentModel;
  options?: {
    renderPlainMD?: boolean;
    showLogoAtEnd?: boolean;
    showTableOfContent?: boolean;
    showSectionNumbers?: boolean;
  };
}

interface MDTableOfContentSection {
  id: string;
  title: string;
  body: string;
  children: MDTableOfContentSection[];
}

const cleanHeadingText = (text: string) =>
  text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*|__/g, '')
    .trim();

const parseTableOfContentSections = (content: string) => {
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');
  let rootTitle = '';
  const rootBodyLines: string[] = [];
  const sections: MDTableOfContentSection[] = [];
  let currentH2: MDTableOfContentSection | null = null;
  let currentH3: MDTableOfContentSection | null = null;
  let idCounter = 0;

  lines.forEach((line) => {
    const h1Match = /^#\s+(.*)$/.exec(line);
    const h2Match = /^##\s+(.*)$/.exec(line);
    const h3Match = /^###\s+(.*)$/.exec(line);

    if (h1Match) {
      rootTitle = cleanHeadingText(h1Match[1]);
      currentH2 = null;
      currentH3 = null;
      return;
    }
    if (h2Match) {
      currentH2 = { id: `md-section-${idCounter++}`, title: cleanHeadingText(h2Match[1]), body: '', children: [] };
      sections.push(currentH2);
      currentH3 = null;
      return;
    }
    if (h3Match) {
      const node: MDTableOfContentSection = {
        id: `md-section-${idCounter++}`,
        title: cleanHeadingText(h3Match[1]),
        body: '',
        children: [],
      };
      if (currentH2) {
        currentH2.children.push(node);
      } else {
        sections.push(node);
      }
      currentH3 = node;
      return;
    }

    if (currentH3) currentH3.body += `${line}\n`;
    else if (currentH2) currentH2.body += `${line}\n`;
    else rootBodyLines.push(line);
  });

  return { rootTitle, rootBody: rootBodyLines.join('\n'), sections };
};

const hasAnyChildren = (sections: MDTableOfContentSection[]): boolean => {
  return sections.some((section) => section.children.length > 0 || hasAnyChildren(section.children));
};

const TocNode: React.FC<{
  section: MDTableOfContentSection;
  onNavigate: (id: string) => void;
  sectionNumber?: string;
  showNumbers?: boolean;
}> = ({ section, onNavigate, sectionNumber, showNumbers }) => {
  const hasChildren = section.children.length > 0;
  const [expanded, setExpanded] = useState(true);

  return (
    <li className="toc-node">
      <div className="toc-row">
        {hasChildren && (
          <button
            type="button"
            className={`toc-toggle ${expanded ? 'expanded' : ''}`}
            onClick={() => setExpanded(!expanded)}
            aria-label={expanded ? 'Collapse section' : 'Expand section'}
          >
            <DynamicIcons iconName="io5 IoChevronForwardOutline" size="0.85rem" customStyle={{ padding: '0rem' }} />
          </button>
        )}
        <a
          className="toc-link"
          href={`#${section.id}`}
          onClick={(e) => {
            e.preventDefault();
            onNavigate(section.id);
          }}
        >
          {showNumbers && sectionNumber && <span className="section-number">{sectionNumber}. </span>}
          {section.title}
        </a>
      </div>
      {hasChildren && expanded && (
        <ul className="toc-children">
          {section.children.map((child, index) => (
            <TocNode
              key={child.id}
              section={child}
              onNavigate={onNavigate}
              sectionNumber={showNumbers ? `${sectionNumber}.${index + 1}` : undefined}
              showNumbers={showNumbers}
            />
          ))}
        </ul>
      )}
    </li>
  );
};

const MDReader: React.FC<MDReaderProps> = ({ mdDocument, options }) => {
  const { content } = mdDocument || {};

  // Valores por defecto para las opciones
  const {
    renderPlainMD = false,
    showLogoAtEnd = false,
    showTableOfContent = true,
    showSectionNumbers = true,
  } = options || {};

  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [tocOpen, setTocOpen] = useState(false);
  const [tocTopPosition, setTocTopPosition] = useState(0);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const mainHeaderRef = useRef<HTMLDivElement>(null);
  const fixedHeaderRef = useRef<FixedHeaderRef>(null);
  const { translateText, translateGlobalDict } = useI18n();
  const { navigateToInnerPath } = useNavigation();

  const generateIdFromText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading and trailing hyphens
  };

  const parseHeadings = (content: string) => {
    const headingRegex = /^(#{1,6})\s+(.*)$/gm;
    const headingsList: { id: string; text: string; level: number }[] = [];
    let match;
    let idCounter = 0xddeb16;

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].replace(/\*\*|__/g, ''); // Remove bold formatting
      const id = `heading-${idCounter.toString(16).toUpperCase()}`; // Generate unique ID
      headingsList.push({ id, text, level });
      idCounter++;
    }

    setHeadings(headingsList);
  };

  useEffect(() => {
    parseHeadings(content);
  }, [content]);

  const goToHome = () => navigateToInnerPath({ path: PATHS.HOME });

  // Smooth scroll function
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const headingComponents = {
    h1: ({ node, ...props }: any) => <h1 id={generateIdFromText(props.children.toString())} {...props} />,
    h2: ({ node, ...props }: any) => <h2 id={generateIdFromText(props.children.toString())} {...props} />,
    h3: ({ node, ...props }: any) => <h3 id={generateIdFromText(props.children.toString())} {...props} />,
    h4: ({ node, ...props }: any) => <h4 id={generateIdFromText(props.children.toString())} {...props} />,
    h5: ({ node, ...props }: any) => <h5 id={generateIdFromText(props.children.toString())} {...props} />,
    h6: ({ node, ...props }: any) => <h6 id={generateIdFromText(props.children.toString())} {...props} />,
  };

  const tableOfContentData = useMemo(
    () => (!renderPlainMD ? parseTableOfContentSections(content) : null),
    [content, renderPlainMD]
  );

  // Callback para manejar cambios de posición del scroll
  const handleScrollPositionChange = (position: {
    headerBottom: number;
    fixedHeaderHeight: number;
    isHeaderHidden: boolean;
  }) => {
    // Calcula la posición del TOC
    if (!position.isHeaderHidden) {
      // El header es visible, el TOC debe seguir bajando con el scroll
      setTocTopPosition(position.headerBottom);
    } else {
      // El header está oculto, el TOC está en posición fija debajo del FixedHeader
      setTocTopPosition(position.fixedHeaderHeight);
    }
  };

  // Efecto para manejar el cierre automático del TOC en scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = Math.abs(currentScrollY - lastScrollY.current);

      // Cierra el TOC solo si el scroll delta es mayor a 100px
      if (tocOpen && scrollDelta > 100) {
        setTocOpen(false);
      }

      // Limpia el timeout anterior si existe
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }

      // Reinicia lastScrollY después de 500ms sin scroll
      scrollTimeout.current = setTimeout(() => {
        lastScrollY.current = window.scrollY;
      }, 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current);
      }
    };
  }, [tocOpen]);

  const renderSectionBody = (body: string) =>
    body?.trim() ? <ReactMarkdown children={body} remarkPlugins={[remarkGfm]} components={headingComponents} /> : null;

  const renderTableOfContentSection = (section: MDTableOfContentSection, nested = false, sectionNumber?: string) => (
    <SectionsPanel
      key={section.id}
      id={section.id}
      sectionName={showSectionNumbers && sectionNumber ? `${sectionNumber}. ${section.title}` : section.title}
      variant={nested ? 'nested' : undefined}
      titleTag={nested ? 'h3' : 'h2'}
      sectionContent={() => (
        <>
          {renderSectionBody(section.body)}
          {section.children.map((child, index) =>
            renderTableOfContentSection(child, true, showSectionNumbers ? `${sectionNumber}.${index + 1}` : undefined)
          )}
        </>
      )}
    />
  );

  const navigateFromToc = (id: string) => {
    scrollToElement(id);
    setTocOpen(false);
  };

  const toggleToc = () => setTocOpen((open) => !open);

  const generateTableOfContent = () => {
    const tocHasNestedItems = tableOfContentData ? hasAnyChildren(tableOfContentData.sections) : false;

    return (
      showTableOfContent && (
        <div className={`index-container${tocOpen ? ' open' : ''}`} style={{ top: `${tocTopPosition}px` }}>
          {tableOfContentData ? (
            <ul className={`toc-tree${tocHasNestedItems ? ' has-nested-items' : ''}`}>
              {tableOfContentData.sections.map((section, index) => (
                <TocNode
                  key={section.id}
                  section={section}
                  onNavigate={navigateFromToc}
                  sectionNumber={showSectionNumbers ? `${index + 1}` : undefined}
                  showNumbers={showSectionNumbers}
                />
              ))}
            </ul>
          ) : (
            <ul>
              {headings.map((heading) => (
                <li key={heading.id} style={{ marginLeft: `${heading.level - 1}rem` }}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateFromToc(heading.id);
                    }}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )
    );
  };

  return (
    <>
      {/* Header fijo que aparece al hacer scroll */}
      <FixedHeader ref={fixedHeaderRef} mainHeaderRef={mainHeaderRef} onScrollPositionChange={handleScrollPositionChange}>
        {showTableOfContent && (
          <button
            type="button"
            className="md-toc-toggle-btn"
            onClick={toggleToc}
            aria-label={tocOpen ? 'Ocultar índice' : 'Mostrar índice'}
          >
            <DynamicIcons iconName="io5 IoListOutline" size="2.2rem" customStyle={{ padding: '0rem' }} />
          </button>
        )}
        {tableOfContentData?.rootTitle && (
          <h1 id={generateIdFromText(tableOfContentData.rootTitle)}>{tableOfContentData.rootTitle}</h1>
        )}
      </FixedHeader>

      <div className="md-reader md-render">
        {/* Título principal (header que se trackea) */}
        <div className="md-reader-title" ref={mainHeaderRef}>
          {showTableOfContent && (
            <button
              type="button"
              className="md-toc-toggle-btn"
              onClick={toggleToc}
              aria-label={tocOpen ? 'Ocultar índice' : 'Mostrar índice'}
            >
              <DynamicIcons iconName="io5 IoListOutline" size="2.2rem" customStyle={{ padding: '0rem' }} />
            </button>
          )}
          {tableOfContentData?.rootTitle && (
            <h1 id={generateIdFromText(tableOfContentData.rootTitle)}>{tableOfContentData.rootTitle}</h1>
          )}
        </div>
        {/* Render del contenido */}
        {!!content && (
          <>
            {/* Render plano */}
            {renderPlainMD && content && (
              <>
                <ReactMarkdown children={content} remarkPlugins={[remarkGfm]} components={headingComponents} />
              </>
            )}
            {/* Render con secciones colapsables */}
            {!renderPlainMD && (
              <div className="md-layout">
                {generateTableOfContent()}
                <div className="md-content-col">
                  {renderSectionBody(tableOfContentData?.rootBody)}
                  {tableOfContentData?.sections.map((section, index) =>
                    renderTableOfContentSection(section, false, showSectionNumbers ? `${index + 1}` : undefined)
                  )}
                </div>
              </div>
            )}
          </>
        )}
        {showLogoAtEnd && (
          <div className="logo-end">
            <a onClick={goToHome}>
              <img alt="Artist Hive" className="img-logotipo" src={import.meta.env.VITE_LOGO_URL} width="80%" />
              <h2>{translateGlobalDict('artists_hive.slogan')}</h2>
            </a>
          </div>
        )}
      </div>
    </>
  );
};

export default MDReader;
