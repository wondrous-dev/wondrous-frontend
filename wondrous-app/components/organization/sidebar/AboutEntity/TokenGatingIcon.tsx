import Tooltip from 'components/Tooltip';
import { useTokenGating } from 'utils/hooks';
import { LockedIconOutline, LockIconOutline } from 'components/Icons/userpass';
import styled from 'styled-components';

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  gap: 10px;
  width: 28px;
  height: 28px;
  background: #313131;
  border-radius: 4px;
  cursor: pointer;
  :hover {
    background: #707070;
    filter: drop-shadow(0px 7px 7px rgba(0, 0, 0, 0.5));
  }
`;

const TokenGatingIcon = ({ orgId }) => {
  const [tokenGatingConditions] = useTokenGating(orgId);
  return (
    <Tooltip title="Token Gating" placement="top">
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
