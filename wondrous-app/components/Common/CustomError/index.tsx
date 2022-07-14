import { ErrorWrapper, ErrorImage, ErrorHeader, EscapeButton } from './styles';
import { SectionSubheader } from 'components/Explore/styles';
import Link from 'next/link';
function CustomErrorComponent() {
  return (
    <ErrorWrapper>
      <ErrorHeader>Houston, we have a problem...</ErrorHeader>
      <SectionSubheader>Something went wrong.</SectionSubheader>
      <Link href="/explore">
        <EscapeButton>Escape to Explore</EscapeButton>
      </Link>
      <ErrorImage src="/images/500.webp" />
    </ErrorWrapper>
  );
}
export default CustomErrorComponent;
