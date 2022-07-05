import { gql } from '@apollo/client';

export const CREATE_TASK_APPLICATION = gql`
  mutation createTaskApplication($input: TaskApplicationInput) {
    createTaskApplication(input: $input) {
      id
    }
  }
`;

export const APPROVE_TASK_APPLICATION = gql`
  mutation approveTaskApplication($id: ID!) {
    approveTaskApplication(id: $id) {
      success
    }
  }
`;

export const DECLINE_TASK_APPLICATION = gql`
  mutation declineTaskApplication($id: ID!) {
    declineTaskApplication(id: $id) {
      success
    }
  }
`;
