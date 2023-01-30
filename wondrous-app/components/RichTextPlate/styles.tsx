import styled from 'styled-components';

import palette from 'theme/palette';

export const MediaUploadButton = styled.button`
  display: flex;
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;

  &:hover {
    background: ${palette.grey900};
    border-radius: 4px;
  }
`;

export const VerticalDivider = styled.div`
  border-right: 1px solid ${palette.grey75};
  height: 28px;
`;
