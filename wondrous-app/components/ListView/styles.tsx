import styled from 'styled-components';
import palette from 'theme/palette';

export const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const ListViewItemBodyWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  cursor: pointer;
  padding: 8px 8px;
  border-radius: 6px;
  &:hover {
    background: #151515;
  }
`;

export const ListViewItemDataContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  flex: 1;
  align-items: center;
  gap: 16px;
  font-family: 'Space Grotesk';
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
`;

export const ListViewItemIconsWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  font-weight: 400;
  font-size: 13px;
  line-height: 17px;
`;

export const ListViewItemActions = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
`;

export const Type = styled.div`
  line-height: 0;
  font-size: 12px;
  font-weight: 600;
  background: ${palette.grey90};
  padding: 12px;
  border-radius: 100px;
  color: ${palette.grey500};
`;
