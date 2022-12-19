import { MENTION_REGEX, PERMISSIONS } from './constants';

const THOUSAND = 1000;
const MILLION = THOUSAND ** 2;
const BILLION = THOUSAND ** 3;

export const shrinkNumber = (number = 0) => {
  const shrinkThousands = ({ divider = THOUSAND, fractionDigits = 1, letter = 'k' } = {}) =>
    `${(number / divider).toFixed(fractionDigits)}${letter}`;

  if (number < THOUSAND) {
    return number;
  }
  if (number < THOUSAND * 10) {
    return shrinkThousands(); // 1234 => 1.2k
  }
  if (number < MILLION) {
    return shrinkThousands({ fractionDigits: 0 }); // 12345 => 12k, 123456 => 123k
  }
  if (number < BILLION) {
    return shrinkThousands({ divider: MILLION, letter: 'M' }); // 1234567 => 1.2M
  }
};

export const enableContainerOverflow = () => {
  document.querySelector('html').style.overflow = '';
  document.body.style.overflow = '';
};

export const disableContainerOverflow = () => {
  document.querySelector('html').style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';
};

export const toggleHtmlOverflow = () => {
  const htmlTagElements = document.getElementsByTagName('html');
  const { style } = htmlTagElements.item(0);
  style.overflow = style.overflow ? '' : 'hidden';
};

export const groupBy = (xs, key) =>
  xs.reduce((rv, x) => {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});

export const getMentionArray = (content) => {
  if (!content) {
    return [];
  }
  const mentionedUsers = [];
  // const mentionedProjects = []
  const mentions = content.match(MENTION_REGEX);

  if (mentions) {
    for (const mention of mentions) {
      const mentionExp = mention.matchAll(MENTION_REGEX);

      const id = [...mentionExp][0][2];
      mentionedUsers.push(id);
    }
  }
  return mentionedUsers;
};

export const parseUserPermissionContext = (props) => {
  // TODO add return type here
  const userPermissionsContext = props?.userPermissionsContext;
  if (!userPermissionsContext) return [];
  const podId = props?.podId;
  const orgId = props?.orgId;
  if (orgId && userPermissionsContext?.orgPermissions[orgId]?.includes(PERMISSIONS.FULL_ACCESS)) {
    // Check for full access
    return userPermissionsContext?.orgPermissions[orgId] || [];
  }
  if (podId) {
    return userPermissionsContext?.podPermissions[podId] || [];
  }
  if (orgId) {
    return userPermissionsContext?.orgPermissions[orgId] || [];
  }
  return [];
};

export const hasCreateTaskPermission = ({ userPermissionsContext, orgId = undefined, podId = undefined }) => {
  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId,
    podId,
  });

  return permissions.some((i) => [PERMISSIONS.FULL_ACCESS, PERMISSIONS.CREATE_TASK].includes(i));
};

export const transformTaskToTaskCard = (task, extraData = null) => ({
  ...task,
  assigneeUsername: task?.assignee?.username || null,
  assigneeProfilePicture: task?.assignee?.profilePicture || null,
  orgProfilePicture: extraData?.orgProfilePicture || task?.org?.profilePicture,
  orgName: extraData?.orgName || task?.org?.name,
  orgUsername: extraData?.orgUsername || task?.org?.username,
  podName: extraData?.podName || task?.pod?.name,
  podColor: extraData?.podColor || task?.pod?.color,
  creatorUsername: task?.creator?.username,
  creatorProfilePicture: task?.creator?.profilePicture,
  __typename: 'TaskCard',
});

export const transformTaskProposalToTaskProposalCard = (taskProposal, extraData) => ({
  ...taskProposal,
  creatorUsername: taskProposal?.creator?.username,
  creatorProfilePicture: taskProposal?.creator?.profilePicture,
  orgProfilePicture: extraData?.orgProfilePicture || taskProposal?.org?.profilePicture,
  orgName: extraData?.orgName || taskProposal?.org?.name,
  orgUsername: extraData?.orgUsername || taskProposal?.org?.username,
  podName: extraData?.podName || taskProposal?.pod?.name,
  podColor: extraData?.podColor || taskProposal?.pod?.color,
  isProposal: true,
});

export const transformTaskSubmissionToTaskSubmissionCard = (taskSubmission, extraData) => ({
  ...taskSubmission,
  creatorUsername: taskSubmission?.creator?.username,
  creatorProfilePicture: taskSubmission?.creator?.profilePicture,
  orgProfilePicture: extraData?.orgProfilePicture || taskSubmission?.org?.profilePicture,
  orgName: extraData?.orgName || taskSubmission?.org?.name,
  orgUsername: extraData?.orgUsername || taskSubmission?.org?.username,
  podName: extraData?.podName || taskSubmission?.pod?.name,
});

export const getNonWhiteSpaceLength = (string) => {
  // use the \s quantifier to remove all white space
  if (!string) return 0;
  const remText = string.replace(/\s/g, '');

  // get the length of the string after removal
  const { length } = remText;
  return length;
};

export const cutString = (string, length = 240, afterText = '...') => {
  if (getNonWhiteSpaceLength(string) > length) {
    return string.slice(0, length) + afterText;
  }
  return string;
};

export const transformMediaFormat = (media) =>
  media &&
  media.map((item) => ({
    uploadSlug: item?.slug,
    type: item?.type,
    name: item?.name,
  }));

export const deleteFromCache = (cache, data, mutationQuery, queryToModify, id, skipSuccess = false) => {
  const isSuccess = data?.[mutationQuery]?.success;
  if (isSuccess || skipSuccess) {
    cache.modify({
      fields: {
        [queryToModify](existingItems = [], { readField }) {
          return existingItems?.filter((item) => readField('id', item) !== id);
        },
      },
    });
  }
};

export const deleteTaskFromCache = (cache, id, keys = []) => {
  const fields = keys.reduce((acc, next) => {
    acc[next] = (existingItems = [], { readField }) => existingItems?.filter((item) => readField('id', item) !== id);
    return acc;
  }, {});

  return cache.modify({
    fields,
  });
};

export const transformCategoryFormat = (categories) => categories && categories.map((item) => item?.name);

export const removeUrlStart = (url) => {
  if (!url) return '';
  return url.replace(/http(s)?(:)?(\/\/)?|(\/\/)?(www\.)?/g, '');
};

export const CHAIN_REGEX = {
  HARMONY: /^one[a-zA-Z0-9]{39}$/gm,
  ETHEREUM: /(^0x[a-zA-Z0-9]{40}$)|(.*\.eth$)/gm,
};
