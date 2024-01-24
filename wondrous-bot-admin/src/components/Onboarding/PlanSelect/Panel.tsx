import { Box, Grid, Typography } from "@mui/material";
import { SharedSecondaryButton } from "components/Shared/styles";
import { useNavigate } from "react-router-dom";

interface IProps {
  fullWidth?: boolean;
  title: string;
  img?: string;
  description: string;
  price?: number;
  onClick?: () => void;
  textColor: string;
  button?: () => JSX.Element;
  buttonTitle?: string;
  disabledButton?: boolean;
}
const Panel = ({
  fullWidth = false,
  title,
  img = null,
  description,
  price = null,
  onClick = null,
  textColor,
  button = null,
  buttonTitle = "Start 14-day Trial",
  disabledButton = false,
}: IProps) => {
  const navigate = useNavigate();

  return (
    <Grid
      flex="1"
      bgcolor="#FFF"
      borderRadius="16px"
      padding="24px 18px"
      gap={"18px"}
      display="flex"
      flexDirection="column"
      height="100%"
      position="relative"
      width={{
        xs: "100%",
        sm: fullWidth ? "100%" : "30%",
      }}
    >
      {img ? (
        <img
          src={img}
          style={{
            objectFit: "cover",
            width: "auto",
            marginBottom: "-20px",
          }}
        />
      ) : null}
      <Typography fontSize="24px" textAlign="center" fontWeight={600} color={textColor}>
        {title}
      </Typography>
      {description ? (
        <Typography color="#4D4D4D" fontSize="13px" fontWeight={500} textAlign="center" height="100%">
          {description}
        </Typography>
      ) : null}
      {button?.()}
      {!button ? (
        <Box
          display="flex"
          width="100%"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap="8px"
          flex="1"
        >
          <SharedSecondaryButton onClick={onClick} $reverse disabled={disabledButton}>
            {buttonTitle}
          </SharedSecondaryButton>
          <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column">
            <>
              <Typography
                color="#4D4D4D"
                fontSize="13px"
                sx={{
                  visibility: price ? "visibile" : "hidden",
                }}
              >
                <span style={{ fontWeight: 800, fontSize: "18px" }}>${price}</span> /month
              </Typography>
              <Typography fontSize="12px" alignItems="center" fontWeight={500} color="#4D4D4D">
                {!price ? "Custom pricing per server" : "No credit card required"}
              </Typography>
            </>
          </Box>
        </Box>
      ) : null}
    </Grid>
  );
};

export default Panel;
