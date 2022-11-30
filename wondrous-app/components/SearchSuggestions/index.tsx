import { useRouter } from 'next/router';
import { Wrapper, Item, CheckedBox, IconWrapper } from './styles';

const SearchSuggestions = ({ show, setParentState = null }) => {
  const router = useRouter();
  const handleOnClick = (suggestion) => () => {
    setParentState && setParentState(false);
    router.push(`/search-result?suggestion=${suggestion}`);
  };
  return (
    <Wrapper show={show}>
      <Item onClick={handleOnClick('user-created-tasks')}>
        <IconWrapper>
          <CheckedBox />
        </IconWrapper>
        Tasks I've Created
      </Item>
    </Wrapper>
  );
};
export default SearchSuggestions;
