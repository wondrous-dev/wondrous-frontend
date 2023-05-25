/* eslint-disable max-lines */
import moment from 'moment';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import CircularProgress from '@mui/material/CircularProgress';
import formatDate from 'date-fns/format';
import apollo from 'services/apollo';

import { useFormik } from 'formik';
import { CREATE_TASK_TEMPLATE, TURN_TASK_TO_BOUNTY, UPDATE_TASK_TEMPLATE } from 'graphql/mutations/task';
import { GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_MINIMAL_TASK_BY_ID } from 'graphql/queries/task';

import isEmpty from 'lodash/isEmpty';

import { ErrorText } from 'components/Common';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { getBoardType } from 'utils';
import {
  ANALYTIC_EVENTS,
  DEFAULT_CUSTOM_PROPOSAL_CHOICE_ARRAY,
  ENTITIES_TYPES,
  GR15DEICategoryName,
  PROPOSAL_VOTE_CHOICES,
} from 'utils/constants';
import { hasCreateTaskPermission } from 'utils/helpers';
import { useFullScreen, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';

import {
  TaskModalSnapshot,
  TaskModalSnapshotLogo,
  TaskModalSnapshotText,
} from 'components/Common/TaskViewModal/styles';
import { extractMentions } from 'components/PlateRichEditor/utils';
import { LINKE_PROPOSAL_TO_SNAPSHOT, UNLINKE_PROPOSAL_FROM_SNAPSHOT } from 'graphql/mutations/integration';
import { useSnapshot } from 'services/snapshot';
import { PlateProvider } from '@udecode/plate';
import { ConvertTaskToBountyModal } from './ConfirmTurnTaskToBounty';
import Footer from './Footer';
import {
  entityTypeData,
  filterOptionsWithPermission,
  formDirty,
  formValidationSchema,
  getPrivacyLevel,
  ICreateEntityModal,
  initialValues,
  privacyOptions,
  useContextValue,
  useGetAvailableUserPods,
} from './Helpers';
import { CreateEntityForm, SnapshotButtonBlock, SnapshotErrorText } from './styles';

import FormBody from './FormBody';
import TemplateBody from './TemplateBody';

import Header from './Header';

export default function CreateEntityModal(props: ICreateEntityModal) {
  const {
    entityType,
    handleClose,
    cancel,
    existingTask,
    parentTaskId,
    formValues,
    status,
    setFormDirty,
    shouldShowTemplates,
    defaults = null,
  } = props;

  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const [showTemplates, setShowTemplates] = useState(shouldShowTemplates);
  const isSubtask =
    parentTaskId !== undefined || (existingTask?.parentTaskId !== undefined && existingTask?.parentTaskId !== null);
  const isProposal = entityType === ENTITIES_TYPES.PROPOSAL;
  const isTask = entityType === ENTITIES_TYPES.TASK;
  const isMilestone = entityType === ENTITIES_TYPES.MILESTONE;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const boardType = getBoardType({
    orgBoard,
    podBoard,
    userBoard,
  });

  const initialRecurrenceValue =
    existingTask?.recurringSchema?.daily ||
    existingTask?.recurringSchema?.weekly ||
    existingTask?.recurringSchema?.monthly ||
    existingTask?.recurringSchema?.periodic;

  const initialRecurrenceType =
    existingTask?.recurringSchema &&
    Object.keys(existingTask.recurringSchema)[
      Object?.values(existingTask?.recurringSchema).indexOf(initialRecurrenceValue)
    ];

  const [recurrenceValue, setRecurrenceValue] = useState(initialRecurrenceValue);
  const [recurrenceType, setRecurrenceType] = useState(initialRecurrenceType);
  const [taskTemplateClicked, setTaskTemplateClicked] = useState(false);
  const [taskTemplate, setTaskTemplate] = useState(null);
  const router = useRouter();
  const [turnTaskToBountyModal, setTurnTaskToBountyModal] = useState(false);
  const { podId: routerPodId } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });
  const inputRef: any = useRef();
  const [getTaskById] = useLazyQuery(GET_MINIMAL_TASK_BY_ID);
  const fetchedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;
  const { data: userOrgs } = useQuery(GET_USER_ORGS, {
    fetchPolicy: 'network-only',
  });
  const filteredDaoOptions = filterOptionsWithPermission(
    entityType,
    userOrgs?.getUserOrgs,
    fetchedUserPermissionsContext,
    undefined,
    board?.podId
  );

  const { handleMutation, loading }: any = existingTask
    ? entityTypeData[entityType]?.updateMutation()
    : entityTypeData[entityType]?.createMutation();
  const [turnTaskToBounty] = useMutation(TURN_TASK_TO_BOUNTY, {
    refetchQueries: () => [
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgHomeMilestones',
      'getOrgHomeTaskObjects',
    ],
  });

  // const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  // const editor = useEditor();

  const initialPodId = !existingTask ? board?.podId || routerPodId : null;
  const form: any = useFormik({
    initialValues: initialValues({ entityType, existingTask, initialPodId, defaults }),
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: formValidationSchema,
    validate: (values) => {
      const errors: { [key: string]: any } = {};
      const selectedOrg = userOrgs?.getUserOrgs.find(({ id }) => id === values?.orgId);
      const selectedOrgModules = selectedOrg?.modules;
      const selectedOrgEntity = selectedOrgModules?.[entityType] ?? true;
      const selectedOrgPod = selectedOrgModules?.pod ?? true;
      if (!selectedOrgEntity && selectedOrgPod && !values?.podId) {
        // If a module is disabled on the org but enabled on the pod, do not create an entity without a podId.
        errors.podId = 'Pod is required';
      }
      if (!selectedOrgEntity && !selectedOrgPod) {
        // If a module is disabled on the org and the pod module is disabled on the org, show error.
        errors.orgId = `Create ${entityType} is disabled by your admin`;
      }
      return errors;
    },
    onSubmit: (values) => {
      const reviewerIds = values?.reviewerIds?.filter((i) => i !== null);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const userMentions = extractMentions(values.description);

      const points = parseInt(values.points, 10);
      const rewards = isEmpty(values.rewards)
        ? []
        : [{ ...values.rewards[0], rewardAmount: parseFloat(values.rewards[0].rewardAmount) }];
      const githubPullRequest = {
        id: values?.githubPullRequest?.id,
        title: values?.githubPullRequest?.label,
        url: values?.githubPullRequest?.url,
      };
      const filteredRewards = rewards.map((reward) => ({
        rewardAmount: reward?.rewardAmount,
        paymentMethodId: reward?.paymentMethodId,
      }));

      const {
        chooseGithubIssue,
        chooseGithubPullRequest,
        githubIssue,
        githubRepo,
        recurringSchema,
        GR15DEISelected,
        proposalVoteType,
        customProposalChoices,
        podIds,
        ...finalValues
      } = values;
      const finalPodIds = podIds?.filter((i) => i !== null);
      let categories = values?.categories?.map((category) => category.id || category);
      if (GR15DEISelected) {
        if (!categories) {
          categories = [];
        }
        categories.push(GR15DEICategoryName);
      }
      const voteType = proposalVoteType || PROPOSAL_VOTE_CHOICES.BINARY;
      const voteOptions = customProposalChoices;
      const input = {
        ...finalValues,
        reviewerIds,
        points,
        rewards: filteredRewards,
        timezone,
        userMentions,
        categories,
        // set due date to 00:00:01 to avoid timezone issues
        dueDate: values.dueDate ? formatDate(values.dueDate, `yyyy-MM-dd'T'00:00:01.000'Z'`) : null,
        ...(isProposal && {
          voteType,
          ...(voteType === PROPOSAL_VOTE_CHOICES.CUSTOM && { voteOptions }),
        }),
        description: JSON.stringify(values.description),
        ...(values?.githubPullRequest?.id && {
          githubPullRequest,
        }),
        ...(status && entityType === ENTITIES_TYPES.TASK && { status }),
        ...(recurrenceType &&
          recurrenceValue && {
            recurringSchema: {
              [recurrenceType]: recurrenceValue,
            },
          }),
        podIds: finalPodIds,
      };
      if (taskTemplateClicked && window?.analytics && process.env.NEXT_PUBLIC_PRODUCTION) {
        window?.analytics?.track(ANALYTIC_EVENTS.TASK_OR_BOUNTY_CREATED_FROM_TEMPLATE, {
          orgId: form?.values?.orgId,
          podIds: finalPodIds,
        });
      }
      handleMutation({ input, board, form, handleClose, existingTask, boardType, showTemplates });
    },
  });

  const [createTaskTemplate, { data: createdTaskTemplate, loading: createTaskLoading }] = useMutation(
    CREATE_TASK_TEMPLATE,
    {
      refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates', 'getPodTaskTemplates'],
    }
  );

  const [updateTaskTemplate, { data: updatedTaskTemplate, loading: updateTaskLoading }] = useMutation(
    UPDATE_TASK_TEMPLATE,
    {
      refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates', 'getPodTaskTemplates'],
    }
  );

  const taskTemplateSaved = createdTaskTemplate || updatedTaskTemplate;
  const taskTemplateLoading = createTaskLoading || updateTaskLoading;
  const handleSaveTemplate = () => {
    const rewards = isEmpty(form.values.rewards)
      ? []
      : [
          {
            paymentMethodId: form.values.rewards[0].paymentMethodId,
            rewardAmount: parseFloat(form.values.rewards[0].rewardAmount),
          },
        ];

    const description = JSON.stringify(form.values.description);
    if (form?.values?.podId) {
      createTaskTemplate({
        variables: {
          input: {
            title: form.values.title,
            assigneeId: form.values.assigneeId,
            reviewerIds: form.values.reviewerIds,
            rewards,
            points: parseInt(form.values.points),
            description,
            orgId: form?.values?.orgId,
            podId: form.values.podId,
          },
        },
      });
    } else {
      createTaskTemplate({
        variables: {
          input: {
            title: form.values.title,
            assigneeId: form.values.assigneeId,
            reviewerIds: form.values.reviewerIds,
            rewards,
            points: parseInt(form.values.points),
            description,
            orgId: form.values.orgId,
          },
        },
      });
    }
  };
  const handleEditTemplate = (template) => {
    const rewards = isEmpty(form.values.rewards)
      ? []
      : [
          {
            paymentMethodId: form.values.rewards[0].paymentMethodId,
            rewardAmount: parseFloat(form.values.rewards[0].rewardAmount),
          },
        ];
    const description = JSON.stringify(form.values.description);
    if (!template?.podId && form.values.podId) {
      // Create a new template for that pod
      createTaskTemplate({
        variables: {
          input: {
            title: form.values.title,
            assigneeId: form.values.assigneeId,
            reviewerIds: form.values.reviewerIds,
            rewards,
            points: parseInt(form.values.points),
            description,
            orgId: form?.values?.orgId,
            podId: form.values.podId,
          },
        },
      }).catch((err) => {
        console.error(err);
      });
    } else {
      updateTaskTemplate({
        variables: {
          taskTemplateId: template?.id,
          input: {
            title: form.values.title,
            assigneeId: form.values.assigneeId,
            reviewerIds: form.values.reviewerIds,
            rewards,
            points: parseInt(form.values.points, 10),
            description,
            ...(template?.podId && { podId: template?.podId }),
          },
        },
      });
    }
  };
  const pods = useGetAvailableUserPods(form.values.orgId);

  const { isFullScreen, toggleFullScreen } = useFullScreen();

  useContextValue(!form.values.orgId && router?.pathname.includes('/dashboard') && filteredDaoOptions[0]?.value, () =>
    existingTask
      ? form.setFieldValue('orgId', existingTask?.orgId)
      : form.setFieldValue('orgId', filteredDaoOptions[0]?.value)
  );

  useContextValue(
    !form.values.orgId &&
      (hasCreateTaskPermission({
        userPermissionsContext: fetchedUserPermissionsContext,
        orgId: board?.orgId,
        podId: board?.podId,
      }) ||
        entityType === ENTITIES_TYPES.PROPOSAL) &&
      board?.orgId,
    () => {
      const { orgData } = board || {};
      const { modules } = orgData || {};
      if (modules?.grant ?? true) {
        form.setFieldValue('orgId', board?.orgId);
      }
    }
  );

  useContextValue(formValues?.orgId && !form.values.orgId, () =>
    form.setValues({ ...form.values, orgId: formValues.orgId })
  );
  useContextValue(formValues?.podId && !form.values.podId, () =>
    form.setValues({ ...form.values, podId: formValues.podId })
  );
  useContextValue(formValues?.milestoneId && !form.values.milestoneId, () => {
    form.setFieldValue('milestoneId', formValues.milestoneId);
    form.setFieldValue('orgId', formValues.orgId);
  });
  useEffect(() => {
    if (recurrenceType && !form.values.dueDate) {
      form.setFieldValue('dueDate', moment().toDate());
    }
  }, [form.values.dueDate, recurrenceType]);

  useEffect(() => {
    form.setFieldValue(
      'reviewerIds',
      existingTask?.reviewers?.map((reviewer) => reviewer.id)
    );
    if (isTask) {
      form.setFieldValue('claimPolicy', existingTask?.claimPolicy || null);
      form.setFieldValue('shouldUnclaimOnDueDateExpiry', existingTask?.shouldUnclaimOnDueDateExpiry);
      form.setFieldValue('shouldUnclaimOnDueDateExpiry', existingTask?.shouldUnclaimOnDueDateExpiry);
    }
    if (isProposal) {
      form.setFieldValue('proposalVoteType', 'binary');
      form.setFieldValue('customProposalChoices', DEFAULT_CUSTOM_PROPOSAL_CHOICE_ARRAY);
    }
    // TODO we should add recurring to bounties and milesstone
    form.setFieldValue('points', existingTask?.points || null);
    form.setFieldValue('priority', existingTask?.priority || null);
    form.setFieldValue('milestoneId', isEmpty(existingTask?.milestoneId) ? null : existingTask?.milestoneId);
    form.setFieldValue(
      'labelIds',
      isEmpty(existingTask?.labels) ? null : existingTask?.labels?.map((label) => label.id)
    );
  }, [
    existingTask?.reviewers?.length,
    existingTask?.claimPolicy,
    existingTask?.shouldUnclaimOnDueDateExpiry,
    existingTask?.points,
    existingTask?.milestoneId,
    existingTask?.labels,
    isTask,
    isProposal,
  ]);

  useEffect(() => {
    if (isProposal) {
      form.setFieldValue('proposalVoteType', PROPOSAL_VOTE_CHOICES.BINARY);
    }
  }, [form?.values?.orgId, isProposal]);

  useEffect(() => {
    if (isSubtask && parentTaskId) {
      form.setFieldValue('parentTaskId', parentTaskId);
      getTaskById({
        variables: {
          taskId: parentTaskId,
        },
      })
        .then((data) => {
          const task = data?.data?.getTaskById;
          form.setFieldValue('orgId', task?.orgId);
          form.setFieldValue('podId', task?.podId);
          if (task?.milestoneId) {
            form.setFieldValue('milestoneId', task?.milestoneId);
          }
        })
        .catch((e) => console.error(e));
    }
  }, [parentTaskId, getTaskById, isSubtask]);

  const isInPrivatePod = getPrivacyLevel(form.values.podId, pods) === privacyOptions.private.value;

  const [snapshotId, setSnapshotId] = useState(existingTask?.snapshotId);

  const handlePodChange = (value) => {
    if (isMilestone) {
      form.setFieldValue('podIds', value?.map((value) => value.id) || []);
    } else {
      form.setFieldValue('podId', value?.id);
      form.setFieldValue('privacyLevel', getPrivacyLevel(value?.id, pods));
      form.setFieldValue('milestoneId', null);
    }
  };
  const podValue = isMilestone ? form.values.podIds : form.values.podId;
  // snapshot integration
  const {
    getOrgSnapshotInfo,
    snapshotConnected,
    snapshotErrorElement,
    snapshotLoading,
    exportTaskProposal,
    cancelProposal,
  } = useSnapshot();

  useEffect(() => {
    if (existingTask?.orgId && isProposal) {
      getOrgSnapshotInfo({
        variables: {
          orgId: existingTask?.orgId,
        },
      });
    }
  }, [getOrgSnapshotInfo, existingTask?.orgId, isProposal]);

  useEffect(() => {
    if (existingTask?.privacyLevel !== null && existingTask?.privacyLevel !== undefined) {
      form.setFieldValue('privacyLevel', existingTask?.privacyLevel);
    } else if (podBoard) {
      if (isInPrivatePod) {
        form.setFieldValue('privacyLevel', privacyOptions.private.value);
      } else if (podBoard?.privacyLevel === privacyOptions.public.value) {
        form.setFieldValue('privacyLevel', privacyOptions.public.value);
      }
    } else if (orgBoard) {
      if (orgBoard?.orgData?.privacyLevel === privacyOptions.public.value) {
        form.setFieldValue('privacyLevel', privacyOptions.public.value);
      } else {
        form.setFieldValue('privacyLevel', privacyOptions.private.value);
      }
    }
  }, [isInPrivatePod, existingTask?.privacyLevel, orgBoard, podBoard]);

  const exportProposalToSnapshot = async () => {
    const receipt = await exportTaskProposal(existingTask);
    if (!receipt) {
      return;
    }
    setSnapshotId(receipt.id);
    if (receipt && receipt.id) {
      await apollo.mutate({
        mutation: LINKE_PROPOSAL_TO_SNAPSHOT,
        variables: {
          proposalId: existingTask?.id,
          snapshotId: receipt.id,
        },
      });
    }
    // update proposal, and if successful, initiate transaction to export to snapshot
  };

  // cancel snapshot proposal
  const cancelSnapshotProposal = async () => {
    await cancelProposal(existingTask.snapshotId).then(() => {
      setSnapshotId(null);
    });
    await apollo.mutate({
      mutation: UNLINKE_PROPOSAL_FROM_SNAPSHOT,
      variables: {
        proposalId: existingTask?.id,
      },
    });
  };

  useEffect(() => {
    if (setFormDirty) {
      setFormDirty(formDirty(form));
    }
  }, [form, setFormDirty]);

  return (
    <CreateEntityForm
      style={showTemplates ? { maxWidth: '90%' } : { maxWidth: '600px' }}
      onSubmit={(e) => {
        // necessary for the plate editor
        e.preventDefault();
        form.handleSubmit(e);
      }}
      fullScreen={isFullScreen}
      data-cy="modal-create-entity"
    >
      <ConvertTaskToBountyModal
        open={turnTaskToBountyModal}
        onClose={() => setTurnTaskToBountyModal(false)}
        onConvert={() => {
          turnTaskToBounty({
            variables: {
              taskId: existingTask?.id,
            },
          })
            .then(() => {
              if (board?.org || board?.orgData) {
                if (board?.org) {
                  window.location.href = `/organization/${board?.org?.username}/boards?entity=bounty`;
                } else if (board?.orgData) {
                  window.location.href = `/organization/${board?.orgData?.username}/boards?entity=bounty`;
                }
              } else if (board?.pod || board?.podData) {
                if (board?.pod) {
                  window.location.href = `/pod/${board?.pod?.id}/boards?entity=bounty`;
                } else if (board?.podData) {
                  window.location.href = `/pod/${board?.podData?.id}/boards?entity=bounty`;
                }
              } else if (handleClose) {
                handleClose();
              }
            })
            .catch((err) => {
              console.error('err', err);
            });
        }}
      />
      <Header
        filteredDaoOptions={filteredDaoOptions}
        form={form}
        isSubtask={isSubtask}
        existingTask={existingTask}
        pods={pods}
        formValues={formValues}
        entityType={entityType}
        fetchedUserPermissionsContext={fetchedUserPermissionsContext}
        podValue={podValue}
        handlePodChange={handlePodChange}
        toggleFullScreen={toggleFullScreen}
        cancel={cancel}
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
      />
      {snapshotConnected && isProposal && (
        <SnapshotButtonBlock>
          {!snapshotId && (
            <TaskModalSnapshot onClick={exportProposalToSnapshot} disabled={snapshotLoading}>
              {snapshotLoading ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <TaskModalSnapshotLogo />

                  <TaskModalSnapshotText>Export To Snapshot</TaskModalSnapshotText>
                </>
              )}
            </TaskModalSnapshot>
          )}
          {snapshotId && (
            <TaskModalSnapshot onClick={cancelSnapshotProposal} disabled={snapshotLoading}>
              {snapshotLoading ? (
                <CircularProgress size={20} />
              ) : (
                <>
                  <TaskModalSnapshotLogo />

                  <TaskModalSnapshotText>Cancel Snapshot Proposal</TaskModalSnapshotText>
                </>
              )}
            </TaskModalSnapshot>
          )}
          {snapshotErrorElement && (
            <SnapshotErrorText>
              {snapshotErrorElement.map((elem, i) => (
                <ErrorText key={i}>{elem}</ErrorText>
              ))}
            </SnapshotErrorText>
          )}
        </SnapshotButtonBlock>
      )}
      {showTemplates ? (
        <PlateProvider initialValue={form?.values?.description}>
          <TemplateBody
            form={form}
            initialRecurrenceValue={initialRecurrenceValue}
            initialRecurrenceType={initialRecurrenceType}
            existingTask={existingTask}
            pods={pods}
            ref={inputRef}
            entityType={entityType}
            handleClose={handleClose}
            isSubtask={isSubtask}
            fileUploadLoading={fileUploadLoading}
            setFileUploadLoading={setFileUploadLoading}
            setTurnTaskToBountyModal={setTurnTaskToBountyModal}
            formValues={formValues}
            fetchedUserPermissionsContext={fetchedUserPermissionsContext}
            handlePodChange={handlePodChange}
            setTaskTemplate={setTaskTemplate}
            board={board}
            setTaskTemplateClicked={setTaskTemplateClicked}
          />
        </PlateProvider>
      ) : (
        <FormBody
          form={form}
          initialRecurrenceValue={initialRecurrenceValue}
          initialRecurrenceType={initialRecurrenceType}
          existingTask={existingTask}
          pods={pods}
          ref={inputRef}
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
      )}
      <Footer
        fileUploadLoading={fileUploadLoading}
        form={form}
        loading={loading}
        entityType={entityType}
        cancel={cancel}
        ref={inputRef}
        hasExistingTask={!!existingTask}
        showTemplates={showTemplates}
        taskTemplate={taskTemplate}
        handleEditTemplate={handleEditTemplate}
        handleSaveTemplate={handleSaveTemplate}
        taskTemplateSaved={taskTemplateSaved}
        taskTemplateLoading={taskTemplateLoading}
      />
    </CreateEntityForm>
  );
}
