import { Backdrop, Box, Grid, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import GradientHeading from 'components/GradientHeading';
import Modal from 'components/Modal';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { DAO_CATEGORIES } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { CONFIG, TYPES } from '../Shared/constants';
import { PageLabel } from '../Shared/styles';

const Summary = () => {
  const { orgData, setStep } = useOrgBoard();
  const router = useRouter();
  const items = [
    {
      label: 'Project title',
      value: orgData?.name,
    },
    {
      label: 'Username',
      value: `@${orgData?.username}`,
    },
    {
      divider: true,
    },
    {
      label: 'Project type',
      value: orgData?.category ? DAO_CATEGORIES[orgData?.category] : 'None yet',
    },
    {
      label: 'Twitter',
      value: orgData?.twitterUsername || 'Unset',
      type: 'connection',
      connected: orgData?.twitterUsername,
    },
    {
      label: 'Project Logo',
      value: orgData?.profilePicture || 'Unset',
      type: orgData?.profilePicture ? 'image' : 'text',
    },
    {
      label: 'Header',
      value: orgData?.headerPicture || 'Unset',
      type: orgData?.profilePicture ? 'image' : 'text',
    },
    {
      divider: true,
    },
    {
      label: 'Discord',
      display: true,
      type: 'connection',
      connected: orgData?.discordServerId,
    },
  ];

  const handleLaunchClick = () => {
    router.push(`/organization/${orgData?.username}/home`);
  };

  const handleClose = () => {
    setStep(CONFIG.findIndex((item) => item.type === TYPES.GUIDES));
  };

  return (
    <Backdrop
      open
      sx={{
        zIndex: '1000',
        background: 'linear-gradient(180deg, #7730d3 -5.04%, #1c0e94 26.14%, #151629 71.11%)',
        opacity: '0.6',
      }}
    >
      <Modal
        open
        onClose={handleClose}
        title="Confirm details"
        maxWidth={860}
        modalBodyStyle={{
          padding: '0px',
        }}
      >
        <Grid
          container
          direction={{
            xs: 'column-reverse',
            sm: 'row',
          }}
        >
          <Grid
            display="flex"
            flexDirection="column"
            width="100%"
            padding="24px"
            gap="12px"
            flexBasis={{
              xs: '100%',
              sm: '60%',
            }}
            height="500px"
          >
            {items.map((item, idx) => {
              if (item.divider) {
                return <Grid height="1px" width="100%" bgcolor={palette.grey79} key={idx} />;
              }
              if (!item.value && !item.display) {
                return null;
              }
              return (
                <Grid display="flex">
                  <PageLabel
                    sx={{
                      flexBasis: '30%',
                    }}
                    fontSize="13px"
                    fontWeight={500}
                  >
                    {item.label}
                  </PageLabel>
                  <Grid display="flex" gap="8px" alignItems="center">
                    {item.type === 'connection' ? (
                      <Typography
                        color={item.connected ? palette.green30 : palette.red300}
                        fontSize="12px"
                        fontWeight={500}
                        lineHeight="12px"
                        fontFamily={typography.fontFamily}
                      >
                        {item.connected ? 'Connected' : 'Not connected'}
                      </Typography>
                    ) : null}
                    {item.value ? (
                      <Box
                        maxHeight="28px"
                        bgcolor={palette.grey920}
                        borderRadius="6px"
                        padding="8px 4px"
                        display="flex"
                        gap="6px"
                        width="fit-content"
                        alignItems="center"
                      >
                        {item.type === 'image' ? (
                          <Box borderRadius="6px" height="24px" width="100%" overflow="hidden">
                            <SafeImage
                              alt="Org profile picture"
                              src={item.value}
                              style={{
                                height: '100%',
                                width: '100%',
                              }}
                            />
                          </Box>
                        ) : (
                          <Typography
                            color={palette.white}
                            fontWeight={500}
                            fontSize="13px"
                            lineHeight="13px"
                            fontFamily={typography.fontFamily}
                          >
                            {item.value}
                          </Typography>
                        )}
                      </Box>
                    ) : null}
                  </Grid>
                </Grid>
              );
            })}
          </Grid>
          <Grid
            bgcolor={palette.grey910}
            height="500px"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap="16px"
            padding="24px"
            flexBasis={{
              xs: '100%',
              sm: '40%',
            }}
          >
            <Grid
              display="flex"
              maxHeight={{
                sm: '30%',
              }}
              maxWidth={{
                xs: '50%',
                sm: 'auto',
              }}
            >
              <video width="100%" height="auto" autoPlay loop muted>
                <source src="/images/project-onboarding/spinning-hexagon.webm" type="video/webm" />
              </video>
            </Grid>
            <GradientHeading>Your project is ready for liftoff!</GradientHeading>
            <Typography
              color={palette.grey250}
              fontFamily={typography.fontFamily}
              lineHeight="24px"
              fontSize="15px"
              fontWeight={500}
            >
              Click launch project to get started. You can adjust your project details later.
            </Typography>
            <HeaderButton reversed onClick={handleLaunchClick}>
              Launch project
            </HeaderButton>
          </Grid>
        </Grid>
      </Modal>
    </Backdrop>
  );
};

export default Summary;
