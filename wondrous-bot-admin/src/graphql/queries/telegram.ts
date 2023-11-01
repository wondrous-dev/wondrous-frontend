import { gql } from "@apollo/client";

export const GET_TELEGRAM_CONFIG_FOR_ORG = gql`
    query getTelegramConfigForOrg($orgId: ID) {
        getTelegramConfigForOrg(orgId: $orgId) {
            chatId
            orgId
            chatInfo {
                id
                title
            }
        }
    }
`;