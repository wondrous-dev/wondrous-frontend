import { useRouter } from 'next/router';
import { useEffect, useRef, KeyboardEvent } from 'react';
import { Wrapper, Item, CheckedBox, IconWrapper } from './styles';

const SearchSuggestions = ({ show, onClose }) => {
  const router = useRouter();
  const handleOnClick = (suggestion) => () => {
    router.push(`/search-result?suggestion=${suggestion}`);
    onClose();
  };

  const handleKeydown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      handleOnClick('user-created-tasks')();
    }
  };

  const ref = useRef(null);

  useEffect(() => {
    if (show && ref.current) {
      ref.current.focus();
    }
  }, [show, ref]);

  return (
    <Wrapper show={show}>
      <Item onClick={handleOnClick('user-created-tasks')} onKeyDown={handleKeydown} tabIndex={0} ref={ref}>
        <IconWrapper>
          <CheckedBox />
        </IconWrapper>
        Tasks I've Created
      </Item>
    </Wrapper>
  );
};
export default SearchSuggestions;
