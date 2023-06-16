import { Typography } from "@mui/material";
import styled from "styled-components";

export const CopyContainer = styled.div`
  height: 28px;
  padding: 5px 5px 5px 5px;
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const InviteMemberContainer = styled.div`
  background: white;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  padding: 22px;
`;

export const AdminUsernameText = styled(Typography)`
  && {
    font-family: Poppins;
    font-weight: 600;
    font-size: 13px;
  }
`;
