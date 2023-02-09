/* eslint-disable max-lines */
import moment from 'moment';
import GitHubIcon from '@mui/icons-material/GitHub';

import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import apollo from 'services/apollo';

import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import DropdownSearch from 'components/DropdownSearch';
import { useEditor } from 'components/RichText';
import Tooltip from 'components/Tooltip';
import { useFormik } from 'formik';
import {
  ATTACH_MEDIA_TO_TASK,
  REMOVE_MEDIA_FROM_TASK,
  CREATE_TASK_GITHUB_ISSUE,
  TURN_TASK_TO_BOUNTY,
  CREATE_TASK_TEMPLATE,
  UPDATE_TASK_TEMPLATE,
  DELETE_TASK_TEMPLATE,
} from 'graphql/mutations/task';
import { ATTACH_MEDIA_TO_TASK_PROPOSAL, REMOVE_MEDIA_FROM_TASK_PROPOSAL } from 'graphql/mutations/taskProposal';
import { GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_MINIMAL_TASK_BY_ID } from 'graphql/queries/task';

import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';
import cloneDeep from 'lodash/cloneDeep';

import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
// import { Editor, Transforms } from 'slate';
// import { ReactEditor } from 'slate-react';
import {
  ENTITIES_TYPES,
  TASK_STATUS_TODO,
  APPLICATION_POLICY,
  APPLICATION_POLICY_LABELS_MAP,
  GR15DEICategoryName,
  PRIORITIES,
  PROPOSAL_VOTE_CHOICES,
  DEFAULT_CUSTOM_PROPOSAL_CHOICE_ARRAY,
} from 'utils/constants';

import { hasCreateTaskPermission, transformMediaFormat } from 'utils/helpers';
import { useFullScreen, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { handleAddFile } from 'utils/media';
import { StyledChipTag } from 'components/Tags/styles';
import { GithubLink } from 'components/Settings/Github/styles';
import { ErrorText } from 'components/Common';
import Checkbox from 'components/Checkbox';

import { LINKE_PROPOSAL_TO_SNAPSHOT, UNLINKE_PROPOSAL_FROM_SNAPSHOT } from 'graphql/mutations/integration';
import { useSnapshot } from 'services/snapshot';
import {
  TaskModalSnapshot,
  TaskModalSnapshotLogo,
  TaskModalSnapshotText,
} from 'components/Common/TaskViewModal/styles';
import { useGetSubtasksForTask } from 'components/Common/TaskSubtask/TaskSubtaskList/TaskSubtaskList';
import ListBox from 'components/CreateCollaborationModal/Steps/AddTeamMembers/Listbox';
import { StyledLink } from 'components/Common/text';
import TaskPriorityToggleButton from 'components/Common/TaskPriorityToggleButton';
import PodSearch from 'components/CreateEntity/CreateEntityModal/PodSearch';
import MilestoneSearch from 'components/CreateEntity/CreateEntityModal/MilestoneSearch';
import { InputLabel } from '@mui/material';
import RichTextEditorPlate from 'components/RichTextPlate/RichTextEditor';
import { extractMentions } from 'components/RichTextPlate/utils';
import { ConvertTaskToBountyModal } from './ConfirmTurnTaskToBounty';
import {
  privacyOptions,
  filterOptionsWithPermission,
  formValidationSchema,
  useGetPaymentMethods,
  useGetOrgUsers,
  useGetOrgLabels,
  useCreateLabel,
  useGetMilestones,
  useGetCategories,
  useGetAvailableUserPods,
  useGetOrgRoles,
  getPrivacyLevel,
  useGetPodPullRequests,
  useGetPodGithubIntegrations,
  useGetEligibleReviewers,
  filterUserOptions,
  filterCategoryValues,
  entityTypeData,
  filterPaymentMethods,
  filterOrgUsers,
  filterOrgUsersForAutocomplete,
  Fields,
  handleRewardOnChange,
  ICreateEntityModal,
  initialValues,
  useContextValue,
  CreateEntityDropdown,
  CreateEntityPaymentMethodItem,
  CreateEntityTextfieldInputPointsComponent,
  CreateEntityTextfieldInputRewardComponent,
  formDirty,
  useGetProposalChoices,
} from './Helpers';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityAttachment,
  CreateEntityAttachmentIcon,
  CreateEntityAutocompleteOption,
  CreateEntityAutocompleteOptionTypography,
  CreateEntityAutocompletePopper,
  CreateEntityAutocompletePopperRenderInput,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityBody,
  CreateEntityCancelButton,
  CreateEntityCreateTaskButton,
  CreateEntityDefaultDaoImage,
  CreateEntityDefaultUserImage,
  CreateEntityDivider,
  CreateEntityDueDate,
  CreateEntityError,
  CreateEntityForm,
  CreateEntityHeader,
  CreateEntityHeaderArrowIcon,
  CreateEntityHeaderWrapper,
  CreateEntityLabel,
  CreateEntityLabelAddButton,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntityOpenInFullIcon,
  CreateEntityOption,
  CreateEntityOptionLabel,
  CreateEntityPaymentMethodOption,
  CreateEntityPaymentMethodSelect,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntityWrapper,
  CreateEntitySelect,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntitySelectWrapper,
  CreateEntityTextfield,
  CreateEntityTitle,
  EditorPlaceholder,
  EditorContainer,
  EditorToolbar,
  MediaUploadDiv,
  SnapshotButtonBlock,
  CreateEntityPaymentMethodSelected,
  CreateEntityApplicationsSelectRender,
  ApplicationInputWrapper,
  ApplicationInputUnassignContainer,
  SnapshotErrorText,
  CreateEntityPrivacySelectRenderLabelWrapper,
  CreateEntityCloseIcon,
  ProposalVoteSelect,
  ProposalVoteSelectMenuItem,
  ProposalVoteSelectMenuItemText,
  CreateEntityFooter,
} from './styles';

import { MediaItem } from '../MediaItem';
import Tags from '../../Tags';
import { SafeImage } from '../../Common/Image';
import TaskTemplatePicker from './TaskTemplatePicker';
import GR15DEICreateSelector from '../Initiatives/GR15DEI';
import { TaskTemplatePickerWrapper } from './TaskTemplatePicker/styles';
import CustomProposal from './CustomProposal';
import SubmitterWalletConnectSelector from './Helpers/RequireSubmitterWalletconnect';

export default function CreateEntityModal(props: ICreateEntityModal) {
  const { entityType, handleClose, cancel, existingTask, parentTaskId, formValues, status, setFormDirty } = props;
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const isSubtask =
    parentTaskId !== undefined || (existingTask?.parentTaskId !== undefined && existingTask?.parentTaskId !== null);
  const isProposal = entityType === ENTITIES_TYPES.PROPOSAL;
  const isTask = entityType === ENTITIES_TYPES.TASK;
  const isBounty = entityType === ENTITIES_TYPES.BOUNTY;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
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
  const router = useRouter();
  const [paymentMethodInactiveError, setPaymentMethodInactiveError] = useState(false);
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
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
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
    ],
  });

  const [createTaskTemplate] = useMutation(CREATE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates'],
  });

  const [updateTaskTemplate] = useMutation(UPDATE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates'],
  });

  const [deleteTaskTemplate] = useMutation(DELETE_TASK_TEMPLATE, {
    refetchQueries: () => ['getTaskTemplatesByUserId', 'getOrgTaskTemplates'],
  });

  // const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  // const editor = useEditor();

  const initialPodId = !existingTask ? board?.podId || routerPodId : null;
  const form: any = useFormik({
    initialValues: initialValues({ entityType, existingTask, initialPodId }),
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: formValidationSchema,
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
      const {
        chooseGithubIssue,
        chooseGithubPullRequest,
        githubIssue,
        githubRepo,
        recurringSchema,
        GR15DEISelected,
        proposalVoteType,
        customProposalChoices,
        ...finalValues
      } = values;
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
        rewards,
        timezone,
        userMentions,
        categories,
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
      };
      handleMutation({ input, board, pods, form, handleClose, existingTask });
    },
  });

  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(form.values.orgId, true));
  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(form.values.orgId);
  const activePaymentMethods = paymentMethods?.filter((p) => p.deactivatedAt === null); // payment methods that havent been deactivated
  const filteredOrgUsersData = filterOrgUsers({ orgUsersData, existingTask });
  const orgLabelsData = useGetOrgLabels(form.values.orgId);
  const handleCreateLabel = useCreateLabel(form.values.orgId, (newLabelId) =>
    form.setFieldValue('labelIds', [...form.values.labelIds, newLabelId])
  );

  const [createGithubIssue, { data: createGithubIssueData, loading: createGithubIssueLoading }] =
    useMutation(CREATE_TASK_GITHUB_ISSUE);

  const milestonesData = useGetMilestones(form.values.orgId, form.values.podId);

  const categoriesData = useGetCategories();
  const proposalChoices = useGetProposalChoices();
  const pods = useGetAvailableUserPods(form.values.orgId);
  const roles = useGetOrgRoles(form.values.orgId);

  const handleOnchangePodId = (podId) => {
    form.setValues({
      ...form.values,
      milestoneId: null,
      privacyLevel: getPrivacyLevel(podId, pods),
      podId,
    });
    form.setErrors({});
  };

  const availablePullRequests = useGetPodPullRequests(form.values.podId);
  const availableRepos = useGetPodGithubIntegrations(form.values.podId);
  const eligibleReviewers = useGetEligibleReviewers(form.values.orgId, form.values.podId);
  const filteredEligibleReviewers = eligibleReviewers.filter(
    (reviewer) => !form.values.reviewerIds?.includes(reviewer.id)
  );
  const { isFullScreen, toggleFullScreen } = useFullScreen();
  const [attachMedia] = useMutation(ATTACH_MEDIA_TO_TASK);
  const [removeMedia] = useMutation(REMOVE_MEDIA_FROM_TASK);
  const [attachTaskProposalMedia] = useMutation(ATTACH_MEDIA_TO_TASK_PROPOSAL);
  const [removeTaskProposalMedia] = useMutation(REMOVE_MEDIA_FROM_TASK_PROPOSAL);

  const handleMedia = () => {
    if (entityType === ENTITIES_TYPES.PROPOSAL) {
      return {
        attach: attachTaskProposalMedia,
        remove: removeTaskProposalMedia,
      };
    }
    return { attach: attachMedia, remove: removeMedia };
  };

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
    () => form.setFieldValue('orgId', board?.orgId)
  );

  useContextValue(formValues?.orgId && !form.values.orgId, () =>
    form.setValues({ ...form.values, orgId: formValues.orgId })
  );
  useContextValue(formValues?.podId && !form.values.podId, () =>
    form.setValues({ ...form.values, podId: formValues.podId })
  );
  useContextValue(formValues?.milestoneId && !form.values.milestoneId, () =>
    form.setValues({
      ...form.values,
      orgId: formValues.orgId,
      podId: formValues.podId,
      milestoneId: formValues.milestoneId,
    })
  );
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
  const noGithubTies = !existingTask?.githubIssue && !existingTask?.githubPullRequest;

  const getRoleDataById = (id) => roles?.find((role) => role.id === id);

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
          podId: form.values.podId,
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

  const [snapshotId, setSnapshotId] = useState(existingTask?.snapshotId);

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

  const selectedPaymentMethod = paymentMethods.filter((p) => p.id === form.values?.rewards?.[0]?.paymentMethodId);

  useEffect(() => {
    if (selectedPaymentMethod?.length > 0) {
      setPaymentMethodInactiveError(false);
      if (selectedPaymentMethod?.[0]?.deactivatedAt) {
        setPaymentMethodInactiveError(true);
      }
    }
  }, [selectedPaymentMethod]);

  const handlePaymentMethodRedirect = () => {
    handleClose();
    router.push(`/organization/settings/${form.values.orgId}/payment-method`);
  };

  const subTasks = useGetSubtasksForTask({ taskId: existingTask?.id, status: TASK_STATUS_TODO });
  const hasSubTasks = subTasks?.data?.length > 0;
  const canTurnIntoBounty = !hasSubTasks && !isSubtask && existingTask?.type === ENTITIES_TYPES.TASK;

  useEffect(() => {
    if (setFormDirty) {
      setFormDirty(formDirty(form));
    }
  }, [form, setFormDirty]);

  return (
    <CreateEntityForm
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
      <CreateEntityHeader>
        <CreateEntityHeaderWrapper showOnSmallScreen hideOnLargeScreen={false}>
          <CreateEntitySelectErrorWrapper>
            <CreateEntityDropdown
              name="orgId"
              options={filteredDaoOptions}
              onChange={(orgId) => {
                // NOTE: This will reset the data that depends on the orgId
                form.setValues({
                  ...form.initialValues,
                  points: form.values.points,
                  dueDate: form.values.dueDate,
                  title: form.values.title,
                  description: form.values.description,
                  mediaUploads: form.values.mediaUploads,
                  orgId,
                });
                form.setErrors({});
              }}
              value={form.values.orgId}
              DefaultImageComponent={CreateEntityDefaultDaoImage}
              error={form.errors.orgId}
              onFocus={() => form.setFieldError('orgId', undefined)}
              disabled={isSubtask || existingTask || formValues !== undefined}
            />
            {form.errors.orgId && <CreateEntityError>{form.errors.orgId}</CreateEntityError>}
          </CreateEntitySelectErrorWrapper>
          {form.values.orgId !== null && (
            <>
              <CreateEntityHeaderArrowIcon />
              <PodSearch
                options={filterOptionsWithPermission(
                  entityType,
                  pods,
                  fetchedUserPermissionsContext,
                  form.values.orgId
                )}
                value={form.values.podId}
                onChange={handleOnchangePodId}
                disabled={isSubtask || formValues !== undefined}
              />
            </>
          )}
        </CreateEntityHeaderWrapper>
        <CreateEntityHeaderWrapper>
          <Tooltip title="Full screen" placement="top">
            <Box>
              <CreateEntityOpenInFullIcon onClick={toggleFullScreen} />
            </Box>
          </Tooltip>
        </CreateEntityHeaderWrapper>
        <CreateEntityHeaderWrapper showOnSmallScreen hideOnLargeScreen>
          <Tooltip title="Close Modal" placement="top-end">
            <Box>
              <CreateEntityCloseIcon onClick={cancel} />
            </Box>
          </Tooltip>
        </CreateEntityHeaderWrapper>
      </CreateEntityHeader>
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

      <CreateEntityBody>
        <CreateEntityTitle
          type="text"
          onChange={form.handleChange('title')}
          value={form.values.title}
          name="title"
          placeholder="Enter a title"
          minRows={1}
          maxRows={3}
          error={form.errors?.title}
          onFocus={() => form.setFieldError('title', undefined)}
          data-cy="create-entity-input-title"
          autoFocus
        />
        <CreateEntityError>{form.errors?.title}</CreateEntityError>

        <RichTextEditorPlate
          inputValue={form.values.description}
          mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
          onChange={(value) => {
            form.setFieldValue('description', value);
          }}
          mediaUploads={() => {
            inputRef.current.click();
          }}
          placeholder="Type ‘/’ for commands"
        />

        {/* <EditorToolbar ref={setEditorToolbarNode} /> */}
        {/* <EditorContainer */}
        {/*   onClick={() => { */}
        {/*     // since editor will collapse to 1 row on input, we need to emulate min-height somehow */}
        {/*     // to achive it, we wrap it with EditorContainer and make it switch focus to editor on click */}
        {/*     ReactEditor.focus(editor); */}
        {/*     // also we need to move cursor to the last position in the editor */}
        {/*     Transforms.select(editor, { */}
        {/*       anchor: Editor.end(editor, []), */}
        {/*       focus: Editor.end(editor, []), */}
        {/*     }); */}
        {/*   }} */}
        {/* > */}
        {/*   /!* <RichTextEditor *!/ */}
        {/*   /!*   editor={editor} *!/ */}
        {/*   /!*   onMentionChange={search} *!/ */}
        {/*   /!*   initialValue={form.values.description} *!/ */}
        {/*   /!*   mentionables={filterOrgUsersForAutocomplete(orgUsersData)} *!/ */}
        {/*   /!*   placeholder={<EditorPlaceholder>Enter a description</EditorPlaceholder>} *!/ */}
        {/*   /!*   toolbarNode={editorToolbarNode} *!/ */}
        {/*   /!*   onChange={(value) => { *!/ */}
        {/*   /!*     form.setFieldValue('description', value); *!/ */}
        {/*   /!*   }} *!/ */}
        {/*   /!*   editorContainerNode={document.querySelector('#modal-scrolling-container')} *!/ */}
        {/*   /!*   onClick={(e) => { *!/ */}
        {/*   /!*     // we need to stop click event propagation, *!/ */}
        {/*   /!*     // since EditorContainer moves cursor to the last position in the editor on click *!/ */}
        {/*   /!*     e.stopPropagation(); *!/ */}
        {/*   /!*   }} *!/ */}
        {/*   /!* /> *!/ */}
        {/* </EditorContainer> */}
        {form.errors?.description && <ErrorText>{form.errors?.description}</ErrorText>}
        <CreateEntityLabelSelectWrapper show>
          <MediaUploadDiv>
            {form.values.mediaUploads?.length > 0 &&
              form.values.mediaUploads.map((mediaItem) => (
                <MediaItem
                  key={mediaItem?.uploadSlug}
                  mediaUploads={form.values.mediaUploads}
                  setMediaUploads={(mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads)}
                  mediaItem={mediaItem}
                  removeMediaItem={() => {
                    if (existingTask) {
                      handleMedia().remove({
                        variables: {
                          ...(entityType === ENTITIES_TYPES.PROPOSAL
                            ? { proposalId: existingTask?.id }
                            : { taskId: existingTask?.id }),
                          slug: mediaItem?.uploadSlug || mediaItem?.slug,
                        },
                      });
                    }
                  }}
                />
              ))}
            <CreateEntityAttachment onClick={() => inputRef.current.click()}>
              <CreateEntityAttachmentIcon />
              Add Attachment
              {fileUploadLoading && <FileLoading />}
            </CreateEntityAttachment>
          </MediaUploadDiv>
          <input
            type="file"
            hidden
            ref={inputRef}
            onChange={async (event) => {
              const fileToAdd = await handleAddFile({
                event,
                filePrefix: 'tmp/task/new/',
                mediaUploads: form.values.mediaUploads,
                setMediaUploads: (mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads),
                setFileUploadLoading,
              });
              if (existingTask) {
                handleMedia().attach({
                  variables: {
                    ...(entityType === ENTITIES_TYPES.PROPOSAL
                      ? { proposalId: existingTask?.id }
                      : { taskId: existingTask?.id }),
                    input: {
                      mediaUploads: [fileToAdd],
                    },
                  },
                  onCompleted: (data) => {
                    const task = data?.attachTaskMedia || data?.attachTaskProposalMedia;
                    form.setFieldValue('mediaUploads', transformMediaFormat(task?.media));
                    setFileUploadLoading(false);
                  },
                });
              }
            }}
          />
          {existingTask && canTurnIntoBounty && (
            <>
              <div
                style={{
                  flex: 1,
                }}
              />
              <CreateEntityAttachment
                style={{
                  marginTop: '8px',
                  marginLeft: '16px',
                  alignSelf: 'flex-start',
                }}
                onClick={() => {
                  setTurnTaskToBountyModal(true);
                }}
              >
                Turn into bounty
              </CreateEntityAttachment>
            </>
          )}
        </CreateEntityLabelSelectWrapper>
        <CreateEntityDivider />
        {isProposal && !existingTask && form?.values?.proposalVoteType && (
          <>
            <ProposalVoteSelect value={form?.values?.proposalVoteType} label="Select voting style">
              {proposalChoices.map((option) => (
                <ProposalVoteSelectMenuItem
                  value={option?.value}
                  onClick={() => form.setFieldValue('proposalVoteType', option?.value)}
                >
                  <ProposalVoteSelectMenuItemText>{option?.label}</ProposalVoteSelectMenuItemText>
                </ProposalVoteSelectMenuItem>
              ))}
            </ProposalVoteSelect>
            {form?.values?.proposalVoteType === PROPOSAL_VOTE_CHOICES.CUSTOM && <CustomProposal form={form} />}
            <ProposalVoteSelectMenuItemText
              style={{
                marginTop: '8px',
                fontSize: '12px',
              }}
            >
              P.S In 'Multiple Choice' voting, options cannot be edited after the proposal is created
            </ProposalVoteSelectMenuItemText>
            <CreateEntityDivider />
          </>
        )}
        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.reviewer)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Reviewer</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values?.reviewerIds?.map((reviewerId, index) => {
              const hasError = form.errors?.reviewerIds?.[index];
              return (
                <CreateEntitySelectErrorWrapper key={index}>
                  <CreateEntityAutocompletePopper
                    onFocus={() => form.setFieldError('reviewerIds', undefined)}
                    openOnFocus
                    options={eligibleReviewers}
                    value={reviewerId}
                    isOptionEqualToValue={(option, value) => option.id === value}
                    renderInput={(params) => {
                      const reviewer = eligibleReviewers.find((reviewer) => reviewer.id === params.inputProps.value);
                      const shouldAutoFocus = form.values?.reviewerIds?.filter((id) => id === null)?.length > 0;
                      return (
                        <CreateEntityAutocompletePopperRenderInput
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            value: reviewer?.label,
                          }}
                          autoFocus={shouldAutoFocus}
                          ref={params.InputProps.ref}
                          disableUnderline
                          fullWidth
                          placeholder="Enter username..."
                          startAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                              {reviewer?.profilePicture ? (
                                <SafeImage useNextImage={false} src={reviewer.profilePicture} alt="Profile picture" />
                              ) : (
                                <CreateEntityDefaultUserImage />
                              )}
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                          endAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment
                              position="end"
                              onClick={() => {
                                const newReviewers = cloneDeep(form.values.reviewerIds).filter((id, i) => i !== index);
                                form.setFieldValue('reviewerIds', newReviewers);
                              }}
                            >
                              <CreateEntityAutocompletePopperRenderInputIcon />
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                        />
                      );
                    }}
                    renderOption={(props, option) => {
                      if (form.values.reviewerIds.includes(option.id) && option.id !== reviewerId) return null;
                      return (
                        <CreateEntityAutocompleteOption {...props}>
                          {option?.profilePicture ? (
                            <SafeImage useNextImage={false} src={option?.profilePicture} alt="Profile picture" />
                          ) : (
                            <CreateEntityDefaultUserImage />
                          )}
                          <CreateEntityAutocompleteOptionTypography>
                            {option?.label}
                          </CreateEntityAutocompleteOptionTypography>
                        </CreateEntityAutocompleteOption>
                      );
                    }}
                    onChange={(event, value, reason) => {
                      if (reason === 'selectOption' && !form.values.reviewerIds.includes(value.id)) {
                        const reviewerIds = cloneDeep(form.values.reviewerIds);
                        reviewerIds[index] = value.id;
                        form.setFieldValue('reviewerIds', reviewerIds);
                      }
                    }}
                    blurOnSelect
                    error={hasError}
                  />
                  {hasError && <CreateEntityError>{hasError}</CreateEntityError>}
                </CreateEntitySelectErrorWrapper>
              );
            })}
            <Tooltip
              title={isEmpty(filteredEligibleReviewers) && 'You reached the maximum no. of available reviewers'}
              placement="top"
            >
              <CreateEntityLabelAddButton
                onClick={() => {
                  if (isEmpty(filteredEligibleReviewers)) return;
                  if (!form.values.reviewerIds) {
                    form.setFieldValue('reviewerIds', [null]);
                    return;
                  }
                  form.setFieldValue('reviewerIds', form.values.reviewerIds.concat(null));
                }}
              >
                <CreateEntityAddButtonIcon />
                {(isNull(form.values.reviewerIds) || isEmpty(form.values.reviewerIds)) && (
                  <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
                )}
              </CreateEntityLabelAddButton>
            </Tooltip>
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.assignee)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Assignee</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.assigneeId !== null && (
              <CreateEntitySelectErrorWrapper>
                <CreateEntityAutocompletePopper
                  onFocus={() => form.setFieldError('assigneeId', undefined)}
                  openOnFocus
                  ListboxComponent={ListBox}
                  ListboxProps={{
                    handleFetchMore: fetchMoreOrgUsers,
                    hasMore: hasMoreOrgUsers,
                  }}
                  data-cy="input-autocomplete-assignee"
                  options={filteredOrgUsersData}
                  value={form.values.assigneeId}
                  isOptionEqualToValue={(option, value) => option.value === value}
                  renderInput={(params) => {
                    const assignee: any = filteredOrgUsersData.find(
                      (user: any) => user.value === params.inputProps.value
                    );
                    return (
                      <CreateEntityAutocompletePopperRenderInput
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          value: assignee?.label,
                        }}
                        onChange={(e) => {
                          params.inputProps.onChange(e);
                          search(e.target.value);
                        }}
                        autoFocus={!form.values.assigneeId}
                        ref={params.InputProps.ref}
                        disableUnderline
                        fullWidth
                        placeholder="Enter username..."
                        startAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                            {assignee?.profilePicture ? (
                              <SafeImage useNextImage={false} src={assignee.profilePicture} alt="Profile picture" />
                            ) : (
                              <CreateEntityDefaultUserImage />
                            )}
                          </CreateEntityAutocompletePopperRenderInputAdornment>
                        }
                        endAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment
                            position="end"
                            onClick={() => {
                              form.setFieldValue('assigneeId', null);
                            }}
                          >
                            <CreateEntityAutocompletePopperRenderInputIcon />
                          </CreateEntityAutocompletePopperRenderInputAdornment>
                        }
                      />
                    );
                  }}
                  renderOption={(props, option) => (
                    <CreateEntityAutocompleteOption {...props} data-cy={`assignee-option-${option.label}`}>
                      {option?.profilePicture ? (
                        <SafeImage useNextImage={false} src={option?.profilePicture} alt="Profile picture" />
                      ) : (
                        <CreateEntityDefaultUserImage />
                      )}
                      <CreateEntityAutocompleteOptionTypography>
                        {option?.label}
                      </CreateEntityAutocompleteOptionTypography>
                    </CreateEntityAutocompleteOption>
                  )}
                  onChange={(event, value, reason) => {
                    if (reason === 'selectOption') {
                      form.setFieldValue('assigneeId', value.value);
                    }
                  }}
                  blurOnSelect
                  error={form.errors?.assigneeId}
                />
                {form.errors?.assigneeId && <CreateEntityError>{form.errors?.assigneeId}</CreateEntityError>}
              </CreateEntitySelectErrorWrapper>
            )}
            {form.values.assigneeId === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('assigneeId', '');
                }}
                data-cy="button-add-assignee"
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>
        <ApplicationInputWrapper>
          <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.claimPolicy)}>
            <CreateEntityLabelWrapper>
              <CreateEntityLabel>Applications</CreateEntityLabel>
            </CreateEntityLabelWrapper>
            <CreateEntitySelectWrapper style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
              {form.values.claimPolicy !== null && (
                <CreateEntityWrapper>
                  <CreateEntitySelect
                    name="task-applications"
                    value={form.values.claimPolicy}
                    style={{ width: '100%' }}
                    onChange={(value) => {
                      form.setFieldValue('claimPolicy', value);
                      if (
                        value === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                        value === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value
                      )
                        form.setFieldValue('claimPolicyRoles', [roles[0]?.id]);
                    }}
                    renderValue={() => {
                      const isRolesSelected =
                        form.values.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                        form.values.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value;
                      return (
                        <CreateEntityApplicationsSelectRender>
                          <span>
                            {isRolesSelected
                              ? 'Role: '
                              : APPLICATION_POLICY_LABELS_MAP[form.values?.claimPolicy]?.title}
                          </span>
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityApplicationsSelectRender>
                      );
                    }}
                  >
                    {Object.keys(APPLICATION_POLICY).map((policy, idx) => {
                      const appPolicy = APPLICATION_POLICY[policy];
                      return (
                        <CreateEntityOption key={idx} value={appPolicy?.value}>
                          <CreateEntityOptionLabel>{appPolicy?.title}</CreateEntityOptionLabel>
                        </CreateEntityOption>
                      );
                    })}
                  </CreateEntitySelect>
                  {(form.values.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM.value ||
                    form.values.claimPolicy === APPLICATION_POLICY.ROLES_CAN_CAN_APPLY.value) && (
                    <CreateEntitySelect
                      name="task-applications-claim-roles"
                      value={form.values.claimPolicyRoles}
                      style={{ width: '100%', height: 'fit-content' }}
                      onChange={(value) =>
                        form.setFieldValue(
                          'claimPolicyRoles',
                          form.values.claimPolicyRoles ? [...form.values.claimPolicyRoles, value] : [value]
                        )
                      }
                      renderValue={() => (
                        <CreateEntityApplicationsSelectRender>
                          {form.values?.claimPolicyRoles?.map((role) => {
                            const roleData = getRoleDataById(role);
                            return (
                              <StyledChipTag
                                key={role}
                                style={{ margin: '2px' }}
                                deleteIcon={<div>&times;</div>}
                                onClick={() =>
                                  form.setFieldValue(
                                    'claimPolicyRoles',
                                    form.values?.claimPolicyRoles?.filter((claimRole) => claimRole !== role)
                                  )
                                }
                                label={roleData?.name}
                                // background={option.color}
                                variant="outlined"
                              />
                            );
                          })}
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityApplicationsSelectRender>
                      )}
                    >
                      {roles?.map((role, roleIdx) => {
                        if (form.values.claimPolicyRoles?.includes(role.id)) return null;
                        return (
                          <CreateEntityOption key={roleIdx} value={role.id}>
                            <CreateEntityOptionLabel>{role?.name}</CreateEntityOptionLabel>
                          </CreateEntityOption>
                        );
                      })}
                    </CreateEntitySelect>
                  )}
                </CreateEntityWrapper>
              )}
              {form.values.claimPolicy !== null && (
                <CreateEntityAutocompletePopperRenderInputAdornment
                  position="end"
                  onClick={() => {
                    form.setFieldValue('claimPolicy', null);
                    form.setFieldValue('claimPolicyRoles', null);
                    form.setFieldValue('shouldUnclaimOnDueDateExpiry', null);
                  }}
                >
                  <CreateEntityAutocompletePopperRenderInputIcon />
                </CreateEntityAutocompletePopperRenderInputAdornment>
              )}
              {form.touched.claimPolicy && <CreateEntityError>{form.touched.claimPolicy}</CreateEntityError>}
              {form.values.claimPolicy === null && (
                <CreateEntityLabelAddButton
                  onClick={() => {
                    form.setFieldValue('claimPolicy', APPLICATION_POLICY.ALL_MEMBERS.value);
                  }}
                >
                  <CreateEntityAddButtonIcon />
                  <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
                </CreateEntityLabelAddButton>
              )}
            </CreateEntitySelectWrapper>
          </CreateEntityLabelSelectWrapper>
          {form.values.claimPolicy !== null && entityTypeData[entityType].fields.includes(Fields.claimPolicy) && (
            <ApplicationInputUnassignContainer>
              <Checkbox
                checked={!!form.values.shouldUnclaimOnDueDateExpiry}
                onChange={() =>
                  form.setFieldValue('shouldUnclaimOnDueDateExpiry', !form.values.shouldUnclaimOnDueDateExpiry)
                }
                inputProps={{ 'aria-label': 'controlled' }}
              />
              Remove assignee when due date is passed
            </ApplicationInputUnassignContainer>
          )}
        </ApplicationInputWrapper>
        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.dueDate)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Due Date</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.dueDate !== null && (
              <CreateEntityDueDate
                autoFocus={!form.values.dueDate}
                setValue={(date) => form.setFieldValue('dueDate', date)}
                setRecurrenceType={setRecurrenceType}
                setRecurrenceValue={setRecurrenceValue}
                hideRecurring={false}
                handleClose={() => {
                  form.setFieldValue('dueDate', null);
                  setRecurrenceType(null);
                  setRecurrenceValue(null);
                }}
                value={form.values.dueDate}
                recurrenceType={recurrenceType}
                recurrenceValue={recurrenceValue}
              />
            )}
            {form.values.dueDate === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('dueDate', '');
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.reward)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Reward</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.rewards?.length > 0 &&
              // this check is to only show the field when there exist a reward with paymethod not active, otherwise just hide
              (activePaymentMethods?.length > 0 || form.values?.rewards?.[0]?.paymentMethodId) && (
                <CreateEntityWrapper>
                  <CreateEntityPaymentMethodSelect
                    name="rewards-payment-method"
                    value={form.values?.rewards?.[0]?.paymentMethodId}
                    onChange={(value) => {
                      form.setFieldValue('rewards', [{ ...form.values?.rewards?.[0], paymentMethodId: value }]);
                    }}
                    renderValue={(selectedItem) => {
                      if (!selectedItem?.label?.props) return null;
                      return (
                        <CreateEntityPaymentMethodSelected>
                          <CreateEntityPaymentMethodItem {...selectedItem.label.props} />
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityPaymentMethodSelected>
                      );
                    }}
                  >
                    {activePaymentMethods.map(({ symbol, icon, id, chain }) => (
                      <CreateEntityPaymentMethodOption key={id} value={id}>
                        <CreateEntityPaymentMethodItem icon={icon} symbol={symbol} chain={chain} />
                      </CreateEntityPaymentMethodOption>
                    ))}
                  </CreateEntityPaymentMethodSelect>
                  <CreateEntityTextfield
                    autoComplete="off"
                    autoFocus={!form.values.rewards?.[0]?.rewardAmount}
                    name="rewards"
                    onChange={handleRewardOnChange(form)}
                    placeholder="Enter rewards..."
                    value={form.values?.rewards?.[0]?.rewardAmount}
                    fullWidth
                    InputProps={{
                      inputComponent: CreateEntityTextfieldInputRewardComponent,
                      endAdornment: (
                        <CreateEntityAutocompletePopperRenderInputAdornment
                          position="end"
                          onClick={() => {
                            form.setFieldValue('rewards', []);
                          }}
                        >
                          <CreateEntityAutocompletePopperRenderInputIcon />
                        </CreateEntityAutocompletePopperRenderInputAdornment>
                      ),
                    }}
                    error={form.errors?.rewards?.[0]?.rewardAmount}
                    onFocus={() => form.setFieldError('rewards', undefined)}
                  />
                </CreateEntityWrapper>
              )}
            {paymentMethodInactiveError && (
              <ErrorText>
                Payment method {`${selectedPaymentMethod?.[0]?.symbol} ${selectedPaymentMethod?.[0]?.chain}`} is
                deactivated
              </ErrorText>
            )}{' '}
            {form.values.rewards?.length > 0 && activePaymentMethods?.length === 0 && (
              // this is the case when no reward is currently attached and no payment method was created
              <StyledLink onClick={handlePaymentMethodRedirect} style={{ cursor: 'pointer' }}>
                {' '}
                Set up payment method
              </StyledLink>
            )}
            {form.touched.rewards && form.errors?.rewards?.[0]?.rewardAmount && (
              <CreateEntityError>{form.errors?.rewards?.[0]?.rewardAmount}</CreateEntityError>
            )}
            {form.values.rewards?.length === 0 && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('rewards', [{ rewardAmount: '', paymentMethodId: activePaymentMethods?.[0]?.id }]);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.points)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Points</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.points !== null && (
              <>
                <CreateEntityTextfield
                  autoComplete="off"
                  autoFocus={!form.values.points}
                  name="points"
                  onChange={form.handleChange('points')}
                  fullWidth
                  value={form.values.points}
                  InputProps={{
                    inputComponent: CreateEntityTextfieldInputPointsComponent,
                    endAdornment: (
                      <CreateEntityAutocompletePopperRenderInputAdornment
                        position="end"
                        onClick={() => {
                          form.setFieldValue('points', null);
                        }}
                      >
                        <CreateEntityAutocompletePopperRenderInputIcon />
                      </CreateEntityAutocompletePopperRenderInputAdornment>
                    ),
                  }}
                  error={form.errors.points}
                  onFocus={() => form.setFieldError('points', undefined)}
                />
                {form.touched.points && form.errors.points && (
                  <CreateEntityError>{form.errors.points}</CreateEntityError>
                )}
              </>
            )}

            {form.values.points === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('points', '');
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper
          show={entityTypeData[entityType].fields.includes(Fields.milestone) && !isSubtask}
        >
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Milestone</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.milestoneId !== null && (
              <CreateEntityWrapper>
                <MilestoneSearch
                  autoFocus={!form.values?.milestoneId}
                  options={filterUserOptions(milestonesData)}
                  value={form.values.milestoneId}
                  onChange={(milestoneId) => {
                    form.setFieldValue('milestoneId', milestoneId);
                  }}
                  handleClose={() => {
                    form.setFieldValue('milestoneId', null);
                  }}
                  formValues={form.values}
                  disabled={formValues?.milestoneId || isSubtask}
                />
              </CreateEntityWrapper>
            )}
            {form.values.milestoneId === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('milestoneId', undefined);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
            {form?.errors?.milestoneId && <ErrorText>{form?.errors?.milestoneId}</ErrorText>}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.priority)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Priority</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.priority === null ? (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('priority', PRIORITIES[1].value);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            ) : (
              <TaskPriorityToggleButton value={form.values.priority} setValue={form.setFieldValue} />
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.tags)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Category</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.categories !== null && (
              <DropdownSearch
                autoFocus={form?.values?.categories?.length === 0}
                label="Select Category"
                searchPlaceholder="Search categories"
                options={categoriesData}
                value={filterCategoryValues(form.values.categories)}
                onChange={(categories) => {
                  form.setFieldValue('categories', [...categories]);
                }}
                disabled={formValues?.categories}
                onClose={() => {}}
              />
            )}
            {form.values.categories == null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('categories', []);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.tags)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Tags</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.labelIds !== null && (
              <Tags
                autoFocus={!form.values.labelIds?.length}
                options={orgLabelsData || []}
                ids={form.values.labelIds}
                onChange={(labelIds) => {
                  form.setFieldValue('labelIds', labelIds);
                }}
                onCreate={handleCreateLabel}
                limit={4}
              />
            )}
            {form.values.labelIds === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('labelIds', []);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>
        {noGithubTies &&
          availablePullRequests.length > 0 &&
          existingTask &&
          !form.values?.chooseGithubPullRequest &&
          !form?.values?.chooseGithubIssue && (
            <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.githubPullRequest)}>
              <>
                <CreateEntityLabel
                  style={{
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}
                  onClick={() => form.setFieldValue('chooseGithubPullRequest', true)}
                >
                  Link Github PR
                </CreateEntityLabel>
                <span
                  style={{
                    color: '#ccbbff',
                    marginRight: '8px',
                    paddingTop: '4px',
                    fontWeight: 'bolder',
                  }}
                >
                  or
                </span>
                <CreateEntityLabel
                  style={{
                    cursor: 'pointer',
                  }}
                  onClick={() => form.setFieldValue('chooseGithubIssue', true)}
                >
                  Create Github issue
                </CreateEntityLabel>
              </>
            </CreateEntityLabelSelectWrapper>
          )}
        {(existingTask?.githubIssue ||
          form.values?.chooseGithubIssue ||
          (availablePullRequests.length === 0 && availableRepos?.length > 0)) &&
          !existingTask?.githubPullRequest && (
            <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.githubPullRequest)}>
              <CreateEntityLabelWrapper>
                <CreateEntityLabel> Github issue </CreateEntityLabel>
              </CreateEntityLabelWrapper>
              {form.values.githubIssue ? (
                <CreateEntitySelectWrapper>
                  <GithubLink
                    style={{
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                    href={form.values.githubIssue?.url}
                    target="_blank"
                  >
                    Connected Github issue
                  </GithubLink>
                </CreateEntitySelectWrapper>
              ) : (
                <CreateEntitySelectWrapper>
                  <CreateEntitySelectErrorWrapper>
                    <CreateEntityAutocompletePopper
                      onFocus={() => form.setFieldError('githubRepo', undefined)}
                      openOnFocus
                      options={availableRepos}
                      value={form.values.githubRepo}
                      isOptionEqualToValue={(option, value) => option.value?.id === value}
                      getOptionLabel={(option) => option?.label || option.title || ''}
                      renderInput={(params) => (
                        <CreateEntityAutocompletePopperRenderInput
                          {...params}
                          ref={params.InputProps.ref}
                          disableUnderline
                          fullWidth
                          placeholder="Choose Repo"
                          endAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment
                              position="end"
                              onClick={() => {
                                form.setFieldValue('githubRepo', null);
                              }}
                            >
                              <CreateEntityAutocompletePopperRenderInputIcon />
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                        />
                      )}
                      renderOption={(props, option) => (
                        <CreateEntityAutocompleteOption
                          {...props}
                          onClick={() => {
                            if (form.values.githubPullRequest?.id !== option.id) {
                              form.setFieldValue('githubRepo', option);
                            }
                            form.setFieldError('githuRepo', undefined);
                          }}
                        >
                          <CreateEntityAutocompleteOptionTypography>
                            {option?.label}
                          </CreateEntityAutocompleteOptionTypography>
                        </CreateEntityAutocompleteOption>
                      )}
                      error={form.errors?.githubRepo}
                    />
                    {form.errors?.githubRepo && <CreateEntityError>{form.errors?.githubRepo}</CreateEntityError>}
                  </CreateEntitySelectErrorWrapper>
                  {createGithubIssueLoading ? (
                    <CircularProgress />
                  ) : (
                    <GithubLink
                      style={{
                        paddingTop: '4px',
                        paddingBottom: '4px',
                      }}
                      onClick={() => {
                        createGithubIssue({
                          variables: {
                            repoPathname: form.values.githubRepo?.label,
                            taskId: existingTask?.id,
                          },
                        }).then((result) => {
                          if (result?.data?.createTaskGithubIssue) {
                            form.setFieldValue('githubIssue', result?.data?.createTaskGithubIssue);
                          }
                        });
                      }}
                    >
                      <GitHubIcon
                        style={{
                          marginRight: '8px',
                        }}
                      />
                      <span>Add</span>
                    </GithubLink>
                  )}
                </CreateEntitySelectWrapper>
              )}
            </CreateEntityLabelSelectWrapper>
          )}
        {availablePullRequests.length > 0 &&
          (existingTask?.githubPullRequest || form.values?.chooseGithubPullRequest) &&
          existingTask &&
          !existingTask?.githubIssue && (
            <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.githubPullRequest)}>
              <CreateEntityLabelWrapper>
                <CreateEntityLabel>Link Github PR</CreateEntityLabel>
              </CreateEntityLabelWrapper>

              <CreateEntitySelectWrapper>
                {form.values.githubPullRequest !== null && (
                  <CreateEntitySelectErrorWrapper>
                    <CreateEntityAutocompletePopper
                      onFocus={() => form.setFieldError('githubPullRequest', undefined)}
                      openOnFocus
                      options={availablePullRequests}
                      value={form.values.githubPullRequest}
                      isOptionEqualToValue={(option, value) => option.value?.id === value}
                      getOptionLabel={(option) => option?.label || option.title || ''}
                      renderInput={(params) => (
                        <CreateEntityAutocompletePopperRenderInput
                          {...params}
                          ref={params.InputProps.ref}
                          disableUnderline
                          fullWidth
                          placeholder="Enter PR name"
                          endAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment
                              position="end"
                              onClick={() => {
                                form.setFieldValue('githubPullRequest', null);
                              }}
                            >
                              <CreateEntityAutocompletePopperRenderInputIcon />
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                        />
                      )}
                      renderOption={(props, option) => (
                        <CreateEntityAutocompleteOption
                          {...props}
                          onClick={() => {
                            if (form.values.githubPullRequest?.id !== option.id) {
                              form.setFieldValue('githubPullRequest', option);
                            }
                            form.setFieldError('githubPullRequest', undefined);
                          }}
                        >
                          <CreateEntityAutocompleteOptionTypography>
                            {option?.label}
                          </CreateEntityAutocompleteOptionTypography>
                        </CreateEntityAutocompleteOption>
                      )}
                      error={form.errors?.githubPullRequest}
                    />
                    {form.errors?.githubPullRequest && (
                      <CreateEntityError>{form.errors?.githubPullRequest}</CreateEntityError>
                    )}
                  </CreateEntitySelectErrorWrapper>
                )}
                {form.values.githubPullRequest === null && (
                  <CreateEntityLabelAddButton
                    onClick={() => {
                      form.setFieldValue('githubPullRequest', '');
                    }}
                  >
                    <CreateEntityAddButtonIcon />
                    <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
                  </CreateEntityLabelAddButton>
                )}
              </CreateEntitySelectWrapper>
            </CreateEntityLabelSelectWrapper>
          )}
        <CreateEntityDivider />
        <TaskTemplatePickerWrapper>
          <TaskTemplatePicker
            options={filterOptionsWithPermission(entityType, pods, fetchedUserPermissionsContext, form.values.orgId)}
            value={form.values.orgId}
            onChange={handleOnchangePodId}
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
      </CreateEntityBody>
      <CreateEntityFooter>
        <CreateEntityHeaderWrapper showOnSmallScreen>
          <CreateEntityAttachment showOnSmallScreen onClick={() => inputRef.current.click()}>
            <CreateEntityAttachmentIcon />
            {fileUploadLoading && <FileLoading />}
          </CreateEntityAttachment>
          <CreateEntityPrivacySelect
            className="select-tooltip"
            name="privacyLevel"
            value={form.values.privacyLevel}
            onChange={(value) => {
              form.setFieldValue('privacyLevel', value);
            }}
            renderValue={(value) => (
              <Tooltip placement="top">
                <CreateEntityPrivacySelectRender>
                  <CreateEntityPrivacySelectRenderLabelWrapper>
                    <CreateEntityPrivacySelectRenderLabel>{value?.label}</CreateEntityPrivacySelectRenderLabel>
                  </CreateEntityPrivacySelectRenderLabelWrapper>
                  <CreateEntitySelectArrowIcon />
                </CreateEntityPrivacySelectRender>
              </Tooltip>
            )}
          >
            {Object.keys(privacyOptions).map((i) => {
              const { label, value, Icon } = privacyOptions[i];
              return (
                <CreateEntityPrivacySelectOption key={value} value={value}>
                  <CreateEntityPrivacyIconWrapper>{Icon && <Icon />}</CreateEntityPrivacyIconWrapper>
                  <CreateEntityPrivacyLabel>{label}</CreateEntityPrivacyLabel>
                </CreateEntityPrivacySelectOption>
              );
            })}
          </CreateEntityPrivacySelect>
        </CreateEntityHeaderWrapper>
        <CreateEntityHeaderWrapper showOnSmallScreen>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <CreateEntityCancelButton onClick={cancel}>Cancel</CreateEntityCancelButton>
              <CreateEntitySelectErrorWrapper>
                <CreateEntityCreateTaskButton type="submit" data-cy="create-entity-button-submit">
                  {existingTask ? 'Save changes' : `Create ${entityType}`}
                </CreateEntityCreateTaskButton>
                {!isEmpty(form.errors) && <CreateEntityError>Please check your input fields</CreateEntityError>}
              </CreateEntitySelectErrorWrapper>
            </>
          )}
        </CreateEntityHeaderWrapper>
      </CreateEntityFooter>
    </CreateEntityForm>
  );
}
