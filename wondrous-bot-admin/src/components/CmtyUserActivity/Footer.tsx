import { Box, Typography } from "@mui/material";
import { FooterBar, HeaderBar } from "./styles";

const FooterComponent = () => {
  const LINKS = [
    {
      label: "Terms of Service",
      link: "https://wonderverse.com/terms-of-service",
    },
    {
      label: "Privacy",
      link: "https://wonderverse.com/privacy-policy",
    },
    {
      label: "Help",
      link: "https://wonderverse.gitbook.io/wonder-communities/",
    },
  ];
  return (
    <FooterBar>
      <Box padding="24px" display="flex" justifyContent="flex-end" alignItems="center" gap="24px">
        {LINKS.map(({ label, link }) => {
          return (
            <a href={link} target="_blank" key={link}>
              <Typography
                color="#363636"
                fontWeight={500}
                lineHeight="10px"
                sx={{
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
                fontSize={{
                  xs: "13px",
                  xl: "15px",
                }}
              >
                {label}
              </Typography>
            </a>
          );
        })}
      </Box>
    </FooterBar>
  );
};

export default FooterComponent;
