import { Typography } from '@mui/material';
import styled from 'styled-components';
import { White } from 'theme/colors';

export const GithubButtonDiv = styled.div`
  margin-top: 32px;
  margin-left: 48px;
`;
export const GithubButton = styled.a`
  background: #f5f8fa;
  padding: 8px 12px;
  text-decoration: none !important;
  color: black !important;
  border-radius: 8px;
  font-weight: bolder;
  display: flex;
  width: fit-content;
  align-items: center;
  cursor: pointer;
`;

export const PodGithubReposDiv = styled.div``;

export const PodGithubExplainerText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-size: 14px;
    line-height: 24px;
    margin-top: -16px;
    color: ${White};
  }
`;

export const AddRepoDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;
