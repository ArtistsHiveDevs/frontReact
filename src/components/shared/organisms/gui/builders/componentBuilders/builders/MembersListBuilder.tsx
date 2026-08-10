import { useI18n } from '~/common/utils';
import { ComponentBuilderParams } from '../types';
import { getData } from '../utils/dataExtraction';
import { LandingMembers } from '~/components/shared/LandingMembers/LandingMembers';

export const createMembersListBuiderComponent = (params: ComponentBuilderParams): JSX.Element => {
  const { componentDescriptor, entityData } = params;
  const { data: componentDescriptorData, formMetaData } = componentDescriptor || {};
  const { externalData } = componentDescriptorData;

  let memberList: any = getData(externalData, entityData);
  const fields = formMetaData?.componentParams?.fields || [];
  const translationPath = formMetaData?.componentParams?.translationPath || '';

  return (
    <>
      <LandingMembers
              fields={fields}
              memberList={[...memberList]}
              translationPath={translationPath}
            />
    </>
  );
};
