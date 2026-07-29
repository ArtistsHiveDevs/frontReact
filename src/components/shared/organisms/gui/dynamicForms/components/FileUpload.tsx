import { Avatar, AvatarGroup, Box, IconButton, InputLabel, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ComponentGeneratorParams } from '../DynamicControl';

export const TRANSLATION_BASE_GLOBAL_DICT_ACTIONS = 'app.global_dictionary.actions';

export enum FileUploaderOptions {
  addItem,
  removeItem
} 

export const createFileUpload = (params: ComponentGeneratorParams) => {
  const { translateText } = useI18n();

  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

  const { fieldData, formContext: externalContext, handlers } = params;

  const hookContext = useFormContext();
  const finalContext = externalContext || hookContext;
  const { register, formState } = finalContext;
  const { errors } = formState || {};

  const { label, fieldName, options = [], config, componentParams } = fieldData || {};

  const { multipleFiles, accept, useIcons, iconName, destinationPath = '' } = componentParams || {};
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (event: any) => {
    const newList = event?.target?.files || {};
    const values = [...selectedFiles, ...Object.values(newList)];

    const tempValues = values.map((file: any) => {
      file['customUrl'] = URL.createObjectURL(file);
      return file;
    });

    setSelectedFiles(tempValues);
    if (handlers && handlers[`${fieldName}_filesChanged`]) {
      handlers[`${fieldName}_filesChanged`]({files: values, optionType: FileUploaderOptions.addItem, destinationPath });
    }
  };

  const handleRemoveItem = (index: number) => {
    selectedFiles.splice(index, 1);
    handlers[`${fieldName}_filesChanged`]({files: selectedFiles, optionType: FileUploaderOptions.removeItem, destinationPath});
  };

  const avatarSize = 100;
  const uploadIconSize = 60;
  const subtitleCardLimits = 15;

  config.value = selectedFiles;

  const substringTextFormat = (text: string, limit: number) => {
    return text.length <= limit ? text : text.substr(0, limit) + '...';
  };

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          p: 2,
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          '&::-webkit-scrollbar': { height: 8 },
          '&::-webkit-scrollbar-thumb': { backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: 4 },
        }}
      >
        <Paper
          variant="outlined"
          sx={{
            minWidth: 150,
            height: 150,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 2,
            transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)', // Increases size by 5%
                boxShadow: 6, // Mimics rising elevation
              },
          }}
        >
          <Button
            sx={{
              width: '100%',
              height: '100%',
              flexDirection: 'column',
              '& .MuiButton-startIcon': {
                margin: 0,
              },
            }}
            component="label"
            startIcon={
              <DynamicIcons
                iconName={!useIcons ? 'md MdAddPhotoAlternate' : 'BiSolidFilePlus'}
                size={uploadIconSize}
                customStyle={{ padding: 0 }}
              />
            }
          >
            {translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.upload`)}
            <input
              accept={accept}
              type="file"
              multiple={multipleFiles}
              {...register(fieldName, config)}
              hidden
              onChange={(event) => handleChange(event)}
            />
          </Button>
        </Paper>

        {selectedFiles.map((file, index) => (
          <Paper
            key={index}
            elevation={2}
            sx={{
              minWidth: 150,
              height: 150,
              flexShrink: 0,
              overflow: 'hidden',
              borderRadius: 2,
              position: 'relative',
              transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
              '&:hover': {
                transform: 'scale(1.05)', // Increases size by 5%
                boxShadow: 6, // Mimics rising elevation
              },
            }}
          >
            {useIcons ? (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  flexDirection: 'column',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <DynamicIcons
                  iconName={iconName || 'FaFileAlt'}
                  size={avatarSize}
                  customStyle={{
                    cursor: 'pointer',
                    display: 'flex',
                    height: '100%',
                    'align-items': 'center',
                    'padding-top': '12px',
                  }}
                  onClick={() => handleRemoveItem(index)}
                />
                <span>{substringTextFormat(file.name, subtitleCardLimits)}</span>
              </div>
            ) : (
              <img
                src={file?.customUrl || null}
                alt={`gallery-item-${index}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )}

            <IconButton
              size="small"
              aria-label="delete image"
              sx={{
                position: 'absolute',
                top: -15,
                right: -8,
              }}
            >
              <DynamicIcons
                iconName="FaTimesCircle"
                size={25}
                customStyle={{ cursor: 'pointer' }}
                onClick={() => handleRemoveItem(index)}
              />
            </IconButton>
          </Paper>
        ))}
      </Box>

      <InputLabel id={`label_${fieldName}`} required={!!config?.required} error={!!errors[fieldName]}>
        {label}
      </InputLabel>
      {/* <AvatarGroup max={4}>
        {!!selectedFiles &&
          selectedFiles.map((file, index) => (
            <Avatar
              alt={file.name}
              src={URL.createObjectURL(file)}
              variant="square"
              key={`${fieldName}-file-${index}`}
              sx={{ width: avatarSize, height: avatarSize, margin: 'auto' }}
            />
          ))}
      </AvatarGroup> */}
      {/* <Button component="label" variant="contained" startIcon={<DynamicIcons iconName="BsCloudArrowUp" />}>
        {translateText(`${TRANSLATION_BASE_GLOBAL_DICT_ACTIONS}.upload`)}
        <input
          accept={accept}
          type="file"
          multiple={multipleFiles}
          {...register(fieldName, config)}
          hidden
          onChange={(event) => handleChange(event)}
        />
        <VisuallyHiddenInput
          type="file"
          {...register(fieldName, config)}
          multiple={multipleFiles}
          accept={accept}
          onChange={(event) => handleChange(event)}
        />
      </Button> */}
    </>
  );
};
