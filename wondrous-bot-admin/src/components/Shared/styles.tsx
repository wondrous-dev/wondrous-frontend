import styled, { css } from "styled-components";
import { Link } from "react-router-dom";
import { greyColors } from "utils/theme/colors";
import { ButtonBase, Grid, TextField, Typography } from "@mui/material";

export const DefaultLink = styled(Link)`
  && {
    color: ${greyColors.grey10};
    font-size: 14px;
    font-weight: 500;
  }
`;

export const SharedButton = styled(ButtonBase)`
  && {
    background: #000000;
    border-radius: 35px;
    padding: 8px 24px;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    color: #ffffff;
  }
`;

export const StyledSwitch = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
  background: ${({ checked }) => (checked ? "#C1B6F6" : "#ABABAB")};
  border-radius: 32px;
  transition: 300ms all;

  &:before {
    transition: 300ms all;
    content: "";
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 35px;
    top: 50%;
    left: 2px;
    background: white;
    transform: ${({ checked }) => (checked ? "translate(26px, -50%)" : "translate(0px, -50%)")};
  }
`;

export const ToggleWrapper = styled(Grid)`
  && {
    height: 32px;
    padding: 4px;
    background: #ebebeb;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${({ fullWidth }) => (fullWidth ? "100%" : "200px")};
  }
`;

export const ToggleItem = styled(Grid)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    background: ${({ checked }) => (checked ? "#f8642d" : "transparent")};
    border-radius: 4px;
    max-height: 24px;
    padding: 6px;
    cursor: pointer;
    width: 100%;
  }
`;

export const ButtonIconWrapper = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #c6bbfc;
    gap: 6px;
    border-radius: 6px;

    height: ${({ height = "30px" }) => height};

    width: ${({ width = "30px" }) => width};
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const StyledTextFieldSelect = styled(TextField)`
  && {
    height: 40px;
    max-width: 100%;
    width: 100%;
    min-width: 100px;
    display: flex;
    justify-content: center;
    background: ${({ background }) => background || "#e8e8e8"};
    border-radius: 6px;

    .MuiInputBase-input {
      padding: 6px 6px 6px 10px;
      padding-right: 32px;
      font-family: "Poppins";
    }
    .MuiOutlinedInput-notchedOutline {
      border: none;
    }
  }
`;

const ReversedButtonCss = css`
  background: white;
  border: 2px solid #84bcff;
`;
export const SharedSecondaryButton = styled(ButtonBase)`
  && {
    display: flex;
    padding: ${({ padding = "8px 24px" }) => padding};
    gap: 10px;
    height: ${({ height = "40px" }) => height};
    min-width: ${({ minWidth = "40px" }) => minWidth};
    width: ${({ width = "auto" }) => width};
    background: ${({ background }) => background || "#84bcff"};
    border-radius: ${({ borderRadius = "35px" }) => borderRadius};
    font-family: "Poppins";
    font-style: normal;
    font-weight: ${({ fontWeight = 600 }) => fontWeight};
    font-size: 15px;
    line-height: 150%;
    white-space: nowrap;
    color: ${({ color = "#0c002d" }) => color};
    border: 1px solid transparent;

    &:disabled {
      opacity: 0.5;
    }
    &:focus {
      outline: none;
    }
    ${({ $reverse }) => ($reverse ? ReversedButtonCss : ``)}
    &:hover {
      border: 1px solid black;
    }
  }
`;

export const SharedBlackOutlineButton = styled(ButtonBase)`
  && {
    display: flex;
    padding: 8px 24px;
    gap: 10px;
    height: ${({ height = "34px" }) => height};
    min-width: ${({ minWidth = "40px" }) => minWidth};
    width: ${({ width = "auto" }) => width};
    background: ${({ background }) => background || "#FFFFF"};
    border-radius: ${({ borderRadius = "6px" }) => borderRadius};
    border: 1px solid ${({ borderColor }) => borderColor || "black"};
    font-family: "Poppins";
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
    line-height: 150%;
    white-space: nowrap;
    color: ${({ color = "#0c002d" }) => color};

    &:disabled {
      opacity: 0.5;
    }
    ${({ $reverse }) => ($reverse ? ReversedButtonCss : ``)}
    &:hover {
      border: 1px solid black;
    }
  }
`;

export const RoundedSecondaryButton = styled(SharedSecondaryButton)`
  && {
    padding: 6px;
  }
`;

export const ErrorText = styled(Typography)`
  && {
    color: #ee4852;
    font-size: 13px;
    margin-top: 5px;
    font-family: "Poppins";
  }
`;

export const CustomResizableTextField = styled(TextField)`
width: 100%;
&& {
  .MuiOutlinedInput-notchedOutline {
    border-color: transparent; /* Set border color to transparent by default */
  }

  &:hover .MuiOutlinedInput-notchedOutline {
    border-color: transparent;
  }

  .Mui-focused .MuiOutlinedInput-notchedOutline {
    border-color: black;
  }

  .Mui-disabled {
    pointer-events: none;
  }
  .Mui-focused fieldset {
    borderColor: black;
  }
  .MuiInputBase-root {
    border-radius: 6px;
    background: #e8e8e8;
    box-sizing: border-box;
    padding: 0;
    border: none;
    color: black;
    width: 100%;
    border: 0;
    font-family: Poppins;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    resize: none;
    .MuiInputBase-input {
      padding: ${({ padding = "9px 14px" }) => padding};
      width: 100%;
    };
  }

  
`;
