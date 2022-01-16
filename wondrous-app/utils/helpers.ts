import { MENTION_REGEX, PERMISSIONS } from './constants'

const THOUSAND = 1000
const MILLION = THOUSAND ** 2
const BILLION = THOUSAND ** 3

export const shrinkNumber = (number = 0) => {
  const shrinkThousands = ({
    divider = THOUSAND,
    fractionDigits = 1,
    letter = 'k',
  } = {}) => {
    return `${(number / divider).toFixed(fractionDigits)}${letter}`
  }

  if (number < THOUSAND) {
    return number
  }
  if (number < THOUSAND * 10) {
    return shrinkThousands() // 1234 => 1.2k
  }
  if (number < MILLION) {
    return shrinkThousands({ fractionDigits: 0 }) // 12345 => 12k, 123456 => 123k
  }
  if (number < BILLION) {
    return shrinkThousands({ divider: MILLION, letter: 'M' }) // 1234567 => 1.2M
  }
}

export const toggleHtmlOverflow = () => {
  const htmlTagElements = document.getElementsByTagName('html')
  const { style } = htmlTagElements.item(0)

  style.overflow = style.overflow ? '' : 'hidden'
}

export const groupBy = (xs, key) => {
  return xs.reduce((rv, x) => {
    ;(rv[x[key]] = rv[x[key]] || []).push(x)
    return rv
  }, {})
}

export const getMentionArray = (content) => {
  if (!content) {
    return {}
  }
  const mentionedUsers = []
  // const mentionedProjects = []
  const mentions = content.match(MENTION_REGEX)

  if (mentions) {
    for (let mention of mentions) {
      const mentionExp = mention.matchAll(MENTION_REGEX)

      const id = [...mentionExp][0][2]
      mentionedUsers.push(id)
    }
  }
  return mentionedUsers
}

export const parseUserPermissionContext = (props) => {
  const userPermissionsContext = props?.userPermissionsContext
  if (!userPermissionsContext) return []
  const podId = props?.podId
  const orgId = props?.orgId
  if (
    orgId &&
    userPermissionsContext?.orgPermissions[orgId].includes(
      PERMISSIONS.FULL_ACCESS
    )
  ) {
    // Check for full access
    return userPermissionsContext?.orgPermissions[orgId] || []
  }
  if (podId) {
    return userPermissionsContext?.podPermissions[podId] || []
  } else if (orgId) {
    return userPermissionsContext?.orgPermissions[orgId] || []
  }
  return []
}

export const transformTaskToTaskCard = (task, extraData) => {
  return {
    ...task,
    assigneeUsername: task?.assignee?.username,
    assigneeProfilePicture: task?.assignee?.profilePicture,
    orgProfilePicture:
      extraData?.orgProfilePicture || task?.org?.profilePicture,
    orgName: extraData?.orgName || task?.org?.name,
    podName: extraData?.podName || task?.pod?.name,
  }
}

export const transformTaskProposalToTaskProposalCard = (
  taskProposal,
  extraData
) => {
  return {
    ...taskProposal,
    creatorUsername: taskProposal?.creator?.username,
    creatorProfilePicture: taskProposal?.creator?.profilePicture,
    orgProfilePicture:
      extraData?.orgProfilePicture || taskProposal?.org?.profilePicture,
    orgName: extraData?.orgName || taskProposal?.org?.name,
    podName: extraData?.podName || taskProposal?.pod?.name,
  }
}

export const transformTaskSubmissionToTaskSubmissionCard = (
  taskSubmission,
  extraData
) => {
  return {
    ...taskSubmission,
    creatorUsername: taskSubmission?.creator?.username,
    creatorProfilePicture: taskSubmission?.creator?.profilePicture,
    orgProfilePicture:
      extraData?.orgProfilePicture || taskSubmission?.org?.profilePicture,
    orgName: extraData?.orgName || taskSubmission?.org?.name,
    podName: extraData?.podName || taskSubmission?.pod?.name,
  }
}
