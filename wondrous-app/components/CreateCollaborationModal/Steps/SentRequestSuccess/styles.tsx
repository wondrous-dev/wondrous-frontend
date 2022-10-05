import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';

export const CopyLinkButton = styled.button`
  background: ${palette.grey99};
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
  color: ${palette.blue20};
  padding: 4px 8px;
  align-items: center;
  justify-content: center;
  gap: 4px;
  display: flex;
  border-radius: 4px;
  border: 0;
  &:hover {
    background: ${palette.grey100};
  }
`;
