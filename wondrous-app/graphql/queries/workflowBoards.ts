import { gql } from '@apollo/client';

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
