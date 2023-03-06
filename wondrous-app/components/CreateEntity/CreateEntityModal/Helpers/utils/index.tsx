import { SafeImage } from 'components/Common/Image';
import PrivacyMembersIcon from 'components/Icons/privacyMembers.svg';
import PrivacyPublicIcon from 'components/Icons/privacyPublic.svg';
import { FormikValues } from 'formik';
import assignIn from 'lodash/assignIn';
import assignWith from 'lodash/assignWith';
import cloneDeep from 'lodash/cloneDeep';
import isDate from 'lodash/isDate';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNull from 'lodash/isNull';
import isObject from 'lodash/isObject';
import isUndefined from 'lodash/isUndefined';
import pick from 'lodash/pick';
import pickBy from 'lodash/pickBy';
import sortBy from 'lodash/sortBy';
import uniqBy from 'lodash/uniqBy';
import { Dispatch, SetStateAction } from 'react';
import {
  CATEGORY_LABELS,
  ENTITIES_TYPES,
  GR15DEICategoryName,
  ONLY_GRANTS_ENABLED_ORGS,
  PRIVACY_LEVEL,
} from 'utils/constants';
import { CHAIN_TO_CHAIN_DIPLAY_NAME } from 'utils/web3Constants';
import { hasCreateTaskPermission, transformCategoryFormat, transformMediaFormat } from 'utils/helpers';
import * as Yup from 'yup';
import { deserializeRichText, plainTextToRichText } from 'components/PlateRichEditor/utils';
import parseISO from 'date-fns/parseISO';
import {
  useCreateBounty,
  useCreateMilestone,
  useCreateTask,
  useCreateTaskProposal,
  useUpdateBounty,
  useUpdateMilestone,
  useUpdateTask,
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
          .moreThan(0, 'Reward amount must be greater than 0')
          .required('Reward amount is required'),
      })
    )
    .optional()
    .nullable(),
  milestoneId: Yup.string()
    .nullable()
    .test('emptyCheck', 'Please enter a valid Milestone', (milestoneId) => milestoneId !== ''),
  proposalVoteType: Yup.string().nullable(),
  customProposalChoices: Yup.array().optional().nullable(),
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
        alt="Payment method"
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
      if (
        ONLY_GRANTS_ENABLED_ORGS.includes(id) &&
        (entityType === ENTITIES_TYPES.TASK ||
          entityType === ENTITIES_TYPES.BOUNTY ||
          entityType === ENTITIES_TYPES.MILESTONE)
      )
        return false;
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
      id,
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

export const getPrivacyLevel = (podId, pods) => {
  const selectedPodPrivacyLevel = pods?.filter((i) => i.id === podId)[0]?.privacyLevel;
  const privacyLevel = privacyOptions[selectedPodPrivacyLevel]?.value ?? privacyOptions.public.value;
  return privacyLevel;
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
  priority,
  voteOptions,
  voteType,
  categories,
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
      Fields.priority,
      Fields.tags,
      Fields.githubPullRequest,
      Fields.categories,
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
      priority: null,
      categories: null,
      GR15DEISelected: false,
    },
  },
  [ENTITIES_TYPES.MILESTONE]: {
    fields: [Fields.dueDate, Fields.points, Fields.priority, Fields.tags],
    createMutation: useCreateMilestone,
    updateMutation: useUpdateMilestone,
    initialValues: {
      orgId: null,
      podIds: [],
      title: '',
      description: plainTextToRichText(''),
      dueDate: null,
      privacyLevel: privacyOptions.public.value,
      mediaUploads: [],
      priority: null,
    },
  },
  [ENTITIES_TYPES.BOUNTY]: {
    fields: [
      Fields.reviewer,
      Fields.dueDate,
      Fields.reward,
      Fields.points,
      Fields.milestone,
      Fields.priority,
      Fields.tags,
      Fields.categories,
    ],
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
      priority: null,
      categories: null,
      GR15DEISelected: false,
      requireSubmitterWalletConnected: false,
    },
  },
  [ENTITIES_TYPES.PROPOSAL]: {
    fields: [Fields.dueDate, Fields.reward, Fields.voteOptions, Fields.voteType, Fields.tags],
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
      categories: null,
      proposalVoteType: null,
      customProposalChoices: [],
    },
  },
};

export const initialValues = ({ entityType, existingTask = null, initialPodId = null }) => {
  const defaultValues = assignIn(
    cloneDeep(entityTypeData[entityType]?.initialValues),
    entityType === ENTITIES_TYPES.MILESTONE ? {} : { podId: initialPodId }
  );
  if (!existingTask) return defaultValues;
  const defaultValuesKeys = Object.keys(defaultValues);
  const description = deserializeRichText(existingTask.description);
  const GR15DEISelected = existingTask?.categories?.some((category) => category?.name === GR15DEICategoryName);
  const remainingCategories = existingTask?.categories?.filter((category) => category?.name !== GR15DEICategoryName);

  const existingTaskValues = pick(
    {
      ...existingTask,
      description,
      dueDate: existingTask.dueDate ? parseISO(existingTask.dueDate.substring(0, 10)) : null,
      mediaUploads: transformMediaFormat(existingTask?.media),
      categories: isEmpty(remainingCategories) ? null : transformCategoryFormat(remainingCategories),
      reviewerIds: isEmpty(existingTask?.reviewers) ? null : existingTask.reviewers.map((i) => i.id),
      rewards: existingTask?.rewards?.map(({ rewardAmount, paymentMethodId }) => ({ rewardAmount, paymentMethodId })),
      labelIds: isEmpty(existingTask?.labels) ? null : existingTask.labels.map((i) => i.id),
      GR15DEISelected,
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
    priority: string | void;
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
    privacyLevel?: string;
  };
  parentTaskId?: string;
  resetEntityType?: Function;
  setEntityType?: Function;
  formValues?: FormikValues;
  status?: string;
  setFormDirty?: Dispatch<SetStateAction<boolean>>;
}

export interface GrantCreateModalProps extends ICreateEntityModal {
  isEdit?: boolean;
  existingGrant?: {
    id: string;
    title: string;
    description: string;
    orgId: string;
    podId?: string;
    media?: any;
    privacyLevel?: string;
    reviewers?: {
      id: string;
      username: string;
      firstName: string;
      lastName: string;
      profilePicture: string;
    }[];
    reward?: {
      paymentMethodId?: string;
      rewardAmount?: string;
    };
    numOfGrant?: string;
    startDate?: string;
    endDate?: string;
    applyPolicy?: string;
    categories?: {
      name?: string;
    }[];
    reviewerIds?: string[];
  };
}

export const formDirty = (form: FormikValues): boolean => {
  const { initialValues, values } = form;
  const excludedFields = ['orgId'];
  const pickByValKey = (val, key) =>
    !excludedFields.includes(key) && val && (isObject(val) && !isDate(val) ? !isEmpty(val) : val);
  const updatedInitialValues = pickBy(initialValues, pickByValKey);
  const updatedValues = pickBy(values, pickByValKey);
  return !isEqual(updatedInitialValues, updatedValues);
};
