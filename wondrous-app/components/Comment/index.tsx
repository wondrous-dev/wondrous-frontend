import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import { ErrorText } from 'components/Common';
import { Button } from 'components/Common/button';
import CommentItem from 'components/Common/CommentItem';
import SubmittableCommentType from 'components/Common/SubmittableCommentType';
import { DiscordIcon } from 'components/Icons/discord';
import { TextInput } from 'components/TextInput';
import { formatDistance } from 'date-fns';
import { CREATE_SUBMISSION_COMMENT, DELETE_SUBMISSION_COMMENT } from 'graphql/mutations';
import { CREATE_GRANT_APPLICATION_COMMENT, CREATE_GRANT_COMMENT, DELETE_GRANT_COMMENT } from 'graphql/mutations/grant';
import { CREATE_TASK_COMMENT, CREATE_TASK_DISCORD_THREAD, DELETE_TASK_COMMENT } from 'graphql/mutations/task';
import { CREATE_TASK_PROPOSAL_COMMENT, DELETE_TASK_PROPOSAL_COMMENT } from 'graphql/mutations/taskProposal';
import { GET_GRANT_APPLICATIONS, GET_GRANT_APPLICATION_COMMENTS, GET_GRANT_COMMENTS } from 'graphql/queries';
import { SEARCH_ORG_USERS } from 'graphql/queries/org';
import {
  GET_COMMENTS_FOR_TASK,
  GET_TASK_REVIEWERS,
  GET_TASK_SUBMISSIONS_FOR_TASK,
  GET_TASK_SUBMISSION_COMMENTS,
} from 'graphql/queries/task';
import { GET_COMMENTS_FOR_TASK_PROPOSAL } from 'graphql/queries/taskProposal';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import apollo from 'services/apollo';
import { updateTask } from 'utils/board';
import { renderMentionString } from 'utils/common';
import { COMMENTER_ROLE, ENTITIES_TYPES, GRAPHQL_ERRORS, PERMISSIONS, SUBMISSION_COMMENT_TYPE } from 'utils/constants';
import { TextInputContext } from 'utils/contexts';
import { getMentionArray, parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';
import { useColumns, useOrgBoard, usePodBoard, useScrollIntoView, useUserBoard } from 'utils/hooks';

import {
  AddCommentButton,
  AddCommentContainer,
  CommentListContainer,
  CommentListEmptyStateContainer,
  CommentListEmptyStateIcon,
  CommentListEmptyStateText,
  CommentListWrapper,
  DiscordDiscussionButtonWrapper,
  TextInputDiv,
} from './styles';

const AddComment = ({ onClick, type }) => {
  const text = {
    [SUBMISSION_COMMENT_TYPE.CHANGE_REQUESTED]: 'Send request',
    [SUBMISSION_COMMENT_TYPE.APPROVED]: 'Send Kudos',
  };
  const selectedText = text[type] || 'Add comment';
  return <AddCommentButton onClick={onClick}>{selectedText}</AddCommentButton>;
};

function CommentBox(props) {
  const user = useMe();
  const {
    orgId,
    existingContent,
    entityType,
    task,
    previousCommenterIds,
    submission,
    type,
    onCommentCallback = () => null,
  } = props;
  const boardColumns = useColumns();
  const [comment, setComment] = useState(existingContent || '');
  const [emptyCommentError, setEmptyCommentError] = useState(null);
  const [searchOrgUsers] = useLazyQuery(SEARCH_ORG_USERS);

  const [createTaskComment, { data: taskCommentData }] = useMutation(CREATE_TASK_COMMENT, {
    refetchQueries: ['getTaskComments'],
  });

  const [createTaskProposalComment] = useMutation(CREATE_TASK_PROPOSAL_COMMENT, {
    refetchQueries: ['getTaskProposalComments'],
  });

  const [createGrantComment] = useMutation(CREATE_GRANT_COMMENT, {
    refetchQueries: ['getGrantComments'],
  });
  const [createSubmissionComment] = useMutation(CREATE_SUBMISSION_COMMENT, {
    refetchQueries: ['getTaskSubmissionComments', GET_TASK_SUBMISSIONS_FOR_TASK],
  });

  const [createGrantApplicationComment] = useMutation(CREATE_GRANT_APPLICATION_COMMENT, {
    refetchQueries: ['getGrantApplicationComments', 'getGrantApplicationsForGrant'],
  });

  const addComment = () => {
    const emptyComment = !comment || comment.trim().length === 0;
    if (type && emptyComment) {
      onCommentCallback();
      return;
    }
    if (emptyComment) {
      setEmptyCommentError(true);
      return;
    }
    const mentionedUsers = getMentionArray(comment);
    const commentArgs = {
      type,
      content: comment.trim(),
      userMentions: mentionedUsers,
      previousCommenterIds,
    };
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      return createGrantApplicationComment({
        variables: {
          input: {
            grantApplicationId: task?.id,
            ...commentArgs,
          },
        },
      }).then(() => {
        onCommentCallback();
        setComment('');
      });
    }
    if (entityType === ENTITIES_TYPES.GRANT) {
      return createGrantComment({
        variables: {
          input: {
            grantId: task?.id,
            ...commentArgs,
          },
        },
      }).then(() => setComment(''));
    }
    if (entityType === ENTITIES_TYPES.PROPOSAL) {
      return createTaskProposalComment({
        variables: {
          input: { ...commentArgs, proposalId: task?.id },
        },
      });
    }
    if (submission) {
      return createSubmissionComment({
        variables: {
          input: { ...commentArgs, submissionId: submission?.id, type },
        },
      }).then(() => onCommentCallback());
    }
    return createTaskComment({
      variables: {
        input: { ...commentArgs, taskId: task?.id },
      },
    }).then(() => setComment(''));
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
        orgIds: [orgId],
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
      <AddComment onClick={addComment} type={type} />
    </AddCommentContainer>
  );
}

const useSelectCommenterRole = ({ task, comment }) => {
  const { data: reviewerData } = useQuery(GET_TASK_REVIEWERS, {
    fetchPolicy: 'cache-only',
    variables: {
      taskId: task.id,
    },
  });
  if (task?.assigneeId === comment.userId) return COMMENTER_ROLE.Assignee;
  if (reviewerData?.getTaskReviewers.map((i) => i.id).includes(comment.userId)) return COMMENTER_ROLE.Reviewer;
  return null;
};

function CommentItemWrapper(props) {
  const { comment, task, entityType, submission } = props;
  const loggedInUser = useMe();
  const router = useRouter();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const boardColumns = useColumns();
  const isOpenedFromNotification = router?.query.taskCommentId === comment.id;
  const commentRef = useScrollIntoView(isOpenedFromNotification);
  const role = useSelectCommenterRole({ task, comment });
  const [deleteTaskComment, { data: deleteTaskCommentData }] = useMutation(DELETE_TASK_COMMENT, {
    refetchQueries: ['getTaskComments'],
  });

  const [deleteGrantComment] = useMutation(DELETE_GRANT_COMMENT, {
    refetchQueries: ['getGrantComments'],
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
    additionalData,
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
    <CommentItem
      commentRef={commentRef}
      isOpenedFromNotification={isOpenedFromNotification}
      actorProfilePicture={actorProfilePicture}
      actorUsername={actorUsername}
      timeText={formatDistance(new Date(createdAt), new Date(), {
        addSuffix: true,
      })}
      handleOnDelete={() => {
        const text = 'Are you sure you want to delete?';
        if (confirm(text)) {
          if (entityType === ENTITIES_TYPES.GRANT) {
            return deleteGrantComment({
              variables: {
                grantCommentId: id,
              },
            });
          }
          if (entityType === ENTITIES_TYPES.PROPOSAL) {
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
      canEdit={canEdit}
      commentText={renderMentionString({
        content,
        router,
      })}
      role={role}
      type={additionalData?.type}
    />
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

export default function CommentList(props) {
  const {
    entityType,
    task,
    submission,
    type,
    onCommentCallback = () => null,
    showComments = true,
    showCommentBox = true,
  } = props;
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const [getGrantComments] = useLazyQuery(GET_GRANT_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const commentList = data?.getGrantComments;
      setComments(commentList);
    },
  });

  const [getGrantApplicationComments] = useLazyQuery(GET_GRANT_APPLICATION_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    onCompleted: (data) => {
      const commentList = data?.getGrantApplicationComments;
      setComments(commentList);
    },
  });

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

  const handleCommentList = () => {
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      return getGrantApplicationComments({
        variables: {
          grantApplicationId: task?.id,
        },
      });
    }
    if (entityType === ENTITIES_TYPES.GRANT) {
      return getGrantComments({
        variables: {
          grantId: task?.id,
        },
      });
    }
    if (task && entityType === ENTITIES_TYPES.PROPOSAL) {
      return getTaskProposalComments({
        variables: {
          proposalId: task?.id,
        },
      });
    }
    if (submission) {
      return getSubmissionComments({
        variables: {
          submissionId: submission?.id,
        },
      });
    }

    if (task) {
      return getTaskComments({
        variables: {
          taskId: task?.id,
        },
      });
    }
  };

  useEffect(() => {
    if (showComments) handleCommentList();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task, entityType, submission, showComments]);

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
      {!task?.org?.shared && entityType === ENTITIES_TYPES.TASK && (
        <DiscordDiscussionButtonWrapper>
          <Button onClick={handleDiscordButtonClick}>
            <DiscordIcon style={{ marginRight: 10 }} />
            Open Discussion
          </Button>
        </DiscordDiscussionButtonWrapper>
      )}

      {showCommentBox && (
        <>
          {type && <SubmittableCommentType status={type} />}
          <CommentBox
            orgId={task?.orgId || submission?.orgId}
            existingContent=""
            entityType={entityType}
            previousCommenterIds={Array.from(set)}
            submission={submission}
            type={type}
            onCommentCallback={onCommentCallback}
            task={task}
          />
        </>
      )}
      {showComments && (
        <CommentListContainer>
          {comments?.length > 0 ? (
            comments.map((comment) => (
              <CommentItemWrapper
                key={comment?.id}
                comment={comment}
                entityType={entityType}
                task={task}
                submission={submission}
              />
            ))
          ) : (
            <CommentListEmptyState />
          )}
        </CommentListContainer>
      )}
    </CommentListWrapper>
  );
}
