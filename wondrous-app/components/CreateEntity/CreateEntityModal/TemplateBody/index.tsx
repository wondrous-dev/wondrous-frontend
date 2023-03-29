import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import palette from 'theme/palette';
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
  // Get org and pod templates
  const presetTemplates = PRESET_TEMPLATES;
  const templateTypes = Object.keys(presetTemplates);
  useEffect(() => {
    if (templateTypes) {
      setTemplateType(templateTypes[0]);
    }
  }, []);
  return (
    <Grid container>
      <StyledGrid item sm={3} md={2}>
        <LeftColumnText>User Created</LeftColumnText>
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
        {templateType &&
          presetTemplates[templateType]?.templates.map((template) => (
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
