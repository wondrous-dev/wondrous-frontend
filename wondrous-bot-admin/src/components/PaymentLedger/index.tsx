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
import { StyledCheckbox } from "./styles";
import { StyledTableHeaderCell } from "components/TableComponent/styles";

const SelectAllComponent = ({ setSelectedPayments, batchPaymentData }) => {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Box display="flex" gap="6px" alignItems="center" width="100%">
      <StyledCheckbox
        style={{
          color: "white",
        }}
        checked={isChecked}
        onChange={(e) => {
          setIsChecked(!isChecked);
          if (!isChecked) {
            setSelectedPayments(batchPaymentData.map(({ id }) => id));
          } else {
            setSelectedPayments([]);
          }
        }}
      />
      <StyledTableHeaderCell
        style={{
          borderBottom: "none",
          width: "max-content",
          textAlign: "left",
          padding: "8px",
        }}
      >
        Select All
      </StyledTableHeaderCell>
    </Box>
  );
};
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
    setSelectedPayments,
    tokenIds,
    updatePaymentList,
    setTokenIds,
  });

  const unpaidHeaders = [
    <SelectAllComponent setSelectedPayments={setSelectedPayments} batchPaymentData={batchPaymentData} />,
    "Name",
    "Reward",
    "Chain",
    "Token ID",
    "Quest/Level Increase",
    "Date",
  ];
  const paidHeaders = ["Name", "Reward", "Chain", "Link", "Quest/Level Increase", "Date"];

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

  const handlePaymentView = (value) => {
    setSelectedPayments([]);
    togglePaymentView(value);
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
              <StatusSwitcher value={paymentView} onChange={handlePaymentView} options={OPTIONS} />
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
          <BatchPayments
            selectedPayments={selectedPayments}
            paymentData={batchPaymentData}
            tokenIds={tokenIds}
            onPaymentCompleted={(paymentIds) =>
              setSelectedPayments((prev) => prev.filter((id) => !paymentIds.includes(id)))
            }
          />
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
