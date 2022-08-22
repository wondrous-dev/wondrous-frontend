import { ButtonBase } from '@mui/material';
import Link from 'next/link';
import styled from 'styled-components';
import ArrowBackIcon from './icons/arrowBack.svg';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Button = styled(ButtonBase)`
  && {
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    color: #fff;
    gap: 8px;
    width: 100%;
  }
`;

const LeftArrowIconWrapper = styled((props) => (
  <div {...props}>
    <div>
      <ArrowBackIcon />
    </div>
  </div>
))`
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #454545;
  ${Button}:hover & {
    background: #7a7a7a;
    filter: drop-shadow(-1px 5px 7px rgba(0, 0, 0, 0.7));
    svg {
      path {
        stroke: #fff;
      }
    }
  }
  > div {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const BackButton = ({ href }) => (
  <Wrapper>
    <Link href={href} passHref>
      <Button disableRipple>
        <LeftArrowIconWrapper />
        Back
      </Button>
    </Link>
  </Wrapper>
);

export default BackButton;
