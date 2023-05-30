export const TYPES = {
  TEXT_FIELD: "text",
  MULTI_QUIZ: "multiple_quiz",
  NUMBER: "number",
  ATTACHMENTS: "attachment",
  SINGLE_QUIZ: "single_quiz",
  LIKE_TWEET: "like_tweet",
  FOLLOW_TWITTER: "follow_twitter",
  REPLY_TWEET: "reply_tweet",
  RETWEET: "retweet",
  TWEET_WITH_PHRASE: "tweet_with_phrase",
  SNAPSHOT_PROPOSAL_VOTE: "snapshot_proposal_vote",
  SNAPSHOT_SPACE_VOTE: "snapshot_space_vote",
  DISCORD_MESSAGE_IN_CHANNEL: "discord_message_in_channel",
  JOIN_DISCORD_COMMUNITY_CALL: "join_discord_community_call",
  DATA_COLLECTION: "data_collection",
};

export const CONFIG = [
  {
    label: "Text Field",
    value: TYPES.TEXT_FIELD,
  },
];

export const RESPOND_TYPES = {
  [TYPES.TEXT_FIELD]: "text",
  [TYPES.NUMBER]: "number",
  [TYPES.ATTACHMENTS]: "files and/or links",
};

export const HEADER_HEIGHT = 68;

export const THEME_TYPES = {
  LIGHT: "light",
  DARK: "dark",
};

export const COMPONENT_LABELS = {
  [TYPES.TEXT_FIELD]: "Text",
  [TYPES.MULTI_QUIZ]: "Quiz",
};

export const DATEPICKER_OPTIONS = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  PERIODICALLY: "periodic",
};
export const DATEPICKER_OPTIONS_ARR = Object.values(DATEPICKER_OPTIONS);

export const DATEPICKER_FIELDS = {
  END_DATE: "endDate",
  START_DATE: "startDate",
};

export const DEFAULT_DATEPICKER_VALUE = { startAt: null, endAt: null };
export const DEFAULT_SINGLE_DATEPICKER_VALUE = null;

export const MONTH_DAY_FULL_YEAR = "MM/DD/YY";
export const DAY_STRING_MONTH_SHORT_YEAR = "DD/MMM/YY";

export const DISCORD_CONNECT_TYPES = {
  signup: "signup",
  login: "login",
  loginMethod: "login-method",
  connectSettings: "connectSettings",
  connectOnboarding: "connectOnboarding",
  connectOnboardingDao: "connectOnboardingDao",
};

export const GRAPHQL_ERRORS = {
  WEB3_ADDRESS_ALREADY_EXISTS: "web3_address_already_exist",
  ORG_INVITE_ALREADY_EXISTS: "org_invite_already_exist",
  POD_INVITE_ALREADY_EXISTS: "pod_invite_already_exist",
  NO_RECIPIENT_WEB_3_ADDRESS: "recipient has no web3 address",
  NO_WEB3_ADDRESS_FOUND: "no_web3_address_found",
  PAYMENT_METHOD_EXIST: "payment_method_exist",
  DISCORD_USER_ALREADY_EXISTS: "Existing discord user exists",
  GITHUB_REPO_ALREADY_ADDED_TO_POD: "Repo already added!",
  EMAIL_ALREADY_EXIST: "email_already_exist",
  INVALID_EMAIL: "invalid_email",
  POD_WITH_SAME_NEXT_EXISTS: "Pod with name already exist",
  DISCORD_NOT_CONFIGURED: "discord_not_configured",
};

export const PAGES_WITHOUT_HEADER = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/twitter/callback",
  "/wallet/connect",
  "/discord/callback",
];

export const BG_TYPES = {
  DEFAULT: "default",
  HOME: "home",
  MEMBERS: "members",
  LEVELS: "levels",
  QUESTS: "quests",
};

export const IMAGE_FILE_EXTENSIONS_TYPE_MAPPING = {
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  tiff: "image/tiff",
  ico: "image/x-icon",
  svg: "image/svg+xml",
};

export const VIDEO_FILE_EXTENSIONS_TYPE_MAPPING = {
  mpeg: "video/mpeg",
  mp4: "video/mp4",
  mov: "video/quicktime",
  wmv: "video/x-ms-wmv",
  flv: "video/x-flv",
  webm: "webm",
};

export const QUEST_CONDITION_TYPES = {
  DISCORD_ROLE: "discord_role",
  QUEST: "quest",
};
export const QUEST_STATUSES = {
  ARCHIVED: "archived",
  OPEN: "open",
  MAX: "max",
  INACTIVE: "inactive",
};

export const LIMIT = 10;

export const QUEST_SUBMISSION_STATUS = {
  IN_REVIEW: "in_review",
  APPROVED: "approved",
  REJECTED: "rejected",
};

export const EMPTY_STATE_TYPES = {
  SUBMISSIONS: "submissions",
  MEMBERS: "members",
};

export const ERRORS = {
  MIN_OPTION_LENGTH: "MIN_OPTION_LENGTH",
};

export const ERRORS_LABELS = {
  [ERRORS.MIN_OPTION_LENGTH]: "You need at least one option.",
};

export const DAO_CATEGORIES_KEYS = {
  SOCIAL_GOOD: "social_good",
  MEDIA_CONTENT: "media_content",
  NFT_COLLECTIVE: "nft_collective",
  INVESTMENTS: "investments",
  DEFI: "defi",
  SOCIAL: "social",
  SERVICE_DAO: "service_dao",
  THINK_TANK: "think_tank",
  FUN_MEMEABLE: "fun_memeable",
  BUILDING_PRODUCTS: "building_products",
  CREATOR_COMMUNITY: "creator_community",
  GAMING: "gaming",
  REFI: "refi",
  DESCI: "desci",
  INCUBATOR: "incubator",
  SPORTS: "sports",
};

export const DAO_CATEGORIES = {
  [DAO_CATEGORIES_KEYS.SOCIAL_GOOD]: "🌎 Social good",
  [DAO_CATEGORIES_KEYS.MEDIA_CONTENT]: "🎬 Media & content",
  [DAO_CATEGORIES_KEYS.NFT_COLLECTIVE]: "🐒 NFT collective",
  [DAO_CATEGORIES_KEYS.INVESTMENTS]: "‍‍💰️ Investments",
  [DAO_CATEGORIES_KEYS.DEFI]: "‍💸 Defi",
  [DAO_CATEGORIES_KEYS.SOCIAL]: "🤝 Social",
  [DAO_CATEGORIES_KEYS.SERVICE_DAO]: "🔨 Service DAO",
  [DAO_CATEGORIES_KEYS.THINK_TANK]: "‍🤔 Think tank",
  [DAO_CATEGORIES_KEYS.FUN_MEMEABLE]: "💀 Fun and memeable",
  [DAO_CATEGORIES_KEYS.BUILDING_PRODUCTS]: "‍🏗️ Building products",
  [DAO_CATEGORIES_KEYS.CREATOR_COMMUNITY]: "👩‍🎨 Creator community",
  [DAO_CATEGORIES_KEYS.GAMING]: "🎮 Gaming",
  [DAO_CATEGORIES_KEYS.REFI]: "🏛️ ReFi",
  [DAO_CATEGORIES_KEYS.DESCI]: "🌱 DeSci",
  [DAO_CATEGORIES_KEYS.INCUBATOR]: "🐣 Incubator",
  [DAO_CATEGORIES_KEYS.SPORTS]: "🏀 Sports",
};

export const INTERESTS = {
  [DAO_CATEGORIES_KEYS.SPORTS]: [
    "Basketball",
    "Football",
    "Soccer",
    "Tennis",
    "Golf",
    "Baseball",
    "Hockey",
    "Cricket",
    "Rugby",
    "Volleyball",
    "Boxing",
    "MMA",
    "Wrestling",
    "Motorsports",
    "Esports",
    "Other",
  ],
  [DAO_CATEGORIES_KEYS.GAMING]: ["Action", "Adventure", "Role-Playing", "Simulation", "Strategy", "Sports", "Other"],
};


export const DATA_COLLECTION_TYPES = {
	INTERESTS: 'interests',
	LOCATION: 'location',
	SKILLS: 'skills'
}

export const SKILLS = ['Filming']