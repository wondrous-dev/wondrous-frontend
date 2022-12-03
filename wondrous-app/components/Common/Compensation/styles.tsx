import Typography from '@mui/material/Typography';
import styled from 'styled-components';
import palette from 'theme/palette';

export const CompensationWrapper = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: flex-end;
  align-self: flex-end;

  svg {
    z-index: 10;
    height: 28px;
  }
`;

export const CompensationPill = styled.div`
  display: flex;
  align-items: center;
  min-width: 63px;
  flex-direction: row;
  justify-content: center;
  background: ${palette.grey85};
  border-radius: 25px;
  line-height: 28px;
  padding: 1px 1px 1px 8px;
  gap: 6px;
  margin-left: -5px;
  z-index: 0;
  height: 28px;
`;

export const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  height: 28px;
  border-radius: 28px;
  padding: 0;
  z-index: 2;
  margin-right: 4px;
`;

export const CompensationAmount = styled(Typography)`
  && {
    color: ${palette.white};
    font-weight: 600;
    font-size: 13px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    gap: 3px;
  }
`;
