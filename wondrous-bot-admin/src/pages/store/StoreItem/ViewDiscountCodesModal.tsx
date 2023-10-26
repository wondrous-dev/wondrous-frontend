import { Box, ClickAwayListener, Dialog, Grid, Typography } from "@mui/material";
import { useCallback, useContext, useMemo, useState } from "react";
import { SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { useLazyQuery } from "@apollo/client";
import useAlerts from "utils/hooks";
import { useEffect } from "react";
import { GET_ALL_STORE_ITEM_DISCOUNT_CODES, GET_STORE_ITEM_DISCOUNT_CODE_COUNT } from "graphql/queries";
import TableComponent from "components/TableComponent";
import ModalComponent from "@mui/material/Modal";
import ShareIcon from "components/Icons/Share";
import { NoBorderElement } from "components/TableComponent/styles";
import { LIMIT } from "utils/constants";
import { useInView } from "react-intersection-observer";
import { DISCOUNT_SCHEME } from "./DiscountCodeModal";

export const DISCOUNT_CODE_HEADERS = ["codes"];

const ViewDiscountCodeModalBody = ({ onClose, itemId }) => {
  const [getAllStoreItemDiscountCodes, { data: discountInfoData, error, fetchMore }] = useLazyQuery(
    GET_ALL_STORE_ITEM_DISCOUNT_CODES,
    {
      fetchPolicy: "cache-and-network",
    }
  );

  const [getStoreItemDiscountCodeCount, { data: discountCodeCountData }] = useLazyQuery(
    GET_STORE_ITEM_DISCOUNT_CODE_COUNT
  );
  const [hasMore, setHasMore] = useState(false);
  const [ref, inView] = useInView({});
  const discountInfo = discountInfoData?.getAllStoreItemDiscountCodes;

  useEffect(() => {
    if (itemId) {
      getAllStoreItemDiscountCodes({
        variables: {
          storeItemId: itemId,
        },
      }).then((results) => {
        setHasMore(results?.data?.getAllStoreItemDiscountCodes?.length >= LIMIT);
      });

      getStoreItemDiscountCodeCount({
        variables: {
          storeItemId: itemId,
        },
      });
    }
  }, [itemId]);

  const handleFetchMore = async () => {
    const res = await fetchMore({
      variables: {
        storeItemId: itemId,
        offset: discountInfo?.length,
        limit: LIMIT,
      },
    });
    setHasMore(res?.data?.getCmtyUsersLeaderboard?.length >= LIMIT);
  };

  useEffect(() => {
    if (inView && hasMore) {
      handleFetchMore();
    }
  }, [hasMore, inView]);
  const headers = ["Discount Code", "Used by", "Date used", "Discount"];
  const discountCodeCounts = discountCodeCountData?.getStoreItemDiscountCodeCount;

  const tableConfig = useMemo(() => {
    return discountInfo?.map((discountCode) => {
      return {
        id: discountCode?.id,
        code: {
          component: "label",
          value: discountCode?.code,
        },
        usedBy: {
          component: "label",
          value: discountCode?.receiver?.username,
        },
        dateUsed: {
          component: "label",
          value: discountCode?.deliverdAt,
        },
        discount: {
          component: "label",
          value:
            discountCode?.scheme === DISCOUNT_SCHEME[0].value
              ? `${discountCode?.discount}%`
              : `$${discountCode?.discount}`,
        },
      };
    });
  }, [discountInfo]);

  return (
    <Grid display="flex" flexDirection="column" gap="10px">
      <TableComponent
        data={tableConfig}
        headers={headers}
        paperComponent={NoBorderElement}
        title="View Discount Codes"
        tableRowStyle={{
          "&:nthChild(odd)": {
            background: "white",
          },
        }}
      />
      <div ref={ref} style={{ height: "1px" }} />
      <Box
        display="flex"
        gap="10px"
        alignItems="center"
        padding="16px"
        paddingTop="2px"
        boxSizing={"border-box"}
        width="100%"
      >
        <Typography fontFamily="Poppins" fontWeight={500}>
          {discountCodeCounts?.unavailableCount}/{discountCodeCounts?.totalCount} used
        </Typography>
        <div style={{ flex: 1 }} />
        <SharedSecondaryButton
          style={{
            radius: "6px",
            width: "fit-content",
          }}
          $reverse
          onClick={() => {
            onClose();
          }}
        >
          Cancel
        </SharedSecondaryButton>
        <SharedSecondaryButton
          style={{
            backgroundColor: "rgba(193, 182, 246, 1)",
            radius: "6px",
            width: "fit-content",
          }}
          onClick={() => {}}
        >
          <ShareIcon />
          Export CSV
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const ViewDiscountCodeModal = ({ openViewDiscounModal, setOpenViewDiscounModal, itemId }) => {
  return (
    <>
      <ModalComponent
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        open={openViewDiscounModal}
        onClose={() => setOpenViewDiscounModal(false)}
      >
        <Box
          maxHeight={"100vh"}
          maxWidth={"800px"}
          width={"100%"}
          borderRadius={"16px"}
          style={{
            backgroundColor: "white",
          }}
        >
          <ViewDiscountCodeModalBody onClose={() => setOpenViewDiscounModal(false)} itemId={itemId} />
        </Box>
      </ModalComponent>
    </>
  );
};

export default ViewDiscountCodeModal;
