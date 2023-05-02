import { Grid, Typography } from "@mui/material"
import styled from "styled-components"

export const Button = styled.button`
	&& {
		font-family: "Poppins";
		font-style: normal;
		font-weight: ${({ fontWeight }) => fontWeight || 600};
		font-size: ${({ fontSize }) => fontSize || "18px"};
		line-height: ${({ lineHeight }) => lineHeight || "21px"};

		color: ${({ color }) => color || "#000000"};
		display: inline-block;
	}
`
