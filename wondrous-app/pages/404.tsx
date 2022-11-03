import { Typography } from '@mui/material';
import { Button } from 'components/Common/button';
import Wrapper from 'components/Wrapper';
import Image from 'next/legacy/image';
import Link from 'next/link';
import styled from 'styled-components';
import palette from 'theme/palette';

const Custom404Background = styled.div`
  background-image: url(/images/404/404-background.webp);
  background-repeat: no-repeat;
  background-position: center;
  background-size: 1000px;
  width: 100%;
  height: 573px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding-top: 100px;
`;

const Custom404Text = styled(Image)`
  z-index: 100;
`;

const Custom404ImageWrapper = styled.div`
  position: absolute;
  z-index: 200;
  width: 100%;
  display: flex;
  justify-content: center;
  padding-top: 40px;
`;

const Custom404Image = styled(Image)``;

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
    color: ${palette.white};
  }
`;

const Custom404SubHeading = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 400;
    color: ${palette.white};
    margin-top: 16px;
  }
`;

const Custom404Button = styled(Button)`
  background: linear-gradient(267.08deg, #ccbbff -2.92%, #7427ff 81.21%, #00baff 174.59%);
  width: 240px;
  margin-top: 40px;
  button {
    background: ${palette.background.default};
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 500;
  }
`;

export default function Custom404() {
  return (
    <Wrapper>
      <Custom404Background>
        <Custom404ImageWrapper>
          <Custom404Image src="/images/404/404-image.webp" width="189" height="182" />
        </Custom404ImageWrapper>
        <Custom404Text src="/images/404/404-text.webp" width="943" height="289" />
      </Custom404Background>
      <Custom404Wrapper>
        <Custom404Heading>Hey Wonderer!</Custom404Heading>
        <Custom404SubHeading>Looks like there is no such planet in the Wonderverse.</Custom404SubHeading>
        <Link href="/dashboard" passHref legacyBehavior>
          <Custom404Button>Back to the homepage</Custom404Button>
        </Link>
      </Custom404Wrapper>
    </Wrapper>
  );
}
