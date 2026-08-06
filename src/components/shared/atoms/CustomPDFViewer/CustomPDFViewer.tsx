import { Box, Button, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { getUrlS3 } from '~/common/utils/amplify/storage/storage.helpers';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import './CustomPDFViewer.scss';

export const CustomPDFViewer = (props: any) => {
  const { fileSources } = props;
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPDFUrl] = useState('');
  const [filesUrls, setFilesUrls] = useState<{ [profileIdentifier: string]: string }>({});

  const iconSize = 60;
  const subtitleCardLimits = 25;

  useEffect(() => {
    if (fileSources && Array.isArray(fileSources)) {
      getProfilePicURLs();
    }
  }, [fileSources]);
  const getProfilePicURLs = async () => {
    if (fileSources && Array.isArray(fileSources)) {
      const urlsObject: { [identifier: string]: string } = {};

      // Mapeamos las URLs a promesas y usamos Promise.all para esperar a que todas se resuelvan
      const urlPromises = fileSources.map(async (imageParams: any) => {
        const url = await getUrlS3({ path: imageParams.src });
        urlsObject[imageParams.src] = url;
      });

      // Esperamos a que todas las promesas terminen
      await Promise.all(urlPromises);

      // Una vez que se resuelvan, actualizamos el estado
      setFilesUrls(urlsObject);
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
  };

  return (
    <>
      {!!filesUrls && !showPDF && (
        <Box className="box-document-avatar">
          {fileSources && Array.isArray(fileSources) && fileSources.map((file: any, index: number) => (
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
        title="Visor de PDF"
        fullScreen
        isOpenDialog={showPDF}
        onClose={handleClickPDFHide}
        content={<Box component="iframe" src={pdfUrl} title="Overlay Example" className="render-pdf-container" />}
      />
    </>
  );
};
