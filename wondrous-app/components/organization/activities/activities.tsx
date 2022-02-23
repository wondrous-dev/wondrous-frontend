import { useQuery } from '@apollo/client';
import React from 'react';
import { GET_ORG_FEED } from '../../../graphql/queries';
import Wrapper from '../wrapper/wrapper';
import { PostItem } from '../../Common/PostItem';
import { Feed } from './styles';
import PostCard from './post';

const Activities = (props) => {
  const { orgData } = props;
  const { data: getOrgFeedData } = useQuery(GET_ORG_FEED, {
    variables: {
      orgId: orgData?.id,
      offset: 0,
      limit: 15,
    },
    pollInterval: 60000,
  });
  const orgFeedData = getOrgFeedData?.getOrgFeed;
  const isMoreThanOne = orgFeedData?.length > 1;
  return (
    <Wrapper orgData={orgData}>
      <Feed isMoreThanOne={isMoreThanOne}>
        {orgFeedData?.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </Feed>
      {/* TODO: @juniusfree add pagination here */}
    </Wrapper>
  );
};

export default Activities;
