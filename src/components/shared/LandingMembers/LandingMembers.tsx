import { Box, Button, IconButton, Paper, Stack } from '@mui/material';
import { I18nPaths, useI18n } from '~/common/utils';
import { DynamicIcons } from '../DynamicIcons';
import { FileUploaderOptions } from '../organisms/gui/dynamicForms';
import './LandingMembers.scss';

export interface LandingMembersInputType {
  memberList: MemberListTemplate[] | undefined;
  fields: MembersFieldTemplate[];
  enableAddButton?: boolean;
  enableRemoveButton?: boolean;
  handleClickEvent?: Function;
  boxContainerCustomStyles?: React.CSSProperties;
  cardMemberCustomStyles?: React.CSSProperties;
  translationPath?: string;
}

export interface MemberListTemplate {
  memberIdentifier: string;
  memberAttributes: KeyValueTemplate[];
}

export interface KeyValueTemplate {
  key: string;
  value: string;
}

export interface MembersFieldTemplate {
  type: string;
  fieldName: string;
  label: string;
  config?: object;
}

export interface MemberHandleClickTemplate {
  selectedOption: FileUploaderOptions;
  memberToRemove?: string;
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

  const findLabel = (externalFieldName: string) => {
    return fields?.find((field: MembersFieldTemplate) => field?.fieldName == externalFieldName)?.label;
  };

  return (
    <Box className="lm-box-container" style={boxContainerCustomStyles}>
      {enableAddButton && (
        <Paper className="lm-card-item" variant="outlined" key={`landing_add_button`}>
          <Button
            className="lm-button-add-member"
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
      {memberList?.map((member: MemberListTemplate, index: number) => (
        <>
          <Paper
            className="lm-card-item lm-card-member"
            key={`container_members_${index}`}
            variant="outlined"
            style={cardMemberCustomStyles}
          >
            <Stack key={`member_data_${index}`} spacing={2}>
              {member?.memberAttributes?.map((field: KeyValueTemplate, index: number) => (
                <div key={`${field?.key}_${index}`}>
                  {/* <strong>{field.label}:</strong> {member?.[`${field.fieldName}`]} */}
                  <strong>{translateText(`${translationPath || ''}.${findLabel(field.key)}`)}:</strong> {field?.value}
                </div>
              ))}
            </Stack>

            {enableRemoveButton && (
              <IconButton
                size="small"
                aria-label="delete image"
                className="lm-button-remove-member"
                onClick={() => {
                  if (handleClickEvent && typeof handleClickEvent === 'function') {
                    handleClickEvent({
                      selectedOption: FileUploaderOptions.removeItem,
                      memberToRemove: member?.memberIdentifier,
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
