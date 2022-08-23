import styled from 'styled-components';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { ButtonUnstyled, PopperUnstyled } from '@mui/base';
import { greyColors } from 'theme/colors';
import { ButtonGroupStyled, ButtonStyled } from 'components/Common/ButtonGroup/styles';
import { ErrorOutline, WarningOutlined } from '@mui/icons-material';
import { ListItem } from '@mui/material';
import CheckMarkIcon from 'components/Icons/checkMark';
import { InProgressCircleIcon, ToDoCircleIcon } from 'components/Icons/taskTypes';
import { CompletedIcon, InReviewIcon } from 'components/Icons/statusIcons';
import TaskStatus from 'components/Icons/TaskStatus';

export const CalendarViewContainer = styled.div`
  width: 100%;
  display: flex;
  border-top: 1px solid #343434;
  border-left: 1px solid #343434;
  border-right: 1px solid #343434;

  border-radius: 8px 8px 0px 0px;
  background-color: #161616;
`;

export const CalendarViewLabel = styled(Typography)`
  font-family: Space Grotesk;
  font-size: 14px;
  color: white;
  max-lines: 1;
`;

export const CalendarDayOfMonthLabel = styled(Typography)`
  font-family: Space Grotesk;
  font-size: 14px;
  color: white;
  background-color: #7427ff;
  border-radius: 4px;
  max-lines: 1;
  align-self: center;
`;
export const CalendarDayOfWeekLabel = styled(Typography)`
  font-family: Space Grotesk;
  font-size: 14px;
  color: white;
  background-color: #7427ff;
  border-radius: 4px;
  margin-right: 20px;
  margin-left: 20px;
  padding: 4px;
  max-lines: 1;
  align-self: center;
`;

export const CalendarTopBar = styled.div`
  margin-bottom: 8px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const CalendarTopBarLeftSide = styled.div`
  display: flex;
  flex-direction: row;

  justify-content: flex-start;
  align-items: center;
`;

export const CalendarRightArrowIcon = styled((props) => (
  <div {...props}>
    <CalendarLeftArrowIcon />
  </div>
))`
  margin-left: 4px;
  transform: rotate(180deg);
`;

export const CalendarViewStatusNotifier = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  background-color: #250069;
  border: 1px #4f00de solid;
  border-radius: 4px;
  padding: 8px;
  height: 36px;
`;

export const CalendarViewMonthDayToggle = styled(ButtonGroupStyled)`
  font-family: 'Space Grotesk';
  border-radius: 4px 4px 4px 0px;
  padding: 12px;
  background-color: ${greyColors.grey87};
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: left;
  height: 36px;
  :hover {
    cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  }
`;

export const CalendarViewWarningIcon = styled(ErrorOutline)`
  color: #ccbbff;
  margin-right: 10px;
`;

export const CalendarLeftArrowIcon = styled((props) => (
  <div {...props}>
    <LeftArrowIcon />
  </div>
))`
  align-items: center;
  display: flex;
  justify-content: center;
  justify-self: end;
  background-color: #1d1d1d;
  padding: 4px;
  border-radius: 5px;
  margin-left: 24px;
  svg {
    width: 30px;
    height: 30px;
    path {
      stroke: white;
    }
  }
`;

export const CalendarDayOfWeekBar = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-around;
  padding-top: 8px;
  padding-bottom: 8px;
  border-bottom: 0.5px solid #343434;
`;

export const CalendaListItem = styled(ListItem)`
  height: 35px;
  margin-top: 3px;
  border-radius: 4px;
  background-color: black;

  &:first-child {
    margin-top: 0;
  }

  &:hover {
    background: #1e1e1e;
    cursor: pointer;
  }
  ${({ toggle }) =>
    toggle &&
    `
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 4px;
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    padding: 1px;
  }
  `}
`;

export const CalendarViewWeekendIconCheckmark = styled(CheckMarkIcon)`
  width: 16px;
  height: 16px;
  padding: 2px;
  background-color: #7427ff;
  border-radius: 4px;
  margin-right: 16px;
  color: white;
`;

export const CalendarViewWeekendContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px;
`;

export const CalendarViewDayTopBar = styled.div`
  background-color: #232323;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-bottom: 4px;
`;

export const CalendarViewDayContainer = styled.div`
  background-color: #1d1d1d;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #343434;
  border-left: 0.5px solid #343434;
  border-right: 0.5px solid #343434;
  padding-top: ${(props) => (props.view === 'WEEK' ? '8px' : '0px')};
  margin-bottom: 0;
`;

export const CalendarViewDMonthContainer = styled.div`
  display: grid;
  grid-auto-flow: row;
  grid-template-columns: repeat(7, 1fr);
  grid-template-rows: ${(props) => (props.view === 'WEEK' ? 'repeat(1 , 1fr)' : 'repeat(6, 1fr)')};
  width: 100%;
  justify-content: start;
  height: 700px;
  margin-bottom: 0;
`;

export const CalendarViewTaskIcon = styled((props) => (
  <TaskStatus status={props.status} style={{ width: '20px', height: '20px', marginRight: '8px' }} />
))``;

export const CalendarViewTaskContainer = styled.div`
  margin-left: 8px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  &:hover {
    cursor: pointer;
  }
`;

export const CalendarViewTaskLabel = styled(Typography)`
  width: 100%;
  font-family: Space Grotesk;
  font-size: 12px;
  color: white;
  align-self: center;
  justify-self: center;
`;

export const CalendarViewTaskShowMore = styled(Typography)`
  font-family: Space Grotesk;
  font-size: 12px;
  color: ${palette.blue100};
  max-lines: 1;
  margin-left: 8px;
  &:hover {
    cursor: pointer;
  }
`;
