import { useMutation } from '@apollo/client';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import GradientHeading from 'components/GradientHeading';
import Modal from 'components/Modal';
import { FieldInput } from 'components/OnboardingDao/styles';
import { UPDATE_POD } from 'graphql/mutations';
import { useContext, useEffect, useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { usePodBoard } from 'utils/hooks';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { CreateEntityError } from 'components/CreateEntity/CreateEntityModal/styles';
import { ButtonsContainer } from 'components/Common/SidebarEntity/styles';
import Button from 'components/Button';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { useRouter } from 'next/router';

const GrantApplicationPodCreateModal = () => {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState(null);
  const [updatePod] = useMutation(UPDATE_POD);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const podBoard = usePodBoard();
  const router = useRouter();
  const { viewed } = router.query;

  const handleClose = () => {
    const query = {
      ...router.query,
    };
    delete query.viewed;
    router.push(
      {
        pathname: router.pathname,
        query,
      },
      undefined,
      { scroll: false, shallow: true }
    );
  };
  const handlePodNameUpdate = (name) =>
    name
      ? updatePod({
          variables: {
            podId: podBoard?.podId,
            input: {
              name,
            },
          },
        })
          .then(() => {
            setSnackbarAlertMessage('Pod name changed successfully!');
            setSnackbarAlertOpen(true);
            handleClose();
          })
          .catch(() => {
            setError('Pod name could not be changed');
          })
      : setError('Pod name is required');

  const handleInputChange = (e) => {
    if (error) setError(null);
    setInputValue(e.target.value);
  };

  const handleShareOnClick = () => {
    navigator.clipboard.writeText(`${window.location.href}`);
    setSnackbarAlertMessage('Link copied to clipboard!');
    setSnackbarAlertOpen(true);
  };

  return (
    <Modal open={!!viewed} maxWidth={560} onClose={handleClose} title="Grant Application Pod">
      <Grid gap="24px" display="flex" direction="column">
        <GradientHeading>Your grant application has been approved!</GradientHeading>
        <Typography fontFamily={typography.fontFamily} fontWeight={400} fontSize="13px" color={palette.grey600}>
          This is your grant workspace, you will add all of your work connected to this grant. This is required so your
          granter can see how the funds are being distributed.
        </Typography>

        <Grid display="flex" direction="column" gap="12px">
          <FieldInput onChange={handleInputChange} />
          {error ? <CreateEntityError>{error}</CreateEntityError> : null}
        </Grid>
        <ButtonsContainer
          direction="row"
          sx={{
            justifyContent: 'flex-end !important',
          }}
        >
          <Button
            onClick={handleShareOnClick}
            buttonTheme={{
              background: palette.grey75,
              borderColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              paddingX: 24,
              paddingY: 8,
              hover: {
                background: palette.grey76,
              },
            }}
          >
            Share
          </Button>
          <HeaderButton
            reversed
            style={{
              width: 'fit-content',
            }}
            onClick={() => {
              handlePodNameUpdate(inputValue);
            }}
          >
            Let's get to work
          </HeaderButton>
        </ButtonsContainer>
      </Grid>
    </Modal>
  );
};

export default GrantApplicationPodCreateModal;
