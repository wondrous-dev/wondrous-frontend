import { Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

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
    color: ${palette.white};
  }
`;

export const AddRepoDiv = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

export const RepoDiv = styled.div`
  background: #1a1a1a;
  padding: 16px;
  border: 1px solid #4b4b4b;
  display: flex;
  border-radius: 4px;
  margin-top: 8px;
`;

export const RepoDivTitle = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 14px;
    font-family: Space Grotesk;
  }
`;
