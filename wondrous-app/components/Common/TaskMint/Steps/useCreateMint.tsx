import { useMutation, useLazyQuery } from '@apollo/client';
import { MINT_TASK, COMPLETE_TASK_MINT } from 'graphql/mutations';
import { GET_MINT_TASK_TOKEN_DATA, GET_MINT_OPERATION } from 'graphql/queries';
import { useSteps, useTaskContext } from 'utils/hooks';

export const useCreateMint = () => {
  const { step, nextStep } = useSteps();
  const [taskMint] = useMutation(MINT_TASK, {
    onCompleted: () => nextStep(),
  });

  const [getTaskTokenData, { data }] = useLazyQuery(GET_MINT_TASK_TOKEN_DATA, {
    // onCompleted: ({ getTaskMintTokenData }) => {
    //   setTokenData(getTaskMintTokenData);
    // },
  });

  const [completeTaskMint] = useMutation(COMPLETE_TASK_MINT);

  const [getTaskMintOperation, { startPolling, stopPolling, variables }] = useLazyQuery(GET_MINT_OPERATION, {
    onCompleted: async ({ getTaskMintOperation }) => {
      if (getTaskMintOperation?.resourceId) {
        nextStep();
        stopPolling();
        await completeTaskMint({
          variables: {
            operationId: variables.operationId,
          },
        });
        await getTaskTokenData({
          variables: {
            taskId: fetchedTask?.id,
          },
        });
      }
    },
    onError: () => stopPolling(),
  });

  const { fetchedTask } = useTaskContext();

  const startTaskMintProcess = async () => {
    const { data: taskMintData } = await taskMint({
      variables: {
        taskId: fetchedTask?.id,
        title: fetchedTask?.title,
        description: fetchedTask?.description,
        links: fetchedTask?.links?.map((link) => JSON.stringify(link)) || null,
      },
    });
    await getTaskMintOperation({
      variables: {
        operationId: taskMintData?.taskMint,
      },
    });
    startPolling(1000);
  };

  return { startTaskMintProcess, step, data };
};
