import { useEffect } from 'react';
import { useMutation, useLazyQuery } from '@apollo/client';
import { COMPLETE_TASK_MINT, MINT_TASK } from 'graphql/mutations';
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

const MintInProgress = ({ step }) => (
  // const { step, nextStep } = useSteps();
  // const [taskMint] = useMutation(MINT_TASK, {
  //   onCompleted: () => nextStep(),
  // });

  // const [getTaskTokenData] = useLazyQuery(GET_MINT_TASK_TOKEN_DATA, {
  //   onCompleted: ({ getTaskMintTokenData }) => {
  //     setTokenData(getTaskMintTokenData);
  //   },
  // });

  // const [completeTaskMint] = useMutation(COMPLETE_TASK_MINT);

  // const [getTaskMintOperation, { startPolling, stopPolling, variables }] = useLazyQuery(GET_MINT_OPERATION, {
  //   onCompleted: async ({ getTaskMintOperation }) => {
  //     if (getTaskMintOperation?.resourceId) {
  //       nextStep();
  //       stopPolling();
  //       await completeTaskMint({
  //         variables: {
  //           operationId: variables.operationId,
  //         },
  //       });
  //       await getTaskTokenData({
  //         variables: {
  //           taskId: fetchedTask?.id,
  //         },
  //       });
  //     }
  //   },
  //   onError: () => stopPolling(),
  // });

  // const { fetchedTask } = useTaskContext();

  // const taskMintProcess = async () => {
  //   const { data: taskMintData } = await taskMint({
  //     variables: {
  //       taskId: fetchedTask?.id,
  //       title: fetchedTask?.title,
  //       description: fetchedTask?.description,
  //       links: fetchedTask?.links?.map((link) => JSON.stringify(link)) || null,
  //     },
  //   });
  //   await getTaskMintOperation({
  //     variables: {
  //       operationId: taskMintData?.taskMint,
  //     },
  //   });
  //   startPolling(1000);
  // };

  // useEffect(() => {
  //   taskMintProcess();
  // }, []);

  <MintStepContent
    skipDivider
    title="Minting your task..."
    img="/images/taskmint/inprogressmint.png"
    body="The minting will only take a moment, please keep this modal open."
  >
    <MintStepDetails step={step} />
  </MintStepContent>
);
export default MintInProgress;
