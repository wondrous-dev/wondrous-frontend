import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { Grid, Box } from "@mui/material";
import BillingInterval, { BillingIntervalValue } from "components/Pricing/BillingInterval";
import PricingOptionsList from "components/Pricing/PricingOptionsList";
import { useState } from "react";
import {
  BillingInfoContainer,
  BillingInfoHeader,
  BillingInfoHeaderText,
  BillingInfoUpdateLink,
  BillingInfoUpdateText,
} from "./styles";
import { useSubscription } from "utils/hooks";
import { useMe } from "components/Auth";

const STRIPE_MANAGE_SUBSCRIPTION_LINK = import.meta.env.VITE_PRODUCTION
  ? "https://billing.stripe.com/p/login/fZefYZfFDdyk6NG8ww"
  : "https://billing.stripe.com/p/login/test_3csbKGfr73hIg2QdQQ";
const BillingSettings = () => {
  const [billingInterval, setBillingInterval] = useState<BillingIntervalValue>(BillingIntervalValue.monthly);
  const subscription = useSubscription();
  const user = useMe()?.user;
  const userPurchasedSubscription = user?.id === subscription?.additionalData?.purchasedUserId;
  return (
    <Grid
      flex="1"
      width={{
        xs: "100%",
        sm: "70%",
      }}
    >
      <Box display="flex" marginBottom={"32px"} justifyContent="center">
        <BillingInterval onClick={setBillingInterval} selected={billingInterval} />
      </Box>
      {subscription && !userPurchasedSubscription && (
        <Box paddingLeft="16px" paddingRight="16px">
          <BillingInfoContainer
            style={{
              marginBottom: "24px",
            }}
          >
            <BillingInfoHeaderText
              style={{
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              Only the user account who purchased the subscription for this organization can update their account!
              Please contact us on our{" "}
              <a href="https://discord.com/invite/wonderverse-907435897568505866" target="_blank">
                Discord
              </a>{" "}
              if you want to change this.
            </BillingInfoHeaderText>
          </BillingInfoContainer>
        </Box>
      )}
      <PricingOptionsList billingInterval={billingInterval} settings={true} />
      {subscription && userPurchasedSubscription && (
        <Box paddingLeft="16px" paddingRight="16px">
          <BillingInfoContainer href={STRIPE_MANAGE_SUBSCRIPTION_LINK} target="_blank">
            <BillingInfoHeader>
              <BillingInfoHeaderText>Update Billing Information</BillingInfoHeaderText>
            </BillingInfoHeader>
            <BillingInfoUpdateText>
              Have any questions? Shoot us a message in our{" "}
              <BillingInfoUpdateLink href="https://discord.com/invite/wonderverse-907435897568505866" target="_blank">
                Discord
              </BillingInfoUpdateLink>
            </BillingInfoUpdateText>
            <BillingInfoUpdateText>
              Need to cancel your plan?{" "}
              <BillingInfoUpdateLink href={STRIPE_MANAGE_SUBSCRIPTION_LINK} target="_blank">
                Click here
              </BillingInfoUpdateLink>
            </BillingInfoUpdateText>
          </BillingInfoContainer>
        </Box>
      )}
    </Grid>
  );
};

export default BillingSettings;
