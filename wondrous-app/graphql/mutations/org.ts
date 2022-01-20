import { gql } from '@apollo/client'


export const CREATE_ORG_INVITE_LINK = gql`
    mutation createOrgInviteLink($input: OrgInviteLinkInput) {
        createOrgInviteLink (input: $input) {
            token
        }
    }
`