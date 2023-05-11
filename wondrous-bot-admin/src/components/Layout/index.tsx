import { useQuery } from '@apollo/client';
import { Box, Grid, Typography } from '@mui/material';
import { EXCLUDED_PATHS, useMe, withAuth } from 'components/Auth';
import ErrorCatcher from 'components/ErrorCatcher';
import Navbar from 'components/Navbar';
import PageSpinner from 'components/PageSpinner';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { GET_LOGGED_IN_USER_FULL_ACCESS_ORGS } from 'graphql/queries';
import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { PAGES_WITHOUT_HEADER } from 'utils/constants';
import GlobalContext from 'utils/context/GlobalContext';
import { Main } from './styles';

const DefaultFallback = () => {
  const navigate = useNavigate();

  return (
    <Grid
      width='100%'
      height='100%'
      minWidth='100vw'
      minHeight='100vh'
      display='flex'
      flexDirection='column'
      justifyContent='center'
      alignItems='center'
      gap='24px'
    >
      <Typography
        fontFamily='Poppins'
        fontWeight='700'
        fontSize='62px'
        color='black'
      >
        Woops! Something went wrong
      </Typography>
      <Box display='flex' gap='10px' alignItems='center'>
        <SharedSecondaryButton onClick={() => navigate('/')}>
          Home
        </SharedSecondaryButton>
        <SharedSecondaryButton $reverse onClick={() => navigate('/login')}>
          Login
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const LOCAL_STORAGE_ORG_ID_KEY = 'default-org-id';
const Layout = () => {
  const defaultActiveOrgId = localStorage.getItem(LOCAL_STORAGE_ORG_ID_KEY);
  const location = useLocation();
  const [activeOrg, setActiveOrg] = useState(null);

  const user = useMe();
  const isPageWithoutHeader = PAGES_WITHOUT_HEADER.includes(location.pathname);

  const handleActiveOrg = (org) => {
    localStorage.setItem(LOCAL_STORAGE_ORG_ID_KEY, org?.id);
    setActiveOrg(org);
  };

  const { data: userOrgs, loading } = useQuery(
    GET_LOGGED_IN_USER_FULL_ACCESS_ORGS,
    {
      skip: isPageWithoutHeader,
      notifyOnNetworkStatusChange: true,
      variables: {
        excludeSharedOrgs: true,
        cmtyEnabled: true,
      },
      onCompleted: ({ getLoggedInUserFullAccessOrgs }) => {
        if (defaultActiveOrgId) {
          const org = getLoggedInUserFullAccessOrgs.find(
            (org) => org.id === defaultActiveOrgId
          );
          if (org) {
            handleActiveOrg(org);
            return;
          }
        }
        const newActiveOrg = getLoggedInUserFullAccessOrgs[0];
        handleActiveOrg(newActiveOrg);
      },
    }
  );

  if (loading) {
    return <PageSpinner />;
  }
  const AuthenticatedOutlet = EXCLUDED_PATHS.includes(location.pathname) ? Outlet : withAuth(Outlet);
  
  return (
    <GlobalContext.Provider
      value={{
        activeOrg,
        setActiveOrg: handleActiveOrg,
        userOrgs: userOrgs?.getLoggedInUserFullAccessOrgs || [],
      }}
    >
      {isPageWithoutHeader ? null : <Navbar />}
      <Main $isPageWithoutHeader={isPageWithoutHeader}>
        <ErrorCatcher fallback={({ reset }) => <DefaultFallback />}>
          <AuthenticatedOutlet />
        </ErrorCatcher>
      </Main>
    </GlobalContext.Provider>
  );
};

export default withAuth(Layout);
