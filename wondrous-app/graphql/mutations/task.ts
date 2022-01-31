import { gql } from '@apollo/client';
import { CommentFragment } from '../fragments/comments';
import { MediaFragment } from '../fragments/media';
import { TaskFragment } from '../fragments/task';

export const CREATE_TASK = gql`
  mutation createTask($input: TaskInput) {
    createTask(input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const UPDATE_TASK = gql`
  mutation updateTask($taskId: ID!, $input: TaskInput) {
    updateTask(taskId: $taskId, input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const COMPLETE_TASK = gql`
  mutation completeTask($taskId: ID!) {
    completeTask(taskId: $taskId) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const DELETE_TASK = gql`
  mutation deleteTask($taskId: String!) {
    deleteTask(taskId: $taskId) {
      success
    }
  }
`;

export const ATTACH_MEDIA_TO_TASK = gql`
  mutation attachTaskMedia($taskId: ID!, $input: AttachMediaInput) {
    attachTaskMedia(taskId: $taskId, input: $input) {
      id
      media {
        ...MediaFragment
      }
    }
  }
  ${MediaFragment}
`;

export const REMOVE_MEDIA_FROM_TASK = gql`
  mutation removeTaskMedia($taskId: ID!, $slug: String!) {
    removeTaskMedia(taskId: $taskId, slug: $slug) {
      success
    }
  }
`;

export const UPDATE_TASK_STATUS = gql`
  mutation updateTaskStatus($taskId: ID!, $input: updateTaskStatusInput!) {
    updateTaskStatus(taskId: $taskId, input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const CREATE_TASK_COMMENT = gql`
  mutation createTaskComment($input: TaskCommentInput) {
    createTaskComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DELETE_TASK_COMMENT = gql`
  mutation deleteTaskComment($taskCommentId: String!) {
    deleteTaskComment(taskCommentId: $taskCommentId) {
      success
    }
  }
`;

export const UPDATE_TASK_ASSIGNEE = gql`
  mutation updateTaskAssignee($taskId: ID!, $assigneeId: ID!) {
    updateTaskAssignee(taskId: $taskId, assigneeId: $assigneeId) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const CREATE_MILESTONE = gql`
  mutation createMilestone($input: TaskInput) {
    createMilestone(input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const UPDATE_MILESTONE = gql`
  mutation updateMilestone($milestoneId: ID!, $input: TaskInput) {
    updateMilestone(milestoneId: $milestoneId, input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const UPDATE_TASK_ORDER = gql`
  mutation updateTaskOrder($taskId: ID!, $input: updateTaskOrderInput!) {
    updateTaskOrder(taskId: $taskId, input: $input) {
      success
    }
  }
`;
