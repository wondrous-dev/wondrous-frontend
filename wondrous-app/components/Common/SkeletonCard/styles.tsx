import styled, { keyframes } from 'styled-components';
import palette from 'theme/palette';
import { CardWrapper } from 'components/Common/Task/styles';

export const SkeletonCardWrapper = styled(CardWrapper)`
  && {
    margin: 10px;
    pointer-events: none;
    min-width: 22%;
  }
`;
const skeletonAnimation = keyframes`
  0% {
    opacity: 0.4;
  }
    100% {
      opacity: 1;
    }
`;

export const SkeletonOrgPlaceholder = styled.div`
  border-radius: 268px;
  width: 28px;
  height: 28px;
  background: ${palette.grey85};
  animation: ${skeletonAnimation} 0.8s linear infinite alternate;
`;

export const SkeletonTitlePlaceholder = styled.div`
  background: ${palette.grey85};
  width: 264px;
  height: 10px;
  border-radius: 279px;
  animation: ${skeletonAnimation} 0.8s linear infinite alternate;
`;

export const SkeletonDescriptionWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
`;

export const SkeletonDescriptionPlaceholder = styled.div`
  width: 20%;
  height: 10px;

  background: ${palette.grey85};
  border-radius: 279px;
  animation: ${skeletonAnimation} 0.8s linear infinite alternate;
`;

export const SkeletonMediaPlaceholder = styled.div`
  background: ${palette.grey85};
  width: 100%;
  height: 8rem;
  border-radius: 7px;
  margin-top: 10px;
  animation: ${skeletonAnimation} 0.8s linear infinite alternate;
`;

export const SkeletonPodTitlePlaceholderInner = styled.div`
  width: 80%;
  height: 4px;
  background: ${palette.grey850};
  border-radius: 279px;
  margin-left: 5px;
  animation: ${skeletonAnimation} 0.8s linear infinite alternate;
`;

export const SkeletonPodTitlePlaceholderOuter = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: ${palette.grey85};
  border-radius: 279px;
  height: 26px;
  animation: ${skeletonAnimation} 0.8s linear infinite alternate;
  width: 40%;
`;

export const CommentSectionWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex: 1;
  animation: ${skeletonAnimation} 0.8s linear infinite alternate;
  gap: 5px;
`;

export const CommentSkeletonCounter = styled(SkeletonPodTitlePlaceholderInner)`
  && {
    width: 20%;
  }
`;
