import { useEffect, useState } from 'react';
import { Box, Grid } from '@mui/material';
import PlateRichTextViewer from 'components/PlateRichEditor/PlateRichTextViewer';
import palette from 'theme/palette';
import { GET_ORG_TASK_TEMPLATES, GET_POD_TASK_TEMPLATES } from 'graphql/queries';
import { useLazyQuery, useMutation } from '@apollo/client';
import { DELETE_TASK_TEMPLATE } from 'graphql/mutations';
import { ENTITIES_TYPES } from 'utils/constants';
import { useGlobalContext } from 'utils/hooks';
import { SafeImage } from 'components/Common/Image';
import { values } from 'lodash';
import PodIcon from 'components/Icons/podIcon';
import FormBody from '../FormBody';
import {
  CategoryDiv,
  CategoryText,
  LeftColumnText,
  StyledGrid,
  TaskTemplateCountDiv,
  TemplateDiv,
  TemplateDivDescription,
  TemplatePodDiv,
  TemplatePodText,
  TemplateSelectText,
  TemplateTitle,
} from './styles';
import { PRESET_TEMPLATES } from './utils';
import TemplateEllipsesIcon from './icons/TemplateEllipsesIcon';
import {
  CreateEntityApplicationsSelectRender,
  CreateEntityDefaultDaoImage,
  CreateEntityOption,
  CreateEntityOptionImageWrapper,
  CreateEntityOptionLabel,
  CreateEntitySelect,
  CreateEntitySelectArrowIcon,
} from '../styles';

const ORG_TYPE_TEMPLATE = 'Org';
const POD_TYPE_TEMPLATE = 'Pod';
const TEMPLATE_ENTITY_TYPES = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.BOUNTY];

const OrgPodTemplateItem = ({ template, setTemplate, handleDeleteTemplate }) => (
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
    {template?.podId && (
      <TemplatePodDiv>
        <PodIcon
          color={template?.pod?.color}
          style={{
            width: '22px',
            height: '22px',
            borderRadius: '11px',
          }}
        />
        <TemplatePodText>{template?.pod?.name}</TemplatePodText>
      </TemplatePodDiv>
    )}
    <TemplateEllipsesIcon
      templateId={template?.id}
      handleEditTemplate={() => setTemplate(template)}
      handleDeleteTemplate={() => handleDeleteTemplate(template?.id)}
    />
  </TemplateDiv>
);

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

  const [getPodTaskTemplates, { data: podTemplatesData }] = useLazyQuery(GET_POD_TASK_TEMPLATES, {
    fetchPolicy: 'cache-and-network',
  });

  const [deleteTaskTemplate] = useMutation(DELETE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates', 'getPodTaskTemplates'],
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
  const podTaskTemplates = podTemplatesData?.getPodTaskTemplates;
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

  useEffect(() => {
    if (form?.values.podId) {
      getPodTaskTemplates({
        variables: {
          podId: form?.values.podId,
        },
      });
    }
  }, form?.values?.podId);
  const setTemplate = (template) => {
    setTaskTemplate(template);
    form.setFieldValue('title', template?.title);
    form.setFieldValue('points', template?.points);
    form.setFieldValue('orgId', template?.orgId);
    if (template?.rewards?.[0]) {
      form.setFieldValue('rewards', [{ ...template?.rewards?.[0], rewardAmount: template?.rewards?.[0].rewardAmount }]);
    } else {
      form.setFieldValue('rewards', []);
    }
    form.setFieldValue('assigneeId', template?.assigneeId);
    form.setFieldValue('reviewerIds', template?.reviewerIds || undefined);
    form.setFieldValue('description', JSON.parse(template?.description));
    setInitialDescription(JSON.parse(template?.description));
    setTimeout(() => {
      setInitialDescription(null);
    }, 0);
  };
  const { pageData, setPageData } = useGlobalContext();
  const orgProfilePicture = board?.orgData?.profilePicture || board?.pod?.org?.profilePicture;

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
              <CreateEntityOptionImageWrapper
                style={{
                  marginRight: '4px',
                }}
              >
                {orgProfilePicture ? (
                  <SafeImage useNextImage={false} src={orgProfilePicture} alt="Image" />
                ) : (
                  <CreateEntityDefaultDaoImage />
                )}
              </CreateEntityOptionImageWrapper>
              <CategoryText>{board?.orgData?.name || board?.pod?.org?.name}</CategoryText>
              <div
                style={{
                  flex: 1,
                }}
              />
              <TaskTemplateCountDiv>
                <CategoryText>{orgTaskTemplates?.length}</CategoryText>
              </TaskTemplateCountDiv>
            </CategoryDiv>
            {podTaskTemplates?.length > 0 && (
              <CategoryDiv
                style={{
                  background: templateType === POD_TYPE_TEMPLATE ? palette.grey78 : 'none',
                }}
                onClick={() => setTemplateType(POD_TYPE_TEMPLATE)}
              >
                <CreateEntityOptionImageWrapper
                  style={{
                    marginRight: '4px',
                  }}
                >
                  <PodIcon
                    color={board?.pod?.color}
                    style={{
                      width: '22px',
                      height: '22px',
                      borderRadius: '11px',
                    }}
                  />
                </CreateEntityOptionImageWrapper>
                <CategoryText>{board?.pod?.name}</CategoryText>
                <div
                  style={{
                    flex: 1,
                  }}
                />
                <TaskTemplateCountDiv>
                  <CategoryText>{podTaskTemplates?.length}</CategoryText>
                </TaskTemplateCountDiv>
              </CategoryDiv>
            )}
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
              paddingLeft: '6px',
            }}
            onClick={() => setTemplateType(key)}
          >
            {presetTemplates[key]?.icon}
            <CategoryText
              style={{
                marginLeft: '4px',
              }}
            >
              {key}
            </CategoryText>
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
                  <OrgPodTemplateItem
                    template={template}
                    setTemplate={setTemplate}
                    handleDeleteTemplate={handleDeleteTemplate}
                  />
                ))}
              </>
            )}
            {templateType === POD_TYPE_TEMPLATE && podTaskTemplates?.length > 0 && (
              <>
                {podTaskTemplates?.map((template) => (
                  <OrgPodTemplateItem
                    template={template}
                    setTemplate={setTemplate}
                    handleDeleteTemplate={handleDeleteTemplate}
                  />
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
                      form.setFieldValue('points', null);
                      form.setFieldValue('rewards', []);
                      form.setFieldValue('assigneeId', null);
                      form.setFieldValue('reviewerIds', undefined);
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
