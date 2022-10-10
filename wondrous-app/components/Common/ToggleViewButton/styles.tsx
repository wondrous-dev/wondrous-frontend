import styled from 'styled-components';
import palette from 'theme/palette';

export const ToggleViewWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border-radius: ${(props) => (props.showNewDesign ? '4px' : '6px')};
  padding: ${(props) => (props.showNewDesign ? '6px' : '4px 5px')};
  background: ${(props) => (props.showNewDesign ? palette.black92 : palette.black101)};
  height: ${(props) => (props.showNewDesign ? '40px' : 'auto')};
  width: fit-content;
  gap: 3px;
`;

export const ToggleViewOption = styled.div`
  /* height: 100%; */
  display: flex;
  color: ${palette.white};
  justify-content: center;
  align-items: center;
  padding: ${(props) => (props.showNewDesign ? '6px 25px' : '0')};

  &.active {
    background: ${(props) =>
      props.showNewDesign
        ? `linear-gradient(266.25deg, ${palette.highlightPurple} 17.75%, ${palette.highlightBlue} 106.75%)`
        : palette.background.default};
    opacity: 1;
    &:hover {
      background: #0f0f0f;
    }
  }

  &.disabled {
    pointer-events: none;
    opacity: 0.4;
  }

  padding: 8.5px;
  border-radius: ${(props) => (props.showNewDesign ? '4px' : '6px')};
  cursor: pointer;
  opacity: 0.4;

  &:hover {
    background: #232323;
  }
`;
