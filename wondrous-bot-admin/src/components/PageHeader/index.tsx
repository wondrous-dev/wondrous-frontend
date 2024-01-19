import { ButtonBase, Grid, Typography } from "@mui/material";
import WestIcon from "@mui/icons-material/West";
import { Box } from "@mui/system";
import { useNavigate } from "react-router-dom";
const PageHeader = ({
  title = "New Quest",
  withBackButton = true,
  renderActions = null,
  titleComponent = null,
  onBackButtonClick = null,
  backButtonProps = {},
}) => {
  const navigate = useNavigate();

  const handleBackButton = () => {
    onBackButtonClick ? onBackButtonClick?.() : navigate(-1);
  };

  return (
    <Grid
      display="flex"
      alignItems={{
        xs: "flex-start",
        sm: "center",
      }}
      justifyContent="space-between"
      width="100%"
      gap="10px"
      paddingTop="46px"
      paddingBottom="34px"
      paddingLeft={{
        xs: "14px",
        sm: "56px",
      }}
      flexDirection={{
        xs: "column",
        sm: "row",
      }}
      paddingRight={{
        xs: "14px",
        sm: "56px",
      }}
    >
      <Grid display="flex" alignItems="center" gap="14px">
        {withBackButton ? (
          <ButtonBase onClick={handleBackButton} {...backButtonProps}>
            <Box
              height="40px"
              width="40px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="#2A8D5C"
              borderRadius="35px"
            >
              <WestIcon
                sx={{
                  color: "white",
                }}
              />
            </Box>
          </ButtonBase>
        ) : null}
        {titleComponent ? (
          titleComponent()
        ) : (
          <Typography
            fontFamily="Poppins"
            fontWeight={600}
            fontSize="28px"
            lineHeight="32px"
            color="black"
            whiteSpace="nowrap"
          >
            {title}
          </Typography>
        )}
      </Grid>
      {renderActions ? (
        <Grid display="flex" gap="14px" alignItems="center">
          {renderActions()}
        </Grid>
      ) : null}
    </Grid>
  );
};

export default PageHeader;
