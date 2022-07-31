import React, { useEffect } from 'react';

import { MainWrapper } from 'components/Onboarding/styles';
import { withAuth } from 'components/Auth/withAuth';
import { useMutation, useLazyQuery, useQuery } from '@apollo/client';

import { useGuildXyz } from 'services/guildxyz';

const ConnectTwitterPage = () => {
  const { getGuildsJoinedByAddress, getGuildsByIds } = useGuildXyz();
  const getAvailableGuildInfo = async (address: string) => {
    const guildsAndRoles = await getGuildsJoinedByAddress(address);
    var guildIds = guildsAndRoles?.map(function (data) {
      return data.guildId;
    });
    const guildsInfo = getGuildsByIds(guildIds);
    // get guild info for all guilds that and address joined
  };
  useEffect(() => {
    getAvailableGuildInfo('0x7f0b8c9B15828c606B205Fe653c2CDE0aA35c702');
  }, []);
  return (
    <MainWrapper>
      <h1>hii</h1>
    </MainWrapper>
  );
};

export default ConnectTwitterPage;
