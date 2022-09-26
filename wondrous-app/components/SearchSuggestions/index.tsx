import { Wrapper, Item, CheckedBox, IconWrapper } from './styles';

const SearchSuggestions = ({ show }) => (
  <>
    {show && (
      <Wrapper>
        <Item>
          <IconWrapper>
            <CheckedBox />
          </IconWrapper>
          Tasks I've Created
        </Item>
      </Wrapper>
    )}
  </>
);
export default SearchSuggestions;
