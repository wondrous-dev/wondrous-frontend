import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { UPDATE_TASK } from 'graphql/mutations';
import { useContext, useMemo, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { CHAIN_REGEX } from 'utils/helpers';
import { useTaskContext } from 'utils/hooks';
import * as Yup from 'yup';
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
    [FIELDS.PAYMENT_ADDRESS]: Yup
    .string()
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
  }

  const entitySchema = SCHEMAS[entityType];

  const schema = entitySchema?.[field] ? Yup.object().shape({
    [field]: entitySchema[field]
  }) : null;

  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
      let entityTitle = entityType?.charAt(0).toUpperCase() + entityType?.slice(1);
      refetch()
    },
    refetchQueries,
    onError: (error) => {
      setError('Something went wrong.');
    },
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
