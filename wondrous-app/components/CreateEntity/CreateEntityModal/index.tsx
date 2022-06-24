import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { CircularProgress } from '@mui/material';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import {
  countCharacters,
  deserializeRichText,
  extractMentions,
  plainTextToRichText,
  RichTextEditor,
  useEditor,
} from 'components/RichText';
import Tooltip from 'components/Tooltip';
import { FormikValues, useFormik } from 'formik';
import { CREATE_LABEL } from 'graphql/mutations/org';
import GitHubIcon from '@mui/icons-material/GitHub';
import {
  ATTACH_MEDIA_TO_TASK,
  CREATE_BOUNTY,
  CREATE_MILESTONE,
  CREATE_TASK,
  REMOVE_MEDIA_FROM_TASK,
  CREATE_TASK_GITHUB_ISSUE,
  UPDATE_BOUNTY,
  UPDATE_MILESTONE,
  UPDATE_TASK,
  TURN_TASK_TO_BOUNTY,
} from 'graphql/mutations/task';
import { GET_ORG_LABELS, GET_ORG_USERS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import { GET_ORG_ROLES } from 'graphql/queries/org';
import {
  GET_POD_GITHUB_INTEGRATIONS,
  GET_POD_GITHUB_PULL_REQUESTS,
  GET_USER_AVAILABLE_PODS,
} from 'graphql/queries/pod';
import {
  GET_ELIGIBLE_REVIEWERS_FOR_ORG,
  GET_ELIGIBLE_REVIEWERS_FOR_POD,
  GET_MILESTONES,
  GET_TASK_BY_ID,
} from 'graphql/queries/task';
import _ from 'lodash';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import {
  updateCompletedItem,
  updateInProgressTask,
  updateInReviewItem,
  updateTaskItem,
  updateTaskItemOnEntityType,
} from 'utils/board';
import {
  CHAIN_TO_CHAIN_DIPLAY_NAME,
  ENTITIES_TYPES,
  PERMISSIONS,
  PRIVACY_LEVEL,
  TASK_STATUS_DONE,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_TODO,
  APPLICATION_POLICY,
  APPLICATION_POLICY_LABELS_MAP,
} from 'utils/constants';
import { parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { handleAddFile } from 'utils/media';
import * as Yup from 'yup';
import { SafeImage } from '../../Common/Image';
import Tags, { Option as Label } from '../../Tags';
import { StyledChipTag } from 'components/Tags/styles';
import { MediaItem } from '../MediaItem';
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
  CreateEntityMilestoneSearch,
  CreateEntityOpenInFullIcon,
  CreateEntityOption,
  CreateEntityOptionImageWrapper,
  CreateEntityOptionLabel,
  CreateEntityPaymentMethodLabel,
  CreateEntityPaymentMethodLabelChain,
  CreateEntityPaymentMethodOption,
  CreateEntityPaymentMethodOptionIcon,
  CreateEntityPaymentMethodSelect,
  CreateEntityPaymentMethodSelectRender,
  CreateEntityPodSearch,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
  CreateEntityPrivacyMembersIcon,
  CreateEntityPrivacyPublicIcon,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntityWrapper,
  CreateEntitySelect,
  CreateEntitySelectArrowIcon,
  CreateEntitySelectErrorWrapper,
  CreateEntitySelectRootValue,
  CreateEntitySelectRootValueWrapper,
  CreateEntitySelectWrapper,
  CreateEntityTextfield,
  CreateEntityTextfieldInputLabel,
  CreateEntityTextfieldInputPoints,
  CreateEntityTextfieldInputReward,
  CreateEntityTextfieldPoints,
  CreateEntityTitle,
  EditorPlaceholder,
  EditorContainer,
  EditorToolbar,
  MediaUploadDiv,
  CreateEntityApplicationsSelectRender,
} from './styles';
import { GithubButton } from 'components/Settings/Github/styles';
import { ConvertTaskToBountyModal } from './ConfirmTurnTaskToBounty';
import { ErrorText } from 'components/Common';

const formValidationSchema = Yup.object().shape({
  orgId: Yup.string().required('Organization is required').typeError('Organization is required'),
  podId: Yup.string().optional().nullable(),
  title: Yup.string().required('Title is required'),
  reviewerIds: Yup.array().of(Yup.string().nullable()).nullable(),
  assigneeId: Yup.string().nullable(),
  claimPolicy: Yup.string().nullable(),
  claimPolicyRoles: Yup.array().of(Yup.string()).optional().nullable(),
  points: Yup.number()
    .typeError('Points must be a number')
    .integer('Points must be whole number')
    .moreThan(0, 'Points must be greater than 0')
    .optional()
    .nullable(),
  rewards: Yup.array()
    .of(
      Yup.object({
        paymentMethodId: Yup.string().required(),
        rewardAmount: Yup.number()
          .typeError('Reward amount must be a number')
          .moreThan(0, 'Reward amount must be greater than 0'),
      })
    )
    .optional()
    .nullable(),
  milestoneId: Yup.string().nullable(),
});

const privacyOptions = {
  public: {
    label: 'Public',
    value: PRIVACY_LEVEL.public,
    Icon: CreateEntityPrivacyPublicIcon,
  },
  private: {
    label: 'Members',
    value: '',
    Icon: CreateEntityPrivacyMembersIcon,
  },
};
const filterUserOptions = (options) => {
  if (!options) return [];
  return options.map((option) => {
    return {
      label: option?.username ?? option?.title,
      id: option?.id,
      profilePicture: option?.profilePicture,
    };
  });
};

const filterOrgUsersForAutocomplete = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }
  return orgUsers.map((orgUser) => ({
    ...orgUser?.user,
    display: orgUser?.user?.username,
    id: orgUser?.user?.id,
  }));
};

const filterGithubPullRequestsForAutocomplete = (githubPullRequests) => {
  if (!githubPullRequests) {
    return [];
  }
  return githubPullRequests.map((githubPullRequest) => ({
    id: githubPullRequest.id,
    label: githubPullRequest.title,
    url: githubPullRequest.url,
  }));
};
const filterPaymentMethods = (paymentMethods) => {
  if (!paymentMethods) return [];
  return paymentMethods.map((paymentMethod) => {
    return {
      ...paymentMethod,
      icon: <SafeImage src={paymentMethod.icon} style={{ width: '30px', height: '30px', borderRadius: '15px' }} />,
      label: `${paymentMethod.tokenName?.toUpperCase()}: ${CHAIN_TO_CHAIN_DIPLAY_NAME[paymentMethod.chain]}`,
      value: paymentMethod.id,
    };
  });
};

const filterOrgUsers = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }

  return orgUsers.map((orgUser) => ({
    profilePicture: orgUser?.user?.profilePicture,
    label: orgUser?.user?.username,
    value: orgUser?.user?.id,
  }));
};

const hasCreateTaskPermission = ({ userPermissionsContext, orgId = undefined, podId = undefined }) => {
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: orgId,
    podId: podId,
  });
  return permissions.some((i) => [PERMISSIONS.FULL_ACCESS, PERMISSIONS.CREATE_TASK].includes(i));
};

const filterOptionsWithPermission = (options, userPermissionsContext, orgId = undefined) => {
  if (!options) {
    return [];
  }
  return options
    .filter(({ id }) => {
      return hasCreateTaskPermission({
        userPermissionsContext,
        orgId: orgId ?? id,
        podId: orgId ? id : undefined,
      });
    })
    .map(({ profilePicture, name, id, color }) => ({
      imageUrl: profilePicture,
      label: name,
      value: id,
      color: color,
    }));
};

const getPodObject = (pods, podId) => {
  let justCreatedPod = null;
  pods.forEach((testPod) => {
    if (testPod.id === podId) {
      justCreatedPod = testPod;
    }
  });
  return justCreatedPod;
};

const onCorrectPage = (existingTask, board) =>
  existingTask?.orgId === board?.orgId ||
  existingTask?.podId === board?.podId ||
  existingTask?.userId === board?.userId;

const getPrivacyLevel = (podId, pods) => {
  const selectedPodPrivacyLevel = pods?.filter((i) => i.id === podId)[0]?.privacyLevel;
  const privacyLevel = privacyOptions[selectedPodPrivacyLevel]?.value ?? privacyOptions.public.value;
  return privacyLevel;
};

const useGetOrgRoles = (org) => {
  const [getOrgRoles, { data }] = useLazyQuery(GET_ORG_ROLES, {
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (org) {
      getOrgRoles({
        variables: {
          orgId: org,
        },
      });
    }
  }, [getOrgRoles, org]);
  return data?.getOrgRoles;
};

const useGetAvailableUserPods = (org) => {
  const [getAvailableUserPods, { data }] = useLazyQuery(GET_USER_AVAILABLE_PODS, {
    fetchPolicy: 'network-only',
  });
  useEffect(() => {
    if (org) {
      getAvailableUserPods({
        variables: {
          orgId: org,
        },
      });
    }
  }, [getAvailableUserPods, org]);
  return data?.getAvailableUserPods;
};

const filterGithubReposForAutocomplete = (githubPullRepos) => {
  if (!githubPullRepos) {
    return [];
  }

  return githubPullRepos.map((githubPullRepo) => ({
    id: githubPullRepo.githubInfo?.repoId,
    label: githubPullRepo.githubInfo?.repoPathname,
  }));
};

const useGetPodGithubIntegrations = (pod) => {
  const [getPodGithubIntegrations, { data: podGithubIntegrationData, error: podGithubIntegrationError }] =
    useLazyQuery(GET_POD_GITHUB_INTEGRATIONS);
  useEffect(() => {
    if (pod) {
      getPodGithubIntegrations({
        variables: {
          podId: pod,
        },
      });
    }
  }, [pod]);
  return filterGithubReposForAutocomplete(podGithubIntegrationData?.getPodGithubRepoIntegrations);
};

const useGetPodPullRequests = (pod) => {
  const [getPodGithubPullRequests, { data: podGithubPullRequestsData }] = useLazyQuery(GET_POD_GITHUB_PULL_REQUESTS);
  useEffect(() => {
    if (pod) {
      getPodGithubPullRequests({
        variables: {
          podId: pod,
        },
      });
    }
  }, [pod]);

  return filterGithubPullRequestsForAutocomplete(podGithubPullRequestsData?.getPodGithubPullRequests);
};

const useGetEligibleReviewers = (org, pod) => {
  const [getEligibleReviewersForOrg, { data: eligibleReviewersForOrgData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_ORG);

  const [getEligibleReviewersForPod, { data: eligibleReviewersForPodData }] =
    useLazyQuery(GET_ELIGIBLE_REVIEWERS_FOR_POD);
  useEffect(() => {
    if (pod) {
      getEligibleReviewersForPod({
        variables: {
          podId: pod,
          searchString: '',
        },
      });
    } else if (org) {
      getEligibleReviewersForOrg({
        variables: {
          orgId: org,
          searchString: '',
        },
      });
    }
  }, [org, pod, getEligibleReviewersForOrg, getEligibleReviewersForPod]);
  const eligibleReviewers = filterUserOptions(
    pod
      ? eligibleReviewersForPodData?.getEligibleReviewersForPod
      : eligibleReviewersForOrgData?.getEligibleReviewersForOrg
  );
  return eligibleReviewers;
};

const useGetOrgLabels = (orgId) => {
  const [getOrgLabels, { data }] = useLazyQuery(GET_ORG_LABELS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId) {
      getOrgLabels({
        variables: {
          orgId: orgId,
        },
      });
    }
  }, [orgId, getOrgLabels]);

  return data?.getOrgLabels;
};

const useCreateGithubIssueFromTask = (taskId, callback) => {
  const [createGithubIssue] = useMutation(CREATE_TASK_GITHUB_ISSUE);
  const handleCreateGithubIssue = async (repoPathname) => {
    const {
      data: { createGithubIssue: newGithubIssue },
    } = await createGithubIssue({
      variables: {
        taskId,
        repoPathname,
      },
    });
    callback(newGithubIssue);
  };
  return handleCreateGithubIssue;
};

const useCreateLabel = (orgId, callback) => {
  const [createLabel] = useMutation(CREATE_LABEL, {
    refetchQueries: () => ['getOrgLabels'],
  });

  const handleCreateLabel = async (label: Label) => {
    const {
      data: { createLabel: newLabel },
    } = await createLabel({
      variables: {
        input: {
          orgId: orgId,
          name: label.name,
          color: label.color,
        },
      },
    });
    callback(newLabel.id);
  };
  return handleCreateLabel;
};

const useGetPaymentMethods = (orgId) => {
  const [getPaymentMethods, { data }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG);
  useEffect(() => {
    if (orgId) {
      getPaymentMethods({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, getPaymentMethods]);
  return data?.getPaymentMethodsForOrg;
};

const useGetOrgUsers = (orgId) => {
  const [getOrgUsers, { data }] = useLazyQuery(GET_ORG_USERS);
  useEffect(() => {
    if (orgId)
      getOrgUsers({
        variables: {
          orgId,
          limit: 1000, // TODO: fix autocomplete
        },
      });
  }, [orgId, getOrgUsers]);
  return data?.getOrgUsers;
};

const useGetMilestones = (orgId, podId) => {
  const [getMilestones, { data }] = useLazyQuery(GET_MILESTONES);
  useEffect(() => {
    if (orgId)
      getMilestones({
        variables: {
          orgId,
          podId,
        },
      });
  }, [getMilestones, orgId, podId]);
  return data?.getMilestones;
};

const useCreateTask = () => {
  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: () => [
      'getPerStatusTaskCountForMilestone',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getSubtasksForTask',
      'getSubtaskCountForTask',
    ],
  });

  const handleMutation = ({ input, board, pods, form, handleClose }) =>
    createTask({
      variables: {
        input,
      },
    })
      .then((result) => {
        //checking if it's pod or org to use pod/org entity type else we assume it's the userBoard and we use the normal flow
        if (board?.entityType === ENTITIES_TYPES.TASK || !board?.entityType) {
          const task = result?.data?.createTask;
          const justCreatedPod = getPodObject(pods, task.podId);
          if (
            board?.setColumns &&
            ((task?.orgId === board?.orgId && !board?.podId) ||
              task?.podId === board?.podId ||
              form.values.podId === board?.podId)
          ) {
            const transformedTask = transformTaskToTaskCard(task, {
              orgName: board?.org?.name,
              orgProfilePicture: board?.org?.profilePicture,
              podName: justCreatedPod?.name,
            });

            const columns = [...board?.columns];
            columns[0].tasks = [transformedTask, ...columns[0].tasks];
            board.setColumns(columns);
          }
        } else {
          board?.setEntityType(ENTITIES_TYPES.TASK);
        }
        handleClose();
      })
      .catch((e) => console.log(e));

  return { handleMutation, loading };
};

const useCreateMilestone = () => {
  const [createMilestone, { loading }] = useMutation(CREATE_MILESTONE, {
    refetchQueries: () => ['getPerTypeTaskCountForOrgBoard', 'getPerTypeTaskCountForPodBoard', 'getMilestones'],
  });
  const handleMutation = ({ input, board, pods, form, handleClose, formValues }) => {
    createMilestone({
      variables: {
        input,
      },
    }).then((result) => {
      if (formValues !== undefined) {
        handleClose(result);
        return;
      }
      if (board?.entityType === ENTITIES_TYPES.MILESTONE || !board?.entityType) {
        const task = result?.data?.createMilestone;
        const justCreatedPod = getPodObject(pods, task.podId);
        if (
          board?.setColumns &&
          ((task?.orgId === board?.orgId && !board?.podId) ||
            task?.podId === board?.podId ||
            form.values.podId === board?.podId)
        ) {
          const transformedTask = transformTaskToTaskCard(task, {
            orgName: board?.org?.name,
            orgProfilePicture: board?.org?.profilePicture,
            podName: justCreatedPod?.name,
          });

          let columns = [...board?.columns];
          if (columns[0]?.tasks) {
            columns[0].tasks = [transformedTask, ...columns[0].tasks];
          } else {
            columns = [transformedTask, ...columns];
          }
          board.setColumns(columns);
        }
      } else {
        board?.setEntityType(ENTITIES_TYPES.MILESTONE);
      }
      handleClose(result);
    });
  };
  return { handleMutation, loading };
};

const useCreateBounty = () => {
  const [createBounty, { loading }] = useMutation(CREATE_BOUNTY, {
    refetchQueries: () => ['getPerTypeTaskCountForOrgBoard', 'getPerTypeTaskCountForPodBoard'],
  });
  const handleMutation = ({ input, board, pods, form, handleClose }) => {
    createBounty({
      variables: {
        input,
      },
    })
      .then((result) => {
        if (board?.entityType === ENTITIES_TYPES.BOUNTY || !board?.entityType) {
          const task = result?.data?.createBounty;
          const justCreatedPod = getPodObject(pods, task.podId);
          if (
            board?.setColumns &&
            ((task?.orgId === board?.orgId && !board?.podId) ||
              task?.podId === board?.podId ||
              form.values.podId === board?.podId)
          ) {
            const transformedTask = transformTaskToTaskCard(task, {
              orgName: board?.org?.name,
              orgProfilePicture: board?.org?.profilePicture,
              podName: justCreatedPod?.name,
            });

            let columns = [...board?.columns];
            if (columns[0]?.tasks) {
              columns = [transformedTask, ...columns[0].tasks];
            } else {
              columns = [transformedTask, ...columns];
            }
            board?.setColumns(columns);
          }
        } else {
          board?.setEntityType(ENTITIES_TYPES.BOUNTY);
        }
        handleClose();
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return { handleMutation, loading };
};

const useUpdateTask = () => {
  const [updateTask, { loading }] = useMutation(UPDATE_TASK, {
    refetchQueries: () => [
      'getPerStatusTaskCountForMilestone',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
    ],
  });
  const handleMutation = ({ input, board, handleClose, existingTask }) => {
    updateTask({
      variables: {
        taskId: existingTask?.id,
        input,
      },
    }).then(({ data }) => {
      const task = data?.updateTask;
      if (board?.setColumns && onCorrectPage(existingTask, board)) {
        const transformedTask = transformTaskToTaskCard(task, {});
        let columns = [...board?.columns];
        if (transformedTask.status === TASK_STATUS_IN_REVIEW) {
          columns = updateInReviewItem(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
          columns = updateInProgressTask(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_TODO) {
          columns = updateTaskItem(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_DONE) {
          columns = updateCompletedItem(transformedTask, columns);
        }
        board.setColumns(columns);
      }
      handleClose();
    });
  };
  return { handleMutation, loading };
};

const useUpdateMilestone = () => {
  const [updateMilestone, { loading }] = useMutation(UPDATE_MILESTONE);
  const handleMutation = ({ input, board, handleClose, existingTask }) => {
    updateMilestone({
      variables: {
        milestoneId: existingTask?.id,
        input,
      },
    }).then(({ data }) => {
      const milestone = data?.updateMilestone;
      if (board?.setColumns && onCorrectPage) {
        const transformedTask = transformTaskToTaskCard(milestone, {});
        let columns = [...board?.columns];
        if (transformedTask.status === TASK_STATUS_IN_REVIEW) {
          columns = updateInReviewItem(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
          columns = updateInProgressTask(transformedTask, columns);
          //if there's no entityType we assume it's the userBoard and keeping the old logic
        } else if (transformedTask.status === TASK_STATUS_TODO && !board?.entityType) {
          columns = updateTaskItem(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_TODO && board?.entityType) {
          columns = updateTaskItemOnEntityType(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_DONE) {
          columns = updateCompletedItem(transformedTask, columns);
        }
        board.setColumns(columns);
      }
      handleClose();
    });
  };
  return { handleMutation, loading };
};

const useUpdateBounty = () => {
  const [updateBounty, { loading }] = useMutation(UPDATE_BOUNTY, {
    refetchQueries: () => [
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
    ],
  });
  const handleMutation = ({ input, existingTask, handleClose }) => {
    updateBounty({
      variables: {
        bountyId: existingTask?.id,
        input,
      },
    }).then(() => {
      handleClose();
    });
  };
  return { handleMutation, loading };
};

const CreateEntityDropdownRenderOptions = (value) => {
  return (
    <CreateEntitySelectRootValue>
      <CreateEntitySelectRootValueWrapper>{value?.label}</CreateEntitySelectRootValueWrapper>
      <CreateEntitySelectArrowIcon />
    </CreateEntitySelectRootValue>
  );
};

const CreateEntityDropdown = (props) => {
  const {
    value,
    options,
    onChange,
    name,
    renderValue = CreateEntityDropdownRenderOptions,
    DefaultImageComponent,
    error,
    onFocus,
    disabled,
  } = props;
  const dropdownValue = value === null ? 'placeholder' : value;
  const placeholderText = { podId: 'Select Pod', orgId: 'Select Org' };
  return (
    <CreateEntitySelect
      name={name}
      renderValue={renderValue}
      onChange={onChange}
      disabled={disabled || options.length == 0}
      value={dropdownValue}
      error={error}
      onFocus={onFocus}
    >
      <CreateEntityOption key={'placeholder'} value={'placeholder'} hide={true}>
        <CreateEntityOptionImageWrapper>
          <DefaultImageComponent color={'#474747'} />
        </CreateEntityOptionImageWrapper>
        <CreateEntityOptionLabel>{placeholderText[name]}</CreateEntityOptionLabel>
      </CreateEntityOption>
      {options.map((i) => {
        const { imageUrl, label, value, color = '' } = i;
        return (
          <CreateEntityOption key={value} value={i.value}>
            <CreateEntityOptionImageWrapper>
              {imageUrl ? <SafeImage src={imageUrl} /> : <DefaultImageComponent color={color} />}
            </CreateEntityOptionImageWrapper>
            <CreateEntityOptionLabel>{label}</CreateEntityOptionLabel>
          </CreateEntityOption>
        );
      })}
    </CreateEntitySelect>
  );
};

const CreateEntityTextfieldInputPointsComponent = React.forwardRef(function CreateEntityTextfieldInputCustom(
  props,
  ref
) {
  return (
    <CreateEntityTextfieldInputPoints
      {...props}
      fullWidth={false}
      ref={ref}
      inputProps={{
        maxLength: 3,
      }}
      InputProps={{
        startAdornment: (
          <CreateEntityAutocompletePopperRenderInputAdornment position="start">
            <CreateEntityTextfieldPoints />
          </CreateEntityAutocompletePopperRenderInputAdornment>
        ),
        endAdornment: (
          <CreateEntityAutocompletePopperRenderInputAdornment position="end">
            <CreateEntityTextfieldInputLabel>PTS</CreateEntityTextfieldInputLabel>
          </CreateEntityAutocompletePopperRenderInputAdornment>
        ),
      }}
    />
  );
});

const CreateEntityTextfieldInputRewardComponent = React.forwardRef(function CreateEntityTextfieldInput(props, ref) {
  return <CreateEntityTextfieldInputReward {...props} ref={ref} />;
});

enum Fields {
  reviewer,
  assignee,
  claimPolicy,
  claimPolicyRoles,
  dueDate,
  reward,
  points,
  milestone,
  tags,
  githubPullRequest,
}

const entityTypeData = {
  [ENTITIES_TYPES.TASK]: {
    fields: [
      Fields.reviewer,
      Fields.assignee,
      Fields.claimPolicy,
      Fields.claimPolicyRoles,
      Fields.dueDate,
      Fields.reward,
      Fields.points,
      Fields.milestone,
      Fields.tags,
      Fields.githubPullRequest,
    ],
    createMutation: useCreateTask,
    updateMutation: useUpdateTask,
    initialValues: {
      orgId: null,
      podId: null,
      claimPolicy: null,
      claimPolicyRoles: null,
      title: '',
      description: plainTextToRichText(''),
      reviewerIds: null,
      assigneeId: null,
      dueDate: null,
      rewards: [],
      points: null,
      milestoneId: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
      githubPullRequest: null,
      githubIssue: null,
      githubRepo: null,
      chooseGithubPullRequest: false,
      chooseGithubIssue: false,
    },
  },
  [ENTITIES_TYPES.MILESTONE]: {
    fields: [Fields.dueDate, Fields.points, Fields.tags],
    createMutation: useCreateMilestone,
    updateMutation: useUpdateMilestone,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: plainTextToRichText(''),
      dueDate: null,
      points: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
    },
  },
  [ENTITIES_TYPES.BOUNTY]: {
    fields: [Fields.reviewer, Fields.dueDate, Fields.reward, Fields.points, Fields.tags],
    createMutation: useCreateBounty,
    updateMutation: useUpdateBounty,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: plainTextToRichText(''),
      reviewerIds: null,
      rewards: [],
      dueDate: null,
      points: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
    },
  },
};

const TEXT_LIMIT = 900;

const useContextValue = (condition, callback) => {
  useEffect(() => {
    if (condition) {
      callback();
    }
  }, [condition, callback]);
};

export const transformMediaFormat = (media) => {
  return (
    media &&
    media.map((item) => {
      return {
        uploadSlug: item?.slug,
        type: item?.type,
        name: item?.name,
      };
    })
  );
};

const initialValues = (entityType, existingTask = undefined) => {
  const defaultValues = _.cloneDeep(entityTypeData[entityType].initialValues);
  if (!existingTask) return defaultValues;
  const defaultValuesKeys = Object.keys(defaultValues);
  const description = deserializeRichText(existingTask.description);
  const existingTaskValues = _.pick(
    {
      ...existingTask,
      description,
      mediaUploads: transformMediaFormat(existingTask?.media),
      reviewerIds: _.isEmpty(existingTask?.reviewers) ? null : existingTask.reviewers.map((i) => i.id),
      rewards: existingTask?.rewards?.map(({ rewardAmount, paymentMethodId }) => {
        return { rewardAmount, paymentMethodId };
      }),
      labelIds: _.isEmpty(existingTask?.labels) ? null : existingTask.labels.map((i) => i.id),
    },
    defaultValuesKeys
  );
  const initialValues = _.assignWith(defaultValues, existingTaskValues, (objValue, srcValue) => {
    return _.isNull(srcValue) || _.isUndefined(srcValue) ? objValue : srcValue;
  });
  return initialValues;
};

interface ICreateEntityModal {
  entityType: string;
  handleClose: Function;
  cancel: Function;
  existingTask?: {
    id: string;
    claimPolicyRoles: [string] | null;
    claimPolicy: string | null;
    githubIssue: {
      id: string;
      url: string;
    };
    githubPullRequest: {
      id: string;
      url: string;
      title: string;
    };
    type?: string;
  };
  parentTaskId?: string;
  resetEntityType?: Function;
  setEntityType?: Function;
  formValues?: FormikValues;
}

export const CreateEntityModal = (props: ICreateEntityModal) => {
  const { entityType, handleClose, cancel, existingTask, parentTaskId, formValues } = props;
  const [recurrenceType, setRecurrenceType] = useState(null);
  const [recurrenceValue, setRecurrenceValue] = useState(null);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);
  const isSubtask = parentTaskId !== undefined;
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const board = orgBoard || podBoard || userBoard;
  const router = useRouter();
  const [turnTaskToBountyModal, setTurnTaskToBountyModal] = useState(false);
  const { podId: routerPodId } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'network-only',
  });
  const inputRef: any = useRef();
  const [getTaskById] = useLazyQuery(GET_TASK_BY_ID);
  const fetchedUserPermissionsContext = userPermissionsContext?.getUserPermissionContext
    ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
    : null;
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const filteredDaoOptions = filterOptionsWithPermission(userOrgs?.getUserOrgs, fetchedUserPermissionsContext);
  const { handleMutation, loading } = existingTask
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

  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();

  const form = useFormik({
    initialValues: initialValues(entityType, existingTask),
    validateOnChange: false,
    validateOnBlur: false,
    validationSchema: formValidationSchema,
    onSubmit: (values) => {
      const reviewerIds = values?.reviewerIds?.filter((i) => i !== null);
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const userMentions = extractMentions(values.description);
      const points = parseInt(values.points);
      const rewards = _.isEmpty(values.rewards)
        ? []
        : [{ ...values.rewards[0], rewardAmount: parseFloat(values.rewards[0].rewardAmount) }];
      const githubPullRequest = {
        id: values?.githubPullRequest?.id,
        title: values?.githubPullRequest?.label,
        url: values?.githubPullRequest?.url,
      };
      const { chooseGithubIssue, chooseGithubPullRequest, githubIssue, githubRepo, ...finalValues } = values;

      const input = {
        ...finalValues,
        reviewerIds,
        points,
        rewards,
        timezone,
        userMentions,
        description: JSON.stringify(values.description),
        ...(values?.githubPullRequest?.id && {
          githubPullRequest,
        }),
      };
      handleMutation({ input, board, pods, form, handleClose, existingTask: existingTask });
    },
  });
  const paymentMethods = filterPaymentMethods(useGetPaymentMethods(form.values.orgId));
  const orgUsersData = useGetOrgUsers(form.values.orgId);
  const filteredOrgUsersData = filterOrgUsers(orgUsersData);
  const orgLabelsData = useGetOrgLabels(form.values.orgId);
  const handleCreateLabel = useCreateLabel(form.values.orgId, (newLabelId) =>
    form.setFieldValue('labelIds', [...form.values.labelIds, newLabelId])
  );

  const [createGithubIssue, { data: createGithubIssueData, loading: createGithubIssueLoading }] =
    useMutation(CREATE_TASK_GITHUB_ISSUE);
  const milestonesData = useGetMilestones(form.values.orgId, form.values.podId);
  const pods = useGetAvailableUserPods(form.values.orgId);
  const roles = useGetOrgRoles(form.values.orgId);

  const handleOnchangePodId = useCallback(
    (podId) => {
      const resetValues = initialValues(entityType);
      form.setValues({
        ...form.values,
        milestoneId: resetValues?.milestoneId,
        privacyLevel: getPrivacyLevel(podId, pods),
        podId,
      });
      form.setErrors({});
    },
    [entityType, form, getPrivacyLevel]
  );
  const availablePullRequests = useGetPodPullRequests(form.values.podId);
  const availableRepos = useGetPodGithubIntegrations(form.values.podId);
  const eligibleReviewers = useGetEligibleReviewers(form.values.orgId, form.values.podId);
  const filteredEligibleReviewers = eligibleReviewers.filter(
    (reviewer) => !form.values.reviewerIds?.includes(reviewer.id)
  );
  const [fullScreen, setFullScreen] = useState(false);
  const [attachMedia] = useMutation(ATTACH_MEDIA_TO_TASK);
  const [removeMedia] = useMutation(REMOVE_MEDIA_FROM_TASK);
  useContextValue(!form.values.orgId && router?.pathname.includes('/dashboard') && filteredDaoOptions[0]?.value, () =>
    form.setFieldValue('orgId', filteredDaoOptions[0]?.value)
  );
  useContextValue(
    !form.values.orgId &&
      hasCreateTaskPermission({
        userPermissionsContext: fetchedUserPermissionsContext,
        orgId: board?.orgId,
      }),
    () => form.setFieldValue('orgId', board?.orgId)
  );
  useContextValue(
    !form.values.podId &&
      (board?.podId || routerPodId) &&
      form.values.orgId &&
      !existingTask &&
      pods &&
      hasCreateTaskPermission({
        userPermissionsContext: fetchedUserPermissionsContext,
        orgId: form.values.orgId,
        podId: board?.podId,
      }),
    () => handleOnchangePodId(board?.podId || routerPodId)
  );
  useContextValue(!form.values.orgId && !form.values.podId && formValues, () =>
    form.setValues({ ...form.values, orgId: formValues.orgId, podId: formValues.podId })
  );

  useEffect(() => {
    if (isSubtask) {
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
        })
        .catch((e) => console.error(e));
    }
  }, [parentTaskId, getTaskById, isSubtask]);

  const isPrivacySelectorEnabled =
    getPrivacyLevel(form.values.podId, pods) === privacyOptions.public.value || !form.values.podId;

  const noGithubTies = !existingTask?.githubIssue && !existingTask?.githubPullRequest;

  const getRoleDataById = (id) => roles?.find((role) => role.id === id);

  return (
    <CreateEntityForm onSubmit={form.handleSubmit} fullScreen={fullScreen}>
      <ConvertTaskToBountyModal
        open={turnTaskToBountyModal}
        onClose={() => setTurnTaskToBountyModal(false)}
        onConvert={() => {
          turnTaskToBounty({
            variables: {
              taskId: existingTask?.id,
            },
          }).then(() => {
            if (board?.org || board?.orgData) {
              if (board?.org) {
                window.location.href = `/organization/${board?.org?.username}/boards?entity=bounty`;
              } else if (board?.orgData) {
                window.location.href = `/organization/${board?.orgData?.username}/boards?entity=bounty`;
              }
            } else if (board?.pod || board?.podData) {
              if (board?.org) {
                window.location.href = `/pod/${board?.pod?.id}/boards?entity=bounty`;
              } else if (board?.orgData) {
                window.location.href = `/pod/${board?.podData?.id}/boards?entity=bounty`;
              }
            } else {
              if (handleClose) {
                handleClose();
              }
            }
          });
        }}
      />
      <CreateEntityHeader>
        <CreateEntityHeaderWrapper>
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
              <CreateEntityPodSearch
                options={filterOptionsWithPermission(pods, fetchedUserPermissionsContext, form.values.orgId)}
                value={form.values.podId}
                onChange={handleOnchangePodId}
                disabled={formValues !== undefined}
              />
            </>
          )}
        </CreateEntityHeaderWrapper>
        <CreateEntityHeaderWrapper>
          <CreateEntityOpenInFullIcon onClick={() => setFullScreen(!fullScreen)} />
        </CreateEntityHeaderWrapper>
      </CreateEntityHeader>
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
        />
        <CreateEntityError>{form.errors?.title}</CreateEntityError>

        <EditorToolbar ref={setEditorToolbarNode} />
        <EditorContainer
          onClick={() => {
            // since editor will collapse to 1 row on input, we need to emulate min-height somehow
            // to achive it, we wrap it with EditorContainer and make it switch focus to editor on click
            ReactEditor.focus(editor);
            // also we need to move cursor to the last position in the editor
            Transforms.select(editor, {
              anchor: Editor.end(editor, []),
              focus: Editor.end(editor, []),
            });
          }}
        >
          <RichTextEditor
            editor={editor}
            initialValue={form.values.description}
            mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
            placeholder={<EditorPlaceholder>Enter a description</EditorPlaceholder>}
            toolbarNode={editorToolbarNode}
            onChange={(value) => {
              form.setFieldValue('description', value);
            }}
            editorContainerNode={document.querySelector('#modal-scrolling-container')}
            onClick={(e) => {
              // we need to stop click event propagation,
              // since EditorContainer moves cursor to the last position in the editor on click
              e.stopPropagation();
            }}
          />
        </EditorContainer>
        {form.errors?.description && <ErrorText>{form.errors?.description}</ErrorText>}
        <CreateEntityLabelSelectWrapper show={true}>
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
                      removeMedia({
                        variables: {
                          taskId: existingTask?.['id'],
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
                attachMedia({
                  variables: {
                    taskId: existingTask?.['id'],
                    input: {
                      mediaUploads: [fileToAdd],
                    },
                  },
                  onCompleted: (data) => {
                    const task = data?.attachTaskMedia;
                    form.setFieldValue('mediaUploads', transformMediaFormat(task?.media));
                    setFileUploadLoading(false);
                  },
                });
              }
            }}
          />
          {existingTask && existingTask?.type === ENTITIES_TYPES.TASK && (
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
                    openOnFocus={true}
                    options={eligibleReviewers}
                    value={reviewerId}
                    isOptionEqualToValue={(option, value) => {
                      return option.id === value;
                    }}
                    renderInput={(params) => {
                      const reviewer = eligibleReviewers.find((reviewer) => reviewer.id === params.inputProps.value);
                      return (
                        <CreateEntityAutocompletePopperRenderInput
                          {...params}
                          inputProps={{
                            ...params.inputProps,
                            value: reviewer?.label,
                          }}
                          ref={params.InputProps.ref}
                          disableUnderline={true}
                          fullWidth={true}
                          placeholder="Enter username..."
                          startAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                              {reviewer?.profilePicture ? (
                                <SafeImage src={reviewer.profilePicture} />
                              ) : (
                                <CreateEntityDefaultUserImage />
                              )}
                            </CreateEntityAutocompletePopperRenderInputAdornment>
                          }
                          endAdornment={
                            <CreateEntityAutocompletePopperRenderInputAdornment
                              position="end"
                              onClick={() => {
                                const newReviewers = _.cloneDeep(form.values.reviewerIds).filter(
                                  (id, i) => i !== index
                                );
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
                            <SafeImage src={option?.profilePicture} />
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
                        const reviewerIds = _.cloneDeep(form.values.reviewerIds);
                        reviewerIds[index] = value.id;
                        form.setFieldValue('reviewerIds', reviewerIds);
                      }
                    }}
                    blurOnSelect={true}
                    error={hasError}
                  />
                  {hasError && <CreateEntityError>{hasError}</CreateEntityError>}
                </CreateEntitySelectErrorWrapper>
              );
            })}
            <Tooltip
              title={_.isEmpty(filteredEligibleReviewers) && 'You reached the maximum no. of available reviewers'}
              placement="top"
            >
              <CreateEntityLabelAddButton
                onClick={() => {
                  if (_.isEmpty(filteredEligibleReviewers)) return;
                  if (form.values.reviewerIds === null) {
                    form.setFieldValue('reviewerIds', [null]);
                    return;
                  }
                  form.setFieldValue('reviewerIds', form.values.reviewerIds.concat(null));
                }}
              >
                <CreateEntityAddButtonIcon />
                {(_.isNull(form.values.reviewerIds) || _.isEmpty(form.values.reviewerIds)) && (
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
                  openOnFocus={true}
                  options={filteredOrgUsersData}
                  value={form.values.assigneeId}
                  isOptionEqualToValue={(option, value) => {
                    return option.value === value;
                  }}
                  renderInput={(params) => {
                    const assignee = filteredOrgUsersData.find((user) => user.value === params.inputProps.value);
                    return (
                      <CreateEntityAutocompletePopperRenderInput
                        {...params}
                        inputProps={{
                          ...params.inputProps,
                          value: assignee?.label,
                        }}
                        ref={params.InputProps.ref}
                        disableUnderline={true}
                        fullWidth={true}
                        placeholder="Enter username..."
                        startAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                            {assignee?.profilePicture ? (
                              <SafeImage src={assignee.profilePicture} />
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
                  renderOption={(props, option) => {
                    return (
                      <CreateEntityAutocompleteOption {...props}>
                        {option?.profilePicture ? (
                          <SafeImage src={option?.profilePicture} />
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
                    if (reason === 'selectOption') {
                      form.setFieldValue('assigneeId', value.value);
                    }
                  }}
                  blurOnSelect={true}
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
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

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
                    if (value === APPLICATION_POLICY.HAS_ROLES.value)
                      form.setFieldValue('claimPolicyRoles', [roles[0]?.id]);
                  }}
                  renderValue={() => {
                    const isRolesSelected = form.values.claimPolicy === APPLICATION_POLICY.HAS_ROLES.value;
                    return (
                      <CreateEntityApplicationsSelectRender>
                        <span>
                          {isRolesSelected ? 'Role: ' : APPLICATION_POLICY_LABELS_MAP[form.values?.claimPolicy]?.title}
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

                {form.values.claimPolicy === APPLICATION_POLICY.HAS_ROLES.value && (
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
                    renderValue={() => {
                      console.log(form.values);
                      return (
                        <CreateEntityApplicationsSelectRender>
                          <>
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
                          </>
                          <CreateEntitySelectArrowIcon />
                        </CreateEntityApplicationsSelectRender>
                      );
                    }}
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
                }}
              >
                <CreateEntityAutocompletePopperRenderInputIcon />
              </CreateEntityAutocompletePopperRenderInputAdornment>
            )}
            {form.touched.claimPolicy && <CreateEntityError>{form.touched.claimPolicy}</CreateEntityError>}
            {form.values.claimPolicy === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  console.log(APPLICATION_POLICY.ALL_MEMBERS.value);
                  form.setFieldValue('claimPolicy', APPLICATION_POLICY.ALL_MEMBERS.value);
                }}
              >
                <CreateEntityAddButtonIcon />
                <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
              </CreateEntityLabelAddButton>
            )}
          </CreateEntitySelectWrapper>
        </CreateEntityLabelSelectWrapper>

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.dueDate)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Due Date</CreateEntityLabel>
          </CreateEntityLabelWrapper>
          <CreateEntitySelectWrapper>
            {form.values.dueDate !== null && (
              <CreateEntityDueDate
                setValue={(date) => form.setFieldValue('dueDate', date)}
                setRecurrenceType={setRecurrenceType}
                setRecurrenceValue={setRecurrenceValue}
                hideRecurring={false}
                handleClose={() => form.setFieldValue('dueDate', null)}
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
            {form.values.rewards?.length > 0 && (
              <CreateEntityWrapper>
                <CreateEntityPaymentMethodSelect
                  name="rewards-payment-method"
                  value={form.values?.rewards?.[0]?.paymentMethodId}
                  onChange={(value) => {
                    form.setFieldValue('rewards', [{ ...form.values?.rewards?.[0], paymentMethodId: value }]);
                  }}
                  renderValue={(value) => {
                    return (
                      <CreateEntityPaymentMethodSelectRender>
                        {value?.label} <CreateEntitySelectArrowIcon />
                      </CreateEntityPaymentMethodSelectRender>
                    );
                  }}
                >
                  {paymentMethods.map(({ symbol, icon, id, chain }) => {
                    return (
                      <CreateEntityPaymentMethodOption key={id} value={id}>
                        <CreateEntityPaymentMethodOptionIcon>{icon ?? <></>}</CreateEntityPaymentMethodOptionIcon>
                        <CreateEntityPaymentMethodLabel>
                          {symbol}
                          <CreateEntityPaymentMethodLabelChain>{chain}</CreateEntityPaymentMethodLabelChain>
                        </CreateEntityPaymentMethodLabel>
                      </CreateEntityPaymentMethodOption>
                    );
                  })}
                </CreateEntityPaymentMethodSelect>
                <CreateEntityTextfield
                  autoComplete="off"
                  name="rewards"
                  onChange={(e) => {
                    form.setFieldValue('rewards', [{ ...form.values?.rewards?.[0], rewardAmount: e.target.value }]);
                  }}
                  placeholder="Enter rewards..."
                  value={form.values?.rewards?.[0]?.rewardAmount}
                  fullWidth={true}
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
                  error={form.errors?.rewards?.[0]?.['rewardAmount']}
                  onFocus={() => form.setFieldError('rewards', undefined)}
                />
              </CreateEntityWrapper>
            )}
            {form.touched.rewards && form.errors?.rewards?.[0]?.['rewardAmount'] && (
              <CreateEntityError>{form.errors?.rewards?.[0]?.['rewardAmount']}</CreateEntityError>
            )}
            {form.values.rewards?.length === 0 && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('rewards', [{ rewardAmount: null, paymentMethodId: paymentMethods?.[0]?.id }]);
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
                  name="points"
                  onChange={form.handleChange('points')}
                  fullWidth={true}
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

        <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.milestone)}>
          <CreateEntityLabelWrapper>
            <CreateEntityLabel>Milestone</CreateEntityLabel>
          </CreateEntityLabelWrapper>

          <CreateEntitySelectWrapper>
            {form.values.milestoneId !== null && (
              <CreateEntityMilestoneSearch
                options={filterUserOptions(milestonesData)}
                value={form.values.milestoneId}
                onChange={(milestoneId) => {
                  form.setFieldValue('milestoneId', milestoneId);
                }}
                handleClose={() => {
                  form.setFieldValue('milestoneId', null);
                }}
                formValues={form.values}
              />
            )}
            {form.values.milestoneId === null && (
              <CreateEntityLabelAddButton
                onClick={() => {
                  form.setFieldValue('milestoneId', '');
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
                  <GithubButton
                    style={{
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                    href={form.values.githubIssue?.url}
                    target="_blank"
                  >
                    Connected Github issue
                  </GithubButton>
                </CreateEntitySelectWrapper>
              ) : (
                <CreateEntitySelectWrapper>
                  <CreateEntitySelectErrorWrapper>
                    <CreateEntityAutocompletePopper
                      onFocus={() => form.setFieldError('githubRepo', undefined)}
                      openOnFocus={true}
                      options={availableRepos}
                      value={form.values.githubRepo}
                      isOptionEqualToValue={(option, value) => {
                        return option.value?.id === value;
                      }}
                      getOptionLabel={(option) => option?.label || option.title || ''}
                      renderInput={(params) => {
                        // const assignee = filteredOrgUsersData.find((user) => user.value === params.inputProps.value);
                        return (
                          <CreateEntityAutocompletePopperRenderInput
                            {...params}
                            // inputProps={{
                            //   ...params.inputProps,
                            //   value: githubPullRequest?.label,
                            // }}
                            ref={params.InputProps.ref}
                            disableUnderline={true}
                            fullWidth={true}
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
                        );
                      }}
                      renderOption={(props, option) => {
                        return (
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
                        );
                      }}
                      error={form.errors?.githubRepo}
                    />
                    {form.errors?.githubRepo && <CreateEntityError>{form.errors?.githubRepo}</CreateEntityError>}
                  </CreateEntitySelectErrorWrapper>
                  {createGithubIssueLoading ? (
                    <CircularProgress />
                  ) : (
                    <GithubButton
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
                    </GithubButton>
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
                      openOnFocus={true}
                      options={availablePullRequests}
                      value={form.values.githubPullRequest}
                      isOptionEqualToValue={(option, value) => {
                        return option.value?.id === value;
                      }}
                      getOptionLabel={(option) => option?.label || option.title || ''}
                      renderInput={(params) => {
                        // const assignee = filteredOrgUsersData.find((user) => user.value === params.inputProps.value);
                        return (
                          <CreateEntityAutocompletePopperRenderInput
                            {...params}
                            // inputProps={{
                            //   ...params.inputProps,
                            //   value: githubPullRequest?.label,
                            // }}
                            ref={params.InputProps.ref}
                            disableUnderline={true}
                            fullWidth={true}
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
                        );
                      }}
                      renderOption={(props, option) => {
                        return (
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
                        );
                      }}
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
      </CreateEntityBody>
      <CreateEntityHeader>
        <CreateEntityHeaderWrapper>
          <CreateEntityPrivacySelect
            disabled={!isPrivacySelectorEnabled}
            name="privacyLevel"
            value={form.values.privacyLevel}
            onChange={form.handleChange('privacyLevel')}
            renderValue={(value) => {
              return (
                <Tooltip title={!isPrivacySelectorEnabled && 'The selected pod is for members only'} placement="top">
                  <CreateEntityPrivacySelectRender>
                    <CreateEntityPrivacySelectRenderLabel>{value?.label}</CreateEntityPrivacySelectRenderLabel>
                    <CreateEntitySelectArrowIcon />
                  </CreateEntityPrivacySelectRender>
                </Tooltip>
              );
            }}
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
        <CreateEntityHeaderWrapper>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <CreateEntityCancelButton onClick={cancel}>Cancel</CreateEntityCancelButton>
              <CreateEntitySelectErrorWrapper>
                <CreateEntityCreateTaskButton type="submit">
                  {existingTask ? `Edit` : `Create`} {entityType}
                </CreateEntityCreateTaskButton>
                {!_.isEmpty(form.errors) && <CreateEntityError>Something went wrong</CreateEntityError>}
              </CreateEntitySelectErrorWrapper>
            </>
          )}
        </CreateEntityHeaderWrapper>
      </CreateEntityHeader>
    </CreateEntityForm>
  );
};
