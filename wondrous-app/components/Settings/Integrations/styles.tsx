import styled from 'styled-components';
import { White } from '../../../theme/colors';
import { Button as MuiButton, InputBase, ListItemIcon, Typography } from '@material-ui/core';

export const IntegrationsContainer = styled.div`
  height: 100vh;
  width: 100%;
  max-width: 765px;
`;

export const TableValueText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
    font-height: 22px;
  }
`;

export const IntegrationsAddressInput = styled(InputBase)`
  && {
    max-width: 100%;
    height: 40px;
    border: 1px solid #4b4b4b;
    border-radius: 6px;
    margin-right: 16px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
  }
`;

export const IntegrationsInputsBlock = styled.div`
  padding: 30px 0;
  border-bottom: 1px solid #363636;
`;

export const IntegrationsSnapshotBlock = styled.div`
  width: 100%;
  height: min-content;
  display: flex;
  flex-direction: column;
`;


export const IntegrationsSnapshotSubBlock = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  overflow-wrap: wrap;
  justify-content: space-between;
`

export const IntegrationsSnapshotInputSubBlock = styled.div`
  width: calc(100% - 220px);
  min-width: 200px;
  display: flex;
  flex-direction: column;
  @media (max-width: 1096px) {
    width: 100%;
  }
`

export const IntegrationsSnapshotENSInput = styled(InputBase)`
  && {
    height: 40px;
    border: 1px solid #4b4b4b;
    border-radius: 6px;

    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
  }
`;

export const IntegrationsSnapshotHelperText = styled(Typography)`
  && {
    font-size: 12px;
    line-height: 15px;
    color: #c4c4c4;
    margin-bottom: 6px;
  }
`;

export const IntegrationsSnapshotButton = styled(MuiButton)`
  && {
    white-space: nowrap;
    min-width: min-content;
    padding: 8px 16px;
    height: 40px;
    background: #0f0f0f;
    border: 1px solid deepskyblue;
    margin-left: 10px;
    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
    .MuiCircularProgress-root {
      margin-right: 10px;
    }
    .Mui-disabled {
      color: #ffffff;
    }
    @media (max-width: 1096px) {
      margin-top: 10px;
      margin-left: 0;
    }
  }
`;


export const LabelBlock = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 10px;
  }
`;

export const LabelBlockText = styled(Typography)`
  && {
    color: ${White};
    font-family: Space Grotesk;
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

