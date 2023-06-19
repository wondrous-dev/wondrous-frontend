import { Grid } from "@mui/material";
import { ModalContent, ModalHeader, ModalTitle } from "components/Shared/Modal/styles";

const ContentComponent = ({ children, title }) => {
  return (
    <ModalContent>
      <ModalHeader>
        <ModalTitle>{title}</ModalTitle>
      </ModalHeader>
      <Grid padding="16px">{children}</Grid>
    </ModalContent>
  );
};

export default ContentComponent;
