import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import { ENTITIES_TYPES } from 'utils/constants';

import palette from 'theme/palette';
import typography from 'theme/typography';

export const entityStyling = {
  [ENTITIES_TYPES.PROPOSAL]: {
    style: 'min-width: 31%',
  },
};

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

  color: ${palette.white};
`;

export const TaskListContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: ${({ isMobile }) => (isMobile ? '' : '100vh')};
  margin-top: 1em;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  background: ${({ highlighted }) => (highlighted ? palette.grey90 : 'none')};
  border: ${({ highlighted }) => `1px solid ${highlighted ? palette.violet800 : 'transparent'}`};
`;

export const TaskColumnItemWrapper = styled.div`
  padding-bottom: 1em;

  &:last-of-type {
    padding-bottom: 0;
  }
`;

export const TaskColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  border-right: 1px solid #1b1b1b;
  padding: 0px 6px 0px 6px;
  box-sizing: content-box;
  /* No padding for before first and and after last columns, but all of them need to be same size */
  &:first-child {
    margin-left: -6px;
  }
  &:last-child {
    margin-right: -6px;
    border-right: 0;
  }
  ${({ activeEntityType }) => activeEntityType && entityStyling[activeEntityType]?.style}

  >div {
    box-sizing: border-box;
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
    marginLeft: '10px',
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

export const AISnackbarContainer = styled.div`
  background: ${palette.purple710};
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  margin-top: 24px;
  align-self: baseline;
  width: 100%;
  cursor: pointer;
`;

export const AISnackbarNewContainer = styled.div`
  background: ${palette.blue150};
  border-radius: 6px;
  padding: 2px 4px;
`;

export const AISnackbarText = styled(Typography)`
  && {
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 13px;
    color: ${palette.white};
  }
`;
