import { gql } from "@apollo/client";

export const CREATE_GRANT = gql`
    mutation createGrant($input: GrantInput) {
        createGrant(input: $input) {
            id
        }
    }
`;

