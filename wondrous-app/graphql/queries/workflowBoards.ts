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
  query getProposalsUserCanReview($searchString: String, $orgId: String, $podIds: [String], $limit: Int, $offset: Int) {
    getProposalsUserCanReview(
      input: { searchString: $searchString, orgId: $orgId, podIds: $podIds, limit: $limit, offset: $offset }
    ) {
      ...TaskProposalCardFragment
    }
  }
  ${TaskProposalCardFragment}
`;

export const GET_SUBMISSIONS_USER_CAN_REVIEW = gql`
  query getSubmissionsUserCanReview(
    $searchString: String
    $orgId: String
    $podIds: [String]
    $limit: Int
    $offset: Int
  ) {
    getSubmissionsUserCanReview(
      input: { searchString: $searchString, orgId: $orgId, podIds: $podIds, limit: $limit, offset: $offset }
    ) {
      ...TaskSubmissionCardFragment
    }
  }
  ${TaskSubmissionCardFragment}
`;
