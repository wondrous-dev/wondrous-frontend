import { useMutation } from '@apollo/client';
import { CREATE_TASK_TEMPLATE, UPDATE_TASK_TEMPLATE, DELETE_TASK_TEMPLATE } from 'graphql/mutations';
import isEmpty from 'lodash/isEmpty';
import { filterOptionsWithPermission } from '../Helpers';
import SubmitterWalletConnectSelector from '../Helpers/RequireSubmitterWalletconnect';
import TaskTemplatePicker from './TaskTemplatePicker';
import { TaskTemplatePickerWrapper } from './TaskTemplatePicker/styles';

const Templates = ({
  form,
  isMilestone,
  entityType,
  fetchedUserPermissionsContext,
  handlePodChange,
  formValues,
  paymentMethods,
  isBounty,
  pods,
}) => {
  const [createTaskTemplate] = useMutation(CREATE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates'],
  });

  const [updateTaskTemplate] = useMutation(UPDATE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates'],
  });

  const [deleteTaskTemplate] = useMutation(DELETE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates'],
  });

  const handleSubmitTemplate = (template) => {
    // editor.children = JSON.parse(template?.description);
    form.setFieldValue('title', template?.title);
    form.setFieldValue('points', template?.points);
    form.setFieldValue('orgId', template?.orgId);
    form.setFieldValue('podId', template?.podId);
    if (template?.rewards?.[0]) {
      form.setFieldValue('rewards', [{ ...template?.rewards?.[0], rewardAmount: template?.rewards?.[0].rewardAmount }]);
    }
    form.setFieldValue('assigneeId', template?.assignee);
    form.setFieldValue(
      'reviewerIds',
      template?.reviewer?.map((reviewerId) => reviewerId.id)
    );
    form.setFieldValue('description', JSON.parse(template?.description));
  };

  const handleSaveTemplate = (template_name) => {
    const rewards = isEmpty(form.values.rewards)
      ? []
      : [
          {
            paymentMethodId: form.values.rewards[0].paymentMethodId,
            rewardAmount: parseFloat(form.values.rewards[0].rewardAmount),
          },
        ];

    const description = JSON.stringify(form.values.description);
    createTaskTemplate({
      variables: {
        input: {
          title: form.values.title,
          assigneeId: form.values.assigneeId,
          reviewerIds: form.values.reviewerIds,
          rewards,
          points: parseInt(form.values.points),
          name: template_name,
          description,
          orgId: form.values.orgId,
          podId: form.values.podId,
        },
      },
    }).catch((err) => {
      console.error(err);
    });
  };

  const handleEditTemplate = (templateId) => {
    const rewards = isEmpty(form.values.rewards)
      ? []
      : [
          {
            paymentMethodId: form.values.rewards[0].paymentMethodId,
            rewardAmount: parseFloat(form.values.rewards[0].rewardAmount),
          },
        ];

    const description = JSON.stringify(form.values.description);
    updateTaskTemplate({
      variables: {
        taskTemplateId: templateId,
        input: {
          title: form.values.title,
          assigneeId: form.values.assigneeId,
          reviewerIds: form.values.reviewerIds,
          rewards,
          points: parseInt(form.values.points, 10),
          description,
          ...(isMilestone
            ? {
                podIds: form.values.podIds,
              }
            : {
                podId: form.values.podId,
              }),
        },
      },
    });
  };

  const handleDeleteTemplate = (templateId) => {
    deleteTaskTemplate({
      variables: {
        taskTemplateId: templateId,
      },
    });
  };

  return (
    <TaskTemplatePickerWrapper>
      <TaskTemplatePicker
        options={filterOptionsWithPermission(entityType, pods, fetchedUserPermissionsContext, form.values.orgId)}
        value={form.values.orgId}
        onChange={handlePodChange}
        disabled={formValues !== undefined}
        handleSubmitTemplate={handleSubmitTemplate}
        paymentMethods={paymentMethods}
        handleSaveTemplate={handleSaveTemplate}
        handleEditTemplate={handleEditTemplate}
        handleDeleteTemplate={handleDeleteTemplate}
      />
      {isBounty && (
        <SubmitterWalletConnectSelector
          setSubmitterWalletConnectSelected={() => {
            form.setFieldValue('requireSubmitterWalletConnected', !form?.values?.requireSubmitterWalletConnected);
          }}
          submitterWalletConnectSelected={form?.values?.requireSubmitterWalletConnected}
        />
      )}
      {/* {!isProposal && (
    <GR15DEICreateSelector
      setGR15DEISelected={() => {
        form.setFieldValue('GR15DEISelected', !form?.values?.GR15DEISelected);
      }}
      GR15DEISelected={form?.values?.GR15DEISelected}
    />
  )} */}
    </TaskTemplatePickerWrapper>
  );
};

export default Templates;
