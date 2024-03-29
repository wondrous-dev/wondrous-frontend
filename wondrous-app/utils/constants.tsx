import palette from 'theme/palette';
import PriorityHighIcon from 'components/Icons/PriorityHighIcon';
import PriorityLowIcon from 'components/Icons/PriorityLowIcon';
import PriorityMediumIcon from 'components/Icons/PriorityMediumIcon';
import PriorityUrgentIcon from 'components/Icons/PriorityUrgentIcon';
import { ToDo, InProgress, Done, InReview, Proposal, Approved, Rejected } from 'components/Icons';

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

export const DISCORD_CONNECT_TYPES = {
  signup: 'signup',
  login: 'login',
  loginMethod: 'login-method',
  connectSettings: 'connectSettings',
  connectOnboarding: 'connectOnboarding',
  connectOnboardingDao: 'connectOnboardingDao',
};

export const NOTION_CONNECT_TYPES = {
  TASK_IMPORT: 'taskImport',
};

export const SIDEBAR_WIDTH = '84px';
export const SIDEBAR_WIDTH_WITH_DAO = '344px';
export const HEADER_HEIGHT = '62px';

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
  GRANT: 'grant',
  GRANT_APPLICATION: 'grant_application',
  COLLAB: 'collab',
  WONDER_AI_BOT: 'wonder_ai_bot',
};

export const ENTITIES_DISPLAY_LABEL_MAP = {
  [ENTITIES_TYPES.TASK]: 'Tasks',
  [ENTITIES_TYPES.MILESTONE]: 'Milestones',
  [ENTITIES_TYPES.BOUNTY]: 'Bounties',
  [ENTITIES_TYPES.PROPOSAL]: 'Proposals',
  [ENTITIES_TYPES.GRANT]: 'Grants',
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

export const USERNAME_REGEX = /^[A-Za-z0-9_]{3,25}$/;

export const PERMISSIONS = {
  CREATE_TASK: 'create_task',
  EDIT_TASK: 'edit_task', // edit task even when you are not the creator
  MANAGE_BOARD: 'manage_board', /// move task around, but can't move it to 'done'
  APPROVE_PAYMENT: 'approve_payment',
  FULL_ACCESS: 'full_access',
  MANAGE_MEMBER: 'manage_member',
  REVIEW_TASK: 'review_task', // can be set as reviewer, once approved, it' automatically done
  MANAGE_COMMENT: 'manage_comment',
  // MANAGE_POST: 'manage_post',
  MANAGE_POD: 'manage_pod', //  create new pod, archive existing pod
  MANAGE_GRANTS: 'manage_grants',
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
  [PERMISSIONS.MANAGE_GRANTS]: 'Manage grants',
};

export const NOTIFICATION_TYPES = {
  MENTION: 'mention',
  COMMENT: 'comment',
  ORG_INVITE_ACCEPT: 'org_invite_accept',
  POD_INVITE_ACCEPT: 'pod_invite_accept',
  ORG_INVITE: 'org_invite',
  POD_INVITE: 'pod_invite',
  TASK_ASSIGN: 'task_assign',
  CREATOR_TASK_ASSIGN: 'creator_task_assign',
  PAYMENT_RECEIVED: 'payment_received',
  REACTION: 'reaction',
  CONVERSATION_COMMENT: 'conversation_comment',
  FOLLOW_APPROVE: 'follow_approve',
  NOW_FOLLOWING: 'now_following',
  FOLLOW_REQUEST: 'follow_request',
  STREAK_REMINDER: 'streak_reminder',
  REVIEW_REMINDER: 'review_reminder',
  EXPIRING_ACTION_REMINDER: 'expiring_action_reminder',
  EXPIRED_ACTION_REMINDER: 'expired_action_reminder',
  COLLAB_INVITE: 'collab_invite',
  COLLAB_APPROVE: 'collab_approve',
  COLLAB_DECLINE: 'collab_decline',
  TASK_MINTED: 'task_minted',
  SUBMISSION_REQUEST_CHANGE: 'submission_request_change',
  SUBMISSION_CREATE: 'submission_create',
  SUBMISSION_APPROVE: 'submission_approve',
  SUBMISSION_REJECT: 'submission_reject',
  SUBMISSION_RESUBMIT: 'submission_resubmit',

  NEW_PROPOSAL: 'new_proposal',
  PROPOSAL_APPROVE: 'proposal_approve',
  PROPOSAL_REJECT: 'proposal_reject',
  GRANT_APPLICATION_APPROVED: 'grant_application_approved',
};

export const NOTIFICATION_OBJ_TYPES = {
  TASK: 'task',
  TASK_COMMENT: 'task_comment',
  TASK_PROPOSAL: 'task_proposal',
  TASK_PROPOSAL_COMMENT: 'task_proposal_comment',
  TASK_SUBMISSION: 'task_submission',
  TASK_SUBMISSION_COMMENT: 'task_submission_comment',
  POST: 'post',
  COLLABORATION: 'collaboration',
  POD: 'pod',
  GRANT: 'grant',
  GRANT_APPLICATION: 'grant_application',
  MILESTONE: 'milestone',
  MILESTONE_COMMENT: 'milestone_comment',
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
  ORG_ROLE_IN_USE: 'Cannot delete a role that is in use',
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
export const PRIVATE_BOUNTY_TITLE = '_private_bounty';
export const APPLICATION_POLICY = {
  ALL_MEMBERS: {
    title: 'All members need to apply',
    value: 'all_members',
  },
  ONLY_ORG_MEMBERS_CAN_CLAIM: {
    title: 'Everyone needs to apply except org members',
    value: 'only_org_members_can_claim',
  },
  ONLY_ORG_MEMBERS_CAN_APPLY: {
    title: 'Only org members can apply',
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

export const DAO_CATEGORIES_KEYS = {
  SOCIAL_GOOD: 'social_good',
  MEDIA_CONTENT: 'media_content',
  NFT_COLLECTIVE: 'nft_collective',
  INVESTMENTS: 'investments',
  DEFI: 'defi',
  SOCIAL: 'social',
  SERVICE_DAO: 'service_dao',
  THINK_TANK: 'think_tank',
  FUN_MEMEABLE: 'fun_memeable',
  BUILDING_PRODUCTS: 'building_products',
  CREATOR_COMMUNITY: 'creator_community',
  GAMING: 'gaming',
  REFI: 'refi',
  DESCI: 'desci',
  INCUBATOR: 'incubator',
  SPORTS: 'sports',
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
  creator_community: '👩‍🎨 Creator community',
  gaming: '🎮 Gaming',
  refi: '🏛️ ReFi',
  desci: '🌱 DeSci',
  incubator: '🐣 Incubator',
  sports: '🏀 Sports',
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
  NO_ROLE: 'no role',
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
  [ROLES.NO_ROLE]: {
    color: palette.grey87,
    emoji: '',
  },
  [ROLES.DEFAULT]: {
    color: palette.highlightBlue,
    emoji: '🐦',
  },
};

export const FEATURED_LIST = [
  {
    username: 'wonderverse',
    imageUrl: 'org/profile/45956686890926082/1ULEYJva6jT3pw.jpg',
    bio: 'Helping organizations succeed with web3 native collaboration tools.',
    headerUrl: 'org/header/45956686890926082/WX7Up9R2q3xumQ.png',
    name: 'Wonderverse',
  },
  {
    username: 'banklessafrica',
    imageUrl: 'thumbnail/lPag9ulTcokV1w.jpg',
    headerUrl: 'org/header/59396866214723655/BXdS6EENCC6Ifw.jpeg',
    bio: 'Educating, onboarding and informing everyday Africans about bitcoin,Defi,DAOs,web3 etc',
    name: 'Bankless Africa',
  },
  {
    username: 'merit_circle',
    imageUrl: 'thumbnail/zMPyNEoOiXbdYw.png',
    bio: 'Investing, gaming, building and trading in web3.',
    headerUrl: 'org/header/63763663725527146/_aJDcWHLrTM6PQ.png',
    name: 'Merit Circle',
  },
  {
    username: 'clubraredao',
    imageUrl: 'thumbnail/8d9bECvHKIueHQ.png',
    headerUrl: 'org/header/54613035730337824/D6pAiyPBzl3N5w.png',
    bio: 'ClubRare DAO is the accelerator for Phygital NFT creators.',
    name: 'ClubRare DAO',
  },
  {
    username: 'yup',
    imageUrl: 'thumbnail/pHu07-T3OVr2BQ.png',
    bio: '✺ curate ✺ NFTs, Tweets, Videos, Tokens, Articles, Songs... you get the idea',
    headerUrl: 'org/header/51007906165817360/8B1kRfVzQ9SmXA.jpeg',
    name: 'Yup',
  },
  {
    username: 'layer2dao',
    imageUrl: 'thumbnail/7ym4a22gWHMa6Q.jpg',
    headerUrl: 'org/header/56980676447043635/n5WWpDaLTX7DUQ.jpeg',
    bio: 'Layer2DAO invests in promising L2 ecosystem projects.',
    name: 'Layer2 DAO',
  },
  {
    username: 'peopledao',
    imageUrl: 'thumbnail/KDWyi8V2W9b4zA.png',
    headerUrl: 'org/header/73998449654104436/XnDaTHBCUltLEg.png',
    name: 'PeopleDAO',
    bio: 'PeopleDAO is a metaDAO governed by $PEOPLE . From the people, To the people, For the people. (📜,🤝)',
  },
  {
    username: 'theRAWDAO',
    imageUrl: 'thumbnail/NSH6BAcqaTOVAw.jpg',
    headerUrl: 'org/header/57093429215100980/eafq4IqOHxIxwQ.png',
    name: 'The RAW DAO',
    bio: 'an ecosystem that is educating, networking & transforming physical creations 2 digital assets🍏',
  },
  {
    username: 'unlock',
    imageUrl: 'thumbnail/-qgTydr4tP1wTg.png',
    headerUrl: 'org/header/67845186849341630/_XcbBTe71pLPXw.png',
    bio: 'Unlock is a decentralized protocol for memberships.',
    name: 'Unlock Protocol',
  },
  {
    username: 'builder',
    imageUrl: 'thumbnail/c3qJBBY45jDE2Q.png',
    bio: 'Web3 Digital Marketing Data Service Provider, focus on DID & Web3 Digital Marketing Tools',
    headerUrl: 'org/header/81556780460540000/Iz8ShtFvFT6Zbw.png',
    name: 'dmgdata',
  },
  {
    username: 'dydx',
    imageUrl: 'thumbnail/Z0KaIqaPnq4_FA.jpg',
    bio: 'Empowering traders with powerful & decentralized infrastructure. Trade & stake to earn rewards, and vote on the future of dydx',
    headerUrl: 'org/header/51083244349685777/kPkZMCDciq1kPg.jpeg',
    name: 'dYdX',
  },
  {
    username: 'gitcoin',
    imageUrl: 'thumbnail/r1vqCxBUe5Vf_g.jpg',
    bio: "Gitcoin is where the world's leading web3 projects are born, validated & funded.",
    headerUrl: 'org/header/50979198683054094/k2fvmfTmEWmsxg.jpeg',
    name: 'Gitcoin',
  },
  {
    username: 'primedao',
    imageUrl: 'thumbnail/eC1saeeUz33wOw.jpg',
    bio: 'Building tools that turn DeFi into a cooperative ecosystem. #DAO2DAO products and services.',
    headerUrl: 'org/header/57310312183889975/9EfJtN66uStK0A.jpeg',
    name: 'Prime DAO',
  },
  {
    username: 'landx',
    imageUrl: 'thumbnail/IlNy6Yfaj_0kAQ.jpg',
    bio: 'The Perpetual Commodity Vaults Protocol ',
    headerUrl: 'org/header/65478934565748886/7M94073pyzLAVg.png',
    name: 'LandX',
  },
  {
    username: 'talentDAO',
    imageUrl: 'thumbnail/--_8OBKmOoYBSg.jpg',
    headerUrl: 'org/header/50274039728439308/EYVXWPWOZp8tYw.jpeg',
    bio: 'Unlock talent | Decentralize knowledge | #DeSci DAO Building the Journal of Decentralized Work',
    name: 'Talent DAO',
  },
  {
    username: 'metricsdao',
    imageUrl: 'thumbnail/aEctNGvj9d3MeQ.png',
    bio: 'Uniting the best analytical minds in the space to build the future of crypto analytics.',
    headerUrl: 'org/header/54002035516768285/YtjvJAXsI2KhmQ.jpeg',
    name: 'MetricsDAO',
  },
  {
    username: 'breadchain',
    imageUrl: 'thumbnail/oy3CWe7QTRT_3w.png',
    bio: 'Breadchain is a collective federation of decentralized cooperative projects looking to forge solidarity through blockchain to advance a progressive vision for the technology and its effect on society.',
    name: 'Breadchain',
    headerUrl: 'org/header/80226660554637384/9aqZ_gEHQEG7mQ.png',
  },
  {
    username: '40acres',
    imageUrl: 'thumbnail/opqtdvRTiogZoA.jpg',
    headerUrl: 'org/header/48189639775748102/_b9SyvjC0hWSTw.jpeg',
    bio: '40acres is the premier social impact DAO for building self sustaining communities of color using blockchain tech.',
    name: '40acres DAO',
  },
  {
    username: 'blu3dao',
    imageUrl: 'thumbnail/Kb6juRRh9ifRVA.png',
    headerUrl: 'org/header/56518149820907568/LBxQZMtLkiPTig.jpeg',
    bio: '🦋 making the impossible, possible. ✨ a DAO focused on empowering women & non-binary people to earn, learn & play in web3 via mentorship, community & funding',
    name: 'Blu3 DAO',
  },
  {
    username: 'kleomedes',
    name: 'Kleomedes',
    imageUrl: 'thumbnail/gpbRqF7PH_MqYQ.png',
    headerUrl: 'org/header/79974708365230138/4crj14njtkVGYQ.png',
    bio: 'Validator Enterprise Building a Decentralized Network of Governance Contributors',
  },
];

export const gridMobileStyles = {
  width: '100%',
  maxWidth: '100vw',
  marginLeft: '0',
};

export const TABS_LABELS = {
  ORGS: 'orgs',
  BOUNTY: 'bounty',
  GR15_DEI: 'gr15_dei',
};

export enum TOKEN_GATING_CONDITION_TYPE {
  GUILD = 'guild',
  TOKEN_GATE = 'token_gate',
  OTTERSPACE = 'otterspace',
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
  OPERATION: 'operation',
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
  [CATEGORY_TYPES.OPERATION]: '🛠️ Operation',
};

export const PROPOSAL_VOTE_CHOICES = {
  BINARY: 'binary',
  CUSTOM: 'custom',
};
export const PROPOSAL_VOTE_CHOICE_LABELS = {
  [PROPOSAL_VOTE_CHOICES.BINARY]: 'For/Against',
  [PROPOSAL_VOTE_CHOICES.CUSTOM]: 'Multiple Choice',
};

export const DEFAULT_CUSTOM_PROPOSAL_CHOICE_ARRAY = ['', ''];
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

export enum SUBMISSION_COMMENT_TYPE {
  APPROVED = 'approved',
  CHANGE_REQUESTED = 'change_requested',
  RESUBMIT = 'resubmit',
  REOPEN = 'reopen',
}

export enum GRANT_APPLICATION_COMMENT_TYPE {
  APPROVED = 'approved',
  CHANGE_REQUESTED = 'change_requested',
  RESUBMIT = 'resubmit',
  REOPEN = 'reopen',
  REJECTED = 'rejected',
}
export const HEADER_ASPECT_RATIO = 7.05;

export const TaskMintStatus = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const GRANTS_STATUSES = {
  OPEN: 'open',
  CLOSED: 'closed',
};

export enum GRANT_APPLICATION_STATUSES {
  OPEN = 'open',
  WAITING_FOR_REVIEW = 'waiting_for_review',
  CHANGE_REQUESTED = 'change_requested',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  APPROVED_AND_PAID = 'approved_and_paid',
  APPROVED_AND_PROCESSING = 'approved_and_processing',
}

export const PRIVACY_LABELS = {
  [PRIVACY_LEVEL.public]: 'Public',
  [PRIVACY_LEVEL.private]: 'Members only',
};

export const GRANT_APPLY_POLICY = {
  EVERYONE: 'everyone',
  ONLY_ORG_MEMBERS: 'only_org_members',
};

export const PAGES_WITH_NO_ENTITY_SIDEBAR = ['/explore'];

export const EMPTY_RICH_TEXT_STRING = '[{"children":[{"text":""}],"type":"paragraph"}]';

export const TITLES = {
  [TASK_STATUS_TODO]: 'To-do',
  [TASK_STATUS_IN_PROGRESS]: 'In-Progress',
  [TASK_STATUS_IN_REVIEW]: 'In-Review',
  [TASK_STATUS_DONE]: 'Done',
  // PROPOSALS
  [STATUS_OPEN]: 'Open',
  [STATUS_APPROVED]: 'Approved',
  [STATUS_CLOSED]: 'Rejected',
};

export const HEADER_ICONS = {
  [TASK_STATUS_TODO]: ToDo,
  [TASK_STATUS_IN_PROGRESS]: InProgress,
  [TASK_STATUS_IN_REVIEW]: InReview,
  [TASK_STATUS_DONE]: Done,
  [STATUS_OPEN]: Proposal,
  [STATUS_APPROVED]: Approved,
  [STATUS_CLOSED]: Rejected,
};

export const ONLY_GRANTS_ENABLED_ORGS = ['63763663725527146', '48014116661493762']; // Merit Circle, SampleDAO (staging)
export const GRANT_APPLICATION_EDITABLE_STATUSES = [
  GRANT_APPLICATION_STATUSES.OPEN,
  GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED,
  GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW,
];

export const GRANT_APPLICATION_DELETE_STATUSES = [
  GRANT_APPLICATION_STATUSES.OPEN,
  GRANT_APPLICATION_STATUSES.CHANGE_REQUESTED,
  GRANT_APPLICATION_STATUSES.WAITING_FOR_REVIEW,
  GRANT_APPLICATION_STATUSES.REJECTED,
];

export enum CALENDAR_VIEW {
  Month = 'month',
  Week = 'week',
}

export const CALENDAR_CONFIG = {
  defaultView: CALENDAR_VIEW.Month,
  weekStartsOn: 0 as 0 | 1 | 2 | 3 | 4 | 5 | 6, // the index of the first day of the week (0 - Sunday)
  maxTasksForMonthView: 3,
  weekDays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  dayGridViews: [
    { label: 'Month View', value: CALENDAR_VIEW.Month },
    { label: 'Week View', value: CALENDAR_VIEW.Week },
  ],
};

export const ANALYTIC_EVENTS = {
  DOCUMENT_CLICK: 'document_click',
  AI_CREATE_TASK_SNACKBAR_CLICK: 'ai_create_task_snackbar_click',
  CREATE_TASK_FROM_TASK_TEMPLATE_SNACKBAR_CLICK: 'create_task_from_task_template_snackbar_click',
  SHOW_TEMPLATES_CLICKED: 'show_templates_clicked',
  PRESET_TASK_TEMPLATE_CLICKED: 'preset_task_template_click',
  ORG_OR_POD_TEMPLATE_CLICKED: 'org_or_pod_template_clicked',
  TASK_TEMPLATE_SAVED: 'task_template_saved',
  TASK_OR_BOUNTY_CREATED_FROM_TEMPLATE: 'task_or_bounty_created_from_template',
  ONBOARDING_BASICS_SETUP: 'onboarding_basics_setup',
  ONBOARDING_CORE_WORKFLOW_SETUP: 'onboarding_core_workflow_setup',
  ONBOARDING_COMMUNITY_SETUP: 'onboarding_community_setup',
  ONBOARDING_PROJECT_CREATE: 'onboarding_project_create',
  ONBOARDING_CATEGORY_SELECT: 'onboarding_category_select',
  ONBOARDING_CATEGORY_SELECT_SKIP: 'onboarding_category_select_skip',
  ONBOARDING_BIO_MEDIA_SETTINGS_SETUP: 'onboarding_bio_media_settings_setup',
  ONBOARDING_BIO_MEDIA_SETTINGS_SETUP_SKIP: 'onboarding_bio_media_settings_setup_skip',
  ONBOARDING_TWITTER_SETUP: 'onboarding_twitter_setup',
  ONBOARDING_TWITTER_SETUP_SKIP: 'onboarding_twitter_setup_skip',
  ONBOARDING_TASK_CREATE: 'onboarding_task_create',
  ONBOARDING_POD_CREATE: 'onboarding_pod_create',
  ONBOARDING_BOUNTY_CREATE: 'onboarding_bounty_create',
  ONBOARDING_MILESTONE_CREATE: 'onboarding_milestone_create',
  ONBOARDING_DISCORD_SETUP: 'onboarding_discord_setup',
  ONBOARDING_DISCORD_SETUP_SKIP: 'onboarding_discord_setup_skip',
  ONBOARDING_EMAIL_INVITES: 'onboarding_email_invites',
  ONBOARDING_INVITE_LINK_COPY: 'onboarding_invite_link_copy',
  ONBOARDING_INVITES_SKIP: 'onboarding_invites_skip',
};

export const CLOSE_AI_SNACK_BAR = 'close_ai_snack_bar';
export const CLOSE_TASK_TEMPLATE_SNACK_BAR = 'close_task_template_snack_bar';

export const PAGES_WITH_NO_HOTKEYS = ['/organization/[username]/onboarding', '/onboarding-dao'];
