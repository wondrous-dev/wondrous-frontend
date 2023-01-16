import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_POD_FEED } from 'graphql/queries';
import isEmpty from 'lodash/isEmpty';
import EmptyStateGeneric from 'components/EmptyStateGeneric';
import HomePageHeader from 'components/Pod/wrapper/HomePageHeader';
import { Post } from '../../Common/Post';
import { Feed, FeedLoadMore } from '../../organization/activities/styles';

const useGetPodFeed = (podId, inView) => {
  const [getPodFeed, { data, loading, fetchMore }] = useLazyQuery(GET_POD_FEED, {
    pollInterval: 60000,
  });
  useEffect(() => {
    if (!data && podId) {
      getPodFeed({
        variables: {
          podId,
          offset: 0,
          limit: 15,
        },
      });
    }
    if (data && !loading && inView) {
      fetchMore({
        variables: {
          offset: data?.getPodFeed?.length,
        },
      });
    }
  }, [inView, fetchMore, loading, podId, getPodFeed, data]);
  return { data, loading };
};

function Activities(props) {
  const { podId } = props;
  const [ref, inView] = useInView({});
  const { data, loading } = useGetPodFeed(podId, inView);
  const feedData = data?.getPodFeed;
  const feedDataLength = feedData?.length;
  const isMoreThanOne = feedDataLength > 1;
  return (
    <HomePageHeader>
      {isEmpty(feedData) && <EmptyStateGeneric content="This is where your activity will go." />}

      <Feed isMoreThanOne={isMoreThanOne}>
        {feedData?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Feed>
      {!loading && <FeedLoadMore ref={ref} />}
    </HomePageHeader>
  );
}

export default Activities;
