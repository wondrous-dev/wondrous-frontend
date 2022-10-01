import { gql } from '@apollo/client';

import { TaskCardFragment, TaskProposalCardFragment, TaskSubmissionCardFragment } from '../fragments/task';
import { PerStatusTaskCountFragment } from '../fragments/taskBoard';

export const GET_ORG_TASK_BOARD_PROPOSALS = gql`
  query GetOrgTaskBoardProposals(
    $orgId: ID!
    $statuses: [String]
    $podIds: [String]
    $limit: Int
    $offset: Int
    $labelId: String
  ) {
    getOrgTaskBoardProposals(
      input: { orgId: $orgId, statuses: $statuses, podIds: $podIds, limit: $limit, offset: $offset, labelId: $labelId }
    ) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const SEARCH_ORG_TASK_BOARD_PROPOSALS = gql`
  query searchProposalsForOrgBoardView(
    $orgId: ID!
    $statuses: [String]
    $searchString: String
    $podIds: [String]
    $limit: Int
    $offset: Int
  ) {
    searchProposalsForOrgBoardView(
      input: {
        orgId: $orgId
        statuses: $statuses
        searchString: $searchString
        podIds: $podIds
        limit: $limit
        offset: $offset
      }
    ) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_ORG_TASK_BOARD_SUBMISSIONS = gql`
  query getOrgTaskBoardSubmissions(
    $orgId: ID!
    $statuses: [String]
    $searchString: String
    $podIds: [String]
    $limit: Int
    $offset: Int
  ) {
    getOrgTaskBoardSubmissions(
      input: {
        orgId: $orgId
        statuses: $statuses
        searchString: $searchString
        podIds: $podIds
        limit: $limit
        offset: $offset
      }
    ) {
      ...TaskSubmissionCardFragment
    }
  }
  ${TaskSubmissionCardFragment}
`;

export const GET_ORG_TASK_BOARD_TASKS = gql`
  query getOrgTaskBoardTasks(
    $orgId: ID!
    $statuses: [String]
    $searchString: String
    $podIds: [String]
    $limit: Int
    $offset: Int
    $onlyPublic: Boolean
    $types: [String]
    $labelId: String
    $date: String
    $category: String
  ) {
    getOrgTaskBoardTasks(
      input: {
        orgId: $orgId
        statuses: $statuses
        searchString: $searchString
        podIds: $podIds
        limit: $limit
        offset: $offset
        onlyPublic: $onlyPublic
        types: $types
        labelId: $labelId
        date: $date
        category: $category
      }
    ) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_USER_TASK_BOARD_PROPOSALS = gql`
  query getUserTaskBoardProposals(
    $userId: ID
    $statuses: [String]
    $orgId: String
    $podIds: [String]
    $limit: Int
    $offset: Int
    $labelId: String
  ) {
    getUserTaskBoardProposals(
      input: {
        userId: $userId
        statuses: $statuses
        orgId: $orgId
        podIds: $podIds
        limit: $limit
        offset: $offset
        labelId: $labelId
      }
    ) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_TASKS_RELATED_TO_USER_IN_ORG = gql`
  query getTasksRelatedToUserInOrg(
    $orgId: ID!
    $statuses: [String]
    $searchString: String
    $podIds: [String]
    $userId: String
    $limit: Int
    $offset: Int
    $types: [String]
    $labelId: String
    $onlyPublic: Boolean
    $date: String
  ) {
    getTasksRelatedToUserInOrg(
      input: {
        orgId: $orgId
        statuses: $statuses
        searchString: $searchString
        podIds: $podIds
        userId: $userId
        limit: $limit
        offset: $offset
        types: $types
        labelId: $labelId
        onlyPublic: $onlyPublic
        date: $date
      }
    ) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_TASKS_RELATED_TO_USER_IN_POD = gql`
  query getTasksRelatedToUserInPod(
    $podId: ID!
    $statuses: [String]
    $searchString: String
    $userId: String
    $limit: Int
    $offset: Int
    $date: String
    $onlyPublic: Boolean
    $types: [String]
    $labelId: String
  ) {
    getTasksRelatedToUserInPod(
      input: {
        podId: $podId
        statuses: $statuses
        searchString: $searchString
        userId: $userId
        limit: $limit
        offset: $offset
        date: $date
        onlyPublic: $onlyPublic
        types: $types
        labelId: $labelId
      }
    ) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const SEARCH_TASKS_FOR_ORG_BOARD_VIEW = gql`
  query searchTasksForOrgBoardView(
    $orgId: ID!
    $statuses: [String]
    $searchString: String
    $podIds: [String]
    $limit: Int
    $offset: Int
  ) {
    searchTasksForOrgBoardView(
      input: {
        orgId: $orgId
        statuses: $statuses
        searchString: $searchString
        podIds: $podIds
        limit: $limit
        offset: $offset
      }
    ) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const SEARCH_PROPOSALS_FOR_USER_BOARD_VIEW = gql`
  query searchProposalsForUserBoardView(
    $userId: ID!
    $orgId: String
    $statuses: [String]
    $searchString: String
    $podIds: [String]
    $limit: Int
    $offset: Int
  ) {
    searchProposalsForUserBoardView(
      input: {
        userId: $userId
        orgId: $orgId
        statuses: $statuses
        searchString: $searchString
        podIds: $podIds
        limit: $limit
        offset: $offset
      }
    ) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const SEARCH_TASKS_FOR_USER_BOARD_VIEW = gql`
  query searchTasksForUserBoardView(
    $userId: ID!
    $orgId: String
    $statuses: [String]
    $searchString: String
    $podIds: [String]
    $limit: Int
    $offset: Int
    $types: [String]
  ) {
    searchTasksForUserBoardView(
      input: {
        userId: $userId
        orgId: $orgId
        statuses: $statuses
        searchString: $searchString
        podIds: $podIds
        limit: $limit
        offset: $offset
        types: $types
      }
    ) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_USER_TASK_BOARD_TASKS = gql`
  query getUserTaskBoardTasks(
    $userId: ID
    $statuses: [String]
    $priorities: [String]
    $orgId: String
    $podIds: [String]
    $limit: Int
    $offset: Int
    $date: String
    $onlyPublic: Boolean
  ) {
    getUserTaskBoardTasks(
      input: {
        userId: $userId
        statuses: $statuses
        priorities: $priorities
        orgId: $orgId
        podIds: $podIds
        limit: $limit
        offset: $offset
        date: $date
        onlyPublic: $onlyPublic
      }
    ) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_USER_TASK_BOARD_SUBMISSIONS = gql`
  query getUserTaskBoardSubmissions(
    $userId: ID
    $statuses: [String]
    $orgId: String
    $podIds: [String]
    $limit: Int
    $offset: Int
  ) {
    getUserTaskBoardSubmissions(
      input: { userId: $userId, statuses: $statuses, orgId: $orgId, podIds: $podIds, limit: $limit, offset: $offset }
    ) {
      ...TaskSubmissionCardFragment
    }
  }
  ${TaskSubmissionCardFragment}
`;

export const GET_PER_STATUS_TASK_COUNT_FOR_ORG_BOARD = gql`
  query getPerStatusTaskCountForOrgBoard($orgId: ID!) {
    getPerStatusTaskCountForOrgBoard(orgId: $orgId) {
      created
      inProgress
      completed
      inReview
      proposalOpen
      proposalApproved
      proposalClosed
    }
  }
`;

export const GET_POD_TASK_BOARD_PROPOSALS = gql`
  query getPodTaskBoardProposals($input: PodTaskBoardQueryInput) {
    getPodTaskBoardProposals(input: $input) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const SEARCH_POD_TASK_BOARD_PROPOSALS = gql`
  query searchProposalsForPodBoardView($input: PodTaskBoardQueryInput) {
    searchProposalsForPodBoardView(input: $input) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_POD_TASK_BOARD_TASKS = gql`
  query getPodTaskBoardTasks($input: PodTaskBoardQueryInput) {
    getPodTaskBoardTasks(input: $input) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const SEARCH_TASKS_FOR_POD_BOARD_VIEW = gql`
  query searchTasksForPodBoardView($input: PodTaskBoardQueryInput) {
    searchTasksForPodBoardView(input: $input) {
      ...TaskCardFragment
    }
  }
  ${TaskCardFragment}
`;

export const GET_POD_TASK_BOARD_SUBMISSIONS = gql`
  query getPodTaskBoardSubmissions($input: PodTaskBoardQueryInput) {
    getPodTaskBoardSubmissions(input: $input) {
      ...TaskSubmissionCardFragment
    }
  }
  ${TaskSubmissionCardFragment}
`;

export const GET_PER_STATUS_TASK_COUNT_FOR_POD_BOARD = gql`
  query getPerStatusTaskCountForPodBoard($podId: ID!) {
    getPerStatusTaskCountForPodBoard(podId: $podId) {
      created
      inProgress
      completed
      inReview
      proposalOpen
      proposalApproved
      proposalClosed
    }
  }
`;

export const GET_PER_STATUS_TASK_COUNT_FOR_USER_BOARD = gql`
  query getPerStatusTaskCountForUserBoard($userId: ID!) {
    getPerStatusTaskCountForUserBoard(userId: $userId) {
      ...PerStatusTaskCountFragment
    }
  }
  ${PerStatusTaskCountFragment}
`;

// export const GET_ORG_SIDEBAR_COUNT = gql`
//   query getOrgSidebarCount($orgId: ID!) {
//     getOrgSidebarCount(orgId: $orgId) {
//       bountyCount
//       taskCount
//       proposalCount
//       milestoneCount
//       membersCount
//       rolesCount
//       resourcesCount
//     }
//   }
// `;

// export const GET_POD_SIDEBAR_COUNT = gql`
//   query getPodSidebarCount($podId: ID!) {
//     getPodSidebarCount(podId: $podId) {
//       bountyCount
//       taskCount
//       proposalCount
//       milestoneCount
//       membersCount
//       rolesCount
//       resourcesCount
//     }
//   }
// `;
