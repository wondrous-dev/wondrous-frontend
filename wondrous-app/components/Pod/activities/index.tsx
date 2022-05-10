import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_POD_FEED } from 'graphql/queries';
import { Post } from '../../Common/Post';
import { Feed, FeedLoadMore } from '../../organization/activities/styles';
import Wrapper from '../wrapper/';

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

const Activities = (props) => {
  const { podId } = props;
  const [ref, inView] = useInView({});
  const { data, loading } = useGetPodFeed(podId, inView);
  const feedData = data?.getPodFeed;
  const feedDataLength = feedData?.length;
  const isMoreThanOne = feedDataLength > 1;
  return (
    <Wrapper>
      <Feed isMoreThanOne={isMoreThanOne}>
        {feedData?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Feed>
      {!loading && <FeedLoadMore ref={ref} />}
    </Wrapper>
  );
};

export default Activities;
