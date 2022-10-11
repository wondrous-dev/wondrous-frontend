import { useMutation, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import apollo from 'services/apollo';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import { CREATE_TASK_COMMENT, DELETE_TASK_COMMENT, CREATE_TASK_DISCORD_THREAD } from 'graphql/mutations/task';
import { CREATE_TASK_PROPOSAL_COMMENT, DELETE_TASK_PROPOSAL_COMMENT } from 'graphql/mutations/taskProposal';
import { PERMISSIONS, TASK_STATUS_REQUESTED, GRAPHQL_ERRORS } from 'utils/constants';
import { getMentionArray, parseUserPermissionContext, transformTaskToTaskCard, cutString } from 'utils/helpers';
import { TextInputContext } from 'utils/contexts';
import { GET_COMMENTS_FOR_TASK, GET_TASK_SUBMISSION_COMMENTS } from 'graphql/queries/task';
import { GET_COMMENTS_FOR_TASK_PROPOSAL } from 'graphql/queries/taskProposal';
import { formatDistance } from 'date-fns';
import { renderMentionString } from 'utils/common';
import { useRouter } from 'next/router';
import { useColumns, useOrgBoard, usePodBoard, useScrollIntoView, useUserBoard } from 'utils/hooks';
import { updateTask } from 'utils/board';
import { CREATE_SUBMISSION_COMMENT, DELETE_SUBMISSION_COMMENT } from 'graphql/mutations';
import { DiscordIcon } from 'components/Icons/discord';
import { TaskSubmissionHeaderCreatorText, TaskSubmissionHeaderTimeText } from 'components/Common/Task/styles';
import { ErrorText } from 'components/Common';
import { useMe } from 'components/Auth/withAuth';
import { TextInput } from 'components/TextInput';

import {
  AddCommentButton,
  CommentItemContainer,
  CommentListContainer,
  CommentListWrapper,
  CommentListEmptyStateContainer,
  CommentListEmptyStateIcon,
  CommentListEmptyStateText,
  CommentProfilePicture,
  CommentText,
  CommentTopFlexDiv,
  DefaultCommentProfilePicture,
  AddCommentContainer,
  DeleteText,
  TextInputDiv,
  DiscordDiscussionButtonWrapper,
  DiscordThreadCreateButton,
} from './styles';

export function CommentBox(props) {
  const user = useMe();
  const { orgId, existingContent, taskType, task, previousCommenterIds, submission } = props;
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || userBoard || podBoard;
  const boardColumns = useColumns();
  const [comment, setComment] = useState(existingContent || '');
  const [emptyCommentError, setEmptyCommentError] = useState(null);
  const [searchOrgUsers, { data: searchOrgUserResults }] = useLazyQuery(SEARCH_ORG_USERS);

  const [createTaskComment, { data: taskCommentData }] = useMutation(CREATE_TASK_COMMENT, {
    refetchQueries: ['getTaskComments'],
  });

  const [createTaskProposalComment] = useMutation(CREATE_TASK_PROPOSAL_COMMENT, {
    refetchQueries: ['getTaskProposalComments'],
  });

  const [createSubmissionComment] = useMutation(CREATE_SUBMISSION_COMMENT, {
    refetchQueries: ['getTaskSubmissionComments'],
  });

  const addComment = () => {
    if (!comment || comment.trim().length === 0) {
      setEmptyCommentError(true);
      return;
    }
    const mentionedUsers = getMentionArray(comment);
    const createArgs = {
      ...(taskType === TASK_STATUS_REQUESTED && {
        proposalId: task?.id,
      }),
      ...(taskType !== TASK_STATUS_REQUESTED && {
        taskId: task?.id,
      }),
      ...(submission && {
        submissionId: submission?.id,
      }),
      content: comment.trim(),
      userMentions: mentionedUsers,
      previousCommenterIds,
    };
    if (taskType === TASK_STATUS_REQUESTED) {
      createTaskProposalComment({
        variables: {
          input: createArgs,
        },
      });
    } else if (submission) {
      createSubmissionComment({
        variables: {
          input: createArgs,
        },
      });
    } else {
      createTaskComment({
        variables: {
          input: createArgs,
        },
      });
    }
    setComment('');
  };

  useEffect(() => {
    if (taskCommentData?.createTaskComment) {
      const updatedTask = { ...task, commentCount: task.commentCount + 1 };
      const transformedTask = transformTaskToTaskCard(updatedTask, boardColumns?.columns);
      const newBoardColumns = updateTask(transformedTask, boardColumns?.columns);
      boardColumns?.setColumns(newBoardColumns);
    }
  }, [taskCommentData]);

  if (!user) return null;

  const handleUserMentionChange = (query) =>
    searchOrgUsers({
      variables: {
        orgId,
        searchString: query,
      },
    }).then(({ data }) => data?.searchOrgUsers?.map((user) => ({ ...user, display: user.username, id: user.id })));

  const handleChange = (e) => {
    setEmptyCommentError(null);
    setComment(e.target.value);
  };
  return (
    <AddCommentContainer>
      <TextInputDiv>
        <TextInputContext.Provider
          value={{
            content: comment,
            onChange: handleChange,
            onMentionChange: handleUserMentionChange,
          }}
        >
          <TextInput placeholder="Write a comment" autoFocus />
        </TextInputContext.Provider>
      </TextInputDiv>
      {emptyCommentError && <ErrorText>Empty Comment</ErrorText>}
      <AddCommentButton onClick={addComment}>Add comment</AddCommentButton>
    </AddCommentContainer>
  );
}

function CommentItem(props) {
  const { comment, task, taskType, list, setList, submission } = props;
  const loggedInUser = useMe();
  const router = useRouter();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const boardColumns = useColumns();
  const isOpenedFromNotification = router?.query.taskCommentId === comment.id;
  const commentRef = useScrollIntoView(isOpenedFromNotification);
  const [deleteTaskComment, { data: deleteTaskCommentData }] = useMutation(DELETE_TASK_COMMENT, {
    refetchQueries: ['getTaskComments'],
  });

  const [deleteTaskProposalComment] = useMutation(DELETE_TASK_PROPOSAL_COMMENT, {
    refetchQueries: ['getTaskProposalComments'],
  });

  const [deleteTaskSubmissionComment] = useMutation(DELETE_SUBMISSION_COMMENT, {
    refetchQueries: ['getTaskSubmissionComments'],
  });

  useEffect(() => {
    if (deleteTaskCommentData?.deleteTaskComment) {
      const updatedTask = { ...task, commentCount: task.commentCount - 1 };
      const transformedTask = transformTaskToTaskCard(updatedTask, boardColumns?.columns);
      const newBoardColumns = updateTask(transformedTask, boardColumns?.columns);
      boardColumns?.setColumns(newBoardColumns);
    }
  }, [deleteTaskCommentData]);

  const board = orgBoard || podBoard || userBoard;
  if (!comment) return null;
  const {
    id,
    createdAt,
    timestamp,
    content,
    parentCommentId,
    actorFirstName,
    actorLastName,
    actorUsername,
    userId,
    actorProfilePicture,
    reactionCount,
  } = comment;
  const permissions = parseUserPermissionContext({
    userPermissionsContext: board?.userPermissionsContext,
    orgId: task?.orgId,
    podId: task?.podId,
  });
  const canEdit =
    permissions.includes(PERMISSIONS.MANAGE_BOARD) ||
    permissions.includes(PERMISSIONS.MANAGE_COMMENT) ||
    userId === loggedInUser?.id;

  return (
    <CommentItemContainer ref={commentRef} highlight={isOpenedFromNotification}>
      {actorProfilePicture ? <CommentProfilePicture src={actorProfilePicture} /> : <DefaultCommentProfilePicture />}
      <div>
        <CommentTopFlexDiv>
          <TaskSubmissionHeaderCreatorText>{actorUsername}</TaskSubmissionHeaderCreatorText>
          <TaskSubmissionHeaderTimeText>
            {formatDistance(new Date(createdAt), new Date(), {
              addSuffix: true,
            })}
          </TaskSubmissionHeaderTimeText>
        </CommentTopFlexDiv>
        <CommentText>
          {renderMentionString({
            content,
            router,
          })}
        </CommentText>
        {canEdit && (
          <DeleteText
            onClick={() => {
              const text = 'Are you sure you want to delete?';
              if (confirm(text)) {
                if (taskType === TASK_STATUS_REQUESTED) {
                  deleteTaskProposalComment({
                    variables: {
                      proposalCommentId: id,
                    },
                  });
                } else if (submission) {
                  deleteTaskSubmissionComment({
                    variables: {
                      submissionCommentId: id,
                    },
                  });
                } else {
                  deleteTaskComment({
                    variables: {
                      taskCommentId: id,
                    },
                  });
                }
              }
            }}
          >
            Delete
          </DeleteText>
        )}
      </div>
    </CommentItemContainer>
  );
}

function CommentListEmptyState() {
  return (
    <CommentListEmptyStateContainer>
      <CommentListEmptyStateIcon />
      <CommentListEmptyStateText>No comments yet</CommentListEmptyStateText>
    </CommentListEmptyStateContainer>
  );
}

export function CommentList(props) {
  const { taskType, task, submission } = props;
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [getTaskComments] = useLazyQuery(GET_COMMENTS_FOR_TASK, {
    onCompleted: (data) => {
      const commentList = data?.getTaskComments;
      setComments(commentList);
    },
    fetchPolicy: 'network-only',
  });
  const [getTaskProposalComments] = useLazyQuery(GET_COMMENTS_FOR_TASK_PROPOSAL, {
    onCompleted: (data) => {
      const commentList = data?.getTaskProposalComments;
      setComments(commentList);
    },
    fetchPolicy: 'network-only',
  });

  const [getSubmissionComments] = useLazyQuery(GET_TASK_SUBMISSION_COMMENTS, {
    onCompleted: (data) => {
      const commentList = data?.getTaskSubmissionComments;
      setComments(commentList);
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (task && taskType === TASK_STATUS_REQUESTED) {
      getTaskProposalComments({
        variables: {
          proposalId: task?.id,
        },
      });
    } else if (submission) {
      getSubmissionComments({
        variables: {
          submissionId: submission?.id,
        },
      });
    } else if (task) {
      getTaskComments({
        variables: {
          taskId: task?.id,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, taskType, submission]);

  const set = new Set();
  comments?.forEach((comment) => {
    set.add(comment?.userId);
  });
  const handleDiscordButtonClick = async () => {
    try {
      const {
        data: {
          createTaskDiscordThread: { guildIds, threadIds },
        },
      } = await apollo.mutate({
        mutation: CREATE_TASK_DISCORD_THREAD,
        variables: {
          taskId: task?.id,
        },
      });

      guildIds.forEach((guild, idx) => window.open(`discord://.com/channels/${guild}/${threadIds[idx]}`));
    } catch (err) {
      if (err?.graphQLErrors && err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.DISCORD_NOT_CONFIGURED) {
        if (task?.podId) {
          router.push(`/pod/settings/${task?.podId}/notifications`);
        } else if (task?.orgId) {
          router.push(`/organization/settings/${task?.orgId}/notifications`);
        }
      }
    }
  };

  return (
    <CommentListWrapper>
      {!task?.org?.shared && (
        <DiscordDiscussionButtonWrapper>
          <DiscordThreadCreateButton onClick={handleDiscordButtonClick}>
            <DiscordIcon style={{ marginRight: 10 }} />
            Open Discussion
          </DiscordThreadCreateButton>
        </DiscordDiscussionButtonWrapper>
      )}

      <CommentBox
        orgId={task?.orgId || submission?.orgId}
        existingContent=""
        taskType={taskType}
        task={task}
        previousCommenterIds={Array.from(set)}
        submission={submission}
      />
      <CommentListContainer>
        {comments?.length > 0 ? (
          comments.map((comment) => (
            <CommentItem key={comment?.id} comment={comment} taskType={taskType} task={task} submission={submission} />
          ))
        ) : (
          <CommentListEmptyState />
        )}
      </CommentListContainer>
    </CommentListWrapper>
  );
}
