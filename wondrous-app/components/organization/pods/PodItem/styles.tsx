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

export const PodItemStatsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  p {
    font-weight: 500;
    font-size: 13px;
  }
`;
