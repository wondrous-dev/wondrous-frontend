import { SyntheticEvent, useState } from 'react';
import { Grid, Typography } from '@mui/material';

import palette from 'theme/palette';
import typography from 'theme/typography';

import { capitalize } from 'utils/common';

import { StyledTab, StyledTabs } from './styles';

const TabLabel = ({ label, count, isActive }) => (
  <Grid sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
    <Typography
      sx={{
        color: isActive ? palette.white : palette.grey51,
        fontWeight: 500,
        fontFamily: typography.fontFamily,
        fontSize: '14px',
      }}
    >
      {label}
    </Typography>
    {!!count && (
      <Typography
        sx={{
          color: isActive ? palette.white : palette.grey51,
          background: isActive ? palette.grey87 : palette.grey87,
          padding: '2px',
          borderRadius: '4px',
          fontWeight: 500,
          fontFamily: typography.fontFamily,
          fontSize: '14px',
        }}
      >
        {count}
      </Typography>
    )}
  </Grid>
);

const Pods = (props) => {
  const { orgData } = props;

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const orgName = orgData?.name || orgData?.username;

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  return (
    <Grid sx={{ padding: '120px 0', margin: '0 auto', maxWidth: '720px' }}>
      <Typography sx={{ color: palette.white, fontWeight: 700, fontFamily: typography.fontFamily, fontSize: '24px' }}>
        Pods in {capitalize(orgName)}
      </Typography>

      <StyledTabs value={value} onChange={handleChange} sx={{}}>
        <StyledTab label={<TabLabel label="Show all" count={33} isActive={value === 0} />} {...a11yProps(0)} />
        <StyledTab label={<TabLabel label="Pods I’m in" count={6} isActive={value === 1} />} {...a11yProps(1)} />
        <StyledTab label={<TabLabel label="Pods I’m not in" count={27} isActive={value === 2} />} {...a11yProps(2)} />
      </StyledTabs>
    </Grid>
  );
};

export default Pods;
