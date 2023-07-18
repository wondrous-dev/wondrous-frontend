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


export const GET_SUBMISSION_REPORTS = gql`
    query getQuestsSubmissionsReport($orgId: String, $startDate: String, $endDate: String) {
        getQuestsSubmissionsReport(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
            date
            counts {
                total,
                approved
            }
        }
    }
`;

export const GET_ONBOARDED_USERS_DATA = gql`
    query getOnboardedUsersCount($orgId: String, $startDate: String, $endDate: String) {
        getOnboardedUsersCount(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
            date
            total
        }
    }
`;

export const GET_CMTY_PRESENCE_ANALYTICS = gql`
    query getCmtyPresenceAnalytics($orgId: String, $startDate: String, $endDate: String) {
        getCmtyPresenceAnalytics(orgId: $orgId, startDate: $startDate, endDate: $endDate) {
            date
            counts {
                total
                active
            }
        }
    }
`;

