import './CustomPDFViewer.scss';
import { useEffect, useState } from 'react';
import { DynamicIcons } from '../../DynamicIcons';
import { Box, Button, Fade, IconButton, Paper } from '@mui/material';
import { getUrlS3 } from '~/common/utils/amplify/storage/storage.helpers';

export const CustomPDFViewer = (props: any) => {
  const { fileSources } = props;
  const [showPDF, setShowPDF] = useState(false);
  const [pdfUrl, setPDFUrl] = useState('');
  const [filesUrls, setFilesUrls] = useState<{ [profileIdentifier: string]: string }>({});

  const iconSize = 60;
  const subtitleCardLimits = 25;

  useEffect(() => {
    if (!!fileSources) {
      getProfilePicURLs();
    }
  }, [fileSources]);
  const getProfilePicURLs = async () => {
    if (!!fileSources) {
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
    return text.length <= limit ? text : text.substr(0, limit) + '...';
  };

  const handleClickPDFShow = (fileSource: string) => {
    setPDFUrl(filesUrls[fileSource]);
    setShowPDF(true);
  };

  const handleClickPDFHidde = () => {
    setPDFUrl('');
    setShowPDF(false);
  };

  return (
    <>
      {!!filesUrls && !showPDF && (
        <Box
          className = 'box-document-avatar'
        >
          {fileSources?.map((file: any, index: number) => (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Paper
                key = {`${file?.fileName}-${index}`}
                variant="outlined"
                className = 'card-document-avatar'
              >
                <Button
                  className = 'button-document-avatar'
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

      {showPDF && (
        <Box
          className = 'box-pdf-viewer'
        >
          <div style={{ display: 'flex', justifyContent: 'flex-end', background: 'black' }}>
            <IconButton size="small" aria-label="delete image" onClick={() => handleClickPDFHidde()}>
              <DynamicIcons iconName="FaTimesCircle" size={25} customStyle={{ cursor: 'pointer' }} />
            </IconButton>
          </div>
          <Box
            component="iframe"
            src={pdfUrl}
            title="Overlay Example"
            className = 'render-pdf-container'
          />
        </Box>
      )}
    </>
  );
};
