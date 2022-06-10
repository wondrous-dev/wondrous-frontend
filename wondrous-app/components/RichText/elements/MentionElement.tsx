import styled from 'styled-components';
import { useFocused, useSelected } from 'slate-react';

const MentionStyled = styled.span`
  display: inline-block;
  vertical-align: baseline;
  background-color: ${({ selected, focused }) => (selected && focused ? 'rgba(0, 186, 255, 0.2)' : 'transparent')};
  color: rgb(0, 186, 255);
  box-shadow: ${({ selected, focused }) => (selected && focused ? '0 1px 0 0 rgba(0, 186, 255, 0.2)' : 'none')};
`;

const MentionElement = ({ attributes, children, element }) => {
  const selected = useSelected();
  const focused = useFocused();

  return (
    <MentionStyled
      {...attributes}
      contentEditable={false}
      data-cy={`mention-${element.mentionable.replace(' ', '-')}`}
      selected={selected}
      focused={focused}
    >
      @{element.mentionable}
      {children}
    </MentionStyled>
  );
};

export default MentionElement;
