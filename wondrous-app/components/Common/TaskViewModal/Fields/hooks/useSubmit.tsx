import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { UPDATE_TASK } from 'graphql/mutations';
import { useContext, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useTaskContext } from 'utils/hooks';
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
  TAGS: 'labelIds'
};

const SCHEMAS = {
  [FIELDS.ASSIGNEE]: Yup.string().nullable(),
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

export const useSubmit = ({ field, refetchQueries = [] }) => {
  const [error, setError] = useState(null);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const schema = SCHEMAS[field] ? Yup.object().shape({
    [field]: SCHEMAS[field]
  }) : null;
  
  const { fetchedTask, refetch, entityType } = useTaskContext();
  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      let entityTitle = entityType?.charAt(0).toUpperCase() + entityType?.slice(1);
      refetch()
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(`${entityTitle} updated successfully`);
    },
    refetchQueries,
    onError: (error) => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage(`Error updating ${entityType}`);
    },
  });

  const validate = async (value) => {
    try {
      await schema.cast(value);
    } catch (err) {
      setError(err);
      throw new Error(err);
    }
  };

  const update = async (input) => {
    if(entityType === ENTITIES_TYPES.TASK) {
      return await updateTask({
        variables: {
          taskId: fetchedTask.id,
          input
        }
      })
    }
    return () => new Error('function not implemented for this entityType yet')
  }

  const submit = async (value, restInputVariables = {}) => {
    setError(null);
    const input = {
      [field]: value,
      ...restInputVariables
    }

    if (schema) {
      try {
        await validate(input);
      } catch (error) {
        return;
      }
    }
    return await update(input)
  };
  return { error, submit };
};
