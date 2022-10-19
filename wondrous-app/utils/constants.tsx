import palette from 'theme/palette';
import PriorityHighIcon from 'components/Icons/PriorityHighIcon';
import PriorityLowIcon from 'components/Icons/PriorityLowIcon';
import PriorityMediumIcon from 'components/Icons/PriorityMediumIcon';
import PriorityUrgentIcon from 'components/Icons/PriorityUrgentIcon';

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

export const PRIORITIES = [
  {
    value: 'p0',
    label: 'Low',
    textColor: palette.green820,
    borderColor: palette.green810,
    icon: <PriorityLowIcon />,
  },
  {
    value: 'p1',
    label: 'Medium',
    textColor: palette.blue620,
    borderColor: palette.blue610,
    icon: <PriorityMediumIcon />,
  },
  {
    value: 'p2',
    label: 'High',
    textColor: palette.highlightOrange,
    borderColor: palette.highlightOrange,
    icon: <PriorityHighIcon />,
  },
  {
    value: 'p3',
    label: 'Urgent',
    textColor: palette.purple620,
    borderColor: palette.purple610,
    icon: <PriorityUrgentIcon />,
  },
];

// Task date types
export const TASK_DATE_OVERDUE = 'overdue';
export const TASK_DATE_DUE_NEXT_WEEK = 'due_next_week';
export const TASK_DATE_DUE_THIS_WEEK = 'due_this_week';

export const ORG_MEMBERSHIP_REQUESTS = 'org_membership_request';
export const POD_MEMBERSHIP_REQUESTS = 'pod_membership_requests';

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
export const STATUS_APPROVED = 'approved';
export const STATUS_REJECTED = 'rejected';
export const STATUS_CLOSED = 'closed';
export const STATUS_CHANGE_REQUESTED = 'change_requested';
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

export const EXPORT_PAYMENT_CSV_TYPE = {
  UTOPIA: 'utopia',
  PARCEL: 'parcel',
  PLAIN: 'plain',
};

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
  8217: 'KLAYTN',
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
  8217: 'KLAY',
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
  connectOnboardingDao: 'connectOnboardingDao',
};

export const NOTION_CONNECT_TYPES = {
  TASK_IMPORT: 'taskImport',
};

export const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_CHAINS).map((chainId) => parseInt(chainId, 10));

export const CHAIN_IDS = {
  ETH: 1,
  MATIC: 137,
  RINKEBY: 4,
  HARMONY: 1666600000,
  ARBITRUM: 42161,
  BSC: 56,
  BOBA: 288,
  OPTIMISM: 10,
  KLAYTN: 8217,
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
  klaytn: 'Klaytn Mainnet',
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
    symbol: 'KLAY',
    chains: [8217],
  },
  {
    symbol: 'WONDER',
    chains: [1, 137, 1666600000, 42161, 56, 288, 10, 8127],
    contracts: {
      1: '',
      137: '',
      1666600000: '',
      42161: '',
      56: '',
      288: '',
      10: '',
      8127: '',
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

export const SIDEBAR_WIDTH = '84px';
export const SIDEBAR_WIDTH_WITH_DAO = '344px';
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
  SUBMISSION: 'submission',
};

export const MODAL_TABS_MAP = {
  CONTRIBUTORS: 'Contributors',
  PODS: 'Pods',
};

export const EXPLORE_MODAL_TABS_MAP = {
  SPONSORS: 'Sponsors',
  GRANTEES: 'Grantees',
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

export const PROPOSAL_STATUS_LIST = [STATUS_OPEN, STATUS_CLOSED, STATUS_APPROVED, TASK_STATUS_ARCHIVED];

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

export const MODAL_ACTIONS = {
  SAVE: 'save',
  OPEN: 'open',
  NONE: 'none',
};

export const MENTION_REGEX = /@\[(.*?)]\((.*?)\)/g;

export const USERNAME_REGEX = /^[A-Za-z0-9_]{3,16}$/;

export const PERMISSIONS = {
  CREATE_TASK: 'create_task',
  EDIT_TASK: 'edit_task', // edit task even when you are not the creator
  MANAGE_BOARD: 'manage_board', /// move task around, but can't move it to 'done'
  APPROVE_PAYMENT: 'approve_payment',
  FULL_ACCESS: 'full_access',
  MANAGE_MEMBER: 'manage_member',
  REVIEW_TASK: 'review_task', // can be set as reviewer, once approved, it' automatically done
  MANAGE_COMMENT: 'manage_comment',
  MANAGE_POST: 'manage_post',
  MANAGE_POD: 'manage_pod', //  create new pod, archive existing pod
};

export const PERMISSION_TO_DISPLAY = {
  [PERMISSIONS.FULL_ACCESS]: 'All Permissions',
  [PERMISSIONS.MANAGE_MEMBER]: 'Add members',
  [PERMISSIONS.CREATE_TASK]: 'Create task',
  [PERMISSIONS.EDIT_TASK]: 'Edit task',
  [PERMISSIONS.REVIEW_TASK]: 'Review Tasks',
  [PERMISSIONS.MANAGE_COMMENT]: 'Manage comment',
  [PERMISSIONS.MANAGE_POD]: 'Manage pod',
  [PERMISSIONS.MANAGE_BOARD]: 'Manage board',
  // [PERMISSIONS.MANAGE_POST]: 'Manage post',
  [PERMISSIONS.APPROVE_PAYMENT]: 'Approve payment',
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
  collab_invite: 'invited you in a',
  collab_approve: 'approved a',
  collab_decline: 'declined request to join a',
};

export const NOTIFICATION_OBJECT_TYPES = {
  task: 'task',
  task_comment: 'task',
  task_proposal: 'task proposal',
  task_proposal_comment: 'task proposal',
  task_submission: 'submission',
  comment: 'comment',
  post: 'post',
  kudos: 'kudos',
  collaboration: 'collaboration',
};

export const COLLAB_TYPES = {
  INVITE: 'collab_invite',
  APPROVE: 'collab_approve',
  DECLINE: 'collab_decline',
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
export const validateEmail = (email) => email.match(EMAIL_REGEX);

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
  DISCORD_NOT_CONFIGURED: 'discord_not_configured',
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
  ROLES_CAN_CAN_APPLY: {
    title: 'Only members with role can apply',
    value: 'roles_can_can_apply',
  },
};

export const APPLICATION_POLICY_LABELS_MAP = {
  all_members: APPLICATION_POLICY.ALL_MEMBERS,
  only_org_members_can_claim: APPLICATION_POLICY.ONLY_ORG_MEMBERS_CAN_CLAIM,
  only_org_members_can_apply: APPLICATION_POLICY.ONLY_ORG_MEMBERS_CAN_APPLY,
  roles_can_can_claim: APPLICATION_POLICY.ROLES_CAN_CAN_CLAIM,
  roles_can_can_apply: APPLICATION_POLICY.ROLES_CAN_CAN_APPLY,
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

// Invite link type
export const ONE_TIME_USE_INVITE_LINK = 'one_time';
export const PUBLIC_INVITE_LINK = 'public';

export const ProposalVoteType = {
  APPROVE: 'approve',
  REJECT: 'reject',
};

export const PROPOSAL_VOTE_LABELS = {
  [ProposalVoteType.APPROVE]: {
    VOTED: 'Voted For',
    ACTION: 'Vote For',
  },
  [ProposalVoteType.REJECT]: {
    VOTED: 'Voted Against',
    ACTION: 'Vote Against',
  },
};

export const PAGES_WITH_NO_SIDEBAR = [
  '/',
  '/forgot-password-sent',
  '/forgot-password',
  '/signup',
  '/signup/email',
  '/login',
  '/discord/callback',
  '/email/verify',
  '/github/callback',
  '/invite/org/[token]',
  '/invite/pod/[token]',
  '/invite/[token]',
  '/onboarding/build-profile',
  '/onboarding/discord',
  '/onboarding/email',
  '/onboarding/twitter',
  '/onboarding/wallet',
  '/onboarding/welcome',
  '/submission/[submissionId]',
  '/twitter/callback',
  '/twitter/verify-tweet',
  '/reset-password',
  '/onboarding-dao',
  '/new-task',
  '/apps/install/coordinape',
  '/invite/collab/[token]',
  '/invite/collab/members/[token]',
];

export const TWITTER_CHALLENGE_CODE = '0ioze5m20493ny2'; // not that important but should fetch from server'

export const ADMIN_COLUMNS_TYPES = {
  [TASK_STATUS_SUBMISSION_REQUEST]: 'Submissions to review',
  [TASK_STATUS_PROPOSAL_REQUEST]: 'Proposals to review',
  [ORG_MEMBERSHIP_REQUESTS]: 'Org membership requests',
  [POD_MEMBERSHIP_REQUESTS]: 'Pod membership requests',
};
export const GLOBAL_SEARCH_TYPES = {
  ORGS: 'orgs',
  PODS: 'pods',
  USERS: 'users',
};

export const DAO_CATEGORIES = {
  social_good: '🌎 Social good',
  media_content: '🎬 Media & content',
  nft_collective: '🐒 NFT collective',
  investments: '‍‍💰️ Investments',
  defi: '‍💸 Defi',
  social: '🤝 Social',
  service_dao: '🔨 Service DAO',
  think_tank: '‍🤔 Think tank',
  fun_memeable: '💀 Fun and memeable',
  building_products: '‍🏗️ Building products',
} as const;

export const SORT_BY = {
  DESC: 'desc',
  ASC: 'asc',
};

export const USER_BOARD_PAGE_TYPES = {
  CONTRIBUTOR: 'contributor',
  ADMIN: 'admin',
};

export const PAGE_PATHNAME = {
  profile_username_about: '/profile/[username]/about',
  explore: '/explore',
  mission_control: '/mission-control',
  search_result: '/search-result',
};

export const ROLES = {
  OWNER: 'owner',
  CORE_TEAM: 'core team',
  CONTRIBUTOR: 'contributor',
  DEFAULT: 'default', // this is for any role other than the above
};

export const ROLE_COLORS_AND_EMOJIS = {
  [ROLES.OWNER]: {
    color: palette.green300,
    emoji: '🔑',
  },
  [ROLES.CORE_TEAM]: {
    color: palette.violet210,
    emoji: '🔮',
  },
  [ROLES.CONTRIBUTOR]: {
    color: palette.highlightOrange,
    emoji: '✨',
  },
  [ROLES.DEFAULT]: {
    color: palette.highlightBlue,
    emoji: '🐦',
  },
};

export const FEATURED_LIST = [
  {
    username: 'wonderverse',
    imageUrl: 'https://pbs.twimg.com/profile_images/1457839097637060612/0t2GiVRC_400x400.png',
    bio: 'Helping DAOs succeed with web3 native collaboration tools.',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1331901484686929920/1643214697/1500x500',
    name: 'Wonderverse',
  },
  {
    username: 'BanklessDAOlationships',
    imageUrl: 'https://pbs.twimg.com/profile_images/1389400052448247816/qsOU0pih_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1380589844838055937/1634756837/1500x500',
    bio: 'Manage and build relationships across the universe of DAOs as part of BanklessDAO',
    name: 'Bankless DAOlationships',
  },
  {
    username: 'Radicle',
    imageUrl: 'https://pbs.twimg.com/profile_images/1372563232850870274/aREQff_C_400x400.jpg',
    bio: 'A peer-to-peer stack for building software together 🌞',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1054235330516320257/1606739593/1500x500',
    name: 'Radicle',
  },
  {
    username: 'dYdX',
    imageUrl: 'https://pbs.twimg.com/profile_images/1422398038904123409/1t8muDVp_400x400.jpg',
    bio: 'Empowering traders with powerful & decentralized infrastructure. Trade & stake to earn rewards, and vote on the future of dydx',
    headerUrl: 'https://pbs.twimg.com/profile_banners/909929047626354688/1614178652/1500x500',
    name: 'dYdX',
  },
  {
    username: 'Gitcoin',
    imageUrl: 'https://d1fdloi71mui9q.cloudfront.net/KHC7f0e5SvS0GinfdwZE_6XUob6JgGP8uW86i',
    bio: "Gitcoin is where the world's leading web3 projects are born, validated & funded.",
    headerUrl: 'https://pbs.twimg.com/profile_banners/856446453157376003/1661964290/1500x500',
    name: 'Gitcoin',
  },
  {
    username: 'PrimeDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1399376178453090305/RJD82RrV_400x400.jpg',
    bio: 'Building tools that turn DeFi into a cooperative ecosystem. #DAO2DAO products and services.',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1280797106886901761/1622472257/1500x500',
    name: 'Prime DAO',
  },
  {
    username: 'talentDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1565047080489553921/EQSISitd_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1468727203219193859/1651863023/1500x500',
    bio: 'Unlock talent | Decentralize knowledge | #DeSci DAO Building the Journal of Decentralized Work',
    name: 'Talent DAO',
  },
  {
    username: 'MetricsDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1453392380250443782/UC8erEKz_400x400.png',
    bio: 'Uniting the best analytical minds in the space to build the future of crypto analytics.',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1451248797582077954/1643664064/1500x500',
    name: 'MetricsDAO',
  },
  {
    username: 'colorsxdao',
    imageUrl: 'https://pbs.twimg.com/profile_images/1532037515074383873/9rufaHjb_400x400.jpg',
    bio: 'A global community of creatives supporting each other across disciplines.',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1485243400379158532/1654101182/1500x500',
    name: 'Colors DAO',
  },
  {
    username: 'yup',
    imageUrl: 'https://pbs.twimg.com/profile_images/1489008618712096770/T2FtCQJL_400x400.jpg',
    bio: '✺ curate ✺ NFTs, Tweets, Videos, Tokens, Articles, Songs... you get the idea',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1678435962/1633377828/1500x500',
    name: 'Yup',
  },
  {
    username: 'ReadyPlayerDAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1499459429304979470/8XBS173g_400x400.png',
    bio: 'The future of gaming is decentralized and permissionless, and this time, the players are in charge.',
    name: 'Ready Player DAO',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1420405430400991236/1638824655/1500x500',
  },
  {
    username: 'Stems',
    imageUrl: 'https://pbs.twimg.com/profile_images/1516504445726588933/YHGzp2MT_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1449068116663754760/1651273720/1500x500',
    bio: 'make music with your favorite artist',
    name: 'StemsDAO',
  },
  {
    username: 'blu3dao',
    imageUrl: 'https://pbs.twimg.com/profile_images/1488749682251628553/c7l6JtMr_400x400.png',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1488735321319612418/1663944361/1500x500',
    bio: '🦋 making the impossible, possible. ✨ a DAO focused on empowering women & non-binary people to earn, learn & play in web3 via mentorship, community & funding',
    name: 'Blu3 DAO',
  },
  {
    username: 'harmony',
    imageUrl: 'https://pbs.twimg.com/profile_images/1526408675186790400/Tc9iFPMC_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1006055524666826754/1652811355/1500x500',
    bio: 'Harmony is an open and fast layer-1 blockchain: Our mainnet runs Ethereum applications with 2-second transaction finality and 100 times lower fees.',
    name: 'Harmony',
  },
  {
    username: 'bobanetwork',
    imageUrl: 'https://pbs.twimg.com/profile_images/1536795904706895872/PVQ769qJ_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/831847934534746114/1663777233/1500x500',
    bio: 'Lower gas, faster, secured in Ethereum, supercharged with Hybrid Compute: bridge at http://gateway.boba.network',
    name: 'Boba Network',
  },
  {
    username: 'Layer2DAO',
    imageUrl: 'https://pbs.twimg.com/profile_images/1566191261987512321/CNtKHXGT_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1480302068602576897/1642437751/1500x500',
    bio: 'Layer2DAO invests in promising L2 ecosystem projects.',
    name: 'Layer2 DAO',
  },
  {
    username: 'RVRSProtocol',
    name: 'Reverse Protocol',
    imageUrl: 'https://pbs.twimg.com/profile_images/1518631802360971264/U5sZ3gRA_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1452749248831819781/1650908414/1500x500',
    bio: '#DeFi 2.0 protocol generating passive income for $RVRS stakers through a community governed treasury ',
  },
  {
    username: 'atlantis0x',
    name: 'Atlantis World',
    bio: 'Web3 social, gaming and education in one lightweight metaverse 🎮',
    imageUrl: 'https://pbs.twimg.com/profile_images/1533910925077467137/szDWfd81_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1396594850598957061/1650731101/1500x500',
  },
  {
    username: 'jokedao',
    name: 'jokedao',
    bio: 'bottom-up, on-chain governance. for user-generated roadmaps, grants, endorsements, bounties, curation, and community-driven decisions',
    imageUrl: 'https://pbs.twimg.com/profile_images/1488257098018430979/pon20B_g_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1483660647858638851/1642618802/1500x500',
  },
  {
    username: 'Lobby3',
    name: 'Lobby3',
    bio: 'Join our fight to advance economic opportunity and Web3 technology in D.C. 👾',
    imageUrl: 'https://pbs.twimg.com/profile_images/1542579303615021056/yG2LqO3M_400x400.jpg',
    headerUrl: 'https://pbs.twimg.com/profile_banners/1483865970724589568/1645050021/1500x500',
  },
];

export const gridMobileStyles = {
  width: '100%',
  maxWidth: '100vw',
  marginLeft: '0',
};

export const TABS_LABELS = {
  DAOS: 'daos',
  BOUNTY: 'bounty',
  GR15_DEI: 'gr15_dei',
};

export enum TOKEN_GATING_CONDITION_TYPE {
  GUILD = 'guild',
  TOKEN_GATE = 'token_gate',
}

export const GR15DEICategoryName = 'gr15_dei';

export const CATEGORY_TYPES = {
  UI_UX_DESIGNER: 'ui_ux_designer',
  SOCIAL_MEDIA: 'social_media',
  GRAPHIC_DESIGN: 'graphic_design',
  GROWTH_MARKETING: 'growth_marketing',
  CONTENT_CREATION: 'content_creation',
  MEMES: 'memes',
  NFT: 'nft',
  GOVERNANCE: 'governance',
  DEFI: 'defi',
  ENGINEERING: 'engineering',
};

export const CATEGORY_LABELS = {
  [CATEGORY_TYPES.UI_UX_DESIGNER]: '💻 UI/UX Design',
  [CATEGORY_TYPES.SOCIAL_MEDIA]: '👥 Social Media',
  [CATEGORY_TYPES.GRAPHIC_DESIGN]: '🖌 Graphic Design',
  [CATEGORY_TYPES.GROWTH_MARKETING]: '📈 Growth Marketing',
  [CATEGORY_TYPES.CONTENT_CREATION]: '✍️ Writing',
  [CATEGORY_TYPES.MEMES]: '💀 Memes',
  [CATEGORY_TYPES.NFT]: '🖼 NFT',
  [CATEGORY_TYPES.GOVERNANCE]: '🪐 Governance',
  [CATEGORY_TYPES.DEFI]: '🫂 DEFI',
  [CATEGORY_TYPES.ENGINEERING]: '⚙ Engineering',
};

export const enum ORG_TYPES {
  ORG = 'org',
  COLLAB = 'collab',
}

export const enum SUBMISSION_STATUS {
  AWAITING_REVIEW = 'awaiting_review',
  REJECTED = 'rejected',
  CHANGE_REQUESTED = 'change_requested',
  APPROVED = 'approved',
  APPROVED_AND_PROCESSING_PAYMENT = 'approved_and_processing_payment',
  APPROVED_AND_PAID = 'approved_and_paid',
}

export const COMMENTER_ROLE = {
  Assignee: 'Assignee',
  Reviewer: 'Reviewer',
};
