import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const CreateButton = styled.button`
  border-radius: 4px;
  background: transparent;
  height: 32px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 4px;
  cursor: pointer;
  border: 0;
  color: ${palette.white};
  background: ${({ isActive, theme }) => isActive && `${theme.palette.black101}`};
  justify-content: flex-start;
  gap: 9px;
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;

  :hover {
    background: ${palette.grey58};
  }
`;
