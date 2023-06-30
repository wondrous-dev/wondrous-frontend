import { useState } from "react";
import { Grid, Box } from "@mui/material";
import EmptyState from "components/EmptyState";
import PageHeader from "components/PageHeader";
import { useContext } from "react";
import { EMPTY_STATE_TYPES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import TableComponent from "components/TableComponent";
import BatchPayments from "./BatchPayments";
import StatusSwitcher from "./StatusSwitcher";
import { SharedSecondaryButton } from "components/Shared/styles";
import { FilterPill } from "components/ViewQuestResults/styles";
import { exportSubmissionPaymentCsv } from "./utils";
import { useData, useTableComponents } from "./hooks";

const PaymentLedger = ({ questId = null }) => {
  const { activeOrg } = useContext(GlobalContext);
  const [tokenIds, setTokenIds] = useState({});
  const [selectedPayments, setSelectedPayments] = useState([]);

  const { hasMore, paymentView, items, hasLength, batchPaymentData, togglePaymentView, handleFetchMore } = useData({
    orgId: activeOrg?.id,
    questId,
  });

  const updatePaymentList = (paymentId, value) => {
    if (value) {
      setSelectedPayments((prev) => [...prev, paymentId]);
    } else {
      setSelectedPayments((prev) => prev.filter((id) => id !== paymentId));
    }
  };

  const itemsList = useTableComponents({
    paymentView,
    items,
    selectedPayments,
    tokenIds,
    updatePaymentList,
    setTokenIds,
  });

  const unpaidHeaders = [null, "Name", "Reward", "Chain", "Token ID", "Quest Title", "Date"];
  const paidHeaders = ["Name", "Reward", "Chain", "Link", "Quest Title", "Date"];

  const headers = paymentView === "unpaid" ? unpaidHeaders : paidHeaders;
  const OPTIONS = [
    {
      label: "Unpaid",
      value: "unpaid",
    },
    {
      label: "Processing",
      value: "processing",
    },
    {
      label: "Paid",
      value: "paid",
    },
  ];

  const handleCsvExport = () => {
    const data = items.filter((item) => selectedPayments.includes(item.id));
    return exportSubmissionPaymentCsv(data);
  };

  return (
    <>
      <PageHeader
        title="Payments"
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%">
            {hasLength && selectedPayments?.length ? (
              <FilterPill
                sx={{
                  color: "black",
                  background: "#E2E2E2 !important",
                  "&:hover": {
                    border: "1px solid",
                  },
                }}
                onClick={handleCsvExport}
              >
                Export payments to CSV
              </FilterPill>
            ) : null}
            <Box>
              <StatusSwitcher value={paymentView} onChange={(value) => togglePaymentView(value)} options={OPTIONS} />
            </Box>
          </Box>
        )}
      />
      <Grid
        minHeight="100vh"
        sx={{
          backgroundImage: "url(/images/members-bg.png)",
          backgroundPosition: "top",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        container
        direction="column"
        gap="42px"
        padding={{
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        }}
      >
        {hasLength ? (
          <TableComponent data={itemsList} headers={headers} />
        ) : (
          <EmptyState type={EMPTY_STATE_TYPES.PAYMENTS} />
        )}
        {selectedPayments?.length && paymentView === "unpaid" ? (
          <BatchPayments selectedPayments={selectedPayments} paymentData={batchPaymentData} tokenIds={tokenIds} />
        ) : null}

        {hasMore ? (
          <SharedSecondaryButton
            style={{
              width: "fit-content",
              alignSelf: "center",
            }}
            onClick={handleFetchMore}
          >
            Show more
          </SharedSecondaryButton>
        ) : null}
      </Grid>
    </>
  );
};

export default PaymentLedger;
