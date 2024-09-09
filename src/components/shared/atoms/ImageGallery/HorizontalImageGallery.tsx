import { Box, Dialog, DialogContent, Grid, IconButton } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { getUrlS3 } from '~/common/utils/amplify/storage/storage.helpers';
import { DynamicIcons } from '../../DynamicIcons';
import { GalleryImageParams } from './ImageGallery';

interface HorizontalImageGalleryProps {
  imagesInfo: GalleryImageParams[];
}

export const HorizontalImageGallery: React.FC<HorizontalImageGalleryProps> = ({ imagesInfo: imageUrls }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [profilePicturesURLs, setProfilePicturesURLs] = useState<{ [profileIdentifier: string]: string }>({});

  const handleClickOpen = (index: number) => {
    setSelectedIndex(index);
  };

  const handleClose = () => {
    setSelectedIndex(null);
  };

  const handlePrev = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex - 1 + imageUrls.length) % imageUrls.length);
    }
  };

  const handleNext = () => {
    if (selectedIndex !== null) {
      setSelectedIndex((selectedIndex + 1) % imageUrls.length);
    }
  };

  const handleKeyboard = (event: any) => {
    if (event.key === 'ArrowLeft') {
      handlePrev();
    } else if (event.key === 'ArrowRight') {
      handleNext();
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNext,
    onSwipedRight: handlePrev,
    // preventDefaultTouchmoveEvent: true,
    trackMouse: true, // Enable swipe with mouse for testing on desktop
  });

  useEffect(() => {
    if (!!imageUrls) {
      getProfilePicURLs();
    }
  }, [imageUrls]);
  const getProfilePicURLs = async () => {
    if (!!imageUrls) {
      const urlsObject: { [identifier: string]: string } = {};

      // Mapeamos las URLs a promesas y usamos Promise.all para esperar a que todas se resuelvan
      const urlPromises = imageUrls.map(async (imageParams) => {
        const url = await getUrlS3({ path: imageParams.src });
        urlsObject[imageParams.src] = url;
      });

      // Esperamos a que todas las promesas terminen
      await Promise.all(urlPromises);

      // Una vez que se resuelvan, actualizamos el estado
      setProfilePicturesURLs(urlsObject);
    }
  };

  return (
    Object.keys(profilePicturesURLs).length > 0 && (
      <Box>
        <Grid container spacing={2} direction="row" wrap="nowrap" style={{ overflowX: 'auto' }}>
          {(imageUrls || []).map((image, index) => {
            const { src, alt } = image;
            return (
              <Grid item key={index}>
                <Box
                  sx={{
                    width: '100px',
                    paddingTop: '100px',
                    position: 'relative',
                    backgroundColor: 'black',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleClickOpen(index)}
                >
                  <img
                    src={profilePicturesURLs[src]}
                    alt={`Thumbnail ${profilePicturesURLs[src]}`}
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)',
                      maxHeight: '100%',
                      maxWidth: '100%',
                    }}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
        <Dialog open={selectedIndex !== null} onClose={handleClose} fullWidth onKeyUp={handleKeyboard}>
          <DialogContent style={{ textAlign: 'center', position: 'relative' }} {...swipeHandlers}>
            <IconButton onClick={handleClose} style={{ position: 'absolute', top: 10, right: 10 }}>
              <DynamicIcons iconName="MdClose" />
            </IconButton>
            {selectedIndex !== null && (
              <img
                src={profilePicturesURLs[imageUrls[selectedIndex].src]}
                alt={`Image ${selectedIndex}`}
                style={{ maxWidth: '100%', maxHeight: '80vh' }}
              />
            )}
            <IconButton
              onClick={handlePrev}
              style={{ position: 'absolute', top: '50%', left: 10, transform: 'translateY(-50%)' }}
            >
              <DynamicIcons iconName="MdArrowBackIosNew" />
            </IconButton>
            <IconButton
              onClick={handleNext}
              style={{ position: 'absolute', top: '50%', right: 10, transform: 'translateY(-50%)' }}
            >
              <DynamicIcons iconName="MdArrowForwardIos" />
            </IconButton>
            {selectedIndex !== null && (
              <p>
                ({selectedIndex + 1} / {imageUrls.length})
                {!!imageUrls[selectedIndex].description && ' - ' && imageUrls[selectedIndex].description}
              </p>
            )}
          </DialogContent>
        </Dialog>
      </Box>
    )
  );
};

export default HorizontalImageGallery;
