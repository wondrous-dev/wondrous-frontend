import { gql } from '@apollo/client';

export const PerStatusTaskCountFragment = gql`
  fragment PerStatusTaskCountFragment on PerStatusTaskCount {
    created
    inProgress
    completed
    submission
    inReview
    archived
    proposalApproved
    proposalClosed
    proposalOpen
  }
`;
