import styled from 'styled-components';
import palette from 'theme/palette';

export const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  width: 100%;
  height: fit-content;
  position: relative;
  border-radius: 300px;
`;

export const ProgressBarMain = styled.div`
  background: ${palette.grey250};
  border-radius: inherit;
  display: flex;
  flex-grow: 1;
  height: 5px;
  left: 0;
  opacity: 0.2;
  position: absolute;
  top: 0;
  width: 100%;
`;

export const ProgressBarValue = styled.div`
  display: flex;
  width: ${(props) => `${props.width}%`};
  height: 5px;
  background: ${(props) =>
    props.color ||
    `linear-gradient(269.92deg, ${palette.white} -20.02%, ${palette.highlightBlue} -1.88%, ${palette.violet90} 57.38%) `};
  border-radius: inherit;
`;
