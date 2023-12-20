import { ButtonBase, Box, Typography } from "@mui/material";
import { useTour } from "@reactour/tour";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { ModalContent, ModalHeader, ModalTitle } from "components/Shared/Modal/styles";

const ContentComponent = ({ content = null, customComponent = null, wrapperProps = {}, typographyProps = {} }) => {
  const { setIsOpen } = useTour();

  const closeTour = () => setIsOpen(false);
  return (
    <ModalContent>
      <Box display="flex" justifyContent="center" alignItems="center" padding="24px" {...wrapperProps}>
        <Typography color="black" fontFamily="Poppins" fontSize="18px" fontWeight={600} lineHeight="24px" {...typographyProps}>
          {content}
        </Typography>
      </Box>
      {/* <ModalHeader bgColor="#FFEBDA">
        <ModalTitle color="black">{title}</ModalTitle>
        <ButtonBase onClick={closeTour}>
          <CloseIcon height="20px" width="20px" />
        </ButtonBase>
      </ModalHeader>
      <Grid padding="16px">{children}</Grid> */}
    </ModalContent>
  );
};

export default ContentComponent;
