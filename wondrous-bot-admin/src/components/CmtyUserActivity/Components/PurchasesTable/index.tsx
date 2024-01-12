import { Box, Grid } from "@mui/material";
import { SharedShowMoreButton } from "../shared";
import { PanelCount, PanelTitle } from "../shared/styles";
import TableComponent from "components/TableComponent";
import { Wrapper } from "./styles";

const PurchasesTable = () => {
  const handleShowMore = () => {};

  const headers = ["Product", "Price", "Deliverable", "Date"];

  const data = [
    {
      id: 1,
      name: {
        component: "label",
        value: "The Reverse Umbrella",
        textAlign: "left",
      },
      price: {
        component: "label",
        value: "2000",
        textAlign: "left",
      },
      deliverable: {
        component: "label",
        value: "NFT",
        textAlign: "left",
      },
      date: {
        component: "label",
        value: "10/10/2021",
        textAlign: "left",
      },
    },
    {
      id: 2,
      name: {
        component: "label",
        textAlign: "left",

        value: "The Reverse Umbrella",
      },
      price: {
        component: "label",
        textAlign: "left",

        value: "2000",
      },
      deliverable: {
        component: "label",
        value: "NFT",
        textAlign: "left",
      },
      date: {
        component: "label",
        value: "10/10/2021",
        textAlign: "left",
      },
    },
    {
      id: 3,
      name: {
        component: "label",
        value: "The Reverse Umbrella",
        textAlign: "left",
      },
      price: {
        component: "label",
        value: "2000",
        textAlign: "left",
      },
      deliverable: {
        component: "label",
        textAlign: "left",

        value: "NFT",
      },
      date: {
        component: "label",
        value: "10/10/2021",
        textAlign: "left",
      },
    },
    {
      id: 4,
      name: {
        component: "label",
        value: "The Reverse Umbrella",
        textAlign: "left",
      },
      price: {
        component: "label",
        value: "2000",
        textAlign: "left",
      },
      deliverable: {
        component: "label",
        value: "NFT",
        textAlign: "left",
      },
      date: {
        component: "label",
        textAlign: "left",

        value: "10/10/2021",
      },
    },
    {
      id: 5,
      name: {
        component: "label",
        value: "The Reverse Umbrella",
        textAlign: "left",
      },
      price: {
        component: "label",
        value: "2000",
        textAlign: "left",
      },
      deliverable: {
        component: "label",
        textAlign: "left",

        value: "NFT",
      },
      date: {
        component: "label",
        textAlign: "left",
        value: "10/10/2021",
      },
    },
  ];
  return (
    <Wrapper display="flex" flexDirection="column" gap="18px" width="100%">
      <Box display="flex" alignItems="center" gap="8px" justifyContent="flex-start">
        <PanelCount>
          <PanelTitle>32</PanelTitle>
        </PanelCount>
        <PanelTitle>purchases</PanelTitle>
      </Box>

      <TableComponent hideTitle headers={headers} data={data} title="Quest Activity" />
      <SharedShowMoreButton onClick={handleShowMore} />
    </Wrapper>
  );
};

export default PurchasesTable;
