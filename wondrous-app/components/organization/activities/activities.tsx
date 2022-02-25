import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_ORG_FEED } from '../../../graphql/queries';
import { Post } from '../../Common/Post';
import Wrapper from '../wrapper/wrapper';
import { Feed, FeedLoadMore } from './styles';

const Activities = (props) => {
  const { orgData } = props;
  const [ref, inView] = useInView({});
  const { data, loading, fetchMore } = useQuery(GET_ORG_FEED, {
    variables: {
      orgId: orgData?.id,
      offset: 0,
      limit: 15,
    },
    pollInterval: 60000,
  });
  const feedData = data?.getOrgFeed;
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
    <Wrapper orgData={orgData}>
      <Feed isMoreThanOne={isMoreThanOne}>
        {feedData?.map((post) => {
          return <Post key={post.id} post={post} />;
        })}
      </Feed>
      {!loading && <FeedLoadMore ref={ref} />}
    </Wrapper>
  );
};

export default Activities;
