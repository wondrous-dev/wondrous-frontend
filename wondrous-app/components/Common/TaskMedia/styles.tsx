import { MediaItem } from 'components/CreateEntity/MediaItem';
import styled from 'styled-components';
import palette from 'theme/palette';

export const TaskMediaContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  height: 32px;
  > a > div {
    height: 32px;
    margin: 0;
  }
`;

export const TaskMediaItem = styled(MediaItem)`
  && {
    background: ${palette.grey85};
  }
`;
