import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { White } from '../../../../theme/colors';
export const DropMeHere = styled.div`
  margin: 1em 0 0 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  width: 100%;
  height: 100%;
  max-height: 400px;
  min-height: 300px;

  background: linear-gradient(180deg, #141414 0%, #151515 100%);
  border-radius: 6px;
  border: 1px dashed #4b4b4b;

  color: ${White};
`;

export const TaskListContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 100vh;
`;
export const TaskColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  max-width: 325px;
  width: 100%;
  margin-right: 12px;
  &:last-child {
    margin-right: 0;
  }
`;

export const TaskColumnContainerHeader = styled.div`
  width: 100%;
  height: 24px;
  display: flex;
  align-items: center;
`;

export const TaskColumnContainerHeaderTitle = styled(Typography)({
  '&.MuiTypography-body1': {
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'left',
    color: '#FFF',
  },
});

export const TaskColumnContainerCount = styled(Typography)`
  &.MuiTypography-body1 {
    color: #828282;
    margin-left: 10px;
    font-size: 14px;
  }
`;

export const TaskColumnDropContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
