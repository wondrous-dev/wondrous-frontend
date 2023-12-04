import { QUALIFYING_ACTION_TYPES, REFERRAL_REWARD_SCHEME, REFERRAL_STATUSES } from "utils/constants";
import * as Yup from "yup";

export const TYPES: string[] = [
  QUALIFYING_ACTION_TYPES.ANY_QUEST,
  QUALIFYING_ACTION_TYPES.QUEST,
  QUALIFYING_ACTION_TYPES.PURCHASE,
];

const schema = Yup.object().shape({
  type: Yup.string().required("You must select a qualifying action").oneOf(TYPES, "Type is not valid"),
  name: Yup.string().required("Name is required"),
  description: Yup.string().nullable(),
  orgId: Yup.string().required("Organization is required"),
  referrerPointReward: Yup.number().nullable(),
  referredPointReward: Yup.number().nullable(),
  maxPerUser: Yup.number().nullable(),
  level: Yup.number().nullable(),
  status: Yup.string(),
  questIds: Yup.array().when("type", (type, schema) => {
    return type.includes(QUALIFYING_ACTION_TYPES.QUEST)
      ? schema.of(Yup.string().required("You must select a quest"))
      : Yup.array().of(Yup.string()).nullable();
  }),
});

export const referralValidator = async (body) => {
  return schema.validate(body, {
    abortEarly: false,
  });
};
