import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import palette from 'theme/palette';
import { GET_ORG_TASK_TEMPLATES } from 'graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_TASK_TEMPLATE } from 'graphql/mutations';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';
import FormBody from '../FormBody';
import {
  CategoryDiv,
  CategoryText,
  LeftColumnText,
  StyledGrid,
  TaskTemplateCountDiv,
  TemplateDiv,
  TemplateDivDescription,
  TemplateSelectText,
  TemplateTitle,
} from './styles';
import { PRESET_TEMPLATES } from './utils';
import TemplateEllipsesIcon from '../Templates/TaskTemplatePicker/TemplateEllipsesIcon';
import {
  CreateEntityApplicationsSelectRender,
  CreateEntityOption,
  CreateEntityOptionLabel,
  CreateEntitySelect,
  CreateEntitySelectArrowIcon,
} from '../styles';

const ORG_TYPE_TEMPLATE = 'Org';
const TEMPLATE_ENTITY_TYPES = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.BOUNTY];
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
  setTaskTemplate,
  board,
  ref,
}) => {
  const [initialDescription, setInitialDescription] = useState(null);
  const [orgTemplateOpenOnce, setOrgTemplateOpenOnce] = useState(null);
  const [templateType, setTemplateType] = useState(null);
  const [getOrgTaskTemplates, { data: orgTemplatesData }] = useLazyQuery(GET_ORG_TASK_TEMPLATES, {
    fetchPolicy: 'cache-and-network',
  });

  const [deleteTaskTemplate] = useMutation(DELETE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates'],
  });

  const handleDeleteTemplate = (templateId) => {
    deleteTaskTemplate({
      variables: {
        taskTemplateId: templateId,
      },
    });
  };
  // Get org and pod templates
  const presetTemplates = PRESET_TEMPLATES;
  const templateTypes = Object.keys(presetTemplates);
  const orgTaskTemplates = orgTemplatesData?.getOrgTaskTemplates;
  useEffect(() => {
    if (orgTaskTemplates?.length > 0 && !orgTemplateOpenOnce) {
      setTemplateType(ORG_TYPE_TEMPLATE);
      setOrgTemplateOpenOnce(true);
    } else if (!templateType && templateTypes) {
      setTemplateType(templateTypes[0]);
    }
  }, [orgTaskTemplates, templateType, orgTemplateOpenOnce]);

  useEffect(() => {
    if (form?.values.orgId) {
      getOrgTaskTemplates({
        variables: {
          orgId: form?.values.orgId,
        },
      });
    }
  }, [form?.values.orgId]);
  const setTemplate = (template) => {
    setTaskTemplate(template?.id);
    form.setFieldValue('title', template?.title);
    form.setFieldValue('points', template?.points);
    form.setFieldValue('orgId', template?.orgId);
    form.setFieldValue('podId', template?.podId);
    if (template?.rewards?.[0]) {
      form.setFieldValue('rewards', [{ ...template?.rewards?.[0], rewardAmount: template?.rewards?.[0].rewardAmount }]);
    }
    form.setFieldValue('assigneeId', template?.assigneeId);
    form.setFieldValue(
      'reviewerIds',
      template?.reviewer?.map((reviewerId) => reviewerId.id)
    );
    form.setFieldValue('description', JSON.parse(template?.description));
    setInitialDescription(JSON.parse(template?.description));
    setTimeout(() => {
      setInitialDescription(null);
    }, 0);
  };
  const { pageData, setPageData } = useGlobalContext();
  return (
    <Grid container>
      <StyledGrid item sm={3} md={2}>
        <>
          <LeftColumnText>Creating</LeftColumnText>
          <CreateEntitySelect
            style={{
              background: palette.grey940,
            }}
            name="task-template-type"
            value={entityType}
            renderValue={() => (
              <CreateEntityApplicationsSelectRender>
                <TemplateSelectText>{entityType}</TemplateSelectText>
                <CreateEntitySelectArrowIcon />
              </CreateEntityApplicationsSelectRender>
            )}
            onChange={(value) => {
              setPageData({ ...pageData, createEntityType: value });
            }}
          >
            {TEMPLATE_ENTITY_TYPES.map((templateEntityType, idx) => (
              <CreateEntityOption key={idx} value={templateEntityType}>
                <CreateEntityOptionLabel
                  style={{
                    textTransform: 'capitalize',
                  }}
                >
                  {templateEntityType}
                </CreateEntityOptionLabel>
              </CreateEntityOption>
            ))}
          </CreateEntitySelect>
        </>

        {orgTaskTemplates?.length > 0 && (
          <>
            <LeftColumnText
              style={{
                marginTop: '24px',
              }}
            >
              User Created
            </LeftColumnText>
            <CategoryDiv
              style={{
                background: templateType === ORG_TYPE_TEMPLATE ? palette.grey78 : 'none',
              }}
              onClick={() => setTemplateType(ORG_TYPE_TEMPLATE)}
            >
              <CategoryText>{board?.orgData?.name} templates</CategoryText>
              <div
                style={{
                  flex: 1,
                }}
              />
              <TaskTemplateCountDiv>
                <CategoryText>{orgTaskTemplates?.length}</CategoryText>
              </TaskTemplateCountDiv>
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
                      setTemplate(template);
                    }}
                  >
                    <TemplateTitle>{template?.title}</TemplateTitle>
                    <TemplateDivDescription>
                      <PlateRichTextViewer text={template?.description} />
                    </TemplateDivDescription>
                    <TemplateEllipsesIcon
                      templateId={template?.id}
                      handleEditTemplate={() => setTemplate(template)}
                      handleDeleteTemplate={() => handleDeleteTemplate(template?.id)}
                    />
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
                      setTaskTemplate(null);
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
