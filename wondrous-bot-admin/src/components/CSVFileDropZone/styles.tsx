import styled from "styled-components";

export const DropZone = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  border: 2px dashed #474747;
  border-radius: 6px;
  cursor: pointer;
  color: #474747;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease-out;

  &:hover {
    border: 2px dashed #787878;
    color: #787878;
  }
`;
