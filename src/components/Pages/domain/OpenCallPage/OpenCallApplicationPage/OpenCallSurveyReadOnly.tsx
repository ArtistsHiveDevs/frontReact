import { Stack } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { AttributeConfiguration } from '~/components/shared/organisms/gui/builders/component-types.def';
import { attributeToDynamicField } from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { OPEN_CALL_PAGE_CONFIG, OPEN_CALL_STEP_META } from './config-open-call';

interface OpenCallSurveyReadOnlyProps {
  surveyResponses: Record<string, any>;
}

/**
 * Renders the OpenCall survey form in read-only mode, pre-filled with the artist's responses.
 * Reuses the same config (OPEN_CALL_PAGE_CONFIG) and DynamicControl components
 * as the original application form.
 */
const OpenCallSurveyReadOnly = ({ surveyResponses }: OpenCallSurveyReadOnlyProps) => {
  const formMethods = useForm({
    defaultValues: surveyResponses,
  });

  const { formState: { errors } } = formMethods;

  return (
    <FormProvider {...formMethods}>
      <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
        {OPEN_CALL_PAGE_CONFIG.map((step) => {
          const stepMeta = OPEN_CALL_STEP_META[step.name];

          return (
            <div key={step.name} style={{ marginBottom: '24px' }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '1em', opacity: 0.8 }}>
                {stepMeta?.title || step.title || step.name}
              </h4>

              {(step.sections || []).map((section) => (
                <Stack key={section.name} spacing={1.5} sx={{ mb: 2 }}>
                  {(section.components || []).map((component) =>
                    (component.data?.attributes || []).map((attr: AttributeConfiguration, attrIdx: number) => {
                      const fieldValue = surveyResponses[attr.name];
                      if (fieldValue === undefined && fieldValue === null) return null;

                      return (
                        <div key={`${section.name}-${attr.name}-${attrIdx}`}>
                          <DynamicControl
                            fieldData={attributeToDynamicField(attr)}
                            errors={errors}
                            handlers={{}}
                          />
                        </div>
                      );
                    })
                  )}
                </Stack>
              ))}
            </div>
          );
        })}
      </div>
    </FormProvider>
  );
};

export default OpenCallSurveyReadOnly;
