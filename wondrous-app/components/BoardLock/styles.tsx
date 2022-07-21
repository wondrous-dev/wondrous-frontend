import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';
import Typography from '@mui/material/Typography';

export const BoardLockWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 2%;
  position: relative;
`;

export const BoardOverlay = styled.div`
  position: absolute;
  opacity: 0.9;
  background-color: ${palette.background.default};
  height: 100%;
  width: 100%;
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const OverlayPopup = styled.div`
  background: ${palette.black101};
  border: 1px solid ${palette.grey70};
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  gap: 38px;
  flex-direction: column;
  position: absolute;
  top: 10%;
`;

export const OverlayPopupTitle = styled(Typography)`
  font-family: ${typography.fontFamily};
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: ${palette.white};
`;
