export const spacingUnit = 8;

// Task Status
export const TASK_STATUS_IN_PROGRESS = 'in_progress';
export const TASK_STATUS_TODO = 'created';
export const TASK_STATUS_IN_REVIEW = 'in_review';
export const TASK_STATUS_DONE = 'completed';
export const TASK_STATUS_REQUESTED = 'requested';
export const TASK_STATUS_ARCHIVED = 'archived';
export const TASK_STATUS_AWAITING_PAYMENT = 'awaiting_payment';
export const TASK_STATUS_PAID = 'paid';
export const TASK_STATUS_PROPOSAL_REQUEST = 'proposal_request';
export const TASK_STATUS_SUBMISSION_REQUEST = 'submission_request';

//Task date types
export const TASK_DATE_OVERDUE = 'overdue';
export const TASK_DATE_DUE_NEXT_WEEK = 'due_next_week';
export const TASK_DATE_DUE_THIS_WEEK = 'due_this_week';

export const ORG_MEMBERSHIP_REQUESTS = 'org_membership_request';
export const TASK_STATUSES = [
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  TASK_STATUS_ARCHIVED,
];

export const COLUMN_TITLE_ARCHIVED = 'Archived';

export const STATUS_OPEN = 'open';
export const STATUS_WAITING_FOR_REVIEW = 'waiting_for_review';
export const STATUS_CHANGE_REQUESTED = 'change_requested';
export const STATUS_APPROVED = 'approved';
export const STATUS_REJECTED = 'rejected';
// Task types
export const TASK_TYPE = 'task';
export const BOUNTY_TYPE = 'bounty';
export const MILESTONE_TYPE = 'milestone';
// Decision
export const DECISION_SEND_INTO_REVISION = 'Send into revision';
export const DECISION_REJECT = 'Reject';
export const DECISION_APPROVE_ONLY = 'Approve only';
export const DECISION_APPROVE_AND_PAY = 'Approve and pay';

// Max avatar user list count
export const AVATAR_LIST_OVERFLOW_MAX = 5;
export const AVATAR_LIST_LARGE_OVERFLOW_MAX = 2;

// Social media
export const SOCIAL_MEDIA_FACEBOOK = 'facebook';
export const SOCIAL_MEDIA_TWITTER = 'twitter';
export const SOCIAL_MEDIA_LINKEDIN = 'linkedin';
export const SOCIAL_MEDIA_DISCORD = 'discord';
export const SOCIAL_MEDIA_GITHUB = 'github';
export const SOCIAL_MEDIA_SPOTIFY = 'spotify';
export const SOCIAL_MEDIA_INSTAGRAM = 'instagram';
export const SOCIAL_OPENSEA = 'opensea';

// Character Limits
export const CHAR_LIMIT_PROFILE_BIO = 200;

export const PAYMENT_STATUS = {
  UNPAID: 'unpaid',
  PROCESSING: 'processing',
  PAID: 'paid',
  FAILED: 'failed',
};

// board columns configuration
export const COLUMNS_CONFIGURATION = {
  ORG: 'org',
  ASSIGNEE: 'assignee',
};

// Supported Chains (ETHEREUM, POLYGON)
const SUPPORTED_CHAINS = {
  1: 'ETH',
  137: 'MATIC',
  1666600000: 'HARMONY',
  42161: 'ARBITRUM',
  56: 'BSC',
  288: 'BOBA',
  10: 'OPTIMISM',
};

export const NATIVE_TOKEN_SYMBOL = {
  1: 'ETH',
  4: 'ETH',
  137: 'MATIC',
  1666600000: 'ONE',
  42161: 'AETH',
  56: 'BNB',
  288: 'ETH',
  10: 'OP',
};

if (!process.env.NEXT_PUBLIC_PRODUCTION) {
  SUPPORTED_CHAINS[4] = 'RINKEBY';
}

export const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_ETH,
  4: process.env.NEXT_PUBLIC_RPC_URL_RINKEBY,
  137: process.env.NEXT_PUBLIC_RPC_URL_MATIC,
  1666600000: process.env.NEXT_PUBLIC_RPC_URL_HARMONY,
  42161: process.env.NEXT_PUBLIC_RPC_URL_ARBITRUM,
  56: process.env.NEXT_PUBLIC_RPC_URL_BSC,
  288: process.env.NEXT_PUBLIC_RPC_URL_BOBA,
  10: process.env.NEXT_PUBLIC_RPC_URL_OPTIMISM,
};

export const CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL = {
  ethereum: 'https://safe-transaction.mainnet.gnosis.io',
  rinkeby: 'https://safe-transaction.rinkeby.gnosis.io',
  polygon: 'https://safe-transaction.polygon.gnosis.io',
  harmony: 'https://multisig.t.hmny.io',
  arbitrum: 'https://safe-transaction.arbitrum.gnosis.io',
  bsc: 'https://safe-transaction.bsc.gnosis.io',
  boba: 'https://safe-transaction.mainnet.boba.network',
  optimism: 'https://safe-transaction.optimism.gnosis.io',
};

export const HARMONY_MULTI_SEND_ADDR = '0x998739BFdAAdde7C933B942a68053933098f9EDa';
export const HARMONY_SAFE_MASTER_COPY = '0x69f4D1788e39c87893C980c06EdF4b7f686e2938';
export const HARMONY_SAFE_MASTER_COPY2 = '0xfb1bffC9d739B8D520DaF37dF666da4C687191EA';
export const HARMONY_PROXY_FACTORY = '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC';

export const DISCORD_CONNECT_TYPES = {
  signup: 'signup',
  login: 'login',
  connectSettings: 'connectSettings',
  connectOnboarding: 'connectOnboarding',
};

export const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_CHAINS).map((chainId) => parseInt(chainId));

export const CHAIN_IDS = {
  ETH: 1,
  MATIC: 137,
  RINKEBY: 4,
  HARMONY: 1666600000,
  ARBITRUM: 42161,
  BSC: 56,
  BOBA: 288,
  OPTIMISM: 10,
};

export const CHAIN_TO_CHAIN_DIPLAY_NAME = {
  ethereum: 'Ethereum Mainnet',
  rinkeby: 'Rinkeby Testnet',
  polygon: 'Polygon Mainnet',
  harmony: 'Harmony Mainnet',
  arbitrum: 'Arbitrum One',
  bsc: 'BNB smart chain',
  boba: 'Boba Mainnet',
  optimism: 'Optimism Mainnet',
};

export const SUPPORTED_CURRENCIES = [
  {
    symbol: 'ETH',
    chains: [1, 4, 288],
  },
  {
    symbol: 'MATIC',
    chains: [137],
  },
  {
    symbol: 'ONE',
    chains: [1666600000],
  },
  {
    symbol: 'AETH',
    chains: [42161],
  },
  {
    symbol: 'BNB',
    chains: [56],
  },
  {
    symbol: 'OP',
    chains: [10],
  },
  {
    symbol: 'WONDER',
    chains: [1, 137, 1666600000, 42161, 56, 288, 10],
    contracts: {
      1: '',
      137: '',
      1666600000: '',
      42161: '',
      56: '',
      288: '',
      10: '',
    },
  },
  {
    symbol: 'USDC',
    chains: [1, 137, 1666600000, 42161, 288, 10],
    contracts: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      1666600000: '0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa',
      42161: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
      56: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
      288: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc',
      10: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607',
    },
  },
];

export const SIDEBAR_WIDTH = '80px';
export const HEADER_HEIGHT = '68px';

export const PROFILE_CARD_WIDTH = 310;
export const PROFILE_CARD_HEIGHT = 194;

export const ENTITIES_TYPES = {
  USER: 'user',
  TASK: 'task',
  MILESTONE: 'milestone',
  POD: 'pod',
  ORG: 'org',
  BOUNTY: 'bounty',
  PROPOSAL: 'proposal',
};

export const MODAL_TABS_MAP = {
  CONTRIBUTORS: 'Contributors',
  PODS: 'Pods',
};

export const MEDIA_TYPES = {
  IMAGE: 'image',
  TEXT: 'text',
  AUDIO: 'audio',
  CODE: 'code',
  LINK: 'link',
  VIDEO: 'video',
};

export const DEFAULT_STATUSES = [
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  TASK_STATUS_ARCHIVED,
];

export const TASKS_DEFAULT_STATUSES = [
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
];

export const STATUSES_ON_ENTITY_TYPES = {
  [ENTITIES_TYPES.TASK]: TASKS_DEFAULT_STATUSES,
  [ENTITIES_TYPES.MILESTONE]: TASKS_DEFAULT_STATUSES,
  [ENTITIES_TYPES.BOUNTY]: TASKS_DEFAULT_STATUSES,
  [ENTITIES_TYPES.PROPOSAL]: TASKS_DEFAULT_STATUSES,
  DEFAULT: DEFAULT_STATUSES,
};

export const PROPOSAL_STATUS_LIST = [STATUS_OPEN, STATUS_CHANGE_REQUESTED, STATUS_APPROVED, TASK_STATUS_ARCHIVED];

export const IMAGE_FILE_EXTENSIONS_TYPE_MAPPING = {
  gif: 'image/gif',
  jpeg: 'image/jpeg',
  jpg: 'image/jpeg',
  png: 'image/png',
  tiff: 'image/tiff',
  ico: 'image/x-icon',
  svg: 'image/svg+xml',
};

export const VIDEO_FILE_EXTENSIONS_TYPE_MAPPING = {
  mpeg: 'video/mpeg',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  wmv: 'video/x-ms-wmv',
  flv: 'video/x-flv',
  webm: 'webm',
};

export const MENTION_REGEX = /@\[(.*?)]\((.*?)\)/g;

export const USERNAME_REGEX = /^[A-Za-z0-9_]{3,16}$/;
export const PERMISSIONS = {
  CREATE_TASK: 'create_task',
  EDIT_TASK: 'edit_task', // edit task even when you are not the creator
  MANAGE_BOARD: 'manage_board', /// move task around, but can't move it to 'done'
  APPROVE_PAYMENT: 'approve_payment',
  CAN_COMMENT: 'can_comment',
  FULL_ACCESS: 'full_access',
  MANAGE_MEMBER: 'manage_member',
  REVIEW_TASK: 'review_task', //can be set as reviewer, once approved, it' automatically done
  MANAGE_COMMENT: 'manage_comment',
  MANAGE_POST: 'manage_post',
  MANAGE_POD: 'manage_pod', //  create new pod, archive existing pod
  REORDER_TASK: 'reorder_task', // reorder task vertically
};

export const NOTIFICATION_VERBS = {
  task_like: 'liked a',
  mention: 'mentioned you in a',
  task_approve: 'approved a',
  task_deny: 'denied a',
  task_revise: 'send into revision a',
  payment: 'paid',
  task_add: 'added',
  post: 'posted a',
  task_assign: 'assigned a',
  comment: 'commented on',
  task_submit: 'submitted a',
};

export const NOTIFICATION_OBJECT_TYPES = {
  task: 'task',
  task_comment: 'task',
  task_proposal: 'task proposal',
  task_proposal_comment: 'task proposal',
  task_submission: 'submission',
  comment: 'comment',
};

export const PRIVACY_LEVEL = {
  public: 'public',
  private: 'private',
};

export const BOARD_TYPE = {
  org: 'org',
  pod: 'pod',
  assignee: 'assignee',
};

export const snakeToCamel = (str) =>
  str?.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));

export const POD_COLOR = {
  '#B8255F': 'Ruby Red',
  '#DB4035': 'Jasper Red',
  '#FF9933': 'Sunstone Orange',
  '#FAD000': 'Citrine Yellow',
  '#B4C424': 'Peridot Green',
  '#7ECC49': 'Lime Green',
  '#00A86B': 'Jade Green',
  '#76EBCA': 'Aquamarine',
  '#158FAD': 'Gemstone Teal',
  '#72C2D4': 'Larimar Blue',
  '#96C3EB': 'Lace Agate Blue',
  '#4073FF': 'Azurite Blue',
  '#884DFF': 'Amethyst Purple',
  '#AF38EB': 'Spirit Quartz Purple',
  '#EB96EB': 'Lepidolite pink',
  '#E05194': 'Magenta',
  '#FF8D85': 'Sardonyx Salmon',
  '#808080': 'Shungite Grey',
  '#B8B8B8': 'Grey',
  '#CCAC93': 'Okenite Sepia',
};

export const filteredColorOptions = Object.keys(POD_COLOR).map((key) => ({
  label: POD_COLOR[key],
  value: key,
}));
export { SUPPORTED_CHAINS };
export const EMAIL_REGEX =
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const URL_REGEX =
  /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi;
export const validateEmail = (email) => {
  return email.match(EMAIL_REGEX);
};

export const GRAPHQL_ERRORS = {
  WEB3_ADDRESS_ALREADY_EXISTS: 'web3_address_already_exist',
  ORG_INVITE_ALREADY_EXISTS: 'org_invite_already_exist',
  POD_INVITE_ALREADY_EXISTS: 'pod_invite_already_exist',
  NO_RECIPIENT_WEB_3_ADDRESS: 'recipient has no web3 address',
  NO_WEB3_ADDRESS_FOUND: 'no_web3_address_found',
  PAYMENT_METHOD_EXIST: 'payment_method_exist',
  DISCORD_USER_ALREADY_EXISTS: 'Existing discord user exists',
  GITHUB_REPO_ALREADY_ADDED_TO_POD: 'Repo already added!',
  EMAIL_ALREADY_EXIST: 'email_already_exist',
  INVALID_EMAIL: 'invalid_email',
  POD_WITH_SAME_NEXT_EXISTS: 'Pod with name already exist',
};

export const LINK = process.env.NEXT_PUBLIC_PRODUCTION
  ? `https://app.wonderverse.xyz`
  : process.env.NEXT_PUBLIC_STAGING
  ? 'https://wondrous-app-git-staging-wonderverse.vercel.app'
  : 'http://localhost:3000';

export const DATEPICKER_OPTIONS = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  PERIODICALLY: 'periodic',
};
export const DATEPICKER_OPTIONS_ARR = Object.values(DATEPICKER_OPTIONS);

export const DATEPICKER_FIELDS = { END_DATE: 'endDate', START_DATE: 'startDate' };

export const DEFAULT_DATEPICKER_VALUE = { startDate: null, endDate: null };
export const DEFAULT_SINGLE_DATEPICKER_VALUE = null;

export const MONTH_DAY_FULL_YEAR = 'MM/DD/YYYY';
export const DAY_STRING_MONTH_SHORT_YEAR = 'DD/MMM/YY';

export const WEEK_DAYS = {
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
  sunday: false,
};

export const WHITE_TYPOGRAPHY_STYLES = {
  fontFamily: 'Space Grotesk',
  fontWeight: 500,
  fontWize: 16,
  lineHeight: '16px',
  color: '#FFFFFF',
};

export const DOCS_PERMISSIONS = [
  {
    label: 'Public',
    value: 'public',
  },
  {
    label: 'Members',
    value: 'members',
  },
];

// Taken from back-end src/constants/colors.py
export enum ColorTypes {
  RubyRed = '#B8255F',
  JasperRed = '#DB4035',
  SunstoneOrange = '#FF9933',
  CitrineYellow = '#FAD000',
  PeridotGreen = '#B4C424',
  LimeGreen = '#7ECC49',
  JadeGreen = '#00A86B',
  Aquamarine = '#76EBCA',
  GemstoneTeal = '#158FAD',
  LarimarBlue = '#72C2D4',
  LaceAgateBlue = '#96C3EB',
  AzuriteBlue = '#4073FF',
  AmethystPurple = '#884DFF',
  SpiritQuartzPurple = '#AF38EB',
  LepidolitePink = '#EB96EB',
  Magenta = '#E05194',
  SardonyxSalmon = '#FF8D85',
  ShungiteGrey = '#808080',
  Grey = '#B8B8B8',
  OkeniteSepia = '#CCAC93',
}

export const PRIVATE_TASK_TITLE = '_private_task';

export const APPLICATION_POLICY = {
  ALL_MEMBERS: {
    title: 'All members need to apply',
    value: 'all_members',
  },
  ONLY_ORG_MEMBERS_CAN_CLAIM: {
    title: 'Everyone needs to apply except DAO members',
    value: 'only_org_members_can_claim',
  },
  ONLY_ORG_MEMBERS_CAN_APPLY: {
    title: 'Only DAO members can apply',
    value: 'only_org_members_can_apply',
  },
  ROLES_CAN_CAN_CLAIM: {
    title: 'Everyone needs to apply except members with role',
    value: 'roles_can_can_claim',
  },
};

export const APPLICATION_POLICY_LABELS_MAP = {
  all_members: APPLICATION_POLICY.ALL_MEMBERS,
  only_org_members_can_claim: APPLICATION_POLICY.ONLY_ORG_MEMBERS_CAN_CLAIM,
  only_org_members_can_apply: APPLICATION_POLICY.ONLY_ORG_MEMBERS_CAN_APPLY,
  roles_can_can_claim: APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM,
};

export const TASK_APPLICATION_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const TASK_APPLICATION_STATUS_LABELS = {
  [TASK_APPLICATION_STATUS.PENDING]: 'Pending...',
  [TASK_APPLICATION_STATUS.APPROVED]: 'Approved',
  [TASK_APPLICATION_STATUS.REJECTED]: 'Rejected',
};
