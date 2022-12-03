import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';

export const GithubButtonDiv = styled.div`
  margin-top: 32px;
  margin-left: 48px;
`;

export const GithubLink = styled.a`
  border: 1px solid #298fca;
  display: flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  border-radius: 6px;
  padding: 12px;
  color: ${palette.white} !important;
  text-decoration: none !important;
  font-weight: bold;
  svg {
    fill: #298fca;
    width: 15px;
    height: 15px;
  }
`;

export const GithubLinkText = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 13px;
    ${({ theme }) => `
      color: ${theme.palette.white}
    `}
  }
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
