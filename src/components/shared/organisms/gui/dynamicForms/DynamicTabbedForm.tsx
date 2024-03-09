import { Button } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { useI18n } from "~/common/utils";
import { SectionsPanel } from "~/components/shared/layout/SectionPanel";
import { TabbedPanel } from "~/components/shared/layout/TabbedPanel";
import { ProfileHeader } from "~/components/shared/molecules/Profile/ProfileHeader";
import { EntityModel, EntityTemplate } from "~/models/base";
import {
  ProfileComponentDescriptor,
  ProfileComponentTypes,
  ProfileDetailAttributeConfiguration,
  ProfileDetailsSubpage,
  ProfileDetailsSubpageSection,
} from "../../ProfileTabsPage/profile-details.def";
import { DynamicControl } from "./DynamicControl";
import { DynamicFieldData } from "./dynamic-control-types";

const TRANSLATION_GLOBAL_DICTIONARY = "app.global_dictionary";

export interface DynamicTabbedFormParams {
  tabsInfo: ProfileDetailsSubpage[];
  handlers: { onSubmit: Function; [handlerName: string]: Function };
  translationBasePath: string;
  entityType: string;
  profileHeaderComponent?: any;
  elementData?: EntityModel<EntityTemplate>;
}
export const DynamicTabbedForm = (params: DynamicTabbedFormParams) => {
  const { tabsInfo, elementData, handlers, translationBasePath } = params;

  const { translateText } = useI18n();
  const formMethods = useForm();

  const onSubmitNotImplemented = () => {
    console.warn("onSubmit is not implemented yet");
  };
  const onSubmit: any = handlers["onSubmit"] || onSubmitNotImplemented;

  const translateSubpage = (subpage: string) => {
    return translateText(`${translationBasePath}.subpages.${subpage}.name`);
  };
  const translateSection = (subpage: string, section: string) => {
    return section
      ? translateText(
          `${translationBasePath}.subpages.${subpage}.sections.${section}.name`
        )
      : undefined;
  };

  const transformedConfig = (
    subpagesConfig: ProfileDetailsSubpage[],
    elementData?: EntityModel<EntityTemplate>
  ) => {
    return (subpagesConfig || []).map((subpage, subPageIndex) => {
      return {
        name: translateSubpage(subpage.name),
        allowedRoles: subpage.allowedRoles,
        requireSession: subpage.requireSession,
        tabContent: () => {
          //   return <h1>asdasd {subPageIndex}</h1>;

          return (
            <>
              {(subpage.sections || []).map((section, sectionIndex) => {
                // Icon Detailed Attributes

                let contentComponents: any = <></>;
                if (section.components) {
                  contentComponents = (section.components || []).map(
                    (
                      componentDescriptor: ProfileComponentDescriptor,
                      componentIndex: number
                    ) => (
                      <div
                        key={`content-comp-${subPageIndex}-${
                          sectionIndex || ""
                        }-${componentIndex}`}
                      >
                        {generateSectionFormFields(
                          subpage,
                          section,
                          componentDescriptor,
                          componentIndex,
                          handlers,
                          formMethods
                        )}
                      </div>
                    )
                  );
                }

                const sectionContent = () => contentComponents;

                return (
                  <SectionsPanel
                    sectionName={translateSection(subpage.name, section?.name)}
                    sectionContent={sectionContent}
                    key={`${subpage.name}-${section?.name}`}
                  />
                );
              })}
            </>
          );
        },
      };
    });
  };

  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="fullwidth">
      <FormProvider {...formMethods}>
        <div className="place-container">
          {/* {profileHeaderComponent || <ProfileHeader element={entityData} />} */}
          <ProfileHeader element={elementData} />
          <TabbedPanel tabs={transformedConfig(tabsInfo, elementData)} />
        </div>
      </FormProvider>
      <Button type="submit" variant="contained">
        {translateText(`${TRANSLATION_GLOBAL_DICTIONARY}.actions.submit`)}
      </Button>
    </form>
  );
};

const generateSectionFormFields = (
  subpage: ProfileDetailsSubpage,
  section: ProfileDetailsSubpageSection,
  componentDescriptor: ProfileComponentDescriptor,
  componentIndex: number,
  handlers: any,
  formMethods: any
) => {
  const fields: JSX.Element[] = [];
  const {
    handleSubmit,
    formState: { errors },
  } = formMethods;

  if (
    componentDescriptor.componentName ===
    ProfileComponentTypes.ATTRIBUTES_ICON_FIELDS
  ) {
    componentDescriptor.data?.attributes?.forEach(
      (attributeInfo: ProfileDetailAttributeConfiguration, index: number) => {
        const fieldData: DynamicFieldData = {
          inputType: "text",
          fieldName: attributeInfo.name,
        };
        const field = (
          <DynamicControl
            fieldData={fieldData}
            errors={errors}
            handlers={handlers}
            key={`${attributeInfo.name}-${index}`}
          />
        );
        fields.push(field);
      }
    );
  }

  return <>{fields}</>;
};

// export const convertTabbedProfileDetailIntoTabbedForm = (
//   subPageInfo: ProfileDetailsSubpage[]
// ) => {
//   // const fieldsData: DynamicFieldData[] = [];
//   // subPageInfo.forEach((subPageInfo) => {
//   //   // const label;
//   //   // const inputType
//   //   // const fieldName sub
//   //   // const defaultValue?: any;
//   //   // const placeholder?: string;
//   //   // const options?: SelectOption[];
//   //   // const config?: RegisterOptions;
//   //   // const componentParams?: any;
//   //   // const handlersNames?: string[];
//   //   // const error
//   //   // const inputType = ControlType.
//   //   // return {
//   //   //   label;
//   //   //   inputType: ControlType;
//   //   //   fieldName: string;
//   //   //   defaultValue?: any;
//   //   //   placeholder?: string;
//   //   //   options?: SelectOption[];
//   //   //   config?: RegisterOptions;
//   //   //   componentParams?: any;
//   //   //   handlersNames?: string[];
//   //   //   error
//   //   // }
//   // });
//   // return fieldsData;
//   return
// };
