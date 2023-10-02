import styled from "styled-components";

export const DiscordGif = styled.img`
  max-width: 400px;
  max-height: 300px;
  border-radius: 16px;
  ${({ theme }) => theme.breakpoints.down("md")} {
    max-width: 100%;
  }
`;
