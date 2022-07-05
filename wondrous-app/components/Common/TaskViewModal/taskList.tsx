import { useLazyQuery } from '@apollo/client';
import { LoadMore } from 'components/Common/KanbanBoard/styles';
import { TaskListCard } from 'components/Common/Task';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import {
  GET_ORG_TASK_BOARD_PROPOSALS,
  GET_ORG_TASK_BOARD_SUBMISSIONS,
  GET_ORG_TASK_BOARD_TASKS,
  GET_POD_TASK_BOARD_PROPOSALS,
  GET_POD_TASK_BOARD_SUBMISSIONS,
  GET_POD_TASK_BOARD_TASKS,
  GET_USER_TASK_BOARD_PROPOSALS,
  GET_USER_TASK_BOARD_SUBMISSIONS,
  GET_USER_TASK_BOARD_TASKS,
} from 'graphql/queries/taskBoard';
import { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  ENTITIES_TYPES,
  STATUS_OPEN,
  TASK_STATUS_ARCHIVED,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_REQUESTED,
} from 'utils/constants';
import { TaskListModalContentWrapper, TaskListModalHeader, TaskModalCard } from './styles';

const LIMIT = 5;

const TASK_LIST_VIEW_LIMIT = 5;

export const TaskListViewModal = (props) => {
  const [fetchedList, setFetchedList] = useState([]);
  const { taskType, entityType, orgId, podId, loggedInUserId, open, handleClose, count } = props;

  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(true);
  const [getOrgTaskProposals, { refetch: refetchOrgProposals, fetchMore: fetchMoreOrgProposals }] = useLazyQuery(
    GET_ORG_TASK_BOARD_PROPOSALS,
    {
      onCompleted: (data) => {
        const proposals = data?.getOrgTaskBoardProposals;
        setFetchedList(proposals);
        if (hasMore) {
          setHasMore(data?.hasMore || data?.getOrgTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT);
        }
      },
    }
  );
  const [getOrgTaskSubmissions, { refetch: refetchOrgSubmissions, fetchMore: fetchMoreOrgSubmissions }] = useLazyQuery(
    GET_ORG_TASK_BOARD_SUBMISSIONS,
    {
      onCompleted: (data) => {
        const submissions = data?.getOrgTaskBoardSubmissions;
        setFetchedList(submissions);
        if (hasMore) {
          setHasMore(data?.hasMore || data?.getOrgTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT);
        }
      },
    }
  );

  const [getOrgArchivedTasks, { refetch: refetchOrgArchivedTasks, fetchMore: fetchMoreOrgArchivedTasks }] =
    useLazyQuery(GET_ORG_TASK_BOARD_TASKS, {
      onCompleted: (data) => {
        const tasks = data?.getOrgTaskBoardTasks;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || data?.getOrgTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT);
      },
    });
  const [getPodTaskProposals, { fetchMore: fetchMorePodProposals }] = useLazyQuery(GET_POD_TASK_BOARD_PROPOSALS, {
    onCompleted: (data) => {
      const tasks = data?.getPodTaskBoardProposals;
      setFetchedList(tasks);
      setHasMore(data?.hasMore || data?.getPodTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT);
    },
  });

  const [getPodTaskSubmissions, { fetchMore: fetchMorePodTaskSubmissions }] = useLazyQuery(
    GET_POD_TASK_BOARD_SUBMISSIONS,
    {
      onCompleted: (data) => {
        const tasks = data?.getPodTaskBoardSubmissions;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || data?.getPodTaskBoardSubmissions?.length >= TASK_LIST_VIEW_LIMIT);
      },
    }
  );

  const [getPodArchivedTasks, { fetchMore: fetchMorePodArchivedTasks }] = useLazyQuery(GET_POD_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      const tasks = data?.getPodTaskBoardTasks;
      setFetchedList(tasks);
      setHasMore(data?.hasMore || data?.getPodTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT);
    },
  });

  const [getUserTaskBoardProposals, { fetchMore: fetchMoreUserTaskProposals }] = useLazyQuery(
    GET_USER_TASK_BOARD_PROPOSALS,
    {
      onCompleted: (data) => {
        const tasks = data?.getUserTaskBoardProposals;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || tasks?.length >= TASK_LIST_VIEW_LIMIT);
      },
    }
  );

  const [getUserTaskBoardSubmissions, { fetchMore: fetchMoreUserTaskSubmissions }] = useLazyQuery(
    GET_USER_TASK_BOARD_SUBMISSIONS,
    {
      onCompleted: (data) => {
        const tasks = data?.getUserTaskBoardSubmissions;
        setFetchedList(tasks);
        setHasMore(data?.hasMore || tasks?.length >= TASK_LIST_VIEW_LIMIT);
      },
    }
  );

  const [getUserArchivedTasks, { fetchMore: fetchMoreUserArchivedTasks }] = useLazyQuery(GET_USER_TASK_BOARD_TASKS, {
    onCompleted: (data) => {
      const tasks = data?.getUserTaskBoardTasks;
      setFetchedList(tasks);
      setHasMore(data?.hasMore || tasks?.length >= LIMIT);
    },
  });

  const handleLoadMore = useCallback(() => {
    if (hasMore) {
      if (taskType === TASK_STATUS_REQUESTED) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgProposals({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getOrgTaskBoardProposals: prev.getOrgTaskBoardProposals.concat(
                  fetchMoreResult.getOrgTaskBoardProposals
                ),
              };
            },
          }).catch((error) => {
            console.error(error);
          });
        } else if (entityType === ENTITIES_TYPES.POD) {
          fetchMorePodProposals({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getPodTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getPodTaskBoardProposals: prev.getPodTaskBoardProposals.concat(
                  fetchMoreResult.getPodTaskBoardProposals
                ),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.USER) {
          fetchMoreUserTaskProposals({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getUserTaskBoardProposals.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getUserTaskBoardProposals: prev.getUserTaskBoardProposals.concat(
                  fetchMoreResult.getUserTaskBoardProposals
                ),
              };
            },
          });
        }
      } else if (taskType === TASK_STATUS_IN_REVIEW) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgSubmissions({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }

              return {
                hasMore,
                getOrgTaskBoardSubmissions: prev.getOrgTaskBoardSubmissions.concat(
                  fetchMoreResult.getOrgTaskBoardSubmissions
                ),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.POD) {
          fetchMorePodTaskSubmissions({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getPodTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }

              return {
                hasMore,
                getPodTaskBoardSubmissions: prev.getPodTaskBoardSubmissions.concat(
                  fetchMoreResult.getPodTaskBoardSubmissions
                ),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.USER) {
          fetchMoreUserTaskSubmissions({
            variables: {
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
              statuses: [STATUS_OPEN],
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getUserTaskBoardSubmissions.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }

              return {
                hasMore,
                getUserTaskBoardSubmissions: prev.getUserTaskBoardSubmissions.concat(
                  fetchMoreResult.getUserTaskBoardSubmissions
                ),
              };
            },
          });
        }
      } else if (taskType === TASK_STATUS_ARCHIVED) {
        if (entityType === ENTITIES_TYPES.ORG) {
          fetchMoreOrgArchivedTasks({
            variables: {
              statuses: ['archived'],
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getOrgTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getOrgTaskBoardTasks: prev.getOrgTaskBoardTasks.concat(fetchMoreResult.getOrgTaskBoardTasks),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.POD) {
          fetchMorePodArchivedTasks({
            variables: {
              statuses: ['archived'],
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getPodTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getPodTaskBoardTasks: prev.getPodTaskBoardTasks.concat(fetchMoreResult.getPodTaskBoardTasks),
              };
            },
          });
        } else if (entityType === ENTITIES_TYPES.USER) {
          fetchMoreUserArchivedTasks({
            variables: {
              statuses: ['archived'],
              offset: fetchedList.length,
              limit: TASK_LIST_VIEW_LIMIT,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              const hasMore = fetchMoreResult.getUserTaskBoardTasks.length >= TASK_LIST_VIEW_LIMIT;
              if (!fetchMoreResult) {
                return prev;
              }
              if (!hasMore) {
                setHasMore(false);
              }
              return {
                hasMore,
                getUserTaskBoardTasks: prev.getUserTaskBoardTasks.concat(fetchMoreResult.getUserTaskBoardTasks),
              };
            },
          });
        }
      }
    }
  }, [
    hasMore,
    entityType,
    fetchMoreOrgProposals,
    taskType,
    fetchedList?.length,
    fetchMoreOrgArchivedTasks,
    fetchMoreOrgSubmissions,
  ]);

  useEffect(() => {
    if (open) {
      if (fetchedList?.length === 0) {
        if (taskType === TASK_STATUS_REQUESTED) {
          if (entityType === ENTITIES_TYPES.ORG) {
            getOrgTaskProposals({
              variables: {
                orgId,
                statuses: [STATUS_OPEN],
              },
            });
          } else if (entityType === ENTITIES_TYPES.POD) {
            getPodTaskProposals({
              variables: {
                input: {
                  podId,
                  statuses: [STATUS_OPEN],
                },
              },
            });
          } else if (entityType === ENTITIES_TYPES.USER) {
            getUserTaskBoardProposals({
              variables: {
                userId: loggedInUserId,
                statuses: [STATUS_OPEN],
              },
            });
          }
        } else if (taskType === TASK_STATUS_IN_REVIEW) {
          if (entityType === ENTITIES_TYPES.ORG) {
            getOrgTaskSubmissions({
              variables: {
                orgId,
                statuses: [STATUS_OPEN],
              },
            });
          } else if (entityType === ENTITIES_TYPES.POD) {
            getPodTaskSubmissions({
              variables: {
                input: {
                  podId,
                  statuses: [STATUS_OPEN],
                },
              },
            });
          } else if (entityType === ENTITIES_TYPES.USER) {
            getUserTaskBoardSubmissions({
              variables: {
                userId: loggedInUserId,
                statuses: [STATUS_OPEN],
              },
            });
          }
        } else if (taskType === TASK_STATUS_ARCHIVED) {
          if (entityType === ENTITIES_TYPES.ORG) {
            getOrgArchivedTasks({
              variables: {
                orgId,
                statuses: ['archived'],
                offset: 0,
                limit: TASK_LIST_VIEW_LIMIT,
              },
            });
          } else if (entityType === ENTITIES_TYPES.POD) {
            getPodArchivedTasks({
              variables: {
                input: {
                  podId,
                  statuses: ['archived'],
                  offset: 0,
                  limit: TASK_LIST_VIEW_LIMIT,
                },
              },
            });
          } else if (entityType === ENTITIES_TYPES.USER) {
            getUserArchivedTasks({
              variables: {
                userId: loggedInUserId,
                statuses: ['archived'],
                offset: 0,
                limit: TASK_LIST_VIEW_LIMIT,
              },
            });
          }
        }
      }
      if (inView && hasMore) {
        handleLoadMore();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgId, taskType, entityType, inView, open]);

  let text = '';
  let refetch;
  if (taskType === TASK_STATUS_REQUESTED) {
    text = 'Proposals';
  } else if (taskType === TASK_STATUS_IN_REVIEW) {
    text = 'Submissions';
  } else if (taskType === TASK_STATUS_ARCHIVED) {
    text = 'Tasks';
  }

  return (
    <CreateModalOverlay
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <TaskModalCard>
        <TaskListModalHeader>
          {count} {text}
        </TaskListModalHeader>
        <TaskListModalContentWrapper>
          {fetchedList?.map((task, index) => {
            return <TaskListCard key={task?.id} taskType={taskType} task={task} />;
          })}
          <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
        </TaskListModalContentWrapper>
      </TaskModalCard>
    </CreateModalOverlay>
  );
};
