import { Box, ButtonBase, Grid, Typography } from '@mui/material';
import Modal from 'components/Shared/Modal';
import { OrgProfilePicture } from 'components/Shared/ProjectProfilePicture';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GET_CMTY_ORG_DISCORD_CONFIG } from 'graphql/queries';
import GlobalContext from 'utils/context/GlobalContext';
import { useLazyQuery, useMutation } from '@apollo/client';
import { CONNECT_DISCORD_TO_CMTY_ORG } from 'graphql/mutations';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { GET_ORG_DISCORD_ROLES } from 'graphql/queries/discord';
import { Label } from 'components/CreateTemplate/styles';

const ChooseOrg = ({ handleClick, userOrgs, shouldBeVisible }) =>
  shouldBeVisible ? (
    <Grid display='flex' gap='10px' alignItems='center' flexWrap='wrap'>
      {userOrgs?.map((org, idx) => (
        <ButtonBase onClick={(e) => handleClick(e, org)}>
          <Grid
            key={idx}
            display='flex'
            padding='10px'
            flex='1 1 30%'
            height='100px'
            flexDirection='column'
            alignItems='center'
            justifyContent='center'
            sx={{
              cursor: 'pointer',
              '&:hover': {
                border: '1px solid black',
                borderRadius: '10px',
              },
            }}
          >
            <OrgProfilePicture
              profilePicture={org?.profilePicture}
              style={{
                width: '100px',
                height: '100px',
              }}
            />

            <Typography
              fontFamily='Poppins'
              fontWeight={600}
              fontSize='14px'
              color='#06040A'
            >
              {org?.name}
            </Typography>
          </Grid>
        </ButtonBase>
      ))}
    </Grid>
  ) : null;

const EnableConnect = ({
  cmtyOrgToEnable,
  setCmtyOrgToEnable,
  handleClickOnCmtyEnable,
  shouldBeVisible,
  handleGoBack,
}) =>
  shouldBeVisible ? (
    <Grid display='flex' flexDirection='column' gap='10px' width='10)%'>
      <Typography
        fontFamily='Poppins'
        fontWeight={600}
        fontSize='14px'
        color='#06040A'
      >
        Enable community bot for {cmtyOrgToEnable?.name}
      </Typography>
      <Box display='flex' gap='10px' alignItems='center' width='100%'>
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          $reverse
          onClick={handleGoBack}
        >
          Go back
        </SharedSecondaryButton>
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          onClick={handleClickOnCmtyEnable}
        >
          Enable
        </SharedSecondaryButton>
      </Box>
    </Grid>
  ) : null;

const PickGuild = ({ guilds, shouldBeVisible, setSelectedGuildId }) => {
  return (
    <>
      {shouldBeVisible ? (
        <Grid display='flex' flexDirection='column' gap='10px' width='10)%'>
          <Typography
            fontFamily='Poppins'
            fontWeight={600}
            fontSize='14px'
            color='#06040A'
          >
            Choose guild
          </Typography>
          <Grid display='flex' flexWrap='wrap' gap='6px'>
            {guilds?.map((guild, idx) => (
              <ButtonBase
                key={guild?.guildInfo?.guildName}
                onClick={() => {
                  setSelectedGuildId(guild?.guildId);
                }}
                sx={{
                  cursor: 'pointer',
                  background: 'white',
                  display: 'flex',
                  gap: '6px',
                  alignItems: 'center',
                  padding: '8px',
                  borderRadius: '6px',
                  '&:hover': {
                    background: '#F8AFDB',
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

                <Label color='black'>{guild?.guildInfo?.guildName}</Label>
              </ButtonBase>
            ))}
          </Grid>
        </Grid>
      ) : null}
    </>
  );
};

const OnboardingPage = () => {
  const { userOrgs, setActiveOrg } = useContext(GlobalContext);

  const [cmtyOrgToEnable, setCmtyOrgToEnable] = useState(null);
  const [getOrgDiscordConfig] = useLazyQuery(GET_CMTY_ORG_DISCORD_CONFIG);
  const [selectedGuildId, setSelectedGuildId] = useState(null);
  const [connectDiscordToCmtyOrg] = useMutation(CONNECT_DISCORD_TO_CMTY_ORG);
  const [getOrgDiscordRoles, { data: discordRolesData }] = useLazyQuery(
    GET_ORG_DISCORD_ROLES
  );
  const navigate = useNavigate();

  const isOneOrgOnly = userOrgs?.length === 1;

  const handleOrgSelect = async (e, org) => {
    try {
      const data = await getOrgDiscordConfig({ variables: { orgId: org.id } });
      if (!data?.data?.getCmtyOrgDiscordConfig) {
        try {
          const discordRolesData = await getOrgDiscordRoles({
            variables: { orgId: org?.id },
          });

          if (discordRolesData?.data?.getOrgDiscordRoles?.length === 1) {
            setSelectedGuildId(
              discordRolesData?.data?.getOrgDiscordRoles[0]?.id
            );
            return setCmtyOrgToEnable(org);
          }
        } catch (error) {
          console.log(error, 'ERROR');
        }

        return setCmtyOrgToEnable(org);
      } else {
        setActiveOrg(org);
        return navigate('/');
      }
    } catch (error) {
      console.log(error, 'ERROR');
    }
  };

  useEffect(() => {
    if (isOneOrgOnly) {
      handleOrgSelect(null, userOrgs[0]);
    }
  }, [isOneOrgOnly]);

  const handleClickOnCmtyEnable = async (e) => {
    const data = await connectDiscordToCmtyOrg({
      variables: {
        orgId: cmtyOrgToEnable?.id,

        guildId: selectedGuildId,
      },
    });

    if (data?.data?.connectDiscordToCmtyOrg) {
      setActiveOrg(cmtyOrgToEnable);
      return navigate('/');
    }
  };

  const handleGoBack = () => {
    setSelectedGuildId(null);
    if (isOneOrgOnly) {
      return;
    }
    return setCmtyOrgToEnable(null);
  };
  return (
    <Modal
      open
      onClose={() => navigate('/')}
      title={`${
        cmtyOrgToEnable
          ? `Enable ${cmtyOrgToEnable?.name}`
          : 'Enable community orgs'
      }`}
    >
      <ChooseOrg
        shouldBeVisible={!cmtyOrgToEnable && !selectedGuildId && !isOneOrgOnly}
        handleClick={handleOrgSelect}
        userOrgs={userOrgs}
      />
      <EnableConnect
        cmtyOrgToEnable={cmtyOrgToEnable}
        setCmtyOrgToEnable={setCmtyOrgToEnable}
        handleClickOnCmtyEnable={handleClickOnCmtyEnable}
        shouldBeVisible={cmtyOrgToEnable && selectedGuildId}
        handleGoBack={handleGoBack}
      />

      <PickGuild
        shouldBeVisible={cmtyOrgToEnable && !selectedGuildId}
        setSelectedGuildId={setSelectedGuildId}
        guilds={discordRolesData?.getOrgDiscordRoles}
      />
    </Modal>
  );
};

export default OnboardingPage;
