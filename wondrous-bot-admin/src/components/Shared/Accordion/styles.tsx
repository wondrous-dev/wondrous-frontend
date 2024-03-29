import styled from "styled-components"
import AccordionMui from "@mui/material/Accordion"
import AccordionDetailsMui from "@mui/material/AccordionDetails"
import AccordionSummaryMui from "@mui/material/AccordionSummary"

import Typography from "@mui/material/Typography"
import { ButtonBase } from "@mui/material"

export const Accordion = styled(AccordionMui)`
	&.MuiAccordion-root {
		border: ${(props) => (props.expanded ? "1px solid black" : "none")};
		background-color: ${(props) => (props.expanded ? "#FFEBDA" : "white")};
		box-shadow: none;
		overflow: hidden;
		border-bottom-left-radius: 17px !important;
		border-bottom-right-radius: 17px !important;
		border-top-left-radius: 17px !important;
		border-top-right-radius: 17px !important;
		border: 1px solid transparent;
		width: 100%;
		&::before {
			display: none;
		}

		&.Mui-expanded {
			margin: 0;
		}
		&:hover {
			background-color: #ffebda;
			border: 1px solid black;
		}
	}
`

export const StyledAccordionSummary = styled(AccordionSummaryMui)`
	&.MuiAccordionSummary-root {
		min-height: 56px;
		padding: 14px;
		background: ${({bgColor = 'transparent'}) => bgColor};
		border-radius: 6px;
		& .MuiAccordionSummary-content {
			margin: 0 !important;
		}
		& .Mui-expanded {
			border-bottom-left-radius: 0;
			border-bottom-right-radius: 0;
		}
	}
`

export const StyledAccordionDetails = styled(AccordionDetailsMui)`
	&.MuiAccordionDetails-root {
		padding: 0;
		border: 1px solid black;

		border-top: 1px solid black;
		border-radius: 0 0 16px 16px;
		background-color: white;
		border-left: 0px;
		border-right: 0px;
		overflow: hidden;
		border-bottom: 0;
	}
`

export const AccordionSummary = styled(AccordionSummaryMui)`
	&& {
		height: 100%;
		margin: 0;
	}
`
export const AccordionDetails = styled(AccordionDetailsMui)`
	&& {
		padding: 0;
	}
`

export const ChevronButton = styled(ButtonBase)`
	&& {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		height: 28px;
		background: transparent;
		border: 1px solid black;
		border-radius: 6px;
	}
`
