import { ButtonBase, Box, Typography } from "@mui/material";
import { useTour } from "@reactour/tour";
import { CloseIcon } from "components/Shared/DatePicker/Shared/Icons";
import { ModalContent, ModalHeader, ModalTitle } from "components/Shared/Modal/styles";

const ContentComponent = ({
  content = null,
  customComponent = null,
  wrapperProps = {},
  typographyProps = {},
  subHeader = null,
  children = null
}) => {
  const { setIsOpen } = useTour();

  return (
    <ModalContent>
      <Box display="flex" justifyContent="center" alignItems="center" padding="24px" gap="18px" flexDirection="column" {...wrapperProps}>
        <Typography
          color="black"
          fontFamily="Poppins"
          fontSize="18px"
          fontWeight={600}
          lineHeight="24px"
          maxWidth="85%"
          {...typographyProps}
        >
          {content}
        </Typography>
        {subHeader ? (
          <Typography color="black" fontFamily="Poppins" fontSize="15px" fontWeight={500} lineHeight="28px" maxWidth="85%">
            {subHeader}
          </Typography>
        ) : null}
        {children}
      </Box>
    </ModalContent>
  );
};

export default ContentComponent;
