import { useLazyQuery } from '@apollo/client';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { GET_USER_PODS } from 'graphql/queries';
import { renderMentionString } from 'utils/common';
import { cutString } from 'utils/helpers';
import { useMe } from '../Auth/withAuth';
import { SafeImage } from '../Common/Image';
import {
  TaskListModalHeader,
  TaskModalBaseCard,
  TaskListCardWrapper,
  TaskHeader,
  TaskContent,
  TaskTitle,
} from '../Common/Task/styles';
import { LoadMore } from '../Common/MilestoneTaskList/styles';
import { CreateModalOverlay } from '../CreateEntity/styles';
import PodIcon from '../Icons/podIcon';
import { PodModalFooter, PodModalFooterInfoWrapper, PodModalFooterInfoWrapperText } from './styles';

const PodListCard = (props) => {
  const { pod, handleClose } = props;
  const router = useRouter();
  return (
    <Link href={`/pod/${pod?.id}/boards`} passHref={true}>
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
          {!!pod?.milestoneCount && (
            <PodModalFooterInfoWrapper>
              <PodModalFooterInfoWrapperText>
                {pod?.milestoneCount} {pod?.milestoneCount === 1 ? 'milestone' : 'milestones'}
              </PodModalFooterInfoWrapperText>
            </PodModalFooterInfoWrapper>
          )}
        </PodModalFooter>
      </TaskListCardWrapper>
    </Link>
  );
};
export const PodModal = (props) => {
  const { open, handleClose } = props;
  const [getUserPods, { data: podData, fetchMore: fetchMorePods }] = useLazyQuery(GET_USER_PODS, {
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
          {pods?.map((pod, index) => {
            return <PodListCard key={pod?.id} pod={pod} handleClose={handleClose} />;
          })}
          <LoadMore ref={ref} hasMore={hasMore}></LoadMore>
        </div>
      </TaskModalBaseCard>
    </CreateModalOverlay>
  );
};
