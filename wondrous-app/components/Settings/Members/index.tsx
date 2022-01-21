import React, { useEffect, useState } from 'react';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { GET_ORG_ROLES, GET_ORG_USERS, GET_USER_ORGS } from '../../../graphql/queries/org';

import { SettingsWrapper } from '../settingsWrapper';
import { HeaderBlock } from '../headerBlock';
import UserCheckIcon from '../../Icons/userCheckIcon';
import Accordion from '../../Common/Accordion';
import Switch from '../../Common/Switch';
import { RolesContainer } from '../Roles/styles';

const Members = (props) => {
  return (
    <SettingsWrapper>
      <RolesContainer>
        <HeaderBlock icon={<UserCheckIcon circle />} title="Members" description="View and edit roles of members" />
      </RolesContainer>
    </SettingsWrapper>
  );
};

export default Members;
