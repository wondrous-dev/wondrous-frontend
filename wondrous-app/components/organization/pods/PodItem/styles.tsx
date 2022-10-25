import { Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

export const PodItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 65px;
  background: ${palette.background.default};
  transition: background 0.2s ease-in-out;
  border-radius: 6px;
  padding: 20px;

  &:hover {
    background: ${palette.grey95};
  }
`;

export const PodItemDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 400px;
  overflow: hidden;
`;

export const PodItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PodNameText = styled(Typography)`
  && {
    color: ${palette.blue20};
    font-weight: 700;
    font-size: 15px;
  }
`;

export const PodDescriptionText = styled(Typography)`
  && {
    color: ${palette.grey250};
    font-size: 14px;
    max-width: 260px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const PodItemIconWrapper = styled.div`
  padding: 10px;
  border-radius: 1000px;
  background: ${({ bgColor }) => bgColor || palette.black85};
  display: flex;
`;

export const PodItemStatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  p {
    font-weight: 500;
    font-size: 13px;
  }
`;

export const PodItemStats = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 6px;
  border-radius: 4px;
  background: ${palette.grey87};
`;

export const PodItemContributorsCount = styled(Typography)`
  && {
    color: ${palette.grey250};
    font-size: 13px;
    font-weight: 500;
  }
`;
