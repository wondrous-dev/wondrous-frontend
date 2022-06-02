import styled from 'styled-components';
import { highlightBlue, white } from 'theme/colors';

export const SmallAvatarWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: 29px;
  height: 29px;
  border-radius: 29px;
  box-shadow: 0 2px solid black;
  border: ${(props) => (props.isOwnerOfPod ? '2px solid ' + highlightBlue : '2px solid black')};
  background-color: ${(props) => props.randomColor || highlightBlue};
  ${(props) => (props.avatarURL ? 'background: url(' + props.avatarURL + ');' : '')}
  background-position: center;
  background-size: cover;

  font-size: 10px;
  color: ${white};
  font-weight: 700;
`;

export const SmallAvatarContainer = styled.div`
  margin-left: -6px;
  :first-child {
    margin-left: 0;
  }
`;

export const AvatarListWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) => props.align || 'flex-start'};
  flex-grow: 1;
  /* margin-left: 16px; */
`;
