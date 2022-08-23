import { useEffect, useState } from 'react';
import WidgetLayout from 'components/MissionControlWidgets/WidgetLayout';
import { EmptyStateText, TaskContainer, TaskTitle } from 'components/MissionControlWidgets/InProgressTasks/styles';
import { useQuery } from '@apollo/client';
import { GET_USER_KUDOS } from 'graphql/queries';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { useInView } from 'react-intersection-observer';
import { LIMIT } from 'services/board';
import { LoadMore } from 'components/SearchTasks/styles';
import Link from 'next/link';
import { KudosWrapper } from './styles';

const KudosWidget = () => {
  const [hasMore, setHasMore] = useState(true);
  const { data, loading, fetchMore: fetchMoreKudos } = useQuery(GET_USER_KUDOS);
  const [ref, inView] = useInView({});

  const fetchMore = () => {
    fetchMoreKudos({ variables: { offset: data?.getUserKudos?.length, limit: LIMIT } }).then(({ data }) =>
      setHasMore(data?.getUserKudos?.length >= LIMIT)
    );
  };

  useEffect(() => {
    if (inView && hasMore && data?.getUserKudos?.length) {
      fetchMore();
    }
  }, [inView, hasMore, data?.getUserKudos?.length]);

  return (
    <WidgetLayout title="Kudos">
      <KudosWrapper>
        {!loading && !data?.getUserKudos?.length && (
          <EmptyStateText>When people send you kudos, you'll see it here</EmptyStateText>
        )}
        {data?.getUserKudos?.map((kudos, idx) => (
          <TaskContainer key={idx}>
            <Link href={`/profile/${kudos.creator.username}`}>
              <UserProfilePicture avatar={kudos.creator.profilePicture} />
            </Link>
            <TaskTitle>{kudos.content}</TaskTitle>
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
