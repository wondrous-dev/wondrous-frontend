import { useLazyQuery } from '@apollo/client';
import Skeleton from '@mui/material/Skeleton';
import { SafeImage } from 'components/Common/Image';
import { GET_NFT_INFO, GET_TOKEN_INFO } from 'graphql/queries';
import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useGuildXyz from 'services/guildxyz';
import useOtterspace from 'services/otterspace';
import { convertIPFSUrl } from 'utils/helpers';

import palette from 'theme/palette';
import {
  AccessCondition,
  GuildAccessCondition,
  TokenGatingCondition,
  OtterspaceAccessCondition,
} from 'types/TokenGating';
import { ErrorText } from 'components/Common';
import TokenGateActionMenu from './TokenGatingActionMenu';

type Props = {
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  tokenGatingCondition: TokenGatingCondition;
};

function TokenGatingItem({ tokenGatingCondition, onEdit, onDelete, onClick }: Props) {
  const { getGuildById } = useGuildXyz();
  const { getBadgeSpec } = useOtterspace();
  const guildAccessCondition = tokenGatingCondition?.guildAccessCondition as GuildAccessCondition;
  const otterspaceAccessCondition = tokenGatingCondition?.otterspaceAccessCondition as OtterspaceAccessCondition;
  const tokenAccessCondition = tokenGatingCondition?.tokenAccessCondition?.[0] as AccessCondition;
  const [guildFetchError, setGuildFetchError] = useState(null);
  const [otterspaceFetchError, setOtterspaceFetchError] = useState(null);
  const [accessConditions, setAccessConditions] = useState<
    Array<{
      name: string;
      value: string;
      image?: string;
    }>
  >([]);
  console.log('accessConditions', accessConditions);
  const [getTokenInfo] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      setAccessConditions([
        {
          name: 'Chain',
          value: tokenAccessCondition.chain,
        },
        {
          name: 'Token',
          image: data?.getTokenInfo.logoUrl,
          value: data?.getTokenInfo.name || tokenAccessCondition.contractAddress,
        },
        {
          name: 'Min. amount to hold',
          value: tokenAccessCondition.minValue,
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
          value: tokenAccessCondition.chain,
        },
        {
          name: 'Token',
          image: data?.getNFTInfo.logoUrl,
          value: data?.getNFTInfo.name || tokenAccessCondition.contractAddress,
        },
        {
          name: 'Min. amount to hold',
          value: tokenAccessCondition.minValue,
        },
      ]);
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const fetchOtterspaceInfo = async () => {
      let badgeSpec;
      try {
        const res = await getBadgeSpec(otterspaceAccessCondition?.badgeSpecId);
        badgeSpec = res?.badgeSpec;
      } catch (e) {
        setOtterspaceFetchError('Guild not found, the guild might be deleted');
        return;
      }
      setAccessConditions([
        {
          image: convertIPFSUrl(badgeSpec?.metadata?.image),
          name: 'Badge',
          value: badgeSpec?.metadata?.name,
        },
      ]);
    };
    if (otterspaceAccessCondition) {
      fetchOtterspaceInfo();
    }
  }, [otterspaceAccessCondition]);

  useEffect(() => {
    const fetchGuildRole = async () => {
      let guild;
      try {
        guild = await getGuildById(guildAccessCondition?.guildId);
      } catch (e) {
        setGuildFetchError('Guild not found, the guild might be deleted');
        return;
      }
      const role = guild?.roles?.find((r) => r.id === Number(guildAccessCondition?.roleId));
      if (!role) {
        setGuildFetchError('Role might be deleted from guild');
      }
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

    if (guildAccessCondition?.roleId) {
      fetchGuildRole();
    }
  }, [guildAccessCondition?.roleId]);

  useEffect(() => {
    const getTokenDisplayInfo = async () => {
      const { contractAddress } = tokenAccessCondition;
      switch (tokenAccessCondition.type) {
        case 'ERC20':
          {
            getTokenInfo({
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
              },
            });
          }
          break;

        case 'ERC721':
          {
            getNFTInfo({
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
                tokenType: 'ERC721',
              },
            });
          }
          break;
        case 'ERC1155':
          {
            getNFTInfo({
              variables: {
                contractAddress,
                chain: tokenAccessCondition.chain,
                tokenType: 'ERC1155',
                tokenId: tokenAccessCondition.tokenIds?.[0],
              },
            });
          }
          break;
      }
    };

    if (tokenAccessCondition?.contractAddress) {
      getTokenDisplayInfo();
    }
  }, [tokenAccessCondition?.contractAddress]);
  console.log(accessConditions);
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
                  alt="Image"
                />
              ) : null}
              <Typography color="white" fontSize="15px" fontWeight={500} display="inline">
                {accessCondition.value}
              </Typography>
              {setGuildFetchError && <ErrorText>{guildFetchError}</ErrorText>}
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
