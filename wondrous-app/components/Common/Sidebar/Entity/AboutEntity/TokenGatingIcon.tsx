import { toolTipStyle } from 'components/Common/Sidebar/Common/styles';
import { LockedIconOutline, LockIconOutline } from 'components/Icons/userpass';
import Tooltip from 'components/Tooltip';
import styled from 'styled-components';
import { useTokenGating } from 'utils/hooks';

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  gap: 10px;
  width: 28px;
  height: 28px;
  background: ${({ theme }) => theme.palette.grey87};
  border-radius: 4px;
  cursor: pointer;
  :hover {
    background: ${({ theme }) => theme.palette.grey58};
    filter: drop-shadow(0px 7px 7px rgba(0, 0, 0, 0.5));
  }
`;

const TokenGatingIcon = ({ orgId }) => {
  const [tokenGatingConditions] = useTokenGating(orgId);
  return (
    <Tooltip title="Token Gating" placement="top" style={toolTipStyle}>
      <IconWrapper>
        {tokenGatingConditions?.getTokenGatingConditionsForOrg?.length > 0 ? (
          <LockIconOutline />
        ) : (
          <LockedIconOutline />
        )}
      </IconWrapper>
    </Tooltip>
  );
};

export default TokenGatingIcon;
