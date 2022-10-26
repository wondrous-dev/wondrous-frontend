import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Button } from 'components/Button';

export const MintStep = styled.div`
  display: flex;
  color: ${({ isActive }) => (isActive ? palette.white : palette.grey57)};
  font-family: ${typography.fontFamily};
  font-size: 15px;
  font-weight: 400;
  gap: 12px;
  align-items: center;
`;

export const CommunityShareWrapper = styled.div`
  display: flex;
  background: ${palette.black97};
  padding: 14px;
  color: ${palette.white};
  width: 100%;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
`;

export const ShareButton = styled(Button)`
  && {
    font-weight: 500;
    font-size: 15px;
    gap: 8px;
  }
`;
