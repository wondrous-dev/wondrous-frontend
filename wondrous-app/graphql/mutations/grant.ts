import { gql } from "@apollo/client";

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

export const UPDATE_GRANT = gql`
    mutation updateGrant($input: GrantInput) {
        createGrant(input: $input) {
            id
        }
    }
`;
