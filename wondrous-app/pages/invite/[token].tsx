import MetaTags from 'components/MetaTags';
import { GET_ORG_INVITE_ORG_INFO, GET_POD_INVITE_ORG_INFO, GET_PREVIEW_FILE } from 'graphql/queries';
import React from 'react';

import apollo from 'services/apollo';
import lazy from 'utils/enhancements/lazy';

enum Type {
  ORG = 'org',
  Pod = 'pod',
}

const TokenLazyPage = lazy(() => import('./tokenLazy'));

const TokenPage = (props) => (
  <>
    {' '}
    <MetaTags meta={props.meta} />
    <TokenLazyPage {...props} />
  </>
);

export default TokenPage;

export const getServerSideProps = async ({ query }) => {
  const props = {
    meta: {
      title: '',
      description: 'Wonder is where DAOs manage world changing projects',
      img: '',
    },
    preloadedState: {
      podInfo: null,
      orgInfo: null,
    },
  };

  try {
    if (query.token) {
      let podInfo;
      let profilePicture;

      if (query.type === Type.Pod) {
        const { data } = await apollo.query({
          query: GET_POD_INVITE_ORG_INFO,
          variables: {
            token: query.token,
          },
        });
        podInfo = data?.getInvitedPodInfo;
        props.preloadedState.podInfo = data.getInvitedPodInfo;
        profilePicture = podInfo?.org?.profilePicture;
        props.meta.title = `The ${podInfo?.name} pod from ${podInfo?.org?.name} is requesting your help`;
      } else {
        const orgData = await apollo.query({
          query: GET_ORG_INVITE_ORG_INFO,
          variables: { token: query.token },
        });

        const orgInfo = orgData?.data?.getInvitedOrgInfo;
        props.preloadedState.orgInfo = orgInfo;
        profilePicture = orgInfo?.profilePicture;
        props.meta.title = `${orgInfo?.name} is requesting your help.`;
      }

      if (profilePicture) {
        const previewFileData = await apollo.query({
          query: GET_PREVIEW_FILE,
          variables: { path: profilePicture },
        });

        props.meta.img = previewFileData.data.getPreviewFile.url;
      }
    }
  } catch (error) {
    console.error(error);
  }

  return { props };
};
