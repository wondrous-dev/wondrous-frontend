import { SafeImage } from 'components/Common/Image';
import PodIconName from 'components/Common/PodIconName';
import {
  PodModalFooter,
  PodModalFooterInfoWrapper,
  PodModalFooterInfoWrapperText,
} from 'components/Common/SidebarMainPods/styles';
import {
  LoadMore,
  TaskContent,
  TaskHeader,
  TaskListCardWrapper,
  TaskListModalHeader,
  TaskModalBaseCard,
} from 'components/Common/Task/styles';
import { CreateModalOverlay } from 'components/CreateEntity/styles';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { renderMentionString } from 'utils/common';
import { cutString } from 'utils/helpers';

import { NoUnderlineLink } from './Link/links';

function PodListCard(props) {
  const { pod, handleClose } = props;
  const router = useRouter();
  return (
    <NoUnderlineLink href={`/pod/${pod?.id}/boards`} passHref>
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
          <PodIconName color={pod?.color} name={pod?.name} />
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
              alt="Organization Logo"
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
    </NoUnderlineLink>
  );
}

interface PodModalProps {
  open: boolean;
  handleClose: () => unknown;
  pods: Array<{
    [key: string]: any;
  }>;
}

export default function PodModal({ open, handleClose, pods }: PodModalProps) {
  const [ref, inView] = useInView({});
  const [hasMore, setHasMore] = useState(false);

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
          {pods?.map((pod) => (
            <PodListCard key={pod?.id} pod={pod} handleClose={handleClose} />
          ))}
          <LoadMore ref={ref} hasMore={hasMore} />
        </div>
      </TaskModalBaseCard>
    </CreateModalOverlay>
  );
}
