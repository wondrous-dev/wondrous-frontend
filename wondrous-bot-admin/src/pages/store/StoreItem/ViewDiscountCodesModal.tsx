import { Box, ClickAwayListener, Dialog, Grid, Typography } from "@mui/material";
import { useCallback, useContext, useMemo, useState } from "react";
import { SharedSecondaryButton } from "components/Shared/styles";
import Modal from "components/Shared/Modal";
import { useLazyQuery } from "@apollo/client";
import { format } from "date-fns";
import { useEffect } from "react";
import { GET_ALL_STORE_ITEM_DISCOUNT_CODES, GET_STORE_ITEM_DISCOUNT_CODE_COUNT } from "graphql/queries";
import TableComponent from "components/TableComponent";
import ModalComponent from "@mui/material/Modal";
import ShareIcon from "components/Icons/Share";
import { NoBorderElement } from "components/TableComponent/styles";
import { LIMIT } from "utils/constants";
import { useInView } from "react-intersection-observer";
import { DISCOUNT_SCHEME } from "./DiscountCodeModal";
import Spinner from "components/Shared/Spinner";

export const DISCOUNT_CODE_HEADERS = ["codes"];

export const exportStoreItemDiscountCodes = async ({
  getAllStoreItemDiscountCodes,
  storeItemId,
  storeItemSettings,
  setCSVExportLoading,
}) => {
  const headers = ["Discount Code", "Used By", "Date Used", "Discount"];
  setCSVExportLoading(true);
  const storeItemDiscountCodeData = await getAllStoreItemDiscountCodes({
    variables: {
      storeItemId,
      all: true,
    },
  });
  setCSVExportLoading(false);
  const storeItemDiscountCodes = storeItemDiscountCodeData?.data?.getAllStoreItemDiscountCodes;

  const rows = [[headers]];
  storeItemDiscountCodes.forEach((discountCode) => {
    const usedAt = discountCode?.deliveredAt ? format(new Date(discountCode?.deliveredAt), "yyyy-MM-dd") : "";
    const usedBy =
      discountCode?.receiver?.username ||
      discountCode?.receiver?.discordUsername ||
      discountCode?.receiver?.telegramUsername ||
      "";
    let finalArr = [
      discountCode?.code,
      usedBy,
      usedAt,
      discountCode?.scheme === DISCOUNT_SCHEME[0].value ? `${discountCode?.discount}%` : `$${discountCode?.discount}`,
    ];

    rows.push(finalArr);
  });
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach((rowArray) => {
    const row = rowArray.join(",");
    csvContent += `${row}\r\n`;
  });

  let encodedUri = encodeURI(csvContent);
  encodedUri = encodedUri.replace(/#/g, "%23");
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wonderverse_store_item_${storeItemSettings?.name}_data_.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};
const ViewDiscountCodeModalBody = ({
  onClose,
  itemId,
  storeItemSettings,
  hasMore,
  handleFetchMore,
  discountCodes,
  getAllStoreItemDiscountCodes,
}) => {
  const [CSVExportLoading, setCSVExportLoading] = useState(false);
  const [getStoreItemDiscountCodeCount, { data: discountCodeCountData }] = useLazyQuery(
    GET_STORE_ITEM_DISCOUNT_CODE_COUNT,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  const [ref, inView] = useInView({});

  useEffect(() => {
    if (itemId) {
      getStoreItemDiscountCodeCount({
        variables: {
          storeItemId: itemId,
        },
      });
    }
  }, [itemId]);

  useEffect(() => {
    if (inView && hasMore) {
      handleFetchMore();
    }
  }, [hasMore, inView]);
  const headers = ["Discount Code", "Used by", "Date used", "Discount"];
  const discountCodeCounts = discountCodeCountData?.getStoreItemDiscountCodeCount;

  const tableConfig = useMemo(() => {
    return discountCodes?.map((discountCode) => {
      const usedBy =
        discountCode?.receiver?.username ||
        discountCode?.receiver?.discordUsername ||
        discountCode?.receiver?.telegramUsername ||
        "";
      return {
        id: discountCode?.id,
        code: {
          component: "label",
          value: discountCode?.code,
        },
        usedBy: {
          component: "label",
          value: usedBy,
        },
        dateUsed: {
          component: "label",
          value: discountCode?.deliveredAt ? format(new Date(discountCode?.deliveredAt), "yyyy-MM-dd") : "",
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
  }, [discountCodes]);

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
          onClick={() => {
            exportStoreItemDiscountCodes({
              getAllStoreItemDiscountCodes,
              storeItemId: itemId,
              storeItemSettings,
              setCSVExportLoading,
            });
          }}
        >
          {CSVExportLoading ? (
            <Spinner />
          ) : (
            <>
              <ShareIcon />
              Export CSV
            </>
          )}
        </SharedSecondaryButton>
      </Box>
    </Grid>
  );
};
const ViewDiscountCodeModal = ({
  openViewDiscounModal,
  setOpenViewDiscounModal,
  itemId,
  storeItemSettings,
  hasMore,
  handleFetchMore,
  discountCodes,
  getAllStoreItemDiscountCodes,
}) => {
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
          <ViewDiscountCodeModalBody
            onClose={() => setOpenViewDiscounModal(false)}
            itemId={itemId}
            storeItemSettings={storeItemSettings}
            hasMore={hasMore}
            handleFetchMore={handleFetchMore}
            discountCodes={discountCodes}
            getAllStoreItemDiscountCodes={getAllStoreItemDiscountCodes}
          />
        </Box>
      </ModalComponent>
    </>
  );
};

export default ViewDiscountCodeModal;
