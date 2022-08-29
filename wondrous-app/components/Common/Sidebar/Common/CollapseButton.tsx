import { ButtonBase } from '@mui/material';
import BackArrowIcon from 'components/Icons/backArrow';
import Tooltip from 'components/Tooltip';
import styled from 'styled-components';
import { useSideBar } from 'utils/hooks';
import { toolTipStyle } from './styles';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;

const Button = styled(ButtonBase)`
  && {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    background: transparent;
    border-radius: 50%;
    background: ${({ theme }) => theme.palette.black97};
  }
`;

const CollapseExpandButton = () => {
  const { setMinimized } = useSideBar();
  return (
    <Wrapper>
      <Tooltip style={toolTipStyle} title="Collapse Sidebar" placement="right">
        <Button onClick={() => setMinimized(true)}>
          <BackArrowIcon />
        </Button>
      </Tooltip>
    </Wrapper>
  );
};

export default CollapseExpandButton;
