import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './CircuitoHivePage.scss';

import MDReader from '~/components/shared/organisms/gui/MDReader/mdreader';
import { MDDocumentModel } from '~/models/app/md-model/md-model';

const CircuitoHivePage = () => {
  const { pageName } = useParams<{ pageName: string }>();
  const [mdDocument, setMdDocument] = useState<MDDocumentModel | null>(null);

  useEffect(() => {
    const loadMarkdown = async () => {
      try {
        // Importar dinámicamente el archivo markdown basado en el pageName
        const fileName = pageName || 'about';
        const mdModule = await import(`./${fileName}.md?raw`);

        // Crear el MDDocumentModel con el contenido
        const mdDoc = new MDDocumentModel({
          id: fileName,
          content: mdModule.default,
          lang: 'es',
          version: '1.0',
        });

        setMdDocument(mdDoc);
      } catch (error) {
        console.error('Error loading markdown file:', error);
      }
    };

    loadMarkdown();
  }, [pageName]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [mdDocument]);

  return (
    mdDocument && (
      <div>
        <MDReader mdDocument={mdDocument} options={{}} />
      </div>
    )
  );
};

export default CircuitoHivePage;
