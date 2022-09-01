import React, { useState } from 'react';
import { Typography } from '@mui/material';
import { createPortal } from 'react-dom';
import Grid from '@mui/material/Grid';
import { useQuery } from '@apollo/client';

import GradientHeading from 'components/GradientHeading';
import Divider from 'components/Divider';
import { Button } from 'components/Button';
import { GET_ORG_USERS } from 'graphql/queries';
import palette from 'theme/palette';

type Props = {
  onCancel: () => void;
  onSubmit: () => void | Promise<any>;
  footerRef: React.RefObject<HTMLDivElement>;
};

const Step3Confirmation = ({ onSubmit, onCancel, footerRef }: Props) => (
  <div>
    <GradientHeading fontSize={24} mb="20px">
      Confirm details
    </GradientHeading>

    <Typography color={palette.grey250}>
      Confirm your Project Collaboration details look right. Once you confirm, we will give you a link to send to their
      collaboration leader.
    </Typography>

    <Divider my="18px" />

    {footerRef.current
      ? createPortal(
          <Grid container gap="18px">
            <Button color="grey" onClick={onCancel}>
              Cancel
            </Button>
            <Button color="primary" type="submit" onClick={onSubmit}>
              Send invitation
            </Button>
          </Grid>,
          footerRef.current
        )
      : null}
  </div>
);

export default Step3Confirmation;
