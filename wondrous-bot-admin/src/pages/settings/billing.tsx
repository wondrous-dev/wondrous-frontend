import { useLazyQuery } from "@apollo/client";
import PageHeader from "components/PageHeader";
import { MenuSwitcher } from "components/Settings";
import BillingSettings from "components/Settings/Billing";
import TeamSettings from "components/Settings/TeamSettings";
import PageWrapper from "components/Shared/PageWrapper";
import { GET_ORG_SUBSCRIPTION } from "graphql/queries/subscription";
import { useContext, useEffect } from "react";
import { BG_TYPES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import SubscriptionContext from "utils/context/SubscriptionContext";

const SettingsPage = () => {
  return (
    <>
      <PageHeader title="Team Settings" />
      <PageWrapper
        bgType={BG_TYPES.DEFAULT}
        containerProps={{
          direction: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
          minHeight: "100vh",
          gap: "24px",
          padding: {
            xs: "14px 14px 120px 14px",
            sm: "24px 16px 150px 24px",
          },
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <MenuSwitcher />
        <BillingSettings />
      </PageWrapper>
    </>
  );
};

export default SettingsPage;