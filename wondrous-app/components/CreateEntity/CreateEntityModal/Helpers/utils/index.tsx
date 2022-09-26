import { assignIn, assignWith, cloneDeep, isEmpty, isNull, isUndefined, pick, sortBy, uniqBy } from 'lodash';
import { PRIVACY_LEVEL, CHAIN_TO_CHAIN_DIPLAY_NAME, ENTITIES_TYPES, CATEGORY_LABELS } from 'utils/constants';
import { hasCreateTaskPermission, transformCategoryFormat, transformMediaFormat } from 'utils/helpers';
import * as Yup from 'yup';
import PrivacyMembersIcon from 'components/Icons/privacyMembers.svg';
import PrivacyPublicIcon from 'components/Icons/privacyPublic.svg';
import { SafeImage } from 'components/Common/Image';
import { plainTextToRichText, deserializeRichText } from 'components/RichText';
import { FormikValues } from 'formik';
import {
  useCreateTask,
  useUpdateTask,
  useCreateMilestone,
  useUpdateMilestone,
  useCreateBounty,
  useUpdateBounty,
  useCreateTaskProposal,
  useUpdateTaskProposal,
} from '../hooks';

export const formValidationSchema = Yup.object().shape({
  orgId: Yup.string().required('Organization is required').typeError('Organization is required'),
  podId: Yup.string().optional().nullable(),
  title: Yup.string().required('Title is required'),
  reviewerIds: Yup.array().of(Yup.string().nullable()).nullable(),
  assigneeId: Yup.string().nullable(),
  claimPolicy: Yup.string().nullable(),
  claimPolicyRoles: Yup.array().of(Yup.string()).optional().nullable(),
  shouldUnclaimOnDueDateExpiry: Yup.boolean().nullable(),
  points: Yup.number()
    .typeError('Points must be a number')
    .integer('Points must be whole number')
    .moreThan(0, 'Points must be greater than 0')
    .optional()
    .nullable(),
  rewards: Yup.array()
    .of(
      Yup.object({
        paymentMethodId: Yup.string().required(),
        rewardAmount: Yup.number()
          .typeError('Reward amount must be a number')
          .moreThan(0, 'Reward amount must be greater than 0'),
      })
    )
    .optional()
    .nullable(),
  milestoneId: Yup.string()
    .nullable()
    .test(
      'emptyCheck',
      'Please enter a valid Milestone',
      (milestoneId) => milestoneId !== '' && milestoneId !== undefined
    ),
});

export const privacyOptions = {
  public: {
    label: 'Public',
    value: PRIVACY_LEVEL.public,
    Icon: PrivacyPublicIcon,
  },
  private: {
    label: 'Members',
    value: '',
    Icon: PrivacyMembersIcon,
  },
};

export const filterUserOptions = (options) => {
  if (!options) return [];
  return options.map((option) => ({
    label: option?.username ?? option?.title,
    id: option?.id,
    profilePicture: option?.profilePicture,
  }));
};

export const filterOrgUsersForAutocomplete = (orgUsers) => {
  if (!orgUsers) {
    return [];
  }
  return orgUsers.map((orgUser) => ({
    ...orgUser,
    display: orgUser?.username,
    id: orgUser?.id,
  }));
};

export const filterGithubPullRequestsForAutocomplete = (githubPullRequests) => {
  if (!githubPullRequests) {
    return [];
  }
  return githubPullRequests.map((githubPullRequest) => ({
    id: githubPullRequest.id,
    label: githubPullRequest.title,
    url: githubPullRequest.url,
  }));
};
export const filterPaymentMethods = (paymentMethods) => {
  if (!paymentMethods) return [];
  return paymentMethods.map((paymentMethod) => ({
    ...paymentMethod,
    icon: (
      <SafeImage
        useNextImage={false}
        src={paymentMethod.icon}
        style={{ width: '30px', height: '30px', borderRadius: '15px' }}
      />
    ),
    label: `${paymentMethod.tokenName?.toUpperCase()}: ${CHAIN_TO_CHAIN_DIPLAY_NAME[paymentMethod.chain]}`,
    value: paymentMethod.id,
  }));
};

export const filterOrgUsers = ({ orgUsersData, existingTask = null }) => {
  if (!orgUsersData) {
    return [];
  }
  const users = orgUsersData.map((orgUser) => ({
    profilePicture: orgUser?.profilePicture,
    label: orgUser?.username,
    value: orgUser?.id,
  }));
  const availableUsers = existingTask?.assigneeId
    ? users.concat({
        label: existingTask?.assignee?.username,
        profilePicture: existingTask?.assignee?.profilePicture,
        value: existingTask?.assigneeId,
      })
    : users;
  return sortBy(
    uniqBy(availableUsers, ({ value }) => value),
    ({ label }) => label
  );
};

export const filterOptionsWithPermission = (
  entityType = ENTITIES_TYPES.TASK,
  options,
  userPermissionsContext,
  orgId = undefined,
  podId = undefined
) => {
  if (!options) {
    return [];
  }
  return options
    .filter(({ id }) => {
      const listPodId = orgId ? id : undefined;
      return (
        hasCreateTaskPermission({
          userPermissionsContext,
          orgId: orgId ?? id,
          podId: podId || listPodId,
        }) || entityType === ENTITIES_TYPES.PROPOSAL
      );
    })
    .map(({ profilePicture, name, id, color }) => ({
      imageUrl: profilePicture,
      label: name,
      value: id,
      color,
    }));
};

export const filterCategoryValues = (categories = []) =>
  categories?.map((category) =>
    typeof category === 'string'
      ? {
          id: category,
          label: CATEGORY_LABELS[category],
        }
      : category
  );

export const getPodObject = (pods, podId) => {
  let justCreatedPod = null;
  pods.forEach((testPod) => {
    if (testPod.id === podId) {
      justCreatedPod = testPod;
    }
  });
  return justCreatedPod;
};

export const onCorrectPage = (existingTask, board) =>
  existingTask?.orgId === board?.orgId ||
  existingTask?.podId === board?.podId ||
  existingTask?.userId === board?.userId;

export const getPrivacyLevel = (podId, pods) => {
  const selectedPodPrivacyLevel = pods?.filter((i) => i.id === podId)[0]?.privacyLevel;
  const privacyLevel = privacyOptions[selectedPodPrivacyLevel]?.value ?? privacyOptions.public.value;
  return privacyLevel;
};

export const filterGithubReposForAutocomplete = (githubPullRepos) => {
  if (!githubPullRepos) {
    return [];
  }

  return githubPullRepos.map((githubPullRepo) => ({
    id: githubPullRepo.githubInfo?.repoId,
    label: githubPullRepo.githubInfo?.repoPathname,
  }));
};

export enum Fields {
  reviewer,
  assignee,
  claimPolicy,
  claimPolicyRoles,
  dueDate,
  reward,
  points,
  milestone,
  tags,
  githubPullRequest,
  shouldUnclaimOnDueDateExpiry,
}

export const entityTypeData = {
  [ENTITIES_TYPES.TASK]: {
    fields: [
      Fields.reviewer,
      Fields.assignee,
      Fields.claimPolicy,
      Fields.claimPolicyRoles,
      Fields.shouldUnclaimOnDueDateExpiry,
      Fields.dueDate,
      Fields.reward,
      Fields.points,
      Fields.milestone,
      Fields.tags,
      Fields.githubPullRequest,
    ],
    createMutation: useCreateTask,
    updateMutation: useUpdateTask,
    initialValues: {
      orgId: null,
      podId: null,
      claimPolicy: null,
      claimPolicyRoles: null,
      shouldUnclaimOnDueDateExpiry: null,
      title: '',
      description: plainTextToRichText(''),
      reviewerIds: null,
      assigneeId: null,
      dueDate: null,
      recurringSchema: null,
      rewards: [],
      points: null,
      milestoneId: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
      githubPullRequest: null,
      githubIssue: null,
      githubRepo: null,
      chooseGithubPullRequest: false,
      chooseGithubIssue: false,
      parentTaskId: null,
      categories: [],
    },
  },
  [ENTITIES_TYPES.MILESTONE]: {
    fields: [Fields.dueDate, Fields.points, Fields.tags],
    createMutation: useCreateMilestone,
    updateMutation: useUpdateMilestone,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: plainTextToRichText(''),
      dueDate: null,
      points: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
      categories: [],
    },
  },
  [ENTITIES_TYPES.BOUNTY]: {
    fields: [Fields.reviewer, Fields.dueDate, Fields.reward, Fields.points, Fields.milestone, , Fields.tags],
    createMutation: useCreateBounty,
    updateMutation: useUpdateBounty,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: plainTextToRichText(''),
      reviewerIds: null,
      rewards: [],
      dueDate: null,
      recurringSchema: null,
      points: null,
      labelIds: null,
      milestoneId: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
      categories: [],
    },
  },
  [ENTITIES_TYPES.PROPOSAL]: {
    fields: [Fields.dueDate, Fields.reward, Fields.milestone, Fields.tags],
    createMutation: useCreateTaskProposal,
    updateMutation: useUpdateTaskProposal,
    initialValues: {
      orgId: null,
      podId: null,
      title: '',
      description: plainTextToRichText(''),
      dueDate: null,
      rewards: [],
      milestoneId: null,
      labelIds: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
      categories: [],
    },
  },
};

export const initialValues = ({ entityType, existingTask = null, initialPodId = null }) => {
  const defaultValues = assignIn(cloneDeep(entityTypeData[entityType]?.initialValues), { podId: initialPodId });
  if (!existingTask) return defaultValues;
  const defaultValuesKeys = Object.keys(defaultValues);
  const description = deserializeRichText(existingTask.description);
  const existingTaskValues = pick(
    {
      ...existingTask,
      description,
      mediaUploads: transformMediaFormat(existingTask?.media),
      categories: transformCategoryFormat(existingTask?.categories),
      reviewerIds: isEmpty(existingTask?.reviewers) ? null : existingTask.reviewers.map((i) => i.id),
      rewards: existingTask?.rewards?.map(({ rewardAmount, paymentMethodId }) => ({ rewardAmount, paymentMethodId })),
      labelIds: isEmpty(existingTask?.labels) ? null : existingTask.labels.map((i) => i.id),
    },
    defaultValuesKeys
  );
  const initialValuesData = assignWith(defaultValues, existingTaskValues, (objValue, srcValue) =>
    isNull(srcValue) || isUndefined(srcValue) ? objValue : srcValue
  );

  return initialValuesData;
};

export const handleRewardOnChange = (form) => (e) => {
  const { value } = e.target;
  if (/^\d*\.?\d*$/.test(value)) {
    form.setFieldValue('rewards', [{ ...form.values?.rewards?.[0], rewardAmount: value }]);
  }
};

export interface ICreateEntityModal {
  entityType: string;
  handleClose: Function;
  cancel: Function;
  existingTask?: {
    id: string;
    reviewers?: { username: string; id: string }[] | null;
    claimPolicyRoles?: [string] | null;
    claimPolicy?: string | null;
    shouldUnclaimOnDueDateExpiry?: boolean;
    points?: number;
    rewards?: { rewardAmount: string; paymentMethodId: string }[] | null;
    milestoneId?: string | null;
    labels?: { id: string }[] | null;
    githubIssue?: {
      id: string;
      url: string;
    };
    githubPullRequest?: {
      id: string;
      url: string;
      title: string;
    };
    type?: string;
    orgId: string;
    snapshotId?: string;
    assignee?: {
      username?: string;
      profilePicture?: string;
    };
    assigneeId?: string;
    recurringSchema?: any;
    parentTaskId?: string;
  };
  parentTaskId?: string;
  resetEntityType?: Function;
  setEntityType?: Function;
  formValues?: FormikValues;
  status?: string;
}
