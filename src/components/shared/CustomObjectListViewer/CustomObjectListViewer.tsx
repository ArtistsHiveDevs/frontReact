import { Box, Button, IconButton, Paper, Stack } from '@mui/material';
import { I18nPaths, useI18n } from '~/common/utils';
import { DynamicIcons } from '~/components/shared/DynamicIcons';
import { ControlType, FileUploaderOptions } from '~/components/shared/organisms/gui/dynamicForms';
import './CustomObjectListViewer.scss';

export interface CustomObjectListViewerInputType {
  objectList: any;
  fields: CustomObjectListElementFieldTemplate[];
  enableAddButton?: boolean;
  enableRemoveButton?: boolean;
  handleClickEvent?: Function;
  boxContainerCustomStyles?: React.CSSProperties;
  cardCustomObjectExternalStyles?: React.CSSProperties;
  translationPath?: string;
  customCardComponent?: Function;
  enableVerticalView?: boolean;
}

export interface KeyValueTemplate {
  key: string;
  value: string;
}

export interface CustomObjectListElementFieldTemplate {
  inputType: ControlType;
  fieldName: string;
  label: string;
  config?: object;
}

export interface CustomObjectElementHandleClickTemplate {
  selectedOption: FileUploaderOptions;
  objectElementToRemove?: string;
}

export const CustomObjectListViewer = (props: CustomObjectListViewerInputType) => {
  const { translateText } = useI18n();
  const {
    objectList,
    fields,
    enableAddButton = false,
    enableRemoveButton = false,
    handleClickEvent,
    boxContainerCustomStyles,
    cardCustomObjectExternalStyles,
    translationPath,
    customCardComponent,
    enableVerticalView = false,
  } = props;

  const findLabel = (externalFieldName: string) => {
    return fields?.find((field: CustomObjectListElementFieldTemplate) => field?.fieldName == externalFieldName)?.label;
  };

  return (
    <Box className={`lm-box-container-${!enableVerticalView ? 'hor' : 'ver'}`} style={boxContainerCustomStyles}>
      {enableAddButton && (
        <Paper className="lm-card-item" variant="outlined" key={`landing_add_button`}>
          <Button
            className="lm-button-add-item"
            component="label"
            startIcon={<DynamicIcons iconName={'FaUserPlus'} size={80} customStyle={{ padding: 0 }} />}
            onClick={() => {
              if (handleClickEvent && typeof handleClickEvent === 'function') {
                handleClickEvent({ selectedOption: FileUploaderOptions.addItem });
              }
            }}
          >
            {translateText(`${I18nPaths.TRANSLATION_GLOBAL_DICTIONARY_ACTIONS}.add`)}
          </Button>
        </Paper>
      )}
      {objectList?.map((objectElement: any, index: number) =>
        !!customCardComponent ? (
          customCardComponent(objectElement)
        ) : (
          <>
            <Paper
              className="lm-card-item lm-card-item"
              key={`container_items_${index}`}
              variant="outlined"
              style={cardCustomObjectExternalStyles}
            >
              <Stack key={`item_data_${index}`} spacing={2}>
                {/* {member?.customObjectElementAttributes?.map((field: KeyValueTemplate, index: number) => ( */}
                {Object.keys(objectElement)
                  ?.filter(
                    (objectElementToFilter) =>
                      findLabel(objectElementToFilter) && objectElement?.[`${objectElementToFilter}`]?.length > 0
                  )
                  ?.map((fieldName: any, index: number) => (
                    <div key={`${fieldName?.key}_${index}`}>
                      <strong>{translateText(`${translationPath || ''}.${findLabel(fieldName)}`)}:</strong>{' '}
                      {objectElement?.[`${fieldName}`]}
                    </div>
                  ))}
              </Stack>

              {enableRemoveButton && (
                <IconButton
                  size="small"
                  aria-label="delete image"
                  className="lm-button-remove-item"
                  onClick={() => {
                    if (handleClickEvent && typeof handleClickEvent === 'function') {
                      handleClickEvent({
                        selectedOption: FileUploaderOptions.removeItem,
                        objectElementToRemove: objectElement?.internal_id,
                      });
                    }
                  }}
                >
                  <DynamicIcons iconName="FaTimesCircle" size={25} customStyle={{ cursor: 'pointer' }} />
                </IconButton>
              )}
            </Paper>
          </>
        )
      )}
    </Box>
  );
};
