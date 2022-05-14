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

// Supported Chains (ETHEREUM, POLYGON)
const SUPPORTED_CHAINS = {
  1: 'ETH',
  137: 'MATIC',
  1666600000: 'HARMONY',
};

export const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.NEXT_PUBLIC_RPC_URL_ETH,
  137: process.env.NEXT_PUBLIC_RPC_URL_MATIC,
  1666600000: process.env.NEXT_PUBLIC_RPC_URL_HARMONY,
};

export const CHAIN_VALUE_TO_GNOSIS_CHAIN_VALUE = {
  eth_mainnet: 'mainnet',
  polygon_mainnet: 'polygon',
  rinkeby: 'rinkeby',
  harmony: 'harmony',
};

export const CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL = {
  eth_mainnet: 'https://safe-transaction.mainnet.gnosis.io',
  polygon_mainnet: 'https://safe-transaction.polygon.gnosis.io',
  rinkeby: 'https://safe-transaction.rinkeby.gnosis.io',
  harmony: 'https://multisig.t.hmny.io',
};

export const HARMONY_MULTI_SEND_ADDR = '0x998739BFdAAdde7C933B942a68053933098f9EDa'
export const HARMONY_SAFE_MASTER_COPY = '0x69f4D1788e39c87893C980c06EdF4b7f686e2938'
export const HARMONY_SAFE_MASTER_COPY2 = '0xfb1bffC9d739B8D520DaF37dF666da4C687191EA'
export const HARMONY_PROXY_FACTORY = '0xC22834581EbC8527d974F8a1c97E1bEA4EF910BC'


export const SUPPORTED_CHAIN_IDS = Object.keys(SUPPORTED_CHAINS).map((chainId) => parseInt(chainId));

if (!process.env.NEXT_PUBLIC_PRODUCTION) {
  SUPPORTED_CHAINS[4] = 'RINKEBY';
}

export const CHAIN_IDS = {
  ETH: 1,
  MATIC: 137,
  RINKEBY: 4,
  HARMONY: 1666600000,
};

export const CHAIN_TO_CHAIN_DIPLAY_NAME = {
  eth_mainnet: 'Ethereum Mainnet',
  rinkeby: 'Rinkeby Testnet',
  polygon_mainnet: 'Polygon Mainnet',
  harmony: 'Harmony Mainnet',
};

export const SUPPORTED_CURRENCIES = [
  {
    symbol: 'ETH',
    chains: [1],
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
    symbol: 'WONDER',
    chains: [1, 137],
    contracts: {
      1: '',
      137: '',
    },
  },
  {
    symbol: 'USDC',
    chains: [1, 137],
    contracts: {
      1: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      137: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
      1666600000: '0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa'
    },
  },
];

export const CURRENCY_KEYS = {
  ETH: 'ETH',
  WONDER: 'WONDER',
  MATIC: 'MATIC',
  USDC: 'USDC',
  ONE: 'ONE',
};

export const SIDEBAR_WIDTH = '80px';
export const ENTITIES_TYPES = {
  USER: 'user',
  TASK: 'task',
  MILESTONE: 'milestone',
  POD: 'pod',
  ORG: 'org',
  BOUNTY: 'bounty',
  PROPOSAL: 'proposal',
};

export const MEDIA_TYPES = {
  IMAGE: 'image',
  TEXT: 'text',
  AUDIO: 'audio',
  CODE: 'code',
  LINK: 'link',
  VIDEO: 'video',
};

export const DEFAULT_STATUS_ARR = [TASK_STATUS_TODO, TASK_STATUS_IN_PROGRESS, TASK_STATUS_DONE, TASK_STATUS_ARCHIVED];

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
};
