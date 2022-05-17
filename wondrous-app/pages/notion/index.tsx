import React from 'react';
import { useRouter } from 'next/router';

import { Typography } from '@mui/material';
import Wrapper from 'components/Wrapper';
import styled from 'styled-components';
import { Background, White } from 'theme/colors';

const Custom404Background = styled.div`
  background-image: url(/images/404/404-background.webp);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1000px;
  width: 100vw;
  height: 573px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 100px;
`;


const Custom404Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -50px;
  z-index: 300;
`;

const Custom404Heading = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 32px;
    font-weight: 500;
    color: ${White};
  }
`;



export default function NotionPage() {
  return (
    <Wrapper>
      <Custom404Background>
      </Custom404Background>
      <Custom404Wrapper>
        <Custom404Heading>Notion Integration Page!</Custom404Heading>
        <a href="https://api.notion.com/v1/oauth/authorize?owner=user&client_id=395f9caf-2b2c-412b-a8cf-e3da9bc61b39&redirect_uri=http://localhost:3000/notion/callback&response_type=code">Add to Notion</a>
      </Custom404Wrapper>
    </Wrapper>
  );
}
