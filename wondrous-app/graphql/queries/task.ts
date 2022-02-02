import { gql } from '@apollo/client';
import { CommentFragment } from '../fragments/comments';
import { TaskFragment, TaskSubmissionFragment } from '../fragments/task';

export const GET_TASK_BY_ID = gql`
  query getTaskById($taskId: ID!) {
    getTaskById(taskId: $taskId) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const GET_TASK_REVIEWERS = gql`
  query getTaskReviewers($taskId: ID!) {
    getTaskReviewers(taskId: $taskId) {
      id
      profilePicture
      firstName
      lastName
      username
    }
  }
`;

export const GET_ELIGIBLE_REVIEWERS_FOR_ORG = gql`
  query getEligibleReviewersForOrg($orgId: ID!, $searchString: String) {
    getEligibleReviewersForOrg(orgId: $orgId, searchString: $searchString) {
      id
      username
    }
  }
`;

export const GET_TASK_SUBMISSIONS_FOR_TASK = gql`
  query getTaskSubmissionsForTask($taskId: ID!) {
    getTaskSubmissionsForTask(taskId: $taskId) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`;

export const GET_COMMENTS_FOR_TASK = gql`
  query getTaskComments($taskId: ID!) {
    getTaskComments(taskId: $taskId) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const GET_TASK_SUBMISSION_BY_ID = gql`
  query getTaskSubmissionById($submissionId: ID!) {
    getTaskSubmissionById(submissionId: $submissionId) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`;

export const GET_TASK_COMMENT_BY_ID = gql`
  query getTaskCommentById($taskCommentId: ID!) {
    getTaskCommentById(taskCommentId: $taskCommentId) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const GET_TASK_FOR_MILESTONE = gql`
  query getTasksForMilestone($milestoneId: ID!, $status: String, $limit: Int, $offset: Int) {
    getTasksForMilestone(milestoneId: $milestoneId, status: $status, limit: $limit, offset: $offset) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const GET_PER_STATUS_TASK_COUNT_FOR_MILESTONE = gql`
  query getPerStatusTaskCountForMilestone($milestoneId: ID!) {
    getPerStatusTaskCountForMilestone(milestoneId: $milestoneId) {
      created
      inProgress
      completed
      inReview
      archived
      awaitingPayment
    }
  }
`;

export const GET_MILESTONES = gql`
  query getMilestones($orgId: ID!, $podId: ID) {
    getMilestones(orgId: $orgId, podId: $podId) {
      title
      id
    }
  }
`;
