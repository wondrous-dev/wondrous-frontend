import { Box, Grid, Typography } from "@mui/material";
import { SignupAuthLayout } from "components/Shared/AuthLayout";
import Panel from "./Panel";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useNavigate } from "react-router-dom";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import { useLazyQuery } from "@apollo/client";
import { GET_CHECKOUT_LINK } from "graphql/queries/subscription";
import useAlerts, { useGlobalContext } from "utils/hooks";
import PostHeaderGoogleTag from "components/GoogleTag/PostHeaderGoogleTag";
import PostBodyGoogleTag from "components/GoogleTag/PostBodyGoogleTag";
import InlineWorkspacePicker from "./InlineWorkspacePicker";

const PlanSelectComponent = () => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAutoHideDuration } = useAlerts();
  const { activeOrg } = useGlobalContext();

  const [getCheckoutLink, { loading }] = useLazyQuery(GET_CHECKOUT_LINK, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const url = data?.getCheckoutLink?.url;
      if (url) {
        window.location.href = url;
      }
    },
    onError: (err) => {
      setSnackbarAlertMessage("Something went wrong. Please try again");
      setSnackbarAlertOpen(true);
    },
  });

  const startTrial = (tier) => {
    getCheckoutLink({
      variables: {
        tier: tier,
        orgId: activeOrg?.id,
      },
    });
  };

  const handlePlanStart = () => navigate("/onboarding/finalize");

  const talkToSalesLink = "https://wonderverse.com/talk-to-sales";
  const config = [
    {
      title: PricingOptionsTitle.Hobby,
      color: "#FF9AD7",
      description: "Unlimited quests, reward in crypto, Twitter verification, analytics page, 2 admins",
      price: 10,
      onClick: () => startTrial("hobby"),
      disabledButton: loading,
      img: "/images/tour-images/levels-page.png",
    },
    {
      title: PricingOptionsTitle.Premium,
      color: "#2A8D5C",
      description: "Unlimited members, store, YouTube verification, custom branding, batch pay, on-chain verifications",
      price: 49,
      disabledButton: loading,
      onClick: () => startTrial("premium"),
      img: "/images/tour-images/members-page.png",
    },
    {
      title: "Ecosystem",
      color: "#F8642D",
      buttonTitle: "Talk to sales",
      description: "API access, NFT native minting, custom integrations, community consulting, unlimited admins",
      img: "/images/tour-images/quests-page.png",
      disabledButton: loading,
      onClick: () => {
        window.open(talkToSalesLink, "_blank");
        return handlePlanStart();
      },
    },
  ];

  const navigate = useNavigate();

  return (
    <SignupAuthLayout>
      <PostHeaderGoogleTag />
      <PostBodyGoogleTag />
      <Grid
        display="flex"
        flexDirection="column"
        width="100%"
        height="100%"
        gap="42px"
        paddingBottom="2rem"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          display="flex"
          gap="10px"
          justifyContent="center"
          alignItems="center"
          padding="42px 42px 0px 42px"
          flexDirection={{
            xs: "column",
            sm: "row",
          }}
        >
          <Typography
            fontSize={{
              xs: "28px",
              sm: "32px",
            }}
            fontWeight={600}
            color="white"
          >
            Select your plan for
          </Typography>
          <InlineWorkspacePicker />
        </Box>
        <Box
          display="flex"
          gap="18px"
          flexDirection="column"
          width={{
            xs: "80%",
            lg: "60%",
            xl: "50%",
          }}
        >
          <Panel
            textColor="#8D75FF"
            title="Free Plan"
            description="Simple rewards, one admin, up to 1,000 quest submissions"
            onClick={handlePlanStart}
            fullWidth
            button={() => (
              <Box width="100%" display="flex" justifyContent="center" alignItems="center">
                <SharedSecondaryButton onClick={handlePlanStart}>Start for Free</SharedSecondaryButton>
              </Box>
            )}
          />
          <Box
            display="flex"
            width="100%"
            gap="18px"
            flexDirection={{
              xs: "column",
              lg: "row",
            }}
          >
            {config.map((item, idx) => {
              return (
                <Panel
                  textColor={item.color}
                  title={item.title}
                  disabledButton={item.disabledButton}
                  description={item.description}
                  price={item.price}
                  img={item.img}
                  buttonTitle={item.buttonTitle}
                  onClick={item.onClick}
                />
              );
            })}
          </Box>
        </Box>
      </Grid>
    </SignupAuthLayout>
  );
};

export default PlanSelectComponent;
