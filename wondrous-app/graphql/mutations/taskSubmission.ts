import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';
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

export const APPROVE_BOUNTY_SUBMISSION = gql`
  mutation approveBountySubmission($submissionId: ID!) {
    approveBountySubmission(submissionId: $submissionId) {
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
  mutation rejectTaskSubmission($submissionId: ID!, $timezone: String) {
    rejectTaskSubmission(submissionId: $submissionId, timezone: $timezone) {
      success
    }
  }
`;

export const RESUBMIT_SUBMISSION = gql`
  mutation resubmitTaskSubmission($submissionId: ID!) {
    resubmitTaskSubmission(submissionId: $submissionId) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`;

export const REOPEN_SUBMISSION = gql`
  mutation reopenTaskSubmission($submissionId: ID!) {
    reopenTaskSubmission(submissionId: $submissionId) {
      ...TaskSubmissionFragment
    }
  }
  ${TaskSubmissionFragment}
`;

export const ARCHIVE_SUBMISSION = gql`
  mutation archiveTaskSubmission($submissionId: ID!) {
    archiveTaskSubmission(submissionId: $submissionId) {
      success
    }
  }
`;

export const CREATE_SUBMISSION_COMMENT = gql`
  mutation createTaskSubmissionComment($input: SubmissionCommentInput) {
    createTaskSubmissionComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DELETE_SUBMISSION_COMMENT = gql`
  mutation deleteTaskSubmissionComment($submissionCommentId: String!) {
    deleteTaskSubmissionComment(submissionCommentId: $submissionCommentId) {
      success
    }
  }
`;
