import { gql } from '@apollo/client';
import { MediaFragment } from '../fragments/media';
import { TaskSubmissionFragment } from '../fragments/task';

export const CREATE_TASK_SUBMISSION = gql`
  mutation createTaskSubmission($input: TaskSubmissionInput) {
    createTaskSubmission(input: $input) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`;

export const UPDATE_TASK_SUBMISSION = gql`
  mutation updateTaskSubmission($submissionId: ID!, $input: TaskSubmissionInput) {
    updateTaskSubmission(submissionId: $submissionId, input: $input) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`;
export const ATTACH_SUBMISSION_MEDIA = gql`
  mutation attachTaskSubmissionMedia($input: AttachMediaInput!, $submissionId: ID!) {
    attachTaskSubmissionMedia(submissionId: $submissionId, input: $input) {
      id
      media {
        ...MediaFragment
      }
    }
  }
  ${MediaFragment}
`;

export const REMOVE_SUBMISSION_MEDIA = gql`
  mutation removeTaskSubmissionMedia($submissionId: ID!, $slug: String!) {
    removeTaskSubmissionMedia(submissionId: $submissionId, slug: $slug) {
      success
    }
  }
`;

export const APPROVE_SUBMISSION = gql`
  mutation approveTaskSubmission($submissionId: ID!) {
    approveTaskSubmission(submissionId: $submissionId) {
      success
    }
  }
`;

export const REQUEST_CHANGE_SUBMISSION = gql`
  mutation requestChangeTaskSubmission($submissionId: ID!) {
    requestChangeTaskSubmission(submissionId: $submissionId) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`;

export const REJECT_SUBMISSION = gql`
  mutation rejectTaskSubmission($submissionId: ID!, $currentTimezone: String) {
    rejectTaskSubmission(submissionId: $submissionId, currentTimezone: $currentTimezone) {
      success
    }
  }
`;
