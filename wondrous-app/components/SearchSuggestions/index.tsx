import { useRouter } from 'next/router';
import { SUGGESTIONS } from 'components/Spotlight/constants';
import { Wrapper, Item, CheckedBox, IconWrapper } from './styles';

const SearchSuggestions = ({ show, onClose, cursors, onCursorChange }) => {
  const router = useRouter();

  const handleOnClick = (suggestion) => {
    router.push(`/search-result?suggestion=${suggestion}`);
    onClose();
  };

  return (
    <Wrapper show={show}>
      {/* TODO: when we have multiple suggestions, we should map them here */}
      {SUGGESTIONS.map((suggestion, idx) => {
        const isActive = cursors?.child === idx;
        const { label, Icon, key } = suggestion;
        return (
          <Item
            isActive={isActive}
            onClick={() => handleOnClick(key)}
            onMouseEnter={() => onCursorChange({ parent: 0, child: idx })}
          >
            <IconWrapper isActive={isActive}>
              <Icon />
            </IconWrapper>
            {label}
          </Item>
        );
      })}
    </Wrapper>
  );
};
export default SearchSuggestions;
