import { gql } from '@apollo/client';
import { TaskFragment } from '../fragments/task';

export const CREATE_BOUNTY = gql`
  mutation createBounty($input: TaskInput) {
    createBounty(input: $input) {
      ...TaskFragment
    }
  }
  ${TaskFragment}
`;
