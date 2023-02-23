import * as Yup from 'yup';

export const FIELDS = {
  ASSIGNEE: 'assigneeId',
  MILESTONE: 'milestoneId',
  POINTS: 'points',
  REWARDS: 'rewards',
  REVIEWERS: 'reviewerIds',
  CATEGORIES: 'categories',
  DUE_DATE: 'dueDate',
  PRIORITY: 'priority',
  TAGS: 'labelIds',
  NUM_OF_GRANT: 'numOfGrant',
  GRANT_DATES: 'grantDates',
  APPLY_POLICY: 'applyPolicy',
  PAYMENT_ADDRESS: 'paymentAddress',
  ORG: 'orgId',
  TITLE: 'title',
  DESCRIPTION: 'description',
  PRIVACY_LEVEL: 'privacyLevel',
  GRANT_REWARDS: 'reward',
};

export const TASK_SCHEMA = {
  [FIELDS.ASSIGNEE]: Yup.string().nullable(),
  [FIELDS.TITLE]: Yup.string().required('Title is required'),
  [FIELDS.MILESTONE]: Yup.string()
    .nullable()
    .test('emptyCheck', 'Please enter a valid Milestone', (milestoneId) => milestoneId !== ''),
  [FIELDS.POINTS]: Yup.number()
    .typeError('Points must be a number')
    .integer('Points must be whole number')
    .moreThan(0, 'Points must be greater than 0')
    .optional()
    .nullable(),
  [FIELDS.REWARDS]: Yup.array()
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
  [FIELDS.REVIEWERS]: Yup.array().of(Yup.string().nullable()).nullable(),
};

export const GRANT_SCHEMA = {
  [FIELDS.TITLE]: Yup.string().required('Title is required'),
  [FIELDS.NUM_OF_GRANT]: Yup.number()
    .typeError('Number of grants must be a number')
    .nullable()
    .moreThan(0, 'Number of grants must be greater than 0')
    .lessThan(1000000000, 'Number of grants must be less than 1 billion'),
  [FIELDS.GRANT_DATES]: Yup.object({
    startDate: Yup.string().optional().nullable(),
    endDate: Yup.string().optional().nullable(),
  }),
  [FIELDS.APPLY_POLICY]: Yup.string().nullable(),
};
