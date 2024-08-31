import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useI18n } from '~/common/utils';
import { useNavigation } from '~/common/utils/hooks/navigation/navigation';
import { PATHS } from '~/constants';
import { MDDocumentModel } from '~/models/app/md-model/md-model';
import './MDReader.scss';

interface MDReaderProps {
  mdDocument: MDDocumentModel;
  options?: {
    showIndex?: boolean;
    showLogoAtEnd?: boolean;
  };
}

const MDReader: React.FC<MDReaderProps> = ({ mdDocument, options }) => {
  const { content } = mdDocument || {};
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [showIndex, setShowIndex] = useState(options?.showIndex ?? true);

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

  return (
    <div className="md-reader md-render">
      {options?.showIndex && showIndex && (
        <div className="index-container">
          <button onClick={() => setShowIndex(false)}>Hide Index</button>
          <ul>
            {headings.map((heading) => (
              <li key={heading.id} style={{ marginLeft: `${heading.level - 1}rem` }}>
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToElement(heading.id);
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {options?.showIndex && !showIndex && <button onClick={() => setShowIndex(true)}>Show Index</button>}
      {content && (
        <ReactMarkdown
          children={content}
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ node, ...props }) => <h1 id={generateIdFromText(props.children.toString())} {...props} />,
            h2: ({ node, ...props }) => <h2 id={generateIdFromText(props.children.toString())} {...props} />,
            h3: ({ node, ...props }) => <h3 id={generateIdFromText(props.children.toString())} {...props} />,
            h4: ({ node, ...props }) => <h4 id={generateIdFromText(props.children.toString())} {...props} />,
            h5: ({ node, ...props }) => <h5 id={generateIdFromText(props.children.toString())} {...props} />,
            h6: ({ node, ...props }) => <h6 id={generateIdFromText(props.children.toString())} {...props} />,
          }}
        />
      )}
      {options?.showLogoAtEnd && (
        <div className="logo-end">
          <a onClick={goToHome}>
            <img alt="Artist Hive" className="img-logotipo" src={import.meta.env.VITE_LOGO_URL} width="80%" />
            <h2>{translateGlobalDict('artists_hive.slogan')}</h2>
          </a>
        </div>
      )}
    </div>
  );
};

export default MDReader;
