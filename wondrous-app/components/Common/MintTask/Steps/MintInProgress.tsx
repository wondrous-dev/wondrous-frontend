import { useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { MINT_TASK } from 'graphql/mutations';
import { useSteps, useTaskContext } from 'utils/hooks';
import { Approved } from 'components/Icons';
import Grid from '@mui/material/Grid';
import palette from 'theme/palette';

import { GET_MINT_OPERATION, GET_MINT_TASK_TOKEN_DATA } from 'graphql/queries';
import { MintStep } from './styles';
import MintStepContent from './MintStepContent';

const STEPS = [
  {
    title: 'Sending metadata',
  },
  {
    title: 'Putting in block request via Mint Kudos',
  },
  {
    title: 'Minting NFT to your wallet',
  },
];

const MintStepDetails = ({ step }) => (
  <Grid display="flex" direction="column" gap="18px" justifyContent="flexStart">
    {STEPS.map((item, idx) => (
      <MintStep isActive={idx <= step}>
        <Approved fill={idx > step ? palette.grey57 : null} skipCircle height="35" width="35" />
        <span>{item.title}</span>
      </MintStep>
    ))}
  </Grid>
);

const MintInProgress = ({ setTokenData }) => {
  const { step, nextStep } = useSteps();
  const [mintTask] = useMutation(MINT_TASK, {
    onCompleted: () => nextStep(),
  });
  const [getMintTaskOperation, { startPolling, stopPolling }] = useLazyQuery(GET_MINT_OPERATION, {
    onCompleted: ({ getMintTaskOperation }) => {
      console.log(getMintTaskOperation);
      if (getMintTaskOperation?.resourceId) {
        nextStep();
        stopPolling();
        getTaskTokenData({
          variables: {
            taskId: fetchedTask?.id,
          },
        });
      }
    },
    onError: () => stopPolling(),
  });

  const [getTaskTokenData] = useLazyQuery(GET_MINT_TASK_TOKEN_DATA, {
    onCompleted: ({ getMintTaskTokenData }) => setTokenData(getMintTaskTokenData),
  });
  const { fetchedTask } = useTaskContext();

  console.log(fetchedTask, 'fetched task12345');
  const mintTaskProcess = async () => {
    const { data: mintTaskData } = await mintTask({
      variables: {
        taskId: fetchedTask?.id,
        title: fetchedTask?.title,
        description: fetchedTask?.description,
        links: fetchedTask?.links?.map((link) => JSON.stringify(link)) || null,
      },
    });
    await getMintTaskOperation({
      variables: {
        operationId: mintTaskData?.mintTask,
      },
    });
    startPolling(1000);
  };

  useEffect(() => {
    mintTaskProcess();
  }, []);

  return (
    <MintStepContent
      skipDivider
      title="Minting your task..."
      img="/images/taskmint/inprogressmint.png"
      body="You can close this modal. The minting will take under 1 minute. We’ll send you a notification when your NFT is ready."
    >
      <MintStepDetails step={step} />
    </MintStepContent>
  );
};

export default MintInProgress;
