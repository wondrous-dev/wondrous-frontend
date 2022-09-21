import styled from 'styled-components';
import palette from 'theme/palette';

export const SmallAvatarWrapper = styled.div`
  display: flex;
  align-self: flex-start;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  width: ${(props) => `${props.imageWidth}px` || '29px'};
  height: ${(props) => `${props.imageHeight}px` || '29px'};
  border-radius: 29px;
  box-shadow: 0 2px solid black;
  border: ${(props) => {
    if (props.border) {
      return props.border;
    }

    return props.isOwnerOfPod ? `2px solid ${palette.highlightBlue}` : '2px solid black';
  }};
  background-color: ${(props) => props.randomColor || palette.highlightBlue};
  ${(props) => (props.avatarURL ? `background: url(${props.avatarURL});` : '')}
  background-position: center;
  background-size: cover;

  font-size: 10px;
  color: ${palette.white};
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
