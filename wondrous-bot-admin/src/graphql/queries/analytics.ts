import { gql } from "@apollo/client";

export const GET_CMTY_ENTITIES_COUNT = gql`
    query getCmtyEntitiesCount($orgId: String, $startDate: String, $endDate: String) {
        getCmtyEntitiesCount(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
            date
            counts {
                discordInteraction,
                discordMessage,
                discordReaction
            }
        }
    }
`;

