import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_MINT_TASK_TOKEN_DATA } from 'graphql/queries';
import { CircularProgress, Grid } from '@mui/material';
import { Wrapper } from './styles';

const TaskViewNft = ({ taskId }) => {
  const { data, loading } = useQuery(GET_MINT_TASK_TOKEN_DATA, {
    variables: {
      taskId,
    },
  });

  if (loading)
    return (
      <Grid display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );

  if (!data) return null;

  const { imageUrl } = data?.getTaskMintTokenData;
  return (
    <Wrapper display="flex" justifyContent="center" alignItems="baseline">
      <Image fill objectFit="contain" src={imageUrl} priority alt="NFT image" />;
    </Wrapper>
  );
};

export default TaskViewNft;
