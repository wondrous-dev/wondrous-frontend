import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { White } from '../../../theme/colors';
import { Button } from '../button';
import PlusIcon from '../../Icons/plus';
import { Task } from '../Task';
import { TaskWrapper, TaskInner } from '../Task/styles';
import { TaskMedia } from '../MediaPlayer';

export const Subtask = styled.div`
  width: 100%;
`;

export const SubtaskHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px;
  background: #0f0f0f;
  border-radius: 6px;
`;

export const SubtaskCompletedWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 45%;
`;

export const LabelWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const Label = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 13px;
    font-style: normal;
    font-weight: 400;
    color: ${White};
    margin-left: 8px;
  }
`;

export const CreateSubtaskButton = styled(Button)`
  && {
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);

    button {
      background: #0f0f0f;
      font-family: 'Space Grotesk';
      font-size: 15px;
      font-style: normal;
      font-weight: 500;
      padding: 8px;
    }
  }
`;

export const StyledPlusIcon = styled(PlusIcon)`
  width: 12px;
  height: 12px;
`;

export const CreateSubtaskIcon = styled.div`
  background: linear-gradient(0deg, #141414 0%, #474747 219.88%, rgba(20, 20, 20, 0) 219.9%);
  padding: 9px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

// https://www.designcise.com/web/tutorial/why-is-styled-components-styled-wrapper-not-working-with-existing-react-component
export const SubtaskTask = styled(Task)`
  ${TaskWrapper} {
    padding: 0;
  }
  ${TaskInner} {
    background: #0f0f0f;
    text-align: left;
  }
`;
