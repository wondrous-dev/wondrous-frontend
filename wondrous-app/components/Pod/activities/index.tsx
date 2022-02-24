import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_POD_FEED } from '../../../graphql/queries';
import { Post } from '../../Common/Post';
import Wrapper from '../wrapper/';
import { Feed } from '../../organization/activities/styles';

const Activities = (props) => {
  const { podId } = props;
  const { data: getPodFeedData } = useQuery(GET_POD_FEED, {
    variables: {
      podId,
      offset: 0,
      limit: 15,
    },
    pollInterval: 60000,
  });
  const podFeedData = getPodFeedData?.getPodFeed;
  const isMoreThanOne = podFeedData?.length > 1;
  return (
    <Wrapper>
      <Feed isMoreThanOne={isMoreThanOne}>
        {podFeedData?.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </Feed>
      {/* TODO: @juniusfree add pagination here */}
    </Wrapper>
  );
};

export default Activities;
