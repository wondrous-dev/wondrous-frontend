export const APEIRON_TYPES = {
  VERIFY_APEIRON_ACCOUNT_BY_WALLET_ADDRESS: "verify_apeiron_account_by_wallet_address",
  VERIFY_APEIRON_APOSTLES_IV_OVER_80: "verify_apeiron_apostles_iv_over_80",
  VERIFY_APEIRON_DEFEAT_FIRST_BOSS: "verify_apeiron_defeat_first_boss",
  VERIFY_APEIRON_10_MINS_PLAYED: "verify_apeiron_10_mins_played",
};

export const FHENIX_TYPES = {
  VERIFY_FHENIX_WALLET_GAS_USAGE: "gas_usage",
  VERIFY_FHENIX_CONTRACTS_CREATED: "contract_created",
  VERIFY_FHENIX_FAUCET_INTERACTION: "contract_interaction",
  VERIFY_FHENIX_ACTIVE_WALLET: "active_wallet",
};

export const APEIRON_ORG_ID = "98989259425317451";
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
  DISCORD_EVENT_ATTENDANCE: "discord_event_attendance",
  DATA_COLLECTION: "data_collection",
  CONNECT_WALLET: "connect_wallet",
  VERIFY_TOKEN_HOLDING: "verify_token_holding",
  LINK_CLICK: "link_click",
  LIKE_YT_VIDEO: "like_yt_video",
  SUBSCRIBE_YT_CHANNEL: "subscribe_yt_channel",
  CUSTOM_ONCHAIN_ACTION: "custom_onchain_action",
  LIFI_VALUE_BRIDGED: "lifi_value_bridged",
  MIGRATE_ORIGIN_USERS: "migrate_origin_users",
  REFERRAL: "referral",
  VERIFY_MARKETSFLARE_TRIAL: "verify_marketsflare_trial",
  VERIFY_GITCOIN_PASSPORT_SCORE: "verify_gitcoin_passport_score",
  ...APEIRON_TYPES,
  ...FHENIX_TYPES,
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

export const HEADER_HEIGHT = 72;

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
  questPreview: "questPreview",
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
  CMTY_USER_ALREADY_REFERRED: "cmty_user_already_referred",
};

export const PAGES_WITHOUT_HEADER = [
  "/login",
  "/signup",
  "/forgot-password",
  "/reset-password",
  "/twitter/callback",
  "/wallet/connect",
  "/discord/callback",
  "/onboarding/welcome",
  "/quests/view/:id",
  "/discord/callback/cmty-user-connect",
  "/discord/callback/referral",
  "/invite/:token",
  "/verify-link",
  "/telegram/start-quest/:id",
  "/telegram/connect",
  "/community-badge/claim",
  "/referral-campaign",
  "/activity",
  "/onboarding/plan-select",
  "/onboarding/finalize",
];

export const BG_TYPES = {
  DEFAULT: "default",
  HOME: "home",
  MEMBERS: "members",
  LEVELS: "levels",
  QUESTS: "quests",
  VIEW_QUESTS: "view_quests",
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

export const CONDITION_TYPES = {
  DISCORD_ROLE: "discord_role",
  QUEST: "quest",
  LEVEL: "level",
};
export const QUEST_STATUSES = {
  ARCHIVED: "archived",
  OPEN: "open",
  MAX: "max",
  INACTIVE: "inactive",
};

export const STORE_ITEM_STATUSES = {
  ACTIVE: "active",
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
  PAYMENTS: "payments",
  NFT: "nft",
  PURCHASES: "purchases",
  CATEGORIES: "categories",
  REFERRALS: "referrals",
};

export const ERRORS = {
  MIN_OPTION_LENGTH: "MIN_OPTION_LENGTH",
  MAX_OPTION_LENGTH: "MAX_OPTION_LENGTH",
};

export const REQUIREMENTS_NOT_MET_ERRORS = {
  ONLY_ONCE: "only_once",
  LEVEL: "level",
  DISCORD_ROLE: "discord_role",
  QUEST: "quest",
};

export const ERRORS_LABELS = {
  [ERRORS.MIN_OPTION_LENGTH]: "You need at least one option.",
  [ERRORS.MAX_OPTION_LENGTH]: "You have too many options",
  item_deleted_error: "Item has been deleted",
  quest_archived: "Quest has been archived",
  invalid_discord_auth_code: "Invalid discord code. Please try again",
  guild_not_found: "Guild not found",
  discord_user_not_in_guild: "You need to be a member of {guildName}'s Discord to connect your account",
  discord_user_not_in_guild_on_quest_start: "You need to be a member of the Discord to start this quest",
  org_member_limit_reached:
    "The organization has reached its member limit - please contact the admin to upgrade their plan",
  [REQUIREMENTS_NOT_MET_ERRORS.ONLY_ONCE]: "You have reached the maximum number of submissions on this quest",
  [REQUIREMENTS_NOT_MET_ERRORS.LEVEL]: "You must reach at least level {requiredLevel} to embark on this quest",
  [REQUIREMENTS_NOT_MET_ERRORS.DISCORD_ROLE]: "You must have {discordRole} role to take this quest",
  [REQUIREMENTS_NOT_MET_ERRORS.QUEST]: "You must complete {questTitle} before taking this quest",
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
  [DAO_CATEGORIES_KEYS.SOCIAL_GOOD]: "Social good",
  [DAO_CATEGORIES_KEYS.MEDIA_CONTENT]: "Media & content",
  [DAO_CATEGORIES_KEYS.INVESTMENTS]: "‍Investments",
  [DAO_CATEGORIES_KEYS.SOCIAL]: "Social",
  [DAO_CATEGORIES_KEYS.SERVICE_DAO]: "Service DAO",
  [DAO_CATEGORIES_KEYS.THINK_TANK]: "Think tank",
  [DAO_CATEGORIES_KEYS.FUN_MEMEABLE]: "Fun and memeable",
  [DAO_CATEGORIES_KEYS.BUILDING_PRODUCTS]: "Building products",
  [DAO_CATEGORIES_KEYS.CREATOR_COMMUNITY]: "Creator community",
  [DAO_CATEGORIES_KEYS.GAMING]: "Gaming",
  [DAO_CATEGORIES_KEYS.REFI]: "ReFi",
  [DAO_CATEGORIES_KEYS.DESCI]: "DeSci",
  [DAO_CATEGORIES_KEYS.INCUBATOR]: "Incubator",
  [DAO_CATEGORIES_KEYS.SPORTS]: "Sports",
  artificial_intelligence: "AI (artificial intelligence)",
  defi: "Decentralized Finance (DeFi)",
  nft: "Non-Fungible Tokens (NFTs)",
  daos: "Decentralized Autonomous Organizations (DAOs)",
  tokenomics: "Tokenomics",
  data_privacy: "Data Privacy",
  engineering: "Engineering",
  marketing: "Marketing",
  community_building: "Community Building",
  memes: "Memes",
  music: "Music",
  science: "Science",
  sustainability: "Sustainability",
  cryptography: "Cryptography",
  consensus_algorithms: "Consensus Algorithms",
  decentralized_storage: "Decentralized Storage",
  digital_identity: "Digital Identity",
  cyber_security: "Cybersecurity",
  interoperability: "Interoperability",
  governance: "Governance",
  cross_chain_technologies: "Cross-Chain Technologies",
  layer_2_solutions: "Layer-2 Solutions",
  web3_social_media: "Web3 Social",
  stablecoins: "Stablecoins",
  other: "Other",
};

export const DATA_COLLECTION_TYPES = {
  INTERESTS: "interests",
  LOCATION: "location",
  SKILLS: "skills",
};

export const SKILLS = {
  blockchain_fundamentals: "Blockchain Fundamentals",
  cryptocurrency_knowledge: "Cryptocurrency Knowledge",
  smart_contract_development: "Smart Contract Development",
  dapp_development: "DApp Development",
  web3_js: "Web3.js",
  ethers_js: "Ethers.js",
  solidity: "Solidity",
  rust: "Rust",
  go: "Go",
  javascript: "JavaScript",
  react: "React",
  python: "Python",
  node_js: "Node.js",
  data_security: "Data Security",
  ipfs: "InterPlanetary File System (IPFS)",
  websockets: "WebSockets",
  networking: "Networking",
  distributed_systems: "Distributed Systems",
  cryptography: "Cryptography",
  database_management: "Database Management",
  system_design: "System Design",
  ui_ux_design: "UI/UX Design",
  testing: "Testing and Debugging",
  git: "Git and Version Control",
  agile_methodologies: "Agile Methodologies",
  other: "Other",
};

export const EXCLUDED_PATHS = [
  "/login",
  "/discord/callback",
  "/twitter/callback",
  "/discord/callback/cmty-user-connect",
  "/discord/callback/referral",
  "/quests/view/:id",
  "/signup",
  "/invite/:token",
  "/verify-link",
  "/wallet/connect",
  "/telegram/start-quest/:id",
  "/telegram/connect",
  "/community-badge/claim",
  "/referral",
  "/referral-campaign",
  "/activity",
];

export const TUTORIALS = {
  COMMUNITIES_HOME_GUIDE: "communities_home_guide",
  COMMUNITIES_QUESTS_PAGE_GUIDE: "communities_quests_page_guide",
  COMMUNITIES_QUEST: "communities_quest",
  FIRST_CREATED_QUEST: "first_created_quest",
  POST_CREATE_QUEST: "post_create_quest",
  POST_CREATE_QUEST_QUESTS_PAGE_GUIDE: "post_create_quest_quests_page_guide",
  REFERRAL_PAGE_GUIDE: "referral_page_guide",
  REFERRAL_CREATE_PAGE_GUIDE: "referral_create_page_guide",
  POST_CREATE_REFERRAL_PAGE_GUIDE: "post_create_referral_page_guide",
  MEMBERS_PAGE_GUIDE: "members_page_guide",
  LEVELS_PAGE_GUIDE: "levels_page_guide",
  ANALYTICS_PAGE_GUIDE: "analytics_page_guide",
  STORE_ITEMS_PAGE_GUIDE: "store_items_page_guide",
  STORE_ITEMS_CREATE_PAGE_GUIDE: "store_items_create_page_guide",
  STORE_ITEMS_POST_CREATE_PAGE_GUIDE: "store_items_post_create_page_guide",
};

export const DEFAULT_BANNER_IMAGES = {
  QUEST: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/d1dde3c6-ec7b-47d0-7038-5f0559af3300/public",
  LEVEL: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/fce99bf4-8658-41cc-4d62-6797e37fe700/public",
  LEADERBOARD: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/2379966b-c3ab-498c-d290-cf0826928100/public",
  QUEST_APPROVED: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/1664bce7-ae62-471d-dcc8-c12ea97ef400/public",
  QUEST_COMPLETED: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/2f3f3cee-37cf-4988-7ecc-721ec1294f00/public",
  QUEST_SUBMITTED: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/0b69e6ff-801c-4596-c9be-42c0cd6d4800/public",
  QUEST_READY_TO_SUBMIT: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/0b69e6ff-801c-4596-c9be-42c0cd6d4800/public",
  START_QUEST: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/45fd3534-6756-445d-4d17-19b277fd7d00/public",
  ONBOARD_ME: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/d96083c6-2250-4780-d492-3b27d702dc00/public",
  MY_SUBMISSION: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/955c330d-947d-4a6b-8005-2319b36ee800/public",
  QUESTION_MARK: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/272fca8c-f320-4578-0e8a-2eff794d3f00/public",
  ATTACHMENT_REQUIRED: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/73b4752f-d9a5-4c79-8151-5989c8b1fa00/public",
  QUEST_STEP_TWITTER: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/89ebf640-014a-45e2-319c-fe2b530c8900/public",
  QUEST_STEP_DISCORD: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/a64a25dd-3d03-40a2-ac40-02c2017c8300/public",
  QUEST_STEP_SNAPSHOT: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/280a3673-93a0-4be1-0cdf-2c0a7c88ab00/public",
  SHOW_QUESTS_1: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/28218faf-0823-4db9-4f6a-3cd4db1ace00/public",
  SHOW_QUESTS_2: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/61f360a2-3c12-4110-4537-4f1262bf8500/public",
  SHOW_LEADERBOARD: "https://imagedelivery.net/Nf8NSpw7AwOfpJLL_UgXaw/4737f05c-0a90-4526-be43-3f18fc9faf00/public",
};

export const TEXT_TYPES = [TYPES.TEXT_FIELD, TYPES.NUMBER];

export const SELECT_TYPES = [TYPES.MULTI_QUIZ, TYPES.SINGLE_QUIZ];

const APEIRON_INTEGRATIONS = [
  {
    label: "Verify Apeiron Account By Wallet Address",
    value: TYPES.VERIFY_APEIRON_ACCOUNT_BY_WALLET_ADDRESS,
  },
  {
    label: "Verify Apeiron Apostles IV Over 80",
    value: TYPES.VERIFY_APEIRON_APOSTLES_IV_OVER_80,
  },
  {
    label: "Verify Apeiron Defeat First Boss",
    value: TYPES.VERIFY_APEIRON_DEFEAT_FIRST_BOSS,
  },
  {
    label: "Verify Apeiron 10 mins Played",
    value: TYPES.VERIFY_APEIRON_10_MINS_PLAYED,
  },
];

const FHENIX_INTEGRATIONS = [
  {
    label: "Verify Fhenix Wallet Gas Usage",
    value: TYPES.VERIFY_FHENIX_WALLET_GAS_USAGE,
  },
  {
    label: "Verify Fhenix Wallet Faucet Interaction",
    value: TYPES.VERIFY_FHENIX_FAUCET_INTERACTION,
  },
  {
    label: "Verify Fhenix Wallet Contracts Created",
    value: TYPES.VERIFY_FHENIX_CONTRACTS_CREATED,
  },
  {
    label: "Verify Fhenix Wallet Active",
    value: TYPES.VERIFY_FHENIX_ACTIVE_WALLET,
  },
];
export const POKT_ORG_ID = import.meta.env.VITE_PRODUCTION ? "110964182503916540" : "89444950095167649";

const FHENIX_ORG_ID = import.meta.env.VITE_PRODUCTION ? "110521236745880560" : "89444950095167649";
export const CUSTOM_INTEGRATIONS = {
  // LIFI
  "58318954576216128": {
    name: "Lifi",
    integrations: [
      {
        label: "LI.FI Bridging across any EVM chain",
        value: TYPES.LIFI_VALUE_BRIDGED,
      },
    ],
  },
  "100884993427899088": {
    name: "Origin",
    integrations: [
      {
        label: "Migrate Origin members from Carma",
        value: TYPES.MIGRATE_ORIGIN_USERS,
      },
    ],
  },
  "100452448485769921": {
    name: "MarketsFlare",
    integrations: [
      {
        label: "Verify MarketsFlare trial",
        value: TYPES.VERIFY_MARKETSFLARE_TRIAL,
      },
    ],
  },
  "98989259425317451": {
    name: "Apeiron",
    integrations: APEIRON_INTEGRATIONS,
  },
  [FHENIX_ORG_ID]: {
    name: "Fhenix",
    integrations: FHENIX_INTEGRATIONS,
  },
};

export const FHENIX_FAUCET_ADDRESS = "0x42B1909dbE62ad89a86095B6F7AC74690Bd8449C";
export const OPTION_TEXT_LIMIT = 250;

export const STORE_ITEM_TYPES = {
  EXTERNAL_SHOP: "external_shop",
  NFT: "nft",
  TOKEN: "token",
  DISCORD_ROLE: "discord_role",
};
export const STORE_ITEM_LABELS = {
  [STORE_ITEM_TYPES.NFT]: "NFT",
  [STORE_ITEM_TYPES.EXTERNAL_SHOP]: "External Shop",
  [STORE_ITEM_TYPES.DISCORD_ROLE]: "Discord Roles",
  [STORE_ITEM_TYPES.TOKEN]: "Token",
};

export const DELIVERY_METHODS = {
  DISCORD_ROLE: "discord_role",
  DISCOUNT_CODE: "discount_code",
  ADMIN_WALLET_PAY: "admin_wallet_pay",
  CMTY_USER_CLAIM: "cmty_user_claim",
  RAFFLE: "raffle",
};

export const NFT_ORIGIN_TYPES = {
  CREATED: "created",
  IMPORTED: "imported",
};

export const DELIVERY_METHOD_LABELS = {
  [DELIVERY_METHODS.DISCORD_ROLE]: "Discord Role",
  [DELIVERY_METHODS.DISCOUNT_CODE]: "Voucher Code",
  [DELIVERY_METHODS.ADMIN_WALLET_PAY]: "Admin Wallet Pay",
  [DELIVERY_METHODS.CMTY_USER_CLAIM]: "Community User Claim",
  [DELIVERY_METHODS.RAFFLE]: "Apeiron Raffle (raffle for after a user makes a purchase)",
};

export const NFT_TYPE_LABELS = {
  ERC721: "ERC721",
  ERC1155: "ERC1155",
  COMMUNITY_BADGE: "Community Badge",
};

export const NFT_TYPES = {
  ERC721: "ERC721",
  ERC1155: "ERC1155",
  COMMUNITY_BADGE: "COMMUNITY_BADGE",
};

export const REFERRAL_STATUSES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
};

export const REFERRAL_REWARD_SCHEME = {
  REFERRER: "referrer",
  REFERRED: "referred",
  TWO_WAY: "two_way",
};

export const QUALIFYING_ACTION_TYPES = {
  PURCHASE: "purchase",
  QUEST: "quest",
  ANY_QUEST: "any_quest",
};

export const LOCKED_PATHS = ["/store", "/store/items/create", "/store/items/:id", "/analytics"];

export const LOCAL_STORAGE_ORG_ID_KEY = "default-org-id";

export const ALLOWLIST_ADMIN_IDS = ["46108748309069853", "54694658413953389"];