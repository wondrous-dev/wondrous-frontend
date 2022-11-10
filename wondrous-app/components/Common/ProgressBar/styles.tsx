import styled from 'styled-components';

export const ProgressBarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-itemms: flex-start;
  justify-content: flex-start;

  width: 100%;
  height: 5px;

  margin-top: 21px;
`;

export const ProgressBarMain = styled.div`
  display: flex;
  flex-grow: 1;
  height: 3px;

  border-radius: 10px;

  opacity: 0.2;

  background: #c4c4c4;
`;
export const ProgressBarValue = styled.div`
  display: flex;

  width: ${(props) => `${props.width}%`};
  height: 5px;
  margin-top: -1px;

  background: ${(props) =>
    props.color || 'linear-gradient(269.92deg, #FFFFFF -20.02%, #00BAFF -1.88%, #7000FF 57.38%);'};

  border-radius: 5px;
  ${({ color }) => color && `box-shadow: 2px 0 4px ${color}`}
`;
