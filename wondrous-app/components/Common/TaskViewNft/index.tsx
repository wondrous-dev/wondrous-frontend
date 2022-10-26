import Image from 'next/image';
import { useQuery } from '@apollo/client';
import { GET_MINT_TASK_TOKEN_DATA } from 'graphql/queries';
import { CircularProgress, Grid } from '@mui/material';

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

  const { imageUrl } = data?.getMintTaskTokenData;
  return (
    <Grid display="flex" justifyContent="center" alignItems="center">
      <Image layout="fixed" width={422} height={422} src={imageUrl} priority />;
    </Grid>
  );
};

export default TaskViewNft;
