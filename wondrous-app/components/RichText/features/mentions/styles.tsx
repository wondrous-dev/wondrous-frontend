import styled from 'styled-components';

export const MentionsContainer = styled.div`
  min-width: 150px;
  font-size: inherit;
  border-radius: 8px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  box-shadow: 0px 24px 42px rgba(0, 0, 0, 0.55);
  z-index: 1000;

  ${({ shown }) => (shown ? 'display: block;' : 'display: none;')}
`;

export const MentionItem = styled.div`
  display: flex;
  padding: 8px;
  align-items: center;
  border-radius: 8px;
  background: linear-gradient(rgb(30, 30, 30) 0%, rgb(20, 20, 20) 100%);
  cursor: pointer;

  ${({ active }) => {
    if (active) {
      return `
        box-shadow: inset 0px 0px 0px 1px deepskyblue;
      `;
    }
  }}

  &:hover {
    background: linear-gradient(rgb(40, 40, 40) 0%, rgb(20, 20, 20) 100%);
  }
`;

export const MentionItemText = styled.div`
  margin-left: 8px;
`;
