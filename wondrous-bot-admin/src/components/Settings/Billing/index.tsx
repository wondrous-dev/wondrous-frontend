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

const STRIPE_MANAGE_SUBSCRIPTION_LINK = "https://billing.stripe.com/p/login/fZefYZfFDdyk6NG8ww";
const BillingSettings = () => {
  const [billingInterval, setBillingInterval] = useState<BillingIntervalValue>(BillingIntervalValue.monthly);
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
      <PricingOptionsList billingInterval={billingInterval} settings={true} />
      <BillingInfoContainer href={STRIPE_MANAGE_SUBSCRIPTION_LINK} target="_blank">
        <BillingInfoHeader>
          <BillingInfoHeaderText>Update Billing Information</BillingInfoHeaderText>
        </BillingInfoHeader>
        <BillingInfoUpdateText>
          Have any questions? Shoot us a message in our{" "}
          <BillingInfoUpdateLink href="https://discord.gg/wonderverse-xyz" target="_blank">
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
    </Grid>
  );
};

export default BillingSettings;
