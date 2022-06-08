import React from 'react'
import { LinkSquareIconWrapper } from './styles'
import Tooltip from "components/Tooltip";

export const LinkSquareIcon = ({ icon, title }) => {
	return <Tooltip title={title} placement="top"><LinkSquareIconWrapper>{icon}</LinkSquareIconWrapper></Tooltip>
}
