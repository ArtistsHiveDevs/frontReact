import { Box, Button, IconButton, Paper, TextField } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { useI18n } from '~/common/utils';
import { getFilesUrls } from '~/common/utils/amplify/storage/storage.helpers';
import { DBFileDataItem } from '~/common/utils/amplify/storage/storage.types';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import './CustomPDFViewer.scss';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const CustomPDFViewer = (props: { fileSources: DBFileDataItem[] }) => {
  const { translateError } = useI18n();
  const { fileSources } = props;
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPDFUrl] = useState('');
  const [filesUrls, setFilesUrls] = useState<{ [profileIdentifier: string]: string }>({});
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [fitMode, setFitMode] = useState<'width' | 'page'>('width');

  const pageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const iconSize = 60;
  const subtitleCardLimits = 25;

  useEffect(() => {
    if (fileSources && Array.isArray(fileSources)) {
      getProfilePicURLs();
    }
  }, [fileSources]);

  const getProfilePicURLs = async () => {
    let handleServerUrls = await getFilesUrls(fileSources);
    if (fileSources && handleServerUrls) {
      setFilesUrls(handleServerUrls);
    }
  };

  const substringTextFormat = (text: string, limit: number) => {
    return text.length <= limit ? text : text.substring(0, limit) + '...';
  };

  const handleClickPDFShow = (fileSource: string) => {
    setPDFUrl(filesUrls[fileSource]);
    setShowPDF(true);
  };

  const handleClickPDFHide = () => {
    setPDFUrl('');
    setShowPDF(false);
    setPageNumber(1);
    setScale(1.0);
    setFitMode('width');
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  // Observer para detectar la página visible durante el scroll
  useEffect(() => {
    if (!showPDF || numPages === 0) return;

    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: '-50% 0px -50% 0px', // Detecta cuando la página está en el centro de la vista
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const pageNum = parseInt(entry.target.getAttribute('data-page-number') || '1', 10);
          setPageNumber(pageNum);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observar todas las páginas
    Object.values(pageRefs.current).forEach((pageElement) => {
      if (pageElement) {
        observer.observe(pageElement);
      }
    });

    return () => {
      observer.disconnect();
    };
  }, [showPDF, numPages]);

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;

    // Obtener el nombre del archivo desde fileSources
    const currentFile = fileSources?.find((file: DBFileDataItem) => filesUrls[file?.src] === pdfUrl);
    const fileName = currentFile?.fileName || 'documento.pdf';

    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const toggleFitMode = () => {
    setFitMode((prev) => (prev === 'width' ? 'page' : 'width'));
  };

  const scrollToPage = (page: number) => {
    const pageElement = pageRefs.current[page];
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const goToPreviousPage = () => {
    const newPage = Math.max(pageNumber - 1, 1);
    setPageNumber(newPage);
    scrollToPage(newPage);
  };

  const goToNextPage = () => {
    const newPage = Math.min(pageNumber + 1, numPages);
    setPageNumber(newPage);
    scrollToPage(newPage);
  };

  const handlePageInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= numPages) {
      setPageNumber(value);
      scrollToPage(value);
    }
  };

  return (
    <>
      {!fileSources?.length && (
        <Box className="box-document-avatar">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div>
              <DynamicIcons iconName="ai AiFillFileUnknown" size={iconSize} customStyle={{ padding: 0 }} />
            </div>
            <span>{translateError('NOT_AVAILABLE')}</span>
          </div>
        </Box>
      )}
      {!!filesUrls && !showPDF && (
        <Box className="box-document-avatar">
          {fileSources &&
            Array.isArray(fileSources) &&
            fileSources.map((file: DBFileDataItem, index: number) => (
              <div key={`pdf_${file}_${index}`} style={{ display: 'flex', flexDirection: 'column' }}>
                <Paper key={`${file?.fileName}-${index}`} variant="outlined" className="card-document-avatar">
                  <Button
                    className="button-document-avatar"
                    component="label"
                    startIcon={<DynamicIcons iconName="BiSolidFilePdf" size={iconSize} customStyle={{ padding: 0 }} />}
                    onClick={() => handleClickPDFShow(file?.src)}
                  ></Button>
                </Paper>
                <span>{substringTextFormat(file?.fileName, subtitleCardLimits)}</span>
              </div>
            ))}
        </Box>
      )}

      <AppDialog
        title={fileSources?.find((file: DBFileDataItem) => filesUrls[file?.src] === pdfUrl)?.fileName || 'PDF'}
        fullScreen
        isOpenDialog={showPDF}
        onClose={handleClickPDFHide}
        content={
          <Box className="pdf-viewer-container">
            <Box className="pdf-controls">
              {/* Navegación de páginas */}
              <Box className="pdf-controls-group">
                <IconButton onClick={goToPreviousPage} disabled={pageNumber <= 1} size="small" title="Página anterior">
                  <DynamicIcons iconName="md MdNavigateBefore" size={14} customStyle={{ padding: 0, margin: 0 }} />
                </IconButton>
                <TextField
                  type="number"
                  value={pageNumber}
                  onChange={handlePageInputChange}
                  size="small"
                  inputProps={{
                    min: 1,
                    max: numPages,
                    style: { textAlign: 'center', width: '30px', padding: '1px' },
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      fontSize: '10px',
                      height: '20px',
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderWidth: '1px',
                    },
                  }}
                />
                <span className="page-info">de {numPages}</span>
                <IconButton
                  onClick={goToNextPage}
                  disabled={pageNumber >= numPages}
                  size="small"
                  title="Página siguiente"
                >
                  <DynamicIcons iconName="md MdNavigateNext" size={14} customStyle={{ padding: 0, margin: 0 }} />
                </IconButton>
              </Box>

              {/* Controles de zoom */}
              <Box className="pdf-controls-group">
                <IconButton onClick={zoomOut} disabled={scale <= 0.5} size="small" title="Alejar">
                  <DynamicIcons iconName="ai AiOutlineZoomOut" size={14} customStyle={{ padding: 0, margin: 0 }} />
                </IconButton>
                <span className="zoom-info">{Math.round(scale * 100)}%</span>
                <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small" title="Acercar">
                  <DynamicIcons iconName="ai AiOutlineZoomIn" size={14} customStyle={{ padding: 0, margin: 0 }} />
                </IconButton>
              </Box>

              {/* Ajuste de vista */}
              <Box className="pdf-controls-group">
                <IconButton
                  onClick={toggleFitMode}
                  size="small"
                  title={fitMode === 'width' ? 'Ajustar a la página' : 'Ajustar al ancho'}
                >
                  <DynamicIcons
                    iconName={fitMode === 'width' ? 'md MdFitScreen' : 'bi BiFullscreen'}
                    size={14}
                    customStyle={{ padding: 0, margin: 0 }}
                  />
                </IconButton>
              </Box>

              {/* Acciones */}
              <Box className="pdf-controls-group">
                <IconButton onClick={downloadPDF} size="small" title="Descargar PDF">
                  <DynamicIcons iconName="md MdDownload" size={14} customStyle={{ padding: 0, margin: 0 }} />
                </IconButton>
              </Box>
            </Box>
            <Box className="pdf-content">
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading="Cargando PDF...">
                {Array.from(new Array(numPages), (el, index) => {
                  const page = index + 1;
                  return (
                    <div
                      key={`page_${page}`}
                      ref={(el) => (pageRefs.current[page] = el)}
                      data-page-number={page}
                      style={{ marginBottom: '20px' }}
                    >
                      <Page
                        pageNumber={page}
                        scale={fitMode === 'page' ? scale : undefined}
                        width={fitMode === 'width' ? window.innerWidth * 0.85 : undefined}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                    </div>
                  );
                })}
              </Document>
            </Box>
          </Box>
        }
      />
    </>
  );
};
