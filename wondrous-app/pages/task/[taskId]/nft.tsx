import Head from 'next/head';
import apollo from 'services/apollo';
import { GET_MINT_TASK_TOKEN_DATA, GET_TASK_BY_ID } from 'graphql/queries';
import { useRouter } from 'next/router';
import AppLayout from 'components/Common/Layout/App';
import { CircularProgress, Grid } from '@mui/material';
import { useQuery } from '@apollo/client';

/*

The logic behind this is to use this URL for server side rendering task metadata for open graph protocol.
Whenever the user does click the url from the social media, the page will redirect to 
Org board task view modal with the NFT view mode
*/

function TaskViewNFT({ tokenData, taskId }) {
  const router = useRouter();

  const { data } = useQuery(GET_TASK_BY_ID, {
    variables: {
      taskId,
    },
  });

  if (data?.getTaskById?.org?.username) {
    router.push(`/organization/${data?.getTaskById?.org?.username}/boards?task=${taskId}&viewNft=${true}`, undefined, {
      shallow: true,
    });
  }

  return (
    <Grid display="flex" justifyContent="center" alignItems="center">
      <Head>
        <title>Wonderverse task - {tokenData?.title}</title>
        <meta name="description" content="Completed task in Wonderverse" key="desc" />
        <meta property="og:title" content={`Wonderverse - ${tokenData?.title}`} />
        <meta property="og:description" content="Completed task in Wonderverse" />
        <meta property="og:image" content={tokenData?.imageUrl} />
      </Head>
      <AppLayout banner={null}>
        <CircularProgress />
      </AppLayout>
    </Grid>
  );
}

export async function getServerSideProps(context) {
  const { taskId } = context.params;

  const { data } = await apollo.query({
    query: GET_MINT_TASK_TOKEN_DATA,
    variables: {
      taskId,
    },
  });
  return {
    props: {
      tokenData: data?.getMintTaskTokenData,
      taskId,
    },
  };
}
export default TaskViewNFT;
