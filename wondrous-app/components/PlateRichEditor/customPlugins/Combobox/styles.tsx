import styled from 'styled-components';

import palette from 'theme/palette';

export const BasicBlocksTitle = styled.div`
  color: ${palette.grey57};
  margin-bottom: 4px;
  border-bottom: 1px solid ${palette.grey920};
  font-size: 13px;
  font-weight: 500;
`;

export const SlashCommandItemIcon = styled.div`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 16px;
`;

export const ComboboxList = styled.ul`
  width: 300px;
  border: 1px solid ${palette.grey79};
  border-radius: 6px;
  box-shadow: 12px 10px 24px 2px rgba(16, 16, 16, 0.8);

  z-index: 1300;
  background-color: ${palette.grey910};
  margin: 0;
  padding: 8px;
  max-height: 280px;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${palette.grey910};
    margin: 6px 0;
  }

  &::-webkit-scrollbar-thumb {
    background: ${palette.grey79};
    border-radius: 4px;
  }
`;

export const ComboboxItem = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  user-select: none;

  color: ${palette.grey57};
  min-height: 28px;
  border-radius: 4px;
  padding: 0 10px;
  background: ${({ highlighted }) => (highlighted ? palette.black95 : 'transparent')};

  &:not(:last-child) {
    margin-bottom: 4px;
  }

  :hover {
    background: ${palette.black95};
  }
`;
