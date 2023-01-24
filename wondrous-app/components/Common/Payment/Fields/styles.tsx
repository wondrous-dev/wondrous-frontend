import styled from 'styled-components';
import { Grid, Typography } from '@mui/material';
import typography from 'theme/typography';
import palette from 'theme/palette';
import { CreateFormMenuItemIcon, CreateFormSelectBlock } from 'components/Common/DropdownSelect/styles';

export const Label = styled(Typography)`
  && {
    font-size: 12px;
    font-family: ${typography.fontFamily};
    font-weight: 600;
    color: ${palette.blue20};
  }
`;

export const Wrapper = ({ label, children, gridStyle = {} }) => (
  <Grid display="flex" direction="column" gap="14px" alignItems="start" sx={gridStyle}>
    <Label>{label}</Label>
    {children}
  </Grid>
);

export const TokenWrapper = styled.div`
  background: ${palette.grey920};
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-family: ${typography.fontFamily};
  font-weight: 400;
  font-size: 13px;
  color: ${palette.white};
  width: 100%;
  border-radius: 6px;
  padding: 6px 6px 6px 12px;
  height: 32px;
  gap: 6px;
`;

export const PaymentMethodDropdown = styled.div`
  width: 100%;
  ${CreateFormMenuItemIcon} {
    svg {
      left: 2% !important;
    }
  }
`;

export const WalletMethodWrapper = styled.div`
  width: 100%;
  ${CreateFormSelectBlock} {
    height: 100%;
    max-width: 100%;
  }
`;
