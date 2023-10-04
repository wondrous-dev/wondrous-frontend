export const DEFAULT_QUEST_SETTINGS_STATE_VALUE = {
  title: "New Quest",
  description: "",
  level: "1",
  timeBound: false,
  maxSubmission: 1,
  maxApproval: null,
  requireReview: false,
  isActive: false,
  isOnboarding: false,
  startAt: null,
  endAt: null,
  questConditions: [],
  submissionCooldownPeriod: null,
  rewards: [
    {
      value: 0,
      type: "points",
    },
  ],
};
