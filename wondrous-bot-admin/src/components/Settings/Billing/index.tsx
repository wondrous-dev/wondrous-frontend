import { useMutation, useLazyQuery, useQuery } from "@apollo/client";
import { Grid, Box } from "@mui/material";
import BillingInterval, { BillingIntervalValue } from "components/Pricing/BillingInterval";
import PricingOptionsList from "components/Pricing/PricingOptionsList";
import { useState } from "react";

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
      <Box display="flex" marginBottom={"20px"} justifyContent="center">
        <BillingInterval onClick={setBillingInterval} selected={billingInterval} />
      </Box>
      <PricingOptionsList billingInterval={billingInterval} settings={true} />
    </Grid>
  );
};

export default BillingSettings;
