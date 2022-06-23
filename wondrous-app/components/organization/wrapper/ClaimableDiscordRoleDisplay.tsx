import {
  TokenGatedRoleTitle,
  TokenGatedRoleWrapper,
  TokenGatedRoleDescription,
  ClaimRoleButton,
  ClaimRoleLabel,
  RoleActionWrapper,
} from './styles';
import apollo from 'services/apollo';
import { useRouter } from 'next/router';

import { CLAIM_ORG_ROLE_BY_DISCORD_ROLE } from 'graphql/mutations';

const ClaimableDiscordRoleDisplay = (props) => {
  const router = useRouter();

  const { role } = props;
  const handleClaimClick = async () => {
    const confirmed = confirm(`Are you sure you want to claim ${role.name}`)
    if (!confirmed) {
      return
    }
    if (role.__typename === 'OrgRole') {
      try {
        await apollo.mutate({
          mutation: CLAIM_ORG_ROLE_BY_DISCORD_ROLE,
          variables: {
            orgRoleId: role?.id,
          },
        });
      } catch (e) {
        console.error(e);
      }
      router.reload();
    }
    if (role.__typename === 'PodRole') {
    }
  };
  return (
    <TokenGatedRoleWrapper>
      <div>
        <TokenGatedRoleTitle>{role?.name}</TokenGatedRoleTitle>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <TokenGatedRoleDescription>Dicord role name: {role?.discordRolesInfo[0]?.name}</TokenGatedRoleDescription>
        </div>
      </div>
      <RoleActionWrapper>
        <ClaimRoleButton onClick={handleClaimClick}>
          <ClaimRoleLabel>Claim Role</ClaimRoleLabel>
        </ClaimRoleButton>
      </RoleActionWrapper>
    </TokenGatedRoleWrapper>
  );
};

export default ClaimableDiscordRoleDisplay;
