import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';
import { TaskCardFragment, TaskFragment, TaskSubmissionFragment, TaskTemplateFragment } from 'graphql/fragments/task';

export const GET_TASK_BY_ID = gql`
  query getTaskById($taskId: ID!) {
    getTaskById(taskId: $taskId) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const GET_TASK_TEMPLATES_BY_USER_ID = gql`
  query getTaskTemplatesByUserId($userId: ID!) {
    getTaskTemplatesByUserId(userId: $userId) {
      ...TaskTemplateFragment
    }
  }
  ${TaskTemplateFragment}
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
      profilePicture
    }
  }
`;

export const GET_ELIGIBLE_REVIEWERS_FOR_POD = gql`
  query getEligibleReviewersForPod($podId: ID!, $searchString: String) {
    getEligibleReviewersForPod(podId: $podId, searchString: $searchString) {
      id
      username
      profilePicture
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

export const GET_TASKS_FOR_MILESTONE = gql`
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

export const GET_SUBTASK_COUNT_FOR_TASK = gql`
  query getSubtaskCountForTask($taskId: ID!) {
    getSubtaskCountForTask(taskId: $taskId) {
      total
      completed
    }
  }
`;

export const GET_SUBTASKS_FOR_TASK = gql`
  query getSubtasksForTask($taskId: ID!, $limit: Int, $offset: Int, $status: String) {
    getSubtasksForTask(taskId: $taskId, limit: $limit, offset: $offset, status: $status) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;

export const GET_COMPLETED_TASKS_BETWEEN_TIME_PERIOD = gql`
  query getCompletedTasksBetweenPeriods(
    $fromTime: String!
    $toTime: String!
    $orgId: ID
    $podId: ID
    $assigneeId: ID
    $includeBounties: Boolean
  ) {
    getCompletedTasksBetweenPeriods(
      fromTime: $fromTime
      toTime: $toTime
      orgId: $orgId
      podId: $podId
      assigneeId: $assigneeId
      includeBounties: $includeBounties
    ) {
      assigneeId
      assigneeUsername
      assigneeProfilePicture
      assigneeWallet
      tasks {
        id
        title
        status
        description
        completedAt
        orgId
        pod {
          id
          name
          color
        }
        rewards {
          rewardAmount
          paymentMethodId
          symbol
          icon
          tokenName
        }
        points
        type
      }
    }
  }
`;

export const GET_TASK_SUBMISSION_COMMENTS = gql`
  query getTaskSubmissionComments($submissionId: String!) {
    getTaskSubmissionComments(submissionId: $submissionId) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const GET_BOUNTIES_TO_EXPLORE = gql`
  query getBountiesToExplore($limit: Int, $offset: Int) {
    getBountiesToExplore(limit: $limit, offset: $offset) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const RENDER_RICH_TEXT = gql`
  query renderRichText($jsonText: String) {
    renderRichText(jsonText: $jsonText)
  }
`;
