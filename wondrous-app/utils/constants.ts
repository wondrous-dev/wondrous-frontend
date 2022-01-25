export const spacingUnit = 8;

// Task Status
export const TASK_STATUS_IN_PROGRESS = 'in_progress';
export const TASK_STATUS_TODO = 'created';
export const TASK_STATUS_IN_REVIEW = 'in_review';
export const TASK_STATUS_DONE = 'completed';
export const TASK_STATUS_REQUESTED = 'requested';
export const TASK_STATUS_ARCHIVED = 'archived';

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
export const CHAR_LIMIT_PROFILE_BIO = 200

// Supported Chains (ETHEREUM, POLYGON)
export const SUPPORTED_CHAINS = {
  1: 'ETH',
  137: 'MATIC',
};

export const CHAIN_IDS = {
  ETH: 1,
  MATIC: 137,
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
    },
  },
];

export const CURRENCY_KEYS = {
  ETH: 'ETH',
  WONDER: 'WONDER',
  MATIC: 'MATIC',
  USDC: 'USDC',
};

export const SIDEBAR_WIDTH = '80px';
export const ENTITIES_TYPES = {
  USER: 'user',
  TASK: 'task',
  MILESTONE: 'milestone',
  POD: 'pod',
  ORG: 'org',
};

export const MEDIA_TYPES = {
  IMAGE: 'image',
  TEXT: 'text',
  AUDIO: 'audio',
  CODE: 'code',
  LINK: 'link',
  VIDEO: 'video',
};

export const DEFAULT_STATUS_ARR = [
  TASK_STATUS_TODO,
  TASK_STATUS_IN_PROGRESS,
  TASK_STATUS_IN_REVIEW,
  TASK_STATUS_DONE,
  TASK_STATUS_ARCHIVED,
];

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
  mention: 'mentioned',
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
  task_comment: 'taskComment',
  task_proposal: 'taskProposal',
  task_proposal_comment: 'taskProposalComment',
  task_submission: 'submission',
  comment: 'comment',
};
