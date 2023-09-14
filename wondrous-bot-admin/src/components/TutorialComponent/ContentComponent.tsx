import { ButtonBase, Grid } from "@mui/material";
import { useTour } from "@reactour/tour";
import { CloseIcon } from "components/Shared/DatePicker/Icons";
import { ModalContent, ModalHeader, ModalTitle } from "components/Shared/Modal/styles";

const ContentComponent = ({ children, title }) => {
  const { setIsOpen } = useTour();

  const closeTour = () => setIsOpen(false);
  return (
    <ModalContent>
      <ModalHeader bgColor="#FFEBDA">
        <ModalTitle color="black">{title}</ModalTitle>
        <ButtonBase onClick={closeTour}>
          <CloseIcon height="20px" width="20px" />
        </ButtonBase>
      </ModalHeader>
      <Grid padding="16px">{children}</Grid>
    </ModalContent>
  );
};

export default ContentComponent;
