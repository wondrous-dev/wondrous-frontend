import React from 'react';
import styled from 'styled-components';
import { Tabs } from '@mui/material';

export const StyledTabs = styled((props) => (
  <Tabs {...props} TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }} />
))({
  '&.MuiTabs-root': {
    marginTop: 30,
    width: 1037,
    margin: '0 auto',
  },
  '& .MuiTabs-flexContainer': {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: 680,
    margin: '0 auto',

    '& a': {
      textDecoration: 'none',
    },
  },
  '& .MuiButtonBase-root': {
    position: 'relative',
    width: 210,
    borderBottom: '2px solid #4B4B4B',

    // text
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '19px',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 210,
    width: '100%',
    backgroundColor: '#7427FF',
  },
});
