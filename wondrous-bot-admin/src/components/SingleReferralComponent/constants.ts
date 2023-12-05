import { QUALIFYING_ACTION_TYPES } from "utils/constants";

export const KEYS_MAP = {
  [QUALIFYING_ACTION_TYPES.PURCHASE]: "storeItemId",
  [QUALIFYING_ACTION_TYPES.QUEST]: "questIds",
  [QUALIFYING_ACTION_TYPES.ANY_QUEST]: "questIds",
};
