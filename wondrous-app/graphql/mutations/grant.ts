import { gql } from "@apollo/client";
import { CommentFragment } from "graphql/fragments/comments";

export const CREATE_GRANT = gql`
    mutation createGrant($input: GrantInput) {
        createGrant(input: $input) {
            id
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