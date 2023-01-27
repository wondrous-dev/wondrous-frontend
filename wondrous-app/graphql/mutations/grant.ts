import { gql } from '@apollo/client';
import { CommentFragment } from 'graphql/fragments/comments';

export const CREATE_GRANT = gql`
  mutation createGrant($input: GrantInput) {
    createGrant(input: $input) {
      id
      org {
        name
        username
      }
      pod {
        id
        name
      }
    }
  }
`;

export const ARCHIVE_GRANT = gql`
  mutation archiveGrant($grantId: ID!) {
    archiveGrant(grantId: $grantId) {
      success
    }
  }
`;

export const DELETE_GRANT = gql`
  mutation deleteGrant($grantId: ID!) {
    deleteGrant(grantId: $grantId) {
      success
    }
  }
`;

export const CREATE_GRANT_COMMENT = gql`
  mutation createGrantComment($input: GrantCommentInput) {
    createGrantComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DELETE_GRANT_COMMENT = gql`
  mutation deleteGrantComment($grantCommentId: String!) {
    deleteGrantComment(grantCommentId: $grantCommentId) {
      success
    }
  }
`;

export const UPDATE_GRANT = gql`
  mutation updateGrant($grantId: ID!, $input: GrantInput) {
    updateGrant(grantId: $grantId, input: $input) {
      id
    }
  }
`;

export const UPDATE_GRANT_STATUS = gql`
  mutation updateGrantStatus($grantId: ID!, $input: updateStatusInput!) {
    updateGrantStatus(grantId: $grantId, input: $input) {
      id
    }
  }
`;

export const CREATE_GRANT_APPLICATION = gql`
  mutation createGrantApplication($input: GrantApplicationInput) {
    createGrantApplication(input: $input) {
      id
    }
  }
`;

export const UPDATE_GRANT_APPLICATION = gql`
  mutation updateGrantApplication($grantApplicationId: ID!, $input: GrantApplicationInput) {
    updateGrantApplication(grantApplicationId: $grantApplicationId, input: $input) {
      approvedAt
      id
      rejectedAt
      changeRequestedAt
      paymentStatus
    }
  }
`;

export const DELETE_GRANT_APPLICATION = gql`
  mutation deleteGrantApplication($grantApplicationId: ID!) {
    deleteGrantApplication(grantApplicationId: $grantApplicationId) {
      success
    }
  }
`;

export const APPROVE_GRANT_APPLICATION = gql`
  mutation approveGrantApplication($grantApplicationId: ID!) {
    approveGrantApplication(grantApplicationId: $grantApplicationId) {
      id
    }
  }
`;

export const CREATE_GRANT_APPLICATION_POD = gql`
  mutation createGranApplicationPod($grantApplicationId: ID!) {
    createGranApplicationPod(grantApplicationId: $grantApplicationId) {
      id
      podId
    }
  }
`;

export const REJECT_GRANT_APPLICATION = gql`
  mutation rejectGrantApplication($grantApplicationId: ID!) {
    rejectGrantApplication(grantApplicationId: $grantApplicationId) {
      id
    }
  }
`;

export const REQUEST_CHANGE_GRANT_APPLICATION = gql`
  mutation requestChangeGrantApplication($grantApplicationId: ID!) {
    requestChangeGrantApplication(grantApplicationId: $grantApplicationId) {
      id
    }
  }
`;

export const REMOVE_GRANT_APPLICATION_MEDIA = gql`
  mutation removeGrantApplicationMedia($grantApplicationId: ID!, $slug: String!) {
    removeGrantApplicationMedia(grantApplicationId: $grantApplicationId, slug: $slug) {
      success
    }
  }
`;

export const CREATE_GRANT_APPLICATION_COMMENT = gql`
  mutation createGrantApplicationComment($input: GrantApplicationCommentInput) {
    createGrantApplicationComment(input: $input) {
      ...CommentFragment
    }
  }
  ${CommentFragment}
`;

export const DELETE_GRANT_APPLICATION_COMMENT = gql`
  mutation deleteGrantApplicationComment($grantApplicationCommentId: String!) {
    deleteGrantApplicationComment(grantApplicationCommentId: $grantApplicationCommentId) {
      success
    }
  }
`;

export const REOPEN_GRANT_APPLICATION = gql`
  mutation reopenGrantApplication($grantApplicationId: ID!) {
    reopenGrantApplication(grantApplicationId: $grantApplicationId) {
      id
    }
  }
`;

export const ARCHIVE_GRANT_APPLICATION = gql`
  mutation archiveGrantApplication($grantApplicationId: ID!) {
    archiveGrantApplication(grantApplicationId: $grantApplicationId) {
      success
    }
  }
`;

export const REMOVE_GRANT_MEDIA = gql`
  mutation removeGrantMedia($grantId: ID!, $slug: String!) {
    removeGrantMedia(grantId: $grantId, slug: $slug) {
      success
    }
  }
`;

export const ATTACH_GRANT_MEDIA = gql`
  mutation attachGrantMedia($grantId: ID!, $input: AttachMediaInput!) {
    attachGrantMedia(grantId: $grantId, input: $input) {
      id
    }
  }
`;

export const ATTACH_GRANT_APPLICATION_MEDIA = gql`
  mutation attachGrantApplicationMedia($grantApplicationId: ID!, $input: AttachMediaInput!) {
    attachGrantApplicationMedia(grantApplicationId: $grantApplicationId, input: $input) {
      id
    }
  }
`;
