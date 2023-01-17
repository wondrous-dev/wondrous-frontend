import { useLazyQuery, useMutation } from '@apollo/client';
import {
  CREATE_TASK_GITHUB_ISSUE,
  CREATE_LABEL,
  CREATE_TASK,
  CREATE_MILESTONE,
  CREATE_BOUNTY,
  UPDATE_TASK,
  UPDATE_MILESTONE,
  UPDATE_BOUNTY,
  CREATE_TASK_PROPOSAL,
  UPDATE_TASK_PROPOSAL,
} from 'graphql/mutations';
import {
  GET_ORG_ROLES,
  GET_USER_AVAILABLE_PODS,
  GET_POD_GITHUB_INTEGRATIONS,
  GET_POD_GITHUB_PULL_REQUESTS,
  GET_ELIGIBLE_REVIEWERS_FOR_ORG,
  GET_ELIGIBLE_REVIEWERS_FOR_POD,
  GET_ORG_LABELS,
  GET_PAYMENT_METHODS_FOR_ORG,
  SEARCH_ORG_USERS,
  GET_MILESTONES,
  SEARCH_USER_CREATED_TASKS,
  GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK,
} from 'graphql/queries';
import { debounce } from 'lodash';
import { useEffect, useState, useCallback, useContext } from 'react';
import { LIMIT } from 'services/board';
import {
  updateInReviewItem,
  updateInProgressTask,
  updateTaskItem,
  updateCompletedItem,
  updateTaskItemOnEntityType,
  removeInReviewItem,
  removeInProgressTask,
  removeTaskItem,
  removeCompletedItem,
  removeTaskItemOnEntityType,
} from 'utils/board';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import {
  CATEGORY_LABELS,
  ENTITIES_TYPES,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_TODO,
  TASK_STATUS_DONE,
  PROPOSAL_VOTE_CHOICES,
  PROPOSAL_VOTE_CHOICE_LABELS,
} from 'utils/constants';
import { transformTaskToTaskCard } from 'utils/helpers';
import {
  filterGithubPullRequestsForAutocomplete,
  filterGithubReposForAutocomplete,
  filterUserOptions,
  getPodObject,
  onCorrectPage,
} from 'components/CreateEntity/CreateEntityModal/Helpers/utils';
import { Typography } from '@mui/material';
import { palette } from '@mui/system';

const HANDLE_TASKS = {
  REMOVE: {
    inReview: removeInReviewItem,
    inProgress: removeInProgressTask,
    done: removeCompletedItem,
    toDo: removeTaskItem,
    onEntityType: removeTaskItemOnEntityType,
  },
  UPDATE: {
    inReview: updateInReviewItem,
    inProgress: updateInProgressTask,
    done: updateCompletedItem,
    toDo: updateTaskItem,
    onEntityType: updateTaskItemOnEntityType,
  },
};

export const useGetOrgRoles = (org) => {
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

export const useGetAvailableUserPods = (org) => {
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

export const useGetPodGithubIntegrations = (pod) => {
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

export const useGetPodPullRequests = (pod) => {
  const [getPodGithubPullRequests, { data: podGithubPullRequestsData }] = useLazyQuery(GET_POD_GITHUB_PULL_REQUESTS, {
    fetchPolicy: 'cache-and-network',
  });
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

export const useGetEligibleReviewers = (org, pod) => {
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
        fetchPolicy: 'cache-and-network',
      });
    } else if (org) {
      getEligibleReviewersForOrg({
        variables: {
          orgId: org,
          searchString: '',
        },
        fetchPolicy: 'cache-and-network',
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

export const useGetOrgLabels = (orgId) => {
  const [getOrgLabels, { data }] = useLazyQuery(GET_ORG_LABELS, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    if (orgId) {
      getOrgLabels({
        variables: {
          orgId,
        },
      });
    }
  }, [orgId, getOrgLabels]);

  return data?.getOrgLabels;
};

export const useCreateGithubIssueFromTask = (taskId, callback) => {
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

export const useCreateLabel = (orgId, callback) => {
  const [createLabel] = useMutation(CREATE_LABEL, {
    refetchQueries: () => ['getOrgLabels'],
  });

  const handleCreateLabel = async (label) => {
    const {
      data: { createLabel: newLabel },
    } = await createLabel({
      variables: {
        input: {
          orgId,
          name: label.name,
          color: label.color,
        },
      },
    });
    callback(newLabel.id);
  };
  return handleCreateLabel;
};

export const useGetPaymentMethods = (orgId, includeDeactivated = false) => {
  const [getPaymentMethods, { data }] = useLazyQuery(GET_PAYMENT_METHODS_FOR_ORG);
  useEffect(() => {
    if (orgId) {
      getPaymentMethods({
        variables: {
          orgId,
          includeDeactivated,
        },
      });
    }
  }, [orgId, includeDeactivated, getPaymentMethods]);
  return data?.getPaymentMethodsForOrg;
};

export const useGetOrgUsers = (orgId, searchString = '') => {
  const [hasMore, setHasMore] = useState(false);

  const [searchOrgUsers, { data, refetch, fetchMore, previousData, loading }] = useLazyQuery(SEARCH_ORG_USERS, {
    onCompleted: (data) => {
      setTimeout(() => {
        if (!previousData) {
          setHasMore(data.searchOrgUsers.length === LIMIT);
        }
      });
    },
  });

  const fetchMoreOrgUsers = () =>
    fetchMore({ variables: { offset: data.searchOrgUsers.length } }).then(({ data }) =>
      setHasMore(data?.searchOrgUsers?.length === LIMIT)
    );

  const refetchUsers = useCallback(debounce(refetch, 500), []);

  const search = (query) => refetchUsers({ searchString: query, offset: 0 });

  useEffect(() => {
    if (orgId)
      searchOrgUsers({
        variables: {
          orgIds: [orgId],
          searchString,
          limit: LIMIT,
        },
      });
  }, [orgId, searchOrgUsers, searchString]);
  return { data: data?.searchOrgUsers, search, hasMoreOrgUsers: hasMore, fetchMoreOrgUsers };
};

export const useGetMilestones = (orgId, podId) => {
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

export const useGetCategories = () =>
  Object.keys(CATEGORY_LABELS).map((key) => ({
    id: key,
    label: CATEGORY_LABELS[key],
  }));

export const useGetProposalChoices = () =>
  Object.keys(PROPOSAL_VOTE_CHOICE_LABELS).map((key) => ({
    value: key,
    label: PROPOSAL_VOTE_CHOICE_LABELS[key],
  }));

export const useCreateTask = () => {
  const [createTask, { loading }] = useMutation(CREATE_TASK, {
    refetchQueries: () => [
      'getPerStatusTaskCountForMilestone',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      'getSubtasksForTask',
      'getSubtaskCountForTask',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getTasksForMilestone',
      SEARCH_USER_CREATED_TASKS,
      GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK,
    ],
  });

  const handleMutation = ({ input, board, pods, form, handleClose }) =>
    createTask({
      variables: {
        input,
      },
    })
      .then(() => {
        handleClose();
      })
      .catch((e) => console.error(e));

  return { handleMutation, loading };
};

export const useCreateMilestone = () => {
  const [createMilestone, { loading }] = useMutation(CREATE_MILESTONE, {
    refetchQueries: () => [
      'getUserTaskBoardTasks',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      'getMilestones',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
    ],
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
        // board?.setEntityType(ENTITIES_TYPES.MILESTONE);
      }
      handleClose(result);
    });
  };
  return { handleMutation, loading };
};

export const useCreateBounty = () => {
  const [createBounty, { loading }] = useMutation(CREATE_BOUNTY, {
    refetchQueries: () => [
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
    ],
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

export const useUpdateTask = () => {
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [updateTask, { loading }] = useMutation(UPDATE_TASK, {
    refetchQueries: () => [
      'getPerStatusTaskCountForMilestone',
      'getUserTaskBoardTasks',
      'getPerStatusTaskCountForUserBoard',
      SEARCH_USER_CREATED_TASKS,
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
      if (board?.setColumns) {
        const transformedTask = transformTaskToTaskCard(task, {});
        let columns = [...board?.columns];

        const handleTasks = onCorrectPage(task, board) ? HANDLE_TASKS.UPDATE : HANDLE_TASKS.REMOVE;

        if (transformedTask.status === TASK_STATUS_IN_REVIEW) {
          columns = handleTasks.inReview(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
          columns = handleTasks.inProgress(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_TODO) {
          columns = handleTasks.toDo(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_DONE) {
          columns = handleTasks.done(transformedTask, columns);
        }
        board.setColumns(columns);
      }
      setSnackbarAlertMessage('Success! Task updated :)');
      setSnackbarAlertOpen(true);
      handleClose();
    });
  };
  return { handleMutation, loading };
};

export const useUpdateMilestone = () => {
  const [updateMilestone, { loading }] = useMutation(UPDATE_MILESTONE);
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const handleMutation = ({ input, board, handleClose, existingTask }) => {
    updateMilestone({
      variables: {
        milestoneId: existingTask?.id,
        input,
      },
    }).then(({ data }) => {
      const milestone = data?.updateMilestone;
      if (board?.setColumns) {
        const transformedTask = transformTaskToTaskCard(milestone, {});

        const handleTasks = onCorrectPage(milestone, board) ? HANDLE_TASKS.UPDATE : HANDLE_TASKS.REMOVE;
        let columns = [...board?.columns];
        if (transformedTask.status === TASK_STATUS_IN_REVIEW) {
          columns = handleTasks.inReview(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_IN_PROGRESS) {
          columns = handleTasks.inProgress(transformedTask, columns);
          // if there's no entityType we assume it's the userBoard and keeping the old logic
        } else if (transformedTask.status === TASK_STATUS_TODO && !board?.entityType) {
          columns = handleTasks.toDo(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_TODO && board?.entityType) {
          columns = handleTasks.onEntityType(transformedTask, columns);
        } else if (transformedTask.status === TASK_STATUS_DONE) {
          columns = handleTasks.done(transformedTask, columns);
        }
        board.setColumns(columns);
      }
      setSnackbarAlertMessage('Success! Milestone updated :)');
      setSnackbarAlertOpen(true);
      handleClose();
    });
  };
  return { handleMutation, loading };
};

export const useUpdateBounty = () => {
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [updateBounty, { loading }] = useMutation(UPDATE_BOUNTY, {
    refetchQueries: () => [
      'getOrgTaskBoardTasks',
      'getPodTaskBoardTasks',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForPodBoard',
    ],
  });
  const handleMutation = ({ input, existingTask, handleClose }) => {
    // this should filter out fields that are not in bountyinput
    updateBounty({
      variables: {
        bountyId: existingTask?.id,
        input,
      },
    }).then(() => {
      setSnackbarAlertMessage('Success! Bounty updated :)');
      setSnackbarAlertOpen(true);
      handleClose();
    });
  };
  return { handleMutation, loading };
};

export const useCreateTaskProposal = () => {
  const [createTaskProposal, { loading }] = useMutation(CREATE_TASK_PROPOSAL, {
    refetchQueries: () => [
      'GetOrgTaskBoardProposals',
      'getPodTaskBoardProposals',
      'GetUserTaskBoardProposals',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getPerStatusTaskCountForOrgBoard',
      'getUserTaskBoardProposals',
    ],
  });

  const handleMutation = ({ input, board, pods, form, handleClose }) =>
    createTaskProposal({
      variables: {
        input: {
          title: input.title,
          description: input.description,
          milestoneId: input.milestoneId,
          orgId: input.orgId,
          podId: input.podId,
          reviewerIds: input.reviewerIds,
          dueDate: input.dueDate,
          timezone: input.timezone,
          labelIds: input.labelIds,
          proposedAssigneeId: input.assigneeId,
          userMentions: input.userMentions,
          mediaUploads: input.mediaUploads,
          rewards: input.rewards,
          privacyLevel: input.privacyLevel,
          voteOptions: input.voteOptions,
          voteType: input.voteType,
        },
      },
    })
      .then(() => {
        handleClose();
      })
      .catch((e) => console.error(e));

  return { handleMutation, loading };
};

export const useUpdateTaskProposal = () => {
  const snackbarContext = useContext(SnackbarAlertContext);
  const setSnackbarAlertOpen = snackbarContext?.setSnackbarAlertOpen;
  const setSnackbarAlertMessage = snackbarContext?.setSnackbarAlertMessage;
  const [updateTaskProposal, { loading }] = useMutation(UPDATE_TASK_PROPOSAL, {
    refetchQueries: () => [
      'GetUserTaskBoardProposals',
      'GetOrgTaskBoardProposals',
      'getPodTaskBoardProposals',
      'getPerTypeTaskCountForOrgBoard',
      'getPerTypeTaskCountForPodBoard',
      'getUserTaskBoardProposals',
    ],
  });

  const handleMutation = ({ input, board, handleClose, existingTask }) => {
    updateTaskProposal({
      variables: {
        proposalId: existingTask?.id,
        input: {
          title: input.title,
          description: input.description,
          milestoneId: input.milestoneId,
          orgId: input.orgId,
          podId: input.podId,
          priority: input.priority,
          reviewerIds: input.reviewerIds,
          dueDate: input.dueDate,
          timezone: input.timezone,
          labelIds: input.labelIds,
          proposedAssigneeId: input.assigneeId,
          userMentions: input.userMentions,
          mediaUploads: input.mediaUploads,
          rewards: input.rewards,
          privacyLevel: input.privacyLevel,
        },
      },
    }).then(() => {
      setSnackbarAlertMessage('Success! Proposal updated :)');
      setSnackbarAlertOpen(true);
      handleClose();
    });
  };
  return { handleMutation, loading };
};

export const useContextValue = (condition, callback) => {
  useEffect(() => {
    if (condition) {
      callback();
    }
  }, [condition, callback]);
};
