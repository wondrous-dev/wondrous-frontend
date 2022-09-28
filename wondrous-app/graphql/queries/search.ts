import { gql } from '@apollo/client';
import { TaskCardFragment } from 'graphql/fragments/task';

export const SEARCH_GLOBAL = gql`
  query globalSearch($searchString: String!) {
    globalSearch(searchString: $searchString) {
      users {
        id
        firstName
        lastName
        username
        profilePicture
      }
      orgs {
        id
        name
        username
        profilePicture
        thumbnailPicture
      }
      pods {
        id
        name
        username
        profilePicture
        thumbnailPicture
      }
    }
  }
`;

export const SEARCH_GLOBAL_ORGS = gql`
  query globalSearchOrgs($searchString: String!) {
    globalSearchOrgs(searchString: $searchString) {
      id
      name
      username
      profilePicture
      thumbnailPicture
    }
  }
`;

export const SEARCH_USER_CREATED_TASKS = gql`
  query searchUserCreatedTask($statuses: [String], $limit: Int, $offset: Int) {
    searchUserCreatedTask(statuses: $statuses, limit: $limit, offset: $offset) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_PER_STATUS_TASK_COUNT_FOR_USER_CREATED_TASK = gql`
  query getPerStatusTaskCountForUserCreatedTask {
    getPerStatusTaskCountForUserCreatedTask {
      created
      inProgress
      completed
      inReview
    }
  }
`;
