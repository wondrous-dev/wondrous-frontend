import styled from 'styled-components';
import { useFocused, useSelected } from 'slate-react';

const StyledLink = styled.span`
  color: rgb(0, 186, 255);
  text-decoration: none;
  background-color: ${({ selected, focused }) => (selected && focused ? 'rgba(0, 186, 255, 0.2)' : 'transparent')};
  box-shadow: ${({ selected, focused }) => (selected && focused ? '0 1px 0 0 deepskyblue' : 'none')};
`;

function LinkElement({ attributes, element, children }) {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <span>
      <StyledLink {...attributes} href={element.href} passHref selected={selected} focused={focused}>
        {children}
      </StyledLink>
    </span>
  );
}

export default LinkElement;
