import styled from 'styled-components';
import { useFocused, useSelected } from 'slate-react';

const MentionStyled = styled.span`
  display: inline-block;
  vertical-align: baseline;
  background-color: ${({ selected, focused }) => (selected && focused ? 'rgba(0, 186, 255, 0.2)' : 'transparent')};
  color: rgb(0, 186, 255);
  box-shadow: ${({ selected, focused }) => (selected && focused ? '0 1px 0 0 rgba(0, 186, 255, 0.2)' : 'none')};
`;

function SlashCommandElement({ attributes, children, element }) {
  const selected = useSelected();
  const focused = useFocused();
  return (
    <MentionStyled
      {...attributes}
      contentEditable={false}
      // data-cy={`slash-command-${element.initialValue.replace(' ', '-')}`}
      selected={selected}
      focused={focused}
    >
      {children}
    </MentionStyled>
  );
}

export default SlashCommandElement;
