import { SectionSubheader } from 'components/Explore/styles';
import Link from 'next/link';
import { ErrorWrapper, ErrorImage, ErrorHeader } from './styles';
import { Button } from 'components/Button';

function CustomErrorComponent() {
  return (
    <ErrorWrapper>
      <ErrorHeader>Houston, we have a problem...</ErrorHeader>
      <SectionSubheader>Something went wrong.</SectionSubheader>
      <Link href="/explore">
        <Button>Escape to Explore</Button>
      </Link>
      <ErrorImage src="/images/500.webp" />
    </ErrorWrapper>
  );
}
export default CustomErrorComponent;
