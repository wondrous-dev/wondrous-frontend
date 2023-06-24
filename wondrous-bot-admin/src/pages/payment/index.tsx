import { useQuery, useLazyQuery } from "@apollo/client";
import { useState, useEffect } from "react";
import { Grid, Box } from "@mui/material";
import EmptyState from "components/EmptyState";
import PageHeader from "components/PageHeader";
import SelectComponent from "components/Shared/Select";
import ToggleComponent from "components/Shared/Toggle";
import { SharedSecondaryButton } from "components/Shared/styles";
import PaymentTable from "pages/payment/PaymentTable";
import { GET_UNPAID_CMTY_PAYMENTS_FOR_ORG } from "graphql/queries";
import { useContext, useMemo } from "react";
import { EMPTY_STATE_TYPES, LIMIT } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

const PaymentsPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const [paymentView, setPaymentView] = useState("unpaid");
  const [unpaidList, setUnpaidList] = useState([]);
  const [paidList, setPaidList] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [getUnpaidCmtyPaymentsForOrg, { fetchMore: fetchMoreUnpaid }] = useLazyQuery(
    GET_UNPAID_CMTY_PAYMENTS_FOR_ORG,
    {
      fetchPolicy: 'network-only',
    }
  );


  useEffect(() => {
    if (paymentView === 'unpaid') {
      getUnpaidCmtyPaymentsForOrg({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: LIMIT,
          },
        },
      }).then((result) => {
        const unpaidPayments = result?.data?.getUnpaidCmtyPaymentsForOrg;
        setUnpaidList(unpaidPayments || []);
        setHasMore(unpaidPayments?.length >= LIMIT);
      });
    } else if ( paymentView === 'paid') {
      // getPaymentsForOrg({
      //   variables: {
      //     input: {
      //       orgId,
      //       orgOnly: false, // TODO add toggle to see pod payments, default to false
      //       limit: LIMIT,
      //     },
      //   },
      // }).then((result) => {
      //   const payments = result?.data?.getPaymentsForOrg;
      //   setPaidList(payments || []);
      //   setHasMore(payments?.length >= LIMIT);
      // });
    } 
  }, [activeOrg?.id, paymentView]);

  const unpaidHeaders = ["Name", "Reward", "Chain", "Quest", "Date"];
  const paidHeaders = ["Name", "Reward", 'Link', "Quest", "Date"];
  const headers = paymentView === 'unpaid' ? unpaidHeaders : paidHeaders;
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

  return (
    <>
      <PageHeader
        title="Payments"
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%">
            {/* <Box minWidth="150px">
              <SelectComponent
                onChange={handleChange}
                value={'statuses'}
                options={SELECT_QUESTS_TYPE}
                background="#C1B6F6"
              />
            </Box> */}
            <Box>
              <ToggleComponent
                options={OPTIONS}
                onChange={(value) => setPaymentView(value)}
                value={paymentView}
                fullWidth
              />
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
        {unpaidList?.getCmtyUsersForOrg?.length ? (
          <PaymentTable data={unpaidList} headers={headers} />
        ) : (
          <EmptyState type={EMPTY_STATE_TYPES.MEMBERS} />
        )}
        {/* {data?.getCmtyUsersForOrg?.length >= LIMIT && (
          <SharedSecondaryButton
            style={{
              width: "fit-content",
              alignSelf: "center",
            }}
            onClick={() => {
              fetchMore({
                variables: {
                  input: {
                    orgId: activeOrg?.id,
                    limit: LIMIT,
                    offset: tableConfig?.length,
                  },
                },
                updateQuery: (prev, { fetchMoreResult }) => {
                  const getCmtyUsersForOrg = [...prev.getCmtyUsersForOrg, ...fetchMoreResult.getCmtyUsersForOrg];
                  return {
                    getCmtyUsersForOrg,
                  };
                },
              });
            }}
          >
            Show more
          </SharedSecondaryButton>
        )} */}
      </Grid>
    </>
  );
};

export default PaymentsPage;
