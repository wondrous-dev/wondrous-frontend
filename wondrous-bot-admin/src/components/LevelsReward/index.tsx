import { RoundedSecondaryButton } from 'components/Shared/styles';
import AddIcon from '@mui/icons-material/Add';
import { forwardRef, useContext, useState } from 'react';
import {
  Box,
  ButtonBase,
  ClickAwayListener,
  Grid,
  Popper,
  Typography,
} from '@mui/material';
import { useDiscordRoles } from 'utils/discord';
import GlobalContext from 'utils/context/GlobalContext';
import { Label } from 'components/CreateTemplate/styles';
import { StyledViewQuestResults } from 'components/ViewQuestResults/styles';
import { CloseIcon } from 'components/Shared/DatePicker/Icons';
import { useMutation } from '@apollo/client';
import { ADD_ORG_LEVEL_REWARD } from 'graphql/mutations';

interface ILevelsRewardProps {
  value?: any;
  setAnchorEl: (element: HTMLAnchorElement) => void;
}

const LevelsRewardViewOrAdd = forwardRef(
  ({ value, setAnchorEl }: ILevelsRewardProps, ref) => {
    if (!value || !value.length)
      return (
        <RoundedSecondaryButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          ref={ref}
          sx={{
            padding: '4px 8px !important',
            borderRadius: '6px !important',
          }}
        >
          <AddIcon
            sx={{
              color: 'black',
              fontSize: '22px',
            }}
          />
        </RoundedSecondaryButton>
      );

    return null;
  }
);

const LevelsReward = ({ value, onChange, roles, level }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  
  const { activeOrg } = useContext(GlobalContext);

  const [addOrgLevelReward] = useMutation(ADD_ORG_LEVEL_REWARD);

  const handleRemove = async () => {
    await addOrgLevelReward({
      variables: {
        input: {
          orgId: activeOrg.id,
          level: level,
          discordRewardData: {},
        },
      },
    });
    onChange({});
  };
  const handleMutation = async (params) => {
    if (!params) {
      return await handleRemove();
    }

    const { discordGuildId, discordRoleId } = params;
    await addOrgLevelReward({
      variables: {
        input: {
          orgId: activeOrg.id,
          level: level,
          discordRewardData: {
            discordRoleId,
            discordGuildId,
          },
        },
      },
    });
    onChange({
      discordRoleId,
      discordGuildId,
    });
  };

  if (Object.keys(value).length) {
    const allRoles = roles.map((role) => role.roles).flat();
    const selectedRole = allRoles.find(
      (item) => item.id === value.discordRoleId
    );
    return (
      <StyledViewQuestResults>
        <img
          src='/images/discord-official-logo.png'
          height='18px'
          width='18px'
          style={{
            borderRadius: '300px',
          }}
        />
        {selectedRole?.name}
        <ButtonBase onClick={() => handleMutation(null)}>
          <CloseIcon />
        </ButtonBase>
      </StyledViewQuestResults>
    );
  }
  return (
    <>
      <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
        <Box>
          <LevelsRewardViewOrAdd value={value} setAnchorEl={setAnchorEl} />
          <Popper open={!!anchorEl} anchorEl={anchorEl} placement='bottom'>
            <Grid
              bgcolor='white'
              border='1px solid #000000'
              boxShadow='0px 4px 4px rgba(0, 0, 0, 0.25)'
              borderRadius='6px'
              container
              width='300px'
              direction={'column'}
              gap='10px'
              maxHeight='500px'
              overflow='scroll'
              flexWrap='nowrap'
              padding='14px'
            >
              {/* <Box
                display='flex'
                gap='6px'
                alignItems='center'
                sx={{
                  cursor: 'pointer',
                }}
              > */}
                {/* <ButtonBase
                  sx={{
                    padding: '3px 5px',
                    borderRadius: '4px',
                    height: '18px',
                    width: '18px',
                    background: '#84bcff',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <AddIcon
                    sx={{
                      color: 'black',
                      fontSize: '12px',
                    }}
                  />
                </ButtonBase>
                <Typography
                  color='#2A8D5C'
                  fontFamily='Poppins'
                  fontWeight={500}
                  fontSize='14px'
                  lineHeight='14px'
                >
                  Add new reward
                </Typography> */}
              {/* </Box> */}
              {!roles?.length && <>
                <Typography
                  color='#2A8D5C'
                  fontFamily='Poppins'
                  fontWeight={500}
                  fontSize='14px'
                  lineHeight='14px'
                >
                  No discord roles found
                </Typography>
              </>}
              {roles?.map((role, idx) => {
                return (
                  <Box>
                    <Label>{role?.guildInfo?.guildName}</Label>
                    {role?.roles?.map((discordRole) => {
                      const isActive = value?.discordRoleId === discordRole.id;
                      return (
                        <Box
                          padding='8px'
                          onClick={() =>
                            // onChange({
                            //   discordGuildId: role?.guildId,
                            //   discordRoleId: discordRole.id,
                            // })
                            handleMutation({
                              discordGuildId: role?.guildId,
                              discordRoleId: discordRole.id,
                            })
                          }
                          display='flex'
                          alignItems='center'
                          gap='6px'
                          borderRadius='6px'
                          sx={{
                            cursor: 'pointer',
                            background: isActive ? '#c5c5c5' : 'white',
                            '&:hover': {
                              background: '#c5c5c5',
                            },
                          }}
                        >
                          <img
                            src='/images/discord-official-logo.png'
                            height='18px'
                            width='18px'
                            style={{
                              borderRadius: '300px',
                            }}
                          />
                          <Typography
                            fontFamily='Poppins'
                            fontSize='14px'
                            fontWeight={500}
                            color='black'
                          >
                            Role: {discordRole.name}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Box>
                );
              })}
            </Grid>
          </Popper>
        </Box>
      </ClickAwayListener>
    </>
  );
};

export default LevelsReward;
