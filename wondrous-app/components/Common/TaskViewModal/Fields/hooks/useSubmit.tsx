import { useMutation } from '@apollo/client';
import {
  UPDATE_TASK,
  UPDATE_TASK_PROPOSAL,
  UPDATE_GRANT,
  UPDATE_GRANT_APPLICATION,
  UPDATE_MILESTONE,
} from 'graphql/mutations';
import { useMemo, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { CHAIN_REGEX } from 'utils/helpers';
import { useOrgBoard, usePodBoard, useTaskContext } from 'utils/hooks';
import * as Yup from 'yup';
import {
  useUpdateGrantCardCache,
  useUpdateProposalCardCache,
  useUpdateTaskCardCache,
  useUpdateTaskHomepageCache,
} from './useUpdateCache';
import { FIELDS, GRANT_SCHEMA, TASK_SCHEMA } from './constants';

export const useSubmit = ({ field, refetchQueries = [] }) => {
  const [error, setError] = useState(null);
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();

  const { isHomepage } = podBoard || orgBoard || {};

  const { fetchedTask, refetch, entityType, grantApplication = null, grant } = useTaskContext();

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
    [FIELDS.ORG]: Yup.string().required('Project is required'),
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

  const handleUpdateProposalCardCache = useUpdateProposalCardCache();

  const handleUpdateGrantCardCache = useUpdateGrantCardCache();

  const handleUpdateTaskHomepageCache = useUpdateTaskHomepageCache();

  const handleUpdateTask = isHomepage ? handleUpdateTaskHomepageCache : handleUpdateTaskCardCache;

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      handleUpdateTask({ data: data?.updateTask });
      refetch();
    },
    refetchQueries,
    onError: (error) => {
      console.log(error, 'error');
      setError('Something went wrong.');
    },
  });

  const [updateMilestone] = useMutation(UPDATE_MILESTONE, {
    onCompleted: (data) => {
      handleUpdateTask({ data: data?.updateMilestone });
      refetch();
    },
    refetchQueries,
    onError: (error) => {
      console.log(error, 'error');
      setError('Something went wrong.');
    },
  });
  const [updateTaskProposal] = useMutation(UPDATE_TASK_PROPOSAL, {
    onCompleted: (data) => {
      handleUpdateProposalCardCache({ data: data?.updateTaskProposal });
      refetch();
    },
  });

  const [updateGrant] = useMutation(UPDATE_GRANT, {
    onCompleted: (data) => {
      handleUpdateGrantCardCache({ data: data?.updateGrant });
      refetch();
    },
  });

  const [updateGrantApplication] = useMutation(UPDATE_GRANT_APPLICATION, {
    refetchQueries: ['getGrantApplicationsForGrant'],
  });

  const validate = async (value) => {
    try {
      await schema.validate(value, { abortEarly: false });
    } catch (err) {
      setError(err?.message);
      throw new Error(err);
    }
  };

  const update = async (input) => {
    if ([ENTITIES_TYPES.TASK, ENTITIES_TYPES.BOUNTY].includes(entityType)) {
      return await updateTask({
        variables: {
          taskId: fetchedTask.id,
          input,
        },
      });
    }
    if (entityType === ENTITIES_TYPES.MILESTONE) {
      return await updateMilestone({
        variables: {
          milestoneId: fetchedTask.id,
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
          grantId: grant.id,
          input,
        },
      });
    }
    if (entityType === ENTITIES_TYPES.GRANT_APPLICATION) {
      return await updateGrantApplication({
        variables: {
          grantApplicationId: grantApplication.id,
          input,
        },
      });
    }
    return () => new Error('function not implemented for this entityType yet');
  };

  const submit = async (value, input = null) => {
    setError(null);
    const inputToValidate = {
      ...(input ? { ...input } : { [field]: value }),
    };
    if (schema) {
      try {
        await validate(inputToValidate);
      } catch (error) {
        console.log(error, 'error');
        return;
      }
    }
    return await update(inputToValidate);
  };
  return { error, submit };
};
