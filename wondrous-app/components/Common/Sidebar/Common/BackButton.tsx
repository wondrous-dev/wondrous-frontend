import LeftArrowIcon from 'components/Icons/leftArrow';
import Link from 'next/link';
import styled from 'styled-components';
import Item from './Item';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const BackButton = ({ href }) => (
  <Wrapper>
    <Link href={href} passHref>
      <Item Icon={LeftArrowIcon} roundedBg>
        Back
      </Item>
    </Link>
  </Wrapper>
);

export default BackButton;
