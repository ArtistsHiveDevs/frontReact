import { Box, Button, IconButton, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { getFilesUrls, getUrlS3 } from '~/common/utils/amplify/storage/storage.helpers';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import './CustomPDFViewer.scss';

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export const CustomPDFViewer = (props: any) => {
  const { fileSources } = props;
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPDFUrl] = useState('');
  const [filesUrls, setFilesUrls] = useState<{ [profileIdentifier: string]: string }>({});
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [isFullScreen, setIsFullScreen] = useState<boolean>(false);
  const [fitMode, setFitMode] = useState<'width' | 'page'>('width');

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
    setPageNumber(1);
  };

  const handleClickPDFHide = () => {
    setPDFUrl('');
    setShowPDF(false);
    setPageNumber(1);
    setScale(1.0);
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset: number) => {
    setPageNumber((prevPageNumber) => prevPageNumber + offset);
  };

  const previousPage = () => {
    changePage(-1);
  };

  const nextPage = () => {
    changePage(1);
  };

  const zoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;

    // Obtener el nombre del archivo desde fileSources
    const currentFile = fileSources?.find((file: any) => filesUrls[file?.src] === pdfUrl);
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

  const toggleFullScreen = () => {
    const elem = document.documentElement;

    if (!document.fullscreenElement) {
      elem.requestFullscreen?.();
      setIsFullScreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullScreen(false);
    }
  };

  const toggleFitMode = () => {
    setFitMode((prev) => (prev === 'width' ? 'page' : 'width'));
  };

  return (
    <>
      {!!filesUrls && !showPDF && (
        <Box className="box-document-avatar">
          {fileSources &&
            Array.isArray(fileSources) &&
            fileSources.map((file: any, index: number) => (
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
        title="PDF"
        fullScreen
        isOpenDialog={showPDF}
        onClose={handleClickPDFHide}
        content={
          <Box className="pdf-viewer-container">
            <Box className="pdf-controls">
              {/* Navegación de páginas */}
              <Box className="pdf-controls-group">
                <IconButton onClick={previousPage} disabled={pageNumber <= 1} size="small">
                  <DynamicIcons iconName="io5 IoChevronBackOutline" size={18} />
                </IconButton>
                <span className="page-info">
                  {pageNumber} / {numPages}
                </span>
                <IconButton onClick={nextPage} disabled={pageNumber >= numPages} size="small">
                  <DynamicIcons iconName="io5 IoChevronForwardOutline" size={18} />
                </IconButton>
              </Box>

              {/* Controles de zoom */}
              <Box className="pdf-controls-group">
                <IconButton onClick={zoomOut} disabled={scale <= 0.5} size="small">
                  <DynamicIcons iconName="ai AiOutlineZoomOut" size={18} />
                </IconButton>
                <span className="zoom-info">{Math.round(scale * 100)}%</span>
                <IconButton onClick={zoomIn} disabled={scale >= 3.0} size="small">
                  <DynamicIcons iconName="ai AiOutlineZoomIn" size={18} />
                </IconButton>
              </Box>

              {/* Ajuste de vista */}
              <Box className="pdf-controls-group">
                <IconButton
                  onClick={toggleFitMode}
                  size="small"
                  title={fitMode === 'width' ? 'Ajustar a la página' : 'Ajustar al ancho'}
                >
                  <DynamicIcons iconName={fitMode === 'width' ? 'md MdFitScreen' : 'bi BiFullscreen'} size={18} />
                </IconButton>
              </Box>

              {/* Acciones */}
              <Box className="pdf-controls-group">
                <IconButton
                  onClick={toggleFullScreen}
                  size="small"
                  title={isFullScreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
                >
                  <DynamicIcons iconName={isFullScreen ? 'md MdFullscreenExit' : 'md MdFullscreen'} size={18} />
                </IconButton>
                <IconButton onClick={downloadPDF} size="small" title="Descargar PDF">
                  <DynamicIcons iconName="md MdDownload" size={18} />
                </IconButton>
              </Box>
            </Box>
            <Box className="pdf-content">
              <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess} loading="Cargando PDF...">
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  width={fitMode === 'width' ? window.innerWidth * 0.9 : undefined}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                />
              </Document>
            </Box>
          </Box>
        }
      />
    </>
  );
};
