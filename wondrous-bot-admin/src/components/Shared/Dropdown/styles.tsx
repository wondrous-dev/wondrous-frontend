import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4px 8px;
  height: 32px;
  line-height: 32px;
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize || "13px"};
  font-weight: ${(props) => props.fontWeight};
  ${(props) => (props.textAlign ? { textAlign: props.textAlign } : null)};
  border-radius: 6px;
  &:hover {
    background-color: #f8afdb;
  }
  color: black;
  cursor: pointer;
`;
