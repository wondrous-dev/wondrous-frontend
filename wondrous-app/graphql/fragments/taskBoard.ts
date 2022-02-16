import { gql } from '@apollo/client';

export const PerStatusTaskCountFragment = gql`
  fragment PerStatusTaskCountFragment on PerStatusTaskCount {
    created
    inProgress
    completed
    proposal
    submission
    inReview
    archived
  }
`;
