import { MediaItem } from 'components/CreateEntity/MediaItem';
import styled from 'styled-components';

export const TaskMediaContainer = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 8px;
  > a > div {
    margin: 0;
  }
`;

export const TaskMediaItem = styled(MediaItem)`
  && {
    background: #282828;
    min-height: 40px;
    height: 100%;
    padding: 0;
    margin: 0;
  }
`;
