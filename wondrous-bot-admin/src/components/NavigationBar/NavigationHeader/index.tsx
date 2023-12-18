import { Box, ButtonBase, Drawer } from "@mui/material";
import { Link } from "react-router-dom";
import { ImageDefault } from "../styles";
import { HeaderBar, MenuIconWrapper } from "./styles";
import { useState } from "react";
import { BOTTOM_LINKS, DrawerComponent, LinkItem } from "../shared";
import CloseIcon from "@mui/icons-material/Close";
import MenuIcon from "@mui/icons-material/Menu";
import { HEADER_HEIGHT } from "utils/constants";

const NavigationHeaderComponent = ({ links }) => {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleDrawer = () => setIsCollapsed((prev) => !prev);
  return (
    <>
      {/* <Drawer
        anchor="top"
        open={isDrawerOpen}
        ModalProps={{
          keepMounted: true,
        }}
        onClose={toggleDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            top: HEADER_HEIGHT,
            padding: "1rem",
          },
          display: {
            xs: "",
            md: "none",
          },
        }}
      > */}
      <Drawer
        // variant="persistent"
        // variant="persistent"
        open={!isCollapsed}
        anchor="top"
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          zIndex: 99,
        }}
      >
        <DrawerComponent links={links} toggleDrawer={toggleDrawer} isCollapsed={isCollapsed} />
      </Drawer>
      <HeaderBar>
        <Link to="/">
          <ImageDefault
            src="/wonder.svg"
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Link>
        <Box display="flex" alignItems="center" justifyContent="space-between" gap="14px">
          <Box display="flex" gap="14px">
            {BOTTOM_LINKS?.map((link, idx) => {
              return (
                <LinkItem item={link}>
                  <ButtonBase
                    type="button"
                    sx={{
                      borderRadius: "12px",
                      border: "1.1px solid #E7E7E7",
                      height: "42px",
                      width: "42px",
                      "&:focus-visibile": {
                        outline: "none",
                      },
                      "&:hover": {
                        borderColor: "#E7E7E7 !important",
                      },
                    }}
                  >
                    {link?.inactiveIcon ? <link.inactiveIcon /> : null}
                  </ButtonBase>
                </LinkItem>
              );
            })}
          </Box>
          <MenuIconWrapper onClick={toggleDrawer}>
            {!isCollapsed ? (
              <CloseIcon
                sx={{
                  color: "black",
                }}
              />
            ) : (
              <MenuIcon
                sx={{
                  color: "black",
                }}
              />
            )}
          </MenuIconWrapper>
        </Box>
      </HeaderBar>
    </>
  );
};
export default NavigationHeaderComponent;
