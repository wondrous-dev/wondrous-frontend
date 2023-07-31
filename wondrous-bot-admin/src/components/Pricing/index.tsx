import { Box, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import BillingInterval, { BillingIntervalValue } from "./BillingInterval";
import PricingOptionsList from "./PricingOptionsList";
import { useNavigate } from "react-router-dom";
import { BillingInfoContainer, BillingInfoHeaderText } from "components/Settings/Billing/styles";
import { useSubscription } from "utils/hooks";
import { useMe } from "components/Auth";

const PricingComponent = () => {
  const navigate = useNavigate();
  const [billingInterval, setBillingInterval] = useState<BillingIntervalValue>(BillingIntervalValue.monthly);
  const height = {
    xs: "100%",
    md: "100vh",
  };
  const subscription = useSubscription();
  const user = useMe()?.user;
  const userPurchasedSubscription = user?.id === subscription?.additionalData?.purchasedUserId;
  return (
    <>
      <Grid
        container
        gap="14px"
        width="100%"
        display="flex"
        flexDirection="column"
        alignItems="center"
        marginTop="50px"
      >
        <Typography fontSize="32px" color="#06040A" fontWeight="600" fontFamily="Poppins, sans-serif" lineHeight="0.7">
          Pricing
        </Typography>
        <Typography
          color="#000000"
          fontSize="14px"
          fontWeight="600"
          fontFamily="Space Grotesk, sans-serif"
          textAlign="center"
        >
          Upgrade your community with our premium features
        </Typography>
        <BillingInterval onClick={setBillingInterval} selected={billingInterval} />
        {subscription && !userPurchasedSubscription && (
          <Box paddingLeft="16px" paddingRight="16px">
            <BillingInfoContainer
              style={{
                marginBottom: "16px",
                background: "#2A8D5C",
                maxWidth: "1200px",
              }}
            >
              <BillingInfoHeaderText
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "white",
                }}
              >
                There's already a subscription associated with this organization! Only the user account who purchased
                the subscription can update their account. Please contact us our on{" "}
                <a
                  style={{ color: "white", textDecoration: "underline" }}
                  href="https://discord.gg/wonderverse-xyz"
                  target="_blank"
                >
                  Discord
                </a>{" "}
                if you want to change this.
              </BillingInfoHeaderText>
            </BillingInfoContainer>
          </Box>
        )}
      </Grid>
      <Box
        width="100%"
        display="flex"
        justifyContent="center"
        position="relative"
        marginTop="32px"
        sx={{
          height,
        }}
      >
        <PricingOptionsList billingInterval={billingInterval} />
        <Box
          sx={{
            position: "absolute",
            backgroundImage: "url(/images/pricing-bg.png)",
            backgroundPosition: "center",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            height,
            zIndex: 0,
            bottom: 0,
            top: 50,
            left: 0,
            right: 0,
          }}
        />
      </Box>
    </>
  );
};

export default PricingComponent;
