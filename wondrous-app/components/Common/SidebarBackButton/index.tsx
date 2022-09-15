import Link from 'next/link';
import { Wrapper, Button, LeftArrowIconWrapper } from 'components/Common/SidebarBackButton/styles';

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
