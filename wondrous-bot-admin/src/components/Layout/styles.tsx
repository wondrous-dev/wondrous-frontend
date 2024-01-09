import styled from "styled-components";

export const Main = styled.main`
  ${({ theme }) => theme.breakpoints.down("md")} {
    padding-top: ${({ $isPageWithoutHeader }) => ($isPageWithoutHeader ? "0" : "24px")};
  }
  flex: 1;
  width: 100%;
`;
  