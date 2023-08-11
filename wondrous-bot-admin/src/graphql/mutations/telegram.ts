import { gql } from "@apollo/client";

export const CONNECT_TELEGRAM_BOT = gql`
    mutation connectTelegram($orgId: ID, $chatId: String, $podId: ID) {
        connectTelegram(orgId: $orgId, chatId: $chatId, podId: $podId) {
            success
        }
    }
`;

