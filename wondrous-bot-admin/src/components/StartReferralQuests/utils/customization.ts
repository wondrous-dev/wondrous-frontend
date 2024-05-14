import { EXOCORE_ORG_ID } from "utils/constants";

export const shouldDisplayJoinDiscordButton = (orgId) => {
  return [EXOCORE_ORG_ID, '113598456040259806'].includes(orgId);
};
