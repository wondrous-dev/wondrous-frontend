import styled from 'styled-components';
import palette from 'theme/palette';

export const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  border: 2px dashed ${palette.grey78};
  border-radius: 6px;
  cursor: pointer;
  color: ${palette.grey78};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-out;

  &:hover {
    border: 2px dashed ${palette.grey850};
    color: ${palette.grey850};
  }
`;
