import { useLazyQuery } from '@apollo/client';
import { useMe } from 'components/Auth/withAuth';
import { SafeImage } from 'components/Common/Image';
import {
  LoadMore,
  TaskContent,
  TaskHeader,
  TaskListCardWrapper,
  TaskListModalHeader,
  TaskModalBaseCard,
  TaskTitle,
} from 'components/Common/Task/styles';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import PodIcon from 'components/Icons/podIcon';
import {
  PodModalFooter,
  PodModalFooterInfoWrapper,
  PodModalFooterInfoWrapperText,
} from 'components/Common/SidebarMainPods/styles';
import { GET_USER_PODS_WITH_COUNT } from 'graphql/queries';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { renderMentionString } from 'utils/common';
import { cutString } from 'utils/helpers';

function PodListCard(props) {
  const { pod, handleClose } = props;
  const router = useRouter();
  return (
    <Link href={`/pod/${pod?.id}/boards`} passHref>
      <TaskListCardWrapper
        onClick={() => {
          if (handleClose) {
            handleClose();
          }
        }}
        style={{
          cursor: 'pointer',
        }}
      >
        <TaskHeader
          style={{
            marginBottom: '0',
          }}
        >
          <PodIcon
            color={pod?.color}
            style={{
              width: '26px',
              height: '26px',
              marginRight: '8px',
            }}
          />
          <TaskTitle>{pod?.name}</TaskTitle>
        </TaskHeader>
        <TaskContent
          style={{
            maxWidth: 'none',
          }}
        >
          <p>
            {renderMentionString({
              content: cutString(pod?.description),
              router,
            })}
          </p>
        </TaskContent>
        <PodModalFooter>
          {pod?.org?.profilePicture && (
            <SafeImage
              useNextImage={false}
              src={pod?.org?.profilePicture}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '4px',
                marginRight: '8px',
              }}
            />
          )}
          {!!pod?.contributorCount && (
            <PodModalFooterInfoWrapper>
              <PodModalFooterInfoWrapperText>
                {pod?.contributorCount} {pod?.contributorCount === 1 ? 'contributor' : 'contributors'}
              </PodModalFooterInfoWrapperText>
            </PodModalFooterInfoWrapper>
          )}
          {!!pod?.tasksIncompleteCount && (
            <PodModalFooterInfoWrapper>
              <PodModalFooterInfoWrapperText>
                {pod?.tasksIncompleteCount} {pod?.tasksIncompleteCount === 1 ? 'task' : 'tasks'} to do
              </PodModalFooterInfoWrapperText>
            </PodModalFooterInfoWrapper>
          )}
        </PodModalFooter>
      </TaskListCardWrapper>
    </Link>
  );
}
export function PodModal(props) {
  const { open, handleClose } = props;
  const [getUserPods, { data: podData, fetchMore: fetchMorePods }] = useLazyQuery(GET_USER_PODS_WITH_COUNT, {
    fetchPolicy: 'network-only',
  });
  const [pods, setPods] = useState([]);
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(false);
  const user = useMe();

  useEffect(() => {
    if (podData?.getUserPods) {
      setPods(podData?.getUserPods);
    }
  }, [podData?.getUserPods]);

  useEffect(() => {
    if (user && open) {
      getUserPods({
        variables: {
          userId: user?.id,
        },
      });
    }
  }, [user, open]);

  return (
    <CreateModalOverlay
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      open={open}
      onClose={() => {
        handleClose();
      }}
    >
      <TaskModalBaseCard>
        <TaskListModalHeader>{pods?.length} Pods</TaskListModalHeader>
        <div
          style={{
            paddingBottom: '30px',
          }}
        >
          {pods?.map((pod, index) => (
            <PodListCard key={pod?.id} pod={pod} handleClose={handleClose} />
          ))}
          <LoadMore ref={ref} hasMore={hasMore} />
        </div>
      </TaskModalBaseCard>
    </CreateModalOverlay>
  );
}
