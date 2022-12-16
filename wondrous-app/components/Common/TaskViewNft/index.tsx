import Image from 'next/image';
import { CircularProgress, Grid } from '@mui/material';
import { useEffect } from 'react';
import { Wrapper } from './styles';

const TaskViewNft = ({ taskId, getTaskMintTokenData, tokenData }) => {
  useEffect(() => {
    getTaskMintTokenData({
      variables: {
        taskId,
      },
    });
  }, []);

  if (tokenData?.loading)
    return (
      <Grid display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );

  if (!tokenData?.data) return null;

  const { imageUrl } = tokenData?.data?.getTaskMintTokenData;
  return (
    <Wrapper display="flex" justifyContent="center" alignItems="baseline">
      <Image fill objectFit="contain" src={imageUrl} priority alt="NFT image" />;
    </Wrapper>
  );
};

export default TaskViewNft;
