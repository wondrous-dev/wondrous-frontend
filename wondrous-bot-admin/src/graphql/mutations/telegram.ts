import { gql } from "@apollo/client";

export const CONNECT_TELEGRAM_BOT = gql`
    mutation connectCommunitiesBot($orgId: ID, $chatId: String) {
        connectCommunitiesBot(orgId: $orgId, chatId: $chatId) {
            success
        }
    }
`;

