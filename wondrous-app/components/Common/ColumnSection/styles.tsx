import React, { useState } from 'react';
import styled from 'styled-components';
import { Collapse } from '@mui/material';

import { background, blackColors, greyColors } from 'theme/colors';

export const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-width: 324px;
  margin-top: 1em;
  width: 100%;
  background: #1b1b1b;
  border: 1px solid ${blackColors.black92}3C;

  border-radius: 3px;
`;

export const SectionHeaderContainer = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;

  cursor: pointer;

  padding: 7px 15px;
  background: ${blackColors.black92}3C;

  font-weight: 400;
  color: ${greyColors.grey250};
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
`;

export const SectionCount = styled.div`
  display: flex;

  margin-left: 10px;
  border-radius: 34px;
  padding: 3px 14px;

  font-size: 11px;
  font-weight: bold;

  background: ${background};
`;

export const SectionContainer = styled(Collapse)`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const SectionIconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: inherit;

  margin-right: 9px;
`;

export const SectionChevronContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: flext-end;

  transition: transform 0.2s;

  &.active {
    transform: rotate(180deg);
  }
`;
