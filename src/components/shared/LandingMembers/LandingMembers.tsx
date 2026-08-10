import { Box, Button, IconButton, Paper, Stack } from '@mui/material';
import { DynamicIcons } from '../DynamicIcons';
import { FileUploaderOptions } from '../organisms/gui/dynamicForms';
import './LandingMembers.scss';
import { I18nPaths, useI18n } from '~/common/utils';

export interface LandingMembersInputType {
  memberList: any;
  fields: any;
  enableAddButton?: boolean;
  enableRemoveButton?: boolean;
  handleClickEvent?: Function;
  boxContainerCustomStyles?: any;
  cardMemberCustomStyles?: any;
  translationPath?: string;
}

export const LandingMembers = (props: LandingMembersInputType) => {
  const { translateText } = useI18n();
  const {
    memberList,
    fields,
    enableAddButton = false,
    enableRemoveButton = false,
    handleClickEvent,
    boxContainerCustomStyles,
    cardMemberCustomStyles,
    translationPath,
  } = props;
  return (
    <Box className="box-container" style={boxContainerCustomStyles}>
      {enableAddButton && (
        <Paper className="card-item" variant="outlined" key={`landing_add_button`}>
          <Button
            className="button-add-member"
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
      {memberList?.map((member: any, index: number) => (
        <>
          <Paper
            className="card-item card-member"
            key={`members_${index}`}
            variant="outlined"
            style={cardMemberCustomStyles}
          >
            <Stack spacing={2}>
              {fields?.map((field: any, index: number) => (
                <div key={`${field?.fieldName}_${index}`}>
                  {/* <strong>{field.label}:</strong> {member?.[`${field.fieldName}`]} */}
                  <strong>{translateText(`${translationPath || ''}.${field.label}`)}:</strong> {member?.[`${field.fieldName}`]}
                </div>
              ))}
            </Stack>

            {enableRemoveButton && (
              <IconButton
                size="small"
                aria-label="delete image"
                className="button-remove-member"
                onClick={() => {
                  if (handleClickEvent && typeof handleClickEvent === 'function') {
                    handleClickEvent({
                      selectedOption: FileUploaderOptions.removeItem,
                      memberToRemove: member.memberNames,
                    });
                  }
                }}
              >
                <DynamicIcons iconName="FaTimesCircle" size={25} customStyle={{ cursor: 'pointer' }} />
              </IconButton>
            )}
          </Paper>
        </>
      ))}
    </Box>
  );
};
