import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_ORG_FEED } from 'graphql/queries';
import isEmpty from 'lodash/isEmpty';
import EmptyStateGeneric from 'components/EmptyStateGeneric';
import BoardPageHeader from 'components/organization/wrapper/BoardPageHeader';
import { Post } from '../../Common/Post';
import { Feed, FeedLoadMore } from './styles';

const useGetOrgFeed = (orgId, inView) => {
  const [getOrgFeed, { data, loading, fetchMore }] = useLazyQuery(GET_ORG_FEED, {
    pollInterval: 60000,
  });
  useEffect(() => {
    if (!data && orgId) {
      getOrgFeed({
        variables: {
          orgId,
          offset: 0,
          limit: 15,
        },
      });
    }
    if (data && !loading && inView) {
      fetchMore({
        variables: {
          offset: data?.getOrgFeed?.length,
        },
      });
    }
  }, [inView, fetchMore, loading, orgId, getOrgFeed, data]);
  return { data, loading };
};

function Activities(props) {
  const { orgData = {} } = props;
  const { id: orgId } = orgData;
  const [ref, inView] = useInView({});
  const { data, loading } = useGetOrgFeed(orgId, inView);
  const feedData = data?.getOrgFeed;
  const feedDataLength = feedData?.length;
  const isMoreThanOne = feedDataLength > 1;

  return (
    <BoardPageHeader orgData={orgData} headerTitle="Activities">
      {isEmpty(feedData) && <EmptyStateGeneric content="This is where your activity will go." />}
      <Feed isMoreThanOne={isMoreThanOne}>
        {feedData?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Feed>
      {!loading && <FeedLoadMore ref={ref} />}
    </BoardPageHeader>
  );
}

export default Activities;
