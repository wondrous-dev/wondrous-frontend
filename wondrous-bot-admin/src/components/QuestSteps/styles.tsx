import styled from "styled-components";

export const Image = styled.img`
  width: ${({ width = "auto" }) => width};
  max-height: 200px;
`;
