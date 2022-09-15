import { useEffect, useState } from 'react';
import WidgetLayout from 'components/MissionControlWidgets/WidgetLayout';
import { EmptyStateText, TaskContainer, TaskTitle } from 'components/MissionControlWidgets/InProgressTasks/styles';
import { useQuery } from '@apollo/client';
import { GET_USER_FEED } from 'graphql/queries';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import { useMe } from 'components/Auth/withAuth';
import { PostVerbType } from 'types/post';
import { LoadMore } from 'components/SearchTasks/styles';
import Link from 'next/link';
import { KudosWrapper } from './styles';

const KudosWidget = () => {
  const user = useMe();
  const [hasMore, setHasMore] = useState(true);
  const {
    data,
    loading,
    fetchMore: fetchMoreKudos,
  } = useQuery(GET_USER_FEED, {
    variables: {
      offset: 0,
      limit: LIMIT,
      userId: user?.id,
      verb: PostVerbType.KUDOS,
    },
    skip: !user?.id,
  });
  const [ref, inView] = useInView({});

  const fetchMore = () => {
    fetchMoreKudos({ variables: { offset: data?.getUserFeed?.length, limit: LIMIT } }).then(({ data }) =>
      setHasMore(data?.getUserFeed?.length >= LIMIT)
    );
  };

  useEffect(() => {
    if (inView && hasMore && data?.getUserFeed?.length >= LIMIT) {
      fetchMore();
    }
  }, [inView, hasMore, data?.getUserFeed?.length]);

  return (
    <WidgetLayout title="Kudos">
      <KudosWrapper>
        {!loading && !data?.getUserFeed?.length && (
          <EmptyStateText>When people send you kudos, you'll see it here</EmptyStateText>
        )}
        {data?.getUserFeed?.map((kudos, idx) => (
          <TaskContainer key={idx}>
            <Link href={`/profile/${kudos?.actor?.username}/about`}>
              <div>
                <UserProfilePicture avatar={kudos?.actor?.profilePicture} />
              </div>
            </Link>
            <TaskTitle>{kudos?.content}</TaskTitle>
          </TaskContainer>
        ))}
        <LoadMore
          style={{
            height: '2px',
          }}
          hasMore
          ref={ref}
        />
      </KudosWrapper>
    </WidgetLayout>
  );
};

export default KudosWidget;
