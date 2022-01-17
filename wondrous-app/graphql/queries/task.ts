import { gql } from '@apollo/client'
import { TaskFragment, TaskSubmissionFragment } from '../fragments/task'

export const GET_TASK_BY_ID = gql`
  query getTaskById($taskId: ID!) {
    getTaskById(taskId: $taskId) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`

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
`

export const GET_ELIGIBLE_REVIEWERS_FOR_ORG = gql`
  query getEligibleReviewersForOrg($orgId: ID!, $searchString: String) {
    getEligibleReviewersForOrg(orgId: $orgId, searchString: $searchString) {
      id
      username
    }
  }
`

export const GET_TASK_SUBMISSIONS_FOR_TASK = gql`
  query getTaskSubmissionsForTask($taskId: ID!) {
    getTaskSubmissionsForTask(taskId: $taskId) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`
