import { useMutation } from '@apollo/client';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { TaskCardFragment } from 'graphql/fragments/task';
import { UPDATE_TASK } from 'graphql/mutations';
import { useContext, useMemo, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { CHAIN_REGEX } from 'utils/helpers';
import { useTaskContext } from 'utils/hooks';
import * as Yup from 'yup';
import { FIELDS, GRANT_SCHEMA, TASK_SCHEMA } from './constants';

let test = {
  fields: {
    key() {

    }
  }
}

const updateTaskEntityCache = (cache, { data }, queries, field) => {
  const { updateTask } = data;
  const fieldsToModify = queries.reduce((acc, query) => {
      acc[query] = (existingItems = [], { readField }) => {
        return existingItems.map((item) => {
          console.log(readField('id', item), updateTask.id)
          if (readField('id', item) === updateTask.id) {
            return {
              ...item,
              [field]: updateTask[field],
            };
          }
          return item;
        });
      };
      return acc;
    }, {});
  
    cache.modify({
      fields: {
        getOrgTaskBoardTasks(existingItems = [], { readField }) {
          
          return existingItems.map((item) => {
            if (readField('id', item) === updateTask.id) {
              console.log('im inside bro')
              const taskCard = cache.readFragment({
                id: `TaskCard:${updateTask.id}`,
                fragment: TaskCardFragment
              })
              console.log(taskCard, 'taskCard')
              // return {
              //   ...item,
              //   [field]: updateTask[field],
              // };
            }
            return item;
          });
        }  
      }
      // fields: {
    //   ...fieldsToModify,
    // }
  });
};

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

  const queriesToUpdate = ['getOrgTaskBoardTasks'];
  const [updateTask] = useMutation(UPDATE_TASK, {
    onCompleted: (data) => {
    refetch()
    },
    update: (cache, { data }) => {
      updateTaskEntityCache(cache, { data }, queriesToUpdate, field);
      // refetch();
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
    if (entityType === ENTITIES_TYPES.TASK) {
      return await updateTask({
        variables: {
          taskId: fetchedTask.id,
          input,
        },
      });
    }
    return () => new Error('function not implemented for this entityType yet');
  };

  const submit = async (value, restInputVariables = {}) => {
    setError(null);
    const input = {
      [field]: value,
      ...restInputVariables,
    };

    if (schema) {
      try {
        await validate(input);
      } catch (error) {
        return;
      }
    }
    return await update(input);
  };
  return { error, submit };
};
