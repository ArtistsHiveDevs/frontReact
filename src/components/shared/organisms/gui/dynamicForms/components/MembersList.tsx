import { AppDialog } from '~/components/shared/molecules/general/Modals/Dialog/AppDialog';
import { ComponentGeneratorParams, DynamicControl } from '../DynamicControl';
import { DynamicForm } from '../dynamic-form';
import { useForm, useFormContext } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { LandingMembers, MemberHandleClickTemplate, MembersFieldTemplate } from '~/components/shared/LandingMembers/LandingMembers';
import { FileUploaderOptions } from './FileUpload';
import { useI18n } from '~/common/utils';

export const createMembersList = (params: ComponentGeneratorParams) => {
  const { translateText } = useI18n();
  const { fieldData, handlers } = params;
  const { componentParams, config, fieldName, externalData } = fieldData;
  const { fields, dialogTitle = '', translationPath, dialogLabelAddMember } = componentParams;

  const formMethods = useForm({
    mode: 'onChange', // Validar en cada cambio
    reValidateMode: 'onChange', // Re-validar en cada cambio
  });

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberList, setMemberList] = useState([]);
  const [prechargedExternalInfo, setPrechargedExternalInfo] = useState(false);

  const hookContext = useFormContext();
  const finalContext = hookContext;
  const { register, formState, setValue } = finalContext;
  const { errors } = formState || {};
  const translatedFieldLabels = fields?.map((field: MembersFieldTemplate) => {
    return { ...field, label: translateText(`${translationPath}.${field.label}`) };
  });

  config.value = memberList;

  useEffect(() => {
    if (externalData?.length > 0 && externalData && Array.isArray(externalData) && !prechargedExternalInfo) {
      setMemberList(externalData);
      setValue?.(fieldName, externalData);
      setPrechargedExternalInfo(true);
    }
  }, [externalData]);

  const generateRandomMemberIdentifier = () => {
    return Math.random().toString(36).slice(2, 11);
  }

  const mapDynamicFormDataToModel = (customMember: any) => {
    const formatOriginalMemberData = Object.keys(customMember)?.map((memberAttr: string) => {
      return { key: memberAttr, value: customMember[`${memberAttr}`] };
    });
    return {
      memberIdentifier: generateRandomMemberIdentifier(),
      memberAttributes: formatOriginalMemberData
    }
  };

  const customHandlers = {
    ...handlers,
    onSubmit: (event: any) => {
      const data = mapDynamicFormDataToModel(event);
      const totalValues = ([...memberList, ...[data]]);
      // const totalValues = restartMemberListWithouthEl([...memberList, ...[event]]);
      setMemberList(totalValues);
      setShowAddMember(false);
      setValue?.(fieldName, totalValues, { shouldDirty: true });
    },
  };

  const handleRemoveItem = (externalIdentifier: string) => {
    const data = (memberList?.filter((member) => member?.memberIdentifier !== externalIdentifier));
    setMemberList(data);
    setValue?.(fieldName, data, { shouldDirty: true });
  };

  const handleLandingMembersOptionClick = (event: MemberHandleClickTemplate) => {
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
        handleClickEvent={(e: MemberHandleClickTemplate) => handleLandingMembersOptionClick(e)}
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
