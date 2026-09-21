import { Stack } from '@mui/material';
import { FormProvider, useForm } from 'react-hook-form';
import { useI18n } from '~/common/utils';
import { AttributeConfiguration, PageSection } from '~/components/shared/organisms/gui/builders/component-types.def';
import { attributeToDynamicField } from '~/components/shared/organisms/gui/builders/page-section-form.utils';
import { DynamicControl } from '~/components/shared/organisms/gui/dynamicForms/DynamicControl';
import { OPEN_CALL_PAGE_CONFIG, OPEN_CALL_SPECIAL_INFO, OPEN_CALL_STEP_META } from './config-open-call';

interface ApplicationSurveyViewProps {
  surveyResponses: Record<string, any>;
}

interface PercentageBreakdownItem {
  value: string;
  count: number;
  percentage: number;
}

const isPercentageBreakdown = (value: any): value is PercentageBreakdownItem[] =>
  Array.isArray(value) && value.length > 0 && typeof value[0]?.percentage === 'number';

const PercentageBreakdown = ({
  items,
  resolveLabel,
}: {
  items: PercentageBreakdownItem[];
  resolveLabel: (value: string) => string;
}) => (
  <Stack spacing={0.75}>
    {items.map((item) => (
      <div key={item.value || 'unspecified'} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ minWidth: '140px' }}>{item.value ? resolveLabel(item.value) : 'No especificado'}</span>
        <div
          style={{
            flex: 1,
            height: '8px',
            borderRadius: '4px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: `${item.percentage}%`, height: '100%', backgroundColor: '#66BB6A' }} />
        </div>
        <span style={{ minWidth: '48px', textAlign: 'right' }}>{item.percentage}%</span>
      </div>
    ))}
  </Stack>
);

/**
 * Renders the OpenCall survey form in read-only mode, pre-filled with the artist's responses.
 * Reuses the same config (OPEN_CALL_PAGE_CONFIG) and DynamicControl components
 * as the original application form.
 */
const ApplicationSurveyView = ({ surveyResponses }: ApplicationSurveyViewProps) => {
  const { translateGlobalDict } = useI18n();
  const formMethods = useForm({
    defaultValues: surveyResponses,
  });

  const {
    formState: { errors },
  } = formMethods;

  const resolveAttrLabel = (attr: AttributeConfiguration, value: string): string => {
    const options = attr.optionsGetter?.({ translateFn: translateGlobalDict });
    return options?.find((option) => option.value === value)?.label ?? value;
  };

  const renderConfig = (configData: PageSection[]) => {
    return configData.map((step) => {
      const stepMeta = OPEN_CALL_STEP_META[step.name];

      return (
        <div key={step.name} style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '3rem 1rem 1rem 0rem' }}>{stepMeta?.title || step.title || step.name}</h3>

          {(step.sections || []).map((section) => (
            <Stack key={section.name} spacing={2} sx={{ mb: 2 }}>
              {(section.components || []).map((component) =>
                (component.data?.attributes || []).map((attr: AttributeConfiguration, attrIdx: number) => {
                  const fieldValue = surveyResponses[attr.name];
                  if (fieldValue === undefined || fieldValue === null) return null;
                  if (Array.isArray(fieldValue) && fieldValue.length === 0) return null;

                  return (
                    <div key={`${section.name}-${attr.name}-${attrIdx}`}>
                      {isPercentageBreakdown(fieldValue) ? (
                        <>
                          <div style={{ marginBottom: '4px', fontWeight: 'bold' }}>{attr.title}</div>
                          <PercentageBreakdown
                            items={fieldValue}
                            resolveLabel={(value) => resolveAttrLabel(attr, value)}
                          />
                        </>
                      ) : attr.displayAsPlainText ? (
                        <div>
                          <strong>{attr.title}:</strong> {fieldValue}
                        </div>
                      ) : (
                        <DynamicControl
                          fieldData={{ ...attributeToDynamicField(attr), readOnly: true }}
                          errors={errors}
                          handlers={{}}
                        />
                      )}
                    </div>
                  );
                })
              )}
            </Stack>
          ))}
        </div>
      );
    });
  };

  return (
    <FormProvider {...formMethods}>
      <div style={{ pointerEvents: 'none', opacity: 0.9 }}>
        {renderConfig(OPEN_CALL_PAGE_CONFIG)}
        {renderConfig(OPEN_CALL_SPECIAL_INFO)}
      </div>
    </FormProvider>
  );
};

export default ApplicationSurveyView;
