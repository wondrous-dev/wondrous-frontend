import { TaskHeader, TaskHeaderIconWrapper, TaskContent, TaskTitle } from 'components/Common/Task/styles';
import { BoardsCardFooter } from 'components/Common/Boards/styles';
import PodIcon from 'components/Icons/podIcon';
import palette from 'theme/palette';
import { TaskCommentIcon } from 'components/Icons/taskComment';

import {
  SkeletonOrgPlaceholder,
  SkeletonTitlePlaceholder,
  SkeletonDescriptionWrapper,
  SkeletonDescriptionPlaceholder,
  SkeletonMediaPlaceholder,
  SkeletonPodTitlePlaceholderInner,
  SkeletonPodTitlePlaceholderOuter,
  CommentSectionWrapper,
  CommentSkeletonCounter,
  SkeletonCardWrapper,
} from './styles';
export default function SkeletonCard() {
  return (
    <SkeletonCardWrapper>
      <TaskHeader>
        <TaskHeaderIconWrapper>
          <SkeletonOrgPlaceholder />
          <SkeletonOrgPlaceholder />
        </TaskHeaderIconWrapper>
      </TaskHeader>
      <TaskContent>
        <TaskTitle>
          <SkeletonTitlePlaceholder />
        </TaskTitle>
        <SkeletonDescriptionWrapper>
          <SkeletonDescriptionPlaceholder />
          <SkeletonDescriptionPlaceholder />
          <SkeletonDescriptionPlaceholder />
        </SkeletonDescriptionWrapper>
        <SkeletonMediaPlaceholder />
      </TaskContent>
      <BoardsCardFooter>
        <PodIcon
          color={palette.grey85}
          style={{
            width: '26px',
            height: '26px',
            marginRight: '8px',
          }}
        />
        <SkeletonPodTitlePlaceholderOuter>
          <SkeletonPodTitlePlaceholderInner />
        </SkeletonPodTitlePlaceholderOuter>
        <CommentSectionWrapper>
          <TaskCommentIcon />
          <CommentSkeletonCounter />
        </CommentSectionWrapper>
      </BoardsCardFooter>
    </SkeletonCardWrapper>
  );
}
