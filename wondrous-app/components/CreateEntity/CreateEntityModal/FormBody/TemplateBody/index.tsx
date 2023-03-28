import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import { deserializeRichText } from 'components/PlateRichEditor';
import palette from 'theme/palette';
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
import FormBody from '..';

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
  const [taskToView, setTaskToView] = useState(null);
  const [taskToViewType, setTaskToViewType] = useState(null);
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
        {templateType &&
          presetTemplates[templateType]?.templates.map((template) => (
            <TemplateDiv key={template?.title}>
              <TemplateTitle>{template?.title}</TemplateTitle>
              <TemplateDivDescription>
                <PlateRichTextViewer text={JSON.stringify(template?.description)} />
              </TemplateDivDescription>
            </TemplateDiv>
          ))}
      </StyledGrid>
      <StyledGrid
        style={{
          paddingLeft: '0',
        }}
        item
        xs={0}
        sm={0}
        md={5}
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
        />
      </StyledGrid>
    </Grid>
  );
};

export default TemplateBody;
