import { gql } from '@apollo/client';

export const GET_TASK_APPLICATIONS = gql`
  query getTaskApplications($input: GetTaskApplicationsInput) {
    getTaskApplications(input: $input) {
      id
      taskId
      createdBy
      message
      status
      lastReviewedBy {
        username
        profilePicture
      }
      createdAt
      lastReviewedAt
      links {
        url
        displayName
      }
      creator {
        username
        profilePicture
        checkIsGr15Contributor {
          isGr15Contributor
        }
      }
    }
  }
`;

export const GET_TASK_APPLICATIONS_COUNT = gql`
  query getTaskApplicationsCount($input: GetTaskApplicationsCountInput) {
    getTaskApplicationsCount(input: $input) {
      total
    }
  }
`;
