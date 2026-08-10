import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { ComponentGeneratorParams, DynamicControl } from '../DynamicControl';
import { DynamicForm } from '../dynamic-form';
import { useForm, useFormContext } from 'react-hook-form';
import { useState } from 'react';
import { LandingMembers } from '~/components/shared/LandingMembers/LandingMembers';
import { FileUploaderOptions } from './FileUpload';
import { useI18n } from '~/common/utils';

export const createMembersList = (params: ComponentGeneratorParams) => {
  const { translateText } = useI18n();
  const { fieldData, handlers } = params;
  const { componentParams, config, fieldName } = fieldData;
  const { fields, dialogTitle = '', translationPath, dialogLabelAddMember } = componentParams;

  const formMethods = useForm({
    mode: 'onChange', // Validar en cada cambio
    reValidateMode: 'onChange', // Re-validar en cada cambio
  });

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberList, setMemberList] = useState([]);

  const hookContext = useFormContext();
  const finalContext = hookContext;
  const { register, formState } = finalContext;
  const { errors } = formState || {};
  const translatedFieldLabels = fields?.map((field: any) => {
    return { ...field, label: translateText(`${translationPath}.${field.label}`) };
  });

  config.value = memberList;

  const customHandlers = {
    ...handlers,
    onSubmit: (event: any) => {
      const data = [event];
      const totalValues = [...memberList, ...data];
      setMemberList(totalValues);
      setShowAddMember(false);
    },
  };

  const handleRemoveItem = (memberName: string) => {
    const data = memberList?.filter((member) => member?.memberNames !== memberName);
    setMemberList(data);
  };

  const handleLandingMembersOptionClick = (event: any) => {
    const { selectedOption, memberToRemove } = event;

    switch (selectedOption) {
      case FileUploaderOptions.addItem:
        setShowAddMember(true);
        break;

      case FileUploaderOptions.removeItem:
        handleRemoveItem(memberToRemove);
    }
  };

  return (
    <>
      <LandingMembers
        {...(register ? register(fieldName, config) : {})}
        fields={fields}
        memberList={memberList}
        enableAddButton={true}
        enableRemoveButton={true}
        translationPath={translationPath}
        handleClickEvent={(e: any) => handleLandingMembersOptionClick(e)}
      />
      <AppDialog
        title={dialogTitle}
        content={
          <DynamicForm
            fields={translatedFieldLabels}
            handlers={customHandlers}
            formMethods={formMethods}
            translationBasePath={translationPath}
            submitLabel={dialogLabelAddMember}
          />
        }
        isOpenDialog={showAddMember}
        onClose={() => setShowAddMember(false)}
        key={`dialog_${fieldData.fieldName}`}
      />
    </>
  );
};
