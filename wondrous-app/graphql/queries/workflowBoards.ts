import { gql } from '@apollo/client';
import { TaskProposalCardFragment, TaskSubmissionCardFragment } from '../fragments/task';

export const GET_WORKFLOW_BOARD_REVIEWABLE_ITEMS_COUNT = gql`
  query getWorkFlowBoardReviewableItemsCount {
    getWorkFlowBoardReviewableItemsCount {
      orgMembershipRequestCount
      podMembershipRequestCount
      proposalRequestCount
      submissionRequestCount
      paymentRequestCount
    }
  }
`;

export const GET_PROPOSALS_USER_CAN_REVIEW = gql`
  query getProposalsUserCanReview(
    $searchString: String
    $orgId: ID
    $podIds: [ID]
    $limit: Int
    $offset: Int
    $sortOrder: String
  ) {
    getProposalsUserCanReview(
      input: {
        searchString: $searchString
        orgId: $orgId
        podIds: $podIds
        limit: $limit
        offset: $offset
        sortOrder: $sortOrder
      }
    ) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_SUBMISSIONS_USER_CAN_REVIEW = gql`
  query getSubmissionsUserCanReview(
    $searchString: String
    $orgId: ID
    $podIds: [ID]
    $limit: Int
    $offset: Int
    $sortOrder: String
  ) {
    getSubmissionsUserCanReview(
      input: {
        searchString: $searchString
        orgId: $orgId
        podIds: $podIds
        limit: $limit
        offset: $offset
        sortOrder: $sortOrder
      }
    ) {
      ...TaskSubmissionCardFragment
    }
  }
  ${TaskSubmissionCardFragment}
`;
