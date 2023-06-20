import { useLazyQuery } from "@apollo/client";
import { withAuth } from "components/Auth";
import { Box, Grid, Typography } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_LOGGED_IN_USER_FULL_ACCESS_ORGS } from "graphql/queries";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { EXCLUDED_PATHS, PAGES_WITHOUT_HEADER } from "utils/constants";
import { matchRoute } from "utils/common";
import ErrorCatcher from "components/ErrorCatcher";
import GlobalContext from "utils/context/GlobalContext";
import PageSpinner from "components/PageSpinner";
import Navbar from "components/Navbar";
import { Main } from "./styles";
import TutorialComponent from "components/TutorialComponent";

const DefaultFallback = () => {
  const navigate = useNavigate();

  return (
    <Grid
      width="100%"
      height="100%"
      minWidth="100vw"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap="24px"
    >
      <Typography fontFamily="Poppins" fontWeight="700" fontSize="62px" color="black">
        Woops! Something went wrong
      </Typography>
      <Box display="flex" gap="10px" alignItems="center">
        <SharedSecondaryButton onClick={() => navigate("/")}>Home</SharedSecondaryButton>
        <SharedSecondaryButton $reverse onClick={() => navigate("/login")}>
          Login
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};

const LOCAL_STORAGE_ORG_ID_KEY = "default-org-id";
const Layout = () => {
  const defaultActiveOrgId = localStorage.getItem(LOCAL_STORAGE_ORG_ID_KEY);
  const location = useLocation();
  const [activeOrg, setActiveOrg] = useState(null);

  const isPageWithoutHeader = matchRoute(location.pathname, PAGES_WITHOUT_HEADER);

  const handleActiveOrg = (org) => {
    localStorage.setItem(LOCAL_STORAGE_ORG_ID_KEY, org?.id);
    setActiveOrg(org);
  };

  const navigate = useNavigate();
  const [getLoggedInUserFullAccessOrgs, { data: userOrgs, loading }] = useLazyQuery(
    GET_LOGGED_IN_USER_FULL_ACCESS_ORGS,
    {
      fetchPolicy: 'no-cache',
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ getLoggedInUserFullAccessOrgs }) => {
        if (getLoggedInUserFullAccessOrgs.length === 0) {
          navigate("/onboarding");
          return;
        }
        if (defaultActiveOrgId) {
          const org = getLoggedInUserFullAccessOrgs.find((org) => org.id === defaultActiveOrgId);
          if (org) {
            handleActiveOrg(org);
            return;
          }
        }
        const newActiveOrg = getLoggedInUserFullAccessOrgs[0];
        handleActiveOrg(newActiveOrg);
    },
  });

  useEffect(() => {
    if (!isPageWithoutHeader) {
      getLoggedInUserFullAccessOrgs({
        variables: {
          excludeSharedOrgs: true,
          cmtyEnabled: true,
        },
      });
    }
  }, [isPageWithoutHeader]);

  if (loading) {
    return <PageSpinner />;
  }
  
  const isMatchedAuthPath = matchRoute(location.pathname, EXCLUDED_PATHS);
  const AuthenticationLayout = isMatchedAuthPath ? TutorialComponent : withAuth(TutorialComponent);

  return (
    <GlobalContext.Provider
      value={{
        activeOrg,
        setActiveOrg: handleActiveOrg,
        userOrgs: userOrgs?.getLoggedInUserFullAccessOrgs || [],
      }}
    >
      <TutorialComponent>
      {isPageWithoutHeader ? null : <Navbar />}
      <Main $isPageWithoutHeader={isPageWithoutHeader}>
        <ErrorCatcher fallback={({ reset }) => <DefaultFallback />}>
          <AuthenticationLayout>
            <Outlet />
          </AuthenticationLayout>
        </ErrorCatcher>
      </Main>
      </TutorialComponent>
    </GlobalContext.Provider>
  );
};

export default Layout;
