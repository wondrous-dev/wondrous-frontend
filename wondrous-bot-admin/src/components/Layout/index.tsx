import { useLazyQuery } from "@apollo/client";
import { withAuth } from "components/Auth";
import { Box, Grid, Typography } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_LOGGED_IN_USER_FULL_ACCESS_ORGS } from "graphql/queries";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useLocation } from "react-router-dom";
import { EXCLUDED_PATHS, LOCAL_STORAGE_ORG_ID_KEY, PAGES_WITHOUT_HEADER } from "utils/constants";
import { matchRoute } from "utils/common";
import ErrorCatcher from "components/ErrorCatcher";
import GlobalContext from "utils/context/GlobalContext";
import PageSpinner from "components/PageSpinner";
import Navbar from "components/NavigationBar";
import { Main } from "./styles";
import TutorialComponent from "components/TutorialComponent";
import { FeedbackButton } from "components/Feedback/button";
import { GET_ORG_SUBSCRIPTION } from "graphql/queries/subscription";
import SubscriptionContext from "utils/context/SubscriptionContext";
import TourDataProvider from "components/TutorialComponent/Tutorials/TourDataProvider";

const DefaultFallback = () => {
  const navigate = useNavigate();

  return (
    <Grid
      width="100%"
      height="100%"
      minWidth="100%"
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

const Layout = () => {
  const defaultActiveOrgId = localStorage.getItem(LOCAL_STORAGE_ORG_ID_KEY);
  const location = useLocation();
  const [activeOrg, setActiveOrg] = useState(null);
  const [getOrgSubscription, { data: orgSubscriptionData }] = useLazyQuery(GET_ORG_SUBSCRIPTION, {
    fetchPolicy: "cache-and-network",
  });

  useEffect(() => {
    if (activeOrg?.id) {
      getOrgSubscription({
        variables: {
          orgId: activeOrg?.id,
        },
      });
    }
  }, [activeOrg?.id, location.pathname]);
  const subscription = orgSubscriptionData?.getOrgSubscription;
  const isPageWithoutHeader = matchRoute(location.pathname, PAGES_WITHOUT_HEADER);

  const isExcludedPath = matchRoute(location.pathname, EXCLUDED_PATHS);
  const handleActiveOrg = (org) => {
    localStorage.setItem(LOCAL_STORAGE_ORG_ID_KEY, org?.id);
    setActiveOrg(org);
  };

  const navigate = useNavigate();
  const [getLoggedInUserFullAccessOrgs, { data: userOrgs, loading }] = useLazyQuery(
    GET_LOGGED_IN_USER_FULL_ACCESS_ORGS,
    {
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: true,
      onCompleted: ({ getLoggedInUserFullAccessOrgs }) => {
        if (getLoggedInUserFullAccessOrgs.length === 0) {
          navigate("/onboarding/welcome?ref=login");
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
    }
  );

  useEffect(() => {
    if (!isExcludedPath) {
      getLoggedInUserFullAccessOrgs({
        variables: {
          excludeSharedOrgs: true,
          cmtyEnabled: true,
        },
      });
    }
  }, [isExcludedPath]);

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
      <SubscriptionContext.Provider value={subscription?.status === "active" ? subscription : null}>
        <TutorialComponent>
          <TourDataProvider>
            {/* <FeedbackButton /> */}
            <Grid
              display="flex"
              width="100%"
              flexDirection={{
                xs: "column",
                md: "row",
              }}
            >
              {isPageWithoutHeader ? null : <Navbar />}
              <Main $isPageWithoutHeader={isPageWithoutHeader}>
                <ErrorCatcher fallback={({ reset }) => <DefaultFallback />}>
                  <AuthenticationLayout>
                    <Outlet />
                  </AuthenticationLayout>
                </ErrorCatcher>
              </Main>
            </Grid>
          </TourDataProvider>
        </TutorialComponent>
      </SubscriptionContext.Provider>
    </GlobalContext.Provider>
  );
};

export default Layout;
