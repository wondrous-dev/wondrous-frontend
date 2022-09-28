import { useRouter } from 'next/router';
import { Wrapper, Item, CheckedBox, IconWrapper } from './styles';

const SearchSuggestions = ({ show }) => {
  const router = useRouter();
  const handleOnClick = () => router.push('/search-result');
  return (
    <Wrapper show={show}>
      <Item onClick={handleOnClick}>
        <IconWrapper>
          <CheckedBox />
        </IconWrapper>
        Tasks I've Created
      </Item>
    </Wrapper>
  );
};
export default SearchSuggestions;
