import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import palette from 'theme/palette';
import { GET_ORG_TASK_TEMPLATES } from 'graphql/queries';
import { useLazyQuery } from '@apollo/client';
import { useOrgBoard } from 'utils/hooks';
import FormBody from '../FormBody';
import {
  CategoryDiv,
  CategoryText,
  LeftColumnText,
  StyledGrid,
  TemplateDiv,
  TemplateDivDescription,
  TemplateTitle,
} from './styles';
import { PRESET_TEMPLATES } from './utils';

const ORG_TYPE_TEMPLATE = 'Org';
const TemplateBody = ({
  form,
  initialRecurrenceValue,
  initialRecurrenceType,
  existingTask,
  entityType,
  handleClose,
  isSubtask,
  fileUploadLoading,
  setFileUploadLoading,
  setTurnTaskToBountyModal,
  formValues,
  fetchedUserPermissionsContext,
  handlePodChange,
  pods,
  ref,
}) => {
  const [initialDescription, setInitialDescription] = useState(null);
  const [templateType, setTemplateType] = useState(null);
  const [getOrgTaskTemplates, { data: orgTemplatesData, loading }] = useLazyQuery(GET_ORG_TASK_TEMPLATES, {
    fetchPolicy: 'cache-and-network',
  });
  // Get org and pod templates
  const presetTemplates = PRESET_TEMPLATES;
  const templateTypes = Object.keys(presetTemplates);
  const orgTaskTemplates = orgTemplatesData?.getOrgTaskTemplates;
  useEffect(() => {
    if (orgTaskTemplates?.length > 0) {
      setTemplateType(ORG_TYPE_TEMPLATE);
    } else if (templateTypes) {
      setTemplateType(templateTypes[0]);
    }
  }, [orgTaskTemplates]);

  useEffect(() => {
    if (form?.values.orgId) {
      getOrgTaskTemplates({
        variables: {
          orgId: form?.values.orgId,
        },
      });
    }
  }, [form?.values.orgId]);

  const orgBoard = useOrgBoard();
  return (
    <Grid container>
      <StyledGrid item sm={3} md={2}>
        {orgTaskTemplates?.length > 0 && (
          <>
            <LeftColumnText>User Created</LeftColumnText>
            <CategoryDiv
              style={{
                background: templateType === ORG_TYPE_TEMPLATE ? palette.grey78 : 'none',
              }}
              onClick={() => setTemplateType(ORG_TYPE_TEMPLATE)}
            >
              <CategoryText>{orgBoard?.orgData?.name} templates</CategoryText>
            </CategoryDiv>
          </>
        )}

        <LeftColumnText
          style={{
            marginTop: '24px',
          }}
        >
          Explore Categories
        </LeftColumnText>
        {templateTypes.map((key, template) => (
          <CategoryDiv
            key={key}
            style={{
              background: key === templateType ? palette.grey78 : 'none',
            }}
            onClick={() => setTemplateType(key)}
          >
            <CategoryText>{key}</CategoryText>
          </CategoryDiv>
        ))}
      </StyledGrid>
      <StyledGrid item sm={9} md={5}>
        <TemplateTitle>{templateType} Templates</TemplateTitle>
        <TemplateDivDescription
          style={{
            marginBottom: '20px',
          }}
        >
          P.S Clicking on the templates will overwrite your changes!
        </TemplateDivDescription>
        {templateType && (
          <>
            {templateType === ORG_TYPE_TEMPLATE && orgTaskTemplates?.length > 0 && (
              <>
                {orgTaskTemplates?.map((template) => (
                  <TemplateDiv
                    key={template?.title}
                    onClick={() => {
                      form.setFieldValue('title', template?.title);
                      form.setFieldValue('points', template?.points);
                      form.setFieldValue('orgId', template?.orgId);
                      form.setFieldValue('podId', template?.podId);
                      if (template?.rewards?.[0]) {
                        form.setFieldValue('rewards', [
                          { ...template?.rewards?.[0], rewardAmount: template?.rewards?.[0].rewardAmount },
                        ]);
                      }
                      form.setFieldValue('assigneeId', template?.assignee);
                      form.setFieldValue(
                        'reviewerIds',
                        template?.reviewer?.map((reviewerId) => reviewerId.id)
                      );
                      form.setFieldValue('description', JSON.parse(template?.description));
                      setInitialDescription(JSON.parse(template?.description));
                      setTimeout(() => {
                        setInitialDescription(null);
                      }, 0);
                    }}
                  >
                    <TemplateTitle>{template?.title}</TemplateTitle>
                    <TemplateDivDescription>
                      <PlateRichTextViewer text={template?.description} />
                    </TemplateDivDescription>
                  </TemplateDiv>
                ))}
              </>
            )}
            {templateType !== ORG_TYPE_TEMPLATE && (
              <>
                {presetTemplates[templateType]?.templates.map((template) => (
                  <TemplateDiv
                    key={template?.title}
                    onClick={() => {
                      form.setFieldValue('title', template?.title);
                      form.setFieldValue('description', template?.description);
                      setInitialDescription(template?.description);
                      setTimeout(() => {
                        setInitialDescription(null);
                      }, 0);
                    }}
                  >
                    <TemplateTitle>{template?.title}</TemplateTitle>
                    <TemplateDivDescription>
                      <PlateRichTextViewer text={JSON.stringify(template?.description)} />
                    </TemplateDivDescription>
                  </TemplateDiv>
                ))}
              </>
            )}
          </>
        )}
      </StyledGrid>
      <Box
        component={StyledGrid}
        style={{
          paddingLeft: '0',
        }}
        item
        md={5}
        sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}
      >
        <FormBody
          form={form}
          initialRecurrenceValue={initialRecurrenceValue}
          initialRecurrenceType={initialRecurrenceType}
          existingTask={existingTask}
          pods={pods}
          ref={ref}
          entityType={entityType}
          handleClose={handleClose}
          isSubtask={isSubtask}
          fileUploadLoading={fileUploadLoading}
          setFileUploadLoading={setFileUploadLoading}
          setTurnTaskToBountyModal={setTurnTaskToBountyModal}
          formValues={formValues}
          fetchedUserPermissionsContext={fetchedUserPermissionsContext}
          handlePodChange={handlePodChange}
          initialDescription={initialDescription}
        />
      </Box>
    </Grid>
  );
};

export default TemplateBody;
