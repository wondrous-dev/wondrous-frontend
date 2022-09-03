import TokenGateActionMenu from 'components/Settings/TokenGating/TokenGatingConditionList/TokenGateActionMenu';
import React, { useEffect, useState } from 'react';

import useGuildXyz from 'services/guildxyz';
import { GuildAccessCondition, TokenGatingCondition } from 'types/TokenGating';

import {
  TokenGatingNameHeader,
  TokenGatingElementWrapper,
  TokenGateListItemDiv,
  TokenGatingHeaderLabel,
  TokenGateListDiv,
} from '../styles';

type Props = {
  tokenGatingCondition: TokenGatingCondition & { accessCondition: GuildAccessCondition };
};

function GuildConditionItem({ tokenGatingCondition }: Props) {
  const [guildName, setGuildName] = useState<string>(null);
  const [roleName, setRoleName] = useState<string>(null);
  const { getGuildById } = useGuildXyz();

  useEffect(() => {
    const populate = async () => {
      const guild = await getGuildById(tokenGatingCondition?.accessCondition?.guildId);
      const role = guild.roles.find((r) => r.id === Number(tokenGatingCondition.accessCondition.roleId));

      setGuildName(guild.name);
      setRoleName(role?.name);
    };

    populate();
  }, []);

  return (
    <TokenGatingElementWrapper>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TokenGatingNameHeader>{tokenGatingCondition.name}</TokenGatingNameHeader>
        <TokenGateActionMenu tokenGatingCondition={tokenGatingCondition} />
      </div>

      <TokenGateListDiv>
        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Guild:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>
            <span
              style={{
                textTransform: 'capitalize',
              }}
            >
              {guildName}
            </span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>

        <TokenGateListItemDiv>
          <TokenGatingHeaderLabel>Role:</TokenGatingHeaderLabel>
          <TokenGatingNameHeader>
            <span>{roleName}</span>
          </TokenGatingNameHeader>
        </TokenGateListItemDiv>
      </TokenGateListDiv>
    </TokenGatingElementWrapper>
  );
}

export default GuildConditionItem;
