import { useLazyQuery } from '@apollo/client';
import Skeleton from '@mui/material/Skeleton';
import { SafeImage } from 'components/Common/Image';
import { GET_NFT_INFO, GET_TOKEN_INFO } from 'graphql/queries';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useGuildXyz from 'services/guildxyz';

import palette from 'theme/palette';
import { AccessCondition, GuildAccessCondition, TokenGatingCondition } from 'types/TokenGating';
import TokenGateActionMenu from './TokenGatingActionMenu';

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  tokenGatingCondition: TokenGatingCondition;
};

function TokenGatingItem({ tokenGatingCondition, onEdit, onDelete, onClick }: Props) {
  const { getGuildById } = useGuildXyz();
  const guildAccessCondition = tokenGatingCondition?.accessCondition as GuildAccessCondition;
  const accessCondition = tokenGatingCondition?.accessCondition as AccessCondition;
  const [accessConditions, setAccessConditions] = useState<
    Array<{
      name: string;
      value: string;
      image?: string;
    }>
  >([]);

  const [getTokenInfo] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      setAccessConditions([
        {
          name: 'Chain',
          value: accessCondition.chain,
        },
        {
          name: 'Token',
          image: data?.getTokenInfo.logoUrl,
          value: data?.getTokenInfo.name || accessCondition.contractAddress,
        },
        {
          name: 'Min. amount to hold:',
          value: accessCondition.minValue,
        },
      ]);
    },
    fetchPolicy: 'network-only',
  });

  const [getNFTInfo] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      setAccessConditions([
        {
          name: 'Chain',
          value: accessCondition.chain,
        },
        {
          name: 'Token',
          image: data?.getNFTInfo.logoUrl,
          value: data?.getNFTInfo.name || accessCondition.contractAddress,
        },
        {
          name: 'Min. amount to hold:',
          value: accessCondition.minValue,
        },
      ]);
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const fetchGuildRole = async () => {
      const guild = await getGuildById(guildAccessCondition?.guildId);
      const role = guild.roles.find((r) => r.id === Number(guildAccessCondition.roleId));

      setAccessConditions([
        {
          name: 'Guild',
          value: guild.name,
        },
        {
          name: 'Role',
          value: role?.name,
        },
      ]);
    };

    if (guildAccessCondition.roleId) {
      fetchGuildRole();
    }
  }, [guildAccessCondition?.roleId]);

  useEffect(() => {
    const { contractAddress } = accessCondition;

    const getTokenDisplayInfo = async () => {
      switch (accessCondition.type) {
        case 'ERC20':
          {
            getTokenInfo({
              variables: {
                contractAddress,
                chain: accessCondition.chain,
              },
            });
          }
          break;

        case 'ERC721':
          {
            getNFTInfo({
              variables: {
                contractAddress,
              },
            });
          }
          break;
      }
    };

    if (accessCondition.contractAddress) {
      getTokenDisplayInfo();
    }
  }, [accessCondition.contractAddress]);

  return (
    <Box
      sx={{
        background: palette.black90,
        cursor: 'pointer',
        ':hover': {
          background: '#474747',
        },
      }}
      p="24px"
      mt="24px"
      borderRadius="6px"
      onClick={onClick}
    >
      <Grid container>
        <Grid item xs={6}>
          <Typography color="white" fontSize="15px" fontWeight="bold">
            {tokenGatingCondition.name}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <TokenGateActionMenu onEdit={onEdit} onDelete={onDelete} />
        </Grid>
      </Grid>

      <Grid gap="20px" mt="10px" container>
        {accessConditions.length ? (
          accessConditions.map((accessCondition) => (
            <Grid key={accessCondition.name + accessCondition.value} sx={{ display: 'flex' }} alignItems="center" item>
              <Typography color={palette.grey250} fontSize="15px" fontWeight={500} mr="8px" display="inline">
                {accessCondition.name}:
              </Typography>
              {accessCondition.image ? (
                <SafeImage
                  useNextImage={false}
                  src={accessCondition.image}
                  style={{
                    width: '29px',
                    height: '28px',
                    borderRadius: '4px',
                    marginRight: '5px',
                  }}
                />
              ) : null}
              <Typography color="white" fontSize="15px" fontWeight={500} display="inline">
                {accessCondition.value}
              </Typography>
            </Grid>
          ))
        ) : (
          <Skeleton variant="text" width={100} sx={{ backgroundColor: palette.grey850, fontSize: '20px' }} />
        )}
      </Grid>
    </Box>
  );
}

export default TokenGatingItem;
