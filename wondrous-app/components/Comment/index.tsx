import { useQuery, useMutation, useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { GET_ORG_USERS } from 'graphql/queries/org';
import { CREATE_TASK_COMMENT, DELETE_TASK_COMMENT } from 'graphql/mutations/task';
import { CREATE_TASK_PROPOSAL_COMMENT, DELETE_TASK_PROPOSAL_COMMENT } from 'graphql/mutations/taskProposal';
import { PERMISSIONS, TASK_STATUS_REQUESTED } from 'utils/constants';
import { getMentionArray, parseUserPermissionContext, transformTaskToTaskCard } from 'utils/helpers';
import { White } from '../../theme/colors';
import { TextInputContext } from 'utils/contexts';
import { TextInputDiv } from '../CreateEntity/styles';
import { TextInput } from '../TextInput';
import { filterOrgUsersForAutocomplete } from '../CreateEntity/createEntityModal';
import { useMe } from '../Auth/withAuth';
import { GET_COMMENTS_FOR_TASK } from 'graphql/queries/task';
import { GET_COMMENTS_FOR_TASK_PROPOSAL } from 'graphql/queries/taskProposal';
import {
  AddCommentButton,
  CommentItemContainer,
  CommentListContainer,
  CommentListWrapper,
  CommentProfilePicture,
  CommentText,
  CommentTopFlexDiv,
  DefaultCommentProfilePicture,
  AddCommentContainer,
  DeleteText,
} from './styles';
import { TaskSubmissionHeaderCreatorText, TaskSubmissionHeaderTimeText } from '../Common/Task/styles';
import { formatDistance } from 'date-fns';
import { renderMentionString } from 'utils/common';
import { cutString } from 'utils/helpers';
import { useRouter } from 'next/router';
import { useColumns, useOrgBoard, usePodBoard, useUserBoard } from 'utils/hooks';
import { updateTask } from 'utils/board';
import { ErrorText } from '../Common';

export const CommentBox = (props) => {
  const user = useMe();
  const { orgId, existingContent, taskType, task, previousCommenterIds } = props;
  const orgBoard = useOrgBoard();
  const userBoard = useUserBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || userBoard || podBoard;
  const boardColumns = useColumns();
  const [comment, setComment] = useState(existingContent || '');
  const [emptyCommentError, setEmptyCommentError] = useState(null);
  const { data: orgUsersData } = useQuery(GET_ORG_USERS, {
    variables: {
      orgId,
      limit: 100, // TODO: fix autocomplete
    },
  });
  const [createTaskComment, { data: taskCommentData }] = useMutation(CREATE_TASK_COMMENT, {
    refetchQueries: ['getTaskComments'],
  });

  const [createTaskProposalComment] = useMutation(CREATE_TASK_PROPOSAL_COMMENT, {
    refetchQueries: ['getTaskProposalComments'],
  });

  const addComment = () => {
    if (!comment || comment.length === 0) {
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
      content: comment,
      userMentions: mentionedUsers,
      previousCommenterIds: previousCommenterIds,
    };
    if (taskType === TASK_STATUS_REQUESTED) {
      createTaskProposalComment({
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
  const keyDownHandler = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      addComment();
    }
  };

  useEffect(() => {
    if (taskCommentData?.createTaskComment) {
      const updatedTask = { ...task, commentCount: task.commentCount + 1 };
      const transformedTask = transformTaskToTaskCard(updatedTask, boardColumns?.columns);
      const newBoardColumns = updateTask(transformedTask, boardColumns?.columns);
      boardColumns?.setColumns(newBoardColumns);
    }
  }, [taskCommentData]);

  return (
    <AddCommentContainer>
      <TextInputDiv>
        <TextInputContext.Provider
          value={{
            content: comment,
            onChange: (e) => {
              setEmptyCommentError(null);
              setComment(e.target.value);
            },
            list: filterOrgUsersForAutocomplete(orgUsersData?.getOrgUsers),
            keyDownHandler,
          }}
        >
          <TextInput
            placeholder="Write a comment"
            // rows={5}
            // maxRows={5}
          />
        </TextInputContext.Provider>
      </TextInputDiv>
      {emptyCommentError && <ErrorText>Empty Comment</ErrorText>}
      <AddCommentButton onClick={addComment}>Add comment</AddCommentButton>
    </AddCommentContainer>
  );
};

const CommentItem = (props) => {
  const comment = props?.comment;
  const task = props?.task;
  const taskType = props?.taskType;
  const list = props?.list;
  const setList = props?.setList;
  const loggedInUser = useMe();
  const router = useRouter();
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const userBoard = useUserBoard();
  const boardColumns = useColumns();
  const [deleteTaskComment, { data: deleteTaskCommentData }] = useMutation(DELETE_TASK_COMMENT, {
    refetchQueries: ['getTaskComments'],
  });

  const [deleteTaskProposalComment] = useMutation(DELETE_TASK_PROPOSAL_COMMENT, {
    refetchQueries: ['getTaskProposalComments'],
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
    <CommentItemContainer>
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
};

export const CommentList = (props) => {
  const { taskType, task } = props;
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

  useEffect(() => {
    if (task && taskType === TASK_STATUS_REQUESTED) {
      getTaskProposalComments({
        variables: {
          proposalId: task?.id,
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
  }, [task, taskType]);
  const set = new Set();
  comments?.forEach((comment) => {
    set.add(comment?.userId);
  });

  return (
    <CommentListWrapper>
      <CommentBox
        orgId={task?.orgId}
        existingContent={''}
        taskType={taskType}
        task={task}
        previousCommenterIds={Array.from(set)}
      />
      <CommentListContainer>
        {comments?.length > 0 &&
          comments.map((comment) => (
            <CommentItem key={comment?.id} comment={comment} taskType={taskType} task={task} />
          ))}
      </CommentListContainer>
    </CommentListWrapper>
  );
};
