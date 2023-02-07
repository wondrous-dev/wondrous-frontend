import { useMutation } from '@apollo/client';
import { UPDATE_TASK, UPDATE_TASK_PROPOSAL, UPDATE_GRANT, UPDATE_GRANT_APPLICATION } from 'graphql/mutations';
import { useMemo, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { CHAIN_REGEX } from 'utils/helpers';
import { useTaskContext } from 'utils/hooks';
import * as Yup from 'yup';
import { useUpdateTaskCardCache } from './useUpdateCache';
import { FIELDS, GRANT_SCHEMA, TASK_SCHEMA } from './constants';

export const useSubmit = ({ field, refetchQueries = [] }) => {
  const [error, setError] = useState(null);

  const { fetchedTask, refetch, entityType, grantApplication = null } = useTaskContext();

  const chainToValidate = useMemo(() => {
    if (grantApplication?.grant?.chain === 'harmony') {
      return CHAIN_REGEX.HARMONY;
    }
    return CHAIN_REGEX.ETHEREUM;
  }, [grantApplication?.grant?.chain]);

  const GRANT_APPLICATION_SCHEMA = {
    [FIELDS.PAYMENT_ADDRESS]: Yup.string()
      .matches(chainToValidate, 'Wallet address is not valid')
      .required('Wallet address is required'),
    [FIELDS.ORG]: Yup.object().required('Project is required'),
  };

  const SCHEMAS = {
    [ENTITIES_TYPES.TASK]: TASK_SCHEMA,
    [ENTITIES_TYPES.GRANT]: GRANT_SCHEMA,
    [ENTITIES_TYPES.PROPOSAL]: TASK_SCHEMA,
    [ENTITIES_TYPES.BOUNTY]: TASK_SCHEMA,
    [ENTITIES_TYPES.MILESTONE]: TASK_SCHEMA,
    [ENTITIES_TYPES.GRANT_APPLICATION]: GRANT_APPLICATION_SCHEMA,
  };

  const entitySchema = SCHEMAS[entityType];

  const schema = entitySchema?.[field]
    ? Yup.object().shape({
        [field]: entitySchema[field],
      })
    : null;

  const handleUpdateTaskCardCache = useUpdateTaskCardCache();

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      handleUpdateTaskCardCache({ data: data?.updateTask });
      refetch();
    },
    refetchQueries,
    onError: (error) => {
      setError('Something went wrong.');
    },
  });

  const [updateTaskProposal] = useMutation(UPDATE_TASK_PROPOSAL, {
    onCompleted: (data) => {
      handleUpdateTaskCardCache({ data: data?.updateTaskProposal });
      refetch();
    },
  });

  const [updateGrant] = useMutation(UPDATE_GRANT);

  const [updateGrantApplication] = useMutation(UPDATE_GRANT_APPLICATION);

  const validate = async (value) => {
    try {
      await schema.validate(value, { abortEarly: false });
    } catch (err) {
      setError(err?.message);
      throw new Error(err);
    }
  };

  const update = async (input) => {
    if (entityType === ENTITIES_TYPES.TASK) {
      return await updateTask({
        variables: {
          taskId: fetchedTask.id,
          input,
        },
      });
    }
    if (entityType === ENTITIES_TYPES.PROPOSAL) {
      return await updateTaskProposal({
        variables: {
          proposalId: fetchedTask.id,
          input,
        },
      });
    }
    if (entityType === ENTITIES_TYPES.GRANT) {
      return await updateGrant({
        variables: {
          grantId: fetchedTask.id,
          input,
        },
      });
    }
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      return await updateGrantApplication({
        variables: {
          grantApplicationId: fetchedTask.id,
          input,
        },
      });
    }
    return () => new Error('function not implemented for this entityType yet');
  };

  const submit = async (value, input = null) => {
    setError(null);
    const inputToValidate = {
      ...(input ? {input} : {[field]: value})
    }

    if (schema) {
      try {
        await validate(inputToValidate);
      } catch (error) {
        return;
      }
    }
    return await update(inputToValidate);
  };
  return { error, submit };
};
