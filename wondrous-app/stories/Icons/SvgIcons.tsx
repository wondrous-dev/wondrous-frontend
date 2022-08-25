import arrow from 'components/Icons/arrow.svg';
import attachFile from 'components/Icons/attachFile.svg';
import checkBox from 'components/Icons/checkBox.svg';
import checkBoxEmpty from 'components/Icons/checkBoxEmpty.svg';
import createPod from 'components/Icons/createPod.svg';
import createProposal from 'components/Icons/createProposal.svg';
import createTask from 'components/Icons/createTask.svg';
import errorField from 'components/Icons/errorField.svg';
import files from 'components/Icons/files.svg';
import linkIcon from 'components/Icons/linkIcon.svg';
import milestoneField from 'components/Icons/milestoneField.svg';
import milestoneNew from 'components/Icons/milestoneNew.svg';
import openInFull from 'components/Icons/openInFull.svg';
import pointsIcon from 'components/Icons/pointsIcon.svg';
import polygonMaticLogo from 'components/Icons/polygonMaticLogo.svg';
import privacyMembers from 'components/Icons/privacyMembers.svg';
import privacyPublic from 'components/Icons/privacyPublic.svg';
import rolesLock from 'components/Icons/rolesLock.svg';
import tokenGating from 'components/Icons/tokenGating.svg';
import createBounty from 'components/Icons/createBounty.svg';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import React from 'react';

const images = [
  arrow,
  attachFile,
  checkBox,
  checkBoxEmpty,
  createPod,
  createProposal,
  createTask,
  errorField,
  files,
  linkIcon,
  milestoneField,
  milestoneNew,
  openInFull,
  pointsIcon,
  polygonMaticLogo,
  privacyMembers,
  privacyPublic,
  rolesLock,
  tokenGating,
  createBounty,
];

const SVGIcons = () =>
  images.map((image) => (
    <Grid item key={image.src} sx={{ color: 'white', textAlign: 'center' }} xs={4}>
      <Box
        sx={{
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
        }}
      >
        <img src={image.src} style={{ height: '100%' }} />
      </Box>

      <Box sx={{ wordBreak: 'break-all' }}>{image.src.replace('static/media/', '')}</Box>
    </Grid>
  ));

export default SVGIcons as any;
