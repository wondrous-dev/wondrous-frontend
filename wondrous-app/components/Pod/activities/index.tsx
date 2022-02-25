import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_POD_FEED } from '../../../graphql/queries';
import { Post } from '../../Common/Post';
import { Feed, FeedLoadMore } from '../../organization/activities/styles';
import Wrapper from '../wrapper/';

const Activities = (props) => {
  const { podId } = props;
  const [ref, inView] = useInView({});
  const { data, loading, fetchMore } = useQuery(GET_POD_FEED, {
    variables: {
      podId,
      offset: 0,
      limit: 15,
    },
    pollInterval: 60000,
  });
  const feedData = data?.getPodFeed;
  const feedDataLength = feedData?.length;
  const isMoreThanOne = feedDataLength > 1;

  useEffect(() => {
    if (!loading && inView) {
      fetchMore({
        variables: {
          offset: feedDataLength,
        },
      });
    }
  }, [inView, feedDataLength, fetchMore, loading]);

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
